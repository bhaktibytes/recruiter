import type { JDQualityResponse } from '@/services/api';

export type JobQualityRating = JDQualityResponse['rating'];

export interface MismatchAlert {
  severity: 'Low' | 'Medium' | 'High';
  title: string;
  details: string;
  recommendations: string[];
}

export interface MismatchPreventionInput {
  title: string;
  description: string;
  requiredSkills: string[];
  responsibilitiesText?: string;
  experienceLevel?: string;
  educationText?: string;
  qualificationsText?: string;
}

export interface MismatchPreventionResult {
  quality: {
    rating: JobQualityRating;
    score: number; // 0-100
  };
  alerts: MismatchAlert[];
  improvementSuggestions: string[];
}

const normalize = (s: string) => (s ?? '').toLowerCase();

const tokenize = (s: string) => normalize(s).split(/[^a-z0-9+.#-]+/g).filter(Boolean);

function jaccard(a: string[], b: string[]) {
  const A = new Set(a);
  const B = new Set(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  const union = A.size + B.size - inter;
  return union === 0 ? 0 : inter / union;
}

const vagueTemplates = [
  'responsibilities include',
  'successful candidate',
  'team player',
  'self-starter',
  'competitive compensation',
  'fast-paced',
  'dynamic environment',
  'will be responsible for',
];

const repetitivePhrases = [
  'good communication skills',
  'strong problem solving',
  'work well with cross-functional',
  'detail-oriented',
];

// Very lightweight copied/JD duplication heuristic for the current UI.
// Without a corpus of past JDs, we can only flag common template signatures.
function detectCopiedOrTemplate(desc: string): { isTemplateLike: boolean; signals: string[] } {
  const normalized = normalize(desc);
  const signals: string[] = [];

  const hits = vagueTemplates.filter((t) => normalized.includes(t));

  if (hits.length >= 3) {
    signals.push('JD contains multiple common template phrases (often seen in copy-paste postings).');
  }

  const repHits = repetitivePhrases.filter((p) => normalized.includes(p));
  if (repHits.length >= 2) {
    signals.push('JD repeats generic competency phrasing; role-specific duties are not explicit enough.');
  }

  return {
    isTemplateLike: hits.length >= 3 || repHits.length >= 2,
    signals,
  };
}

function extractSectionSignals(desc: string) {
  const d = normalize(desc);
  void d;

  const hasResponsibilities = /(responsibilit|duti|you will|what you will|key duties)/i.test(desc);
  const hasRequirements = /(requirement|qualif|must|preferred)/i.test(desc);
  const hasEducation = /(bachelor|master|phd|degree|university)/i.test(desc);
  const hasBenefits = /(benefit|perks|compensation|insurance|retirement|vacation|stock)/i.test(desc);
  const hasLocation = /(remote|hybrid|on[- ]?site|onsite|location|based in)/i.test(desc);
  const bullets = /\n\s*[-*•]/.test(desc);

  return {
    hasResponsibilities,
    hasRequirements,
    hasEducation,
    hasBenefits,
    hasLocation,
    bullets,
    wordCount: desc.trim() ? desc.trim().split(/\s+/).length : 0,
    hasExperienceSignals: /(years?\s*(of)?\s*experience|experience level|minimum|required experience|preferred experience)/i.test(desc),
  };
}

function mismatchTitleVsContent(title: string, description: string, requiredSkills: string[]) {
  const t = normalize(title);
  const d = normalize(description);
  const skills = requiredSkills.map(normalize);

  const signals: { alert?: Omit<MismatchAlert, 'severity'>; scoreDelta: number } = { scoreDelta: 0 };

  // Marketing vs Design/Creative mismatch
  const marketing = /(marketing|growth|seo|sem|content marketing|digital marketing|brand marketing)/i.test(title);
  const design = /(design|ux|ui|figma|illustrator|photoshop|creative)/i.test(title) || /(design|ux|ui|figma|illustrator|photoshop|creative)/i.test(description);

  if (marketing && design && !/marketing/i.test(description)) {
    signals.alert = {
      title: 'Title/responsibilities mismatch: Marketing vs Creative/Design',
      details: 'The job title suggests marketing work, but the JD content emphasizes design/creative deliverables.',
      recommendations: [
        'Re-align responsibilities to marketing outcomes (acquisition, campaigns, metrics, channels).',
        'Add role-specific skills to the required skills list (SEO/SEM, analytics, campaign management).',
        'Remove (or clearly separate) design deliverables unless they are truly part of the role.',
      ],
    };
    signals.scoreDelta = -10;
  }

  // Engineer vs Design mismatch
  const engineering = /(engineer|developer|software|backend|frontend|full[- ]?stack|architect)/i.test(title);
  if (engineering) {
    const designSignals = /(figma|ux|ui|illustrator|photoshop|adobe|portfolio)/i.test(description);
    if (designSignals && !(skills.some((s) => /react|typescript|engineering|backend|frontend|api|sql/i.test(s)))) {
      signals.alert = {
        title: 'Title/content inconsistency: Engineering role lacks technical evidence',
        details: 'The title indicates engineering, but description/skills do not clearly reflect technical responsibilities or tools.',
        recommendations: [
          'Add explicit technical responsibilities (e.g., APIs, data models, performance, reliability).',
          'Add required skills/tools relevant to the engineering track (e.g., React/TypeScript, SQL, cloud).',
          'Include experience and scope (systems scale, integrations, ownership).',
        ],
      };
      signals.scoreDelta = -10;
    }
  }

  return signals;
}

function skillsCoverageAndSpecificity(title: string, requiredSkills: string[], description: string) {
  const skills = requiredSkills.map((s) => s.trim()).filter(Boolean);
  const skillCount = skills.length;
  const d = normalize(description);

  const scoreParts = [] as number[];
  const suggestions: string[] = [];

  if (skillCount === 0) {
    scoreParts.push(-15);
    suggestions.push('Add required skills/tools (aim for 5–10) to improve indexing and reduce mismatches.');
  } else if (skillCount < 3) {
    scoreParts.push(-8);
    suggestions.push('Add more required skills/tools (at least 3) so candidates can self-qualify.');
  } else {
    scoreParts.push(8);
  }

  // If description doesn’t mention most skills, warn
  const matchedSkills = skills.filter((s) => d.includes(normalize(s)));
  const coverage = skillCount === 0 ? 0 : matchedSkills.length / skillCount;
  if (coverage < 0.4 && skillCount >= 3) {
    scoreParts.push(-10);
    suggestions.push('Your required skills are not well supported in the JD text. Add 1–2 sentences tying each key skill to actual work.');
  } else if (coverage >= 0.7) {
    scoreParts.push(6);
  }

  // Title keyword alignment
  const titleTokens = tokenize(title);
  const requiredTokens = skills.flatMap(tokenize);
  const overlap = jaccard(titleTokens, requiredTokens);
  if (title.trim() && overlap < 0.15) {
    scoreParts.push(-8);
    suggestions.push('Align the required skills with the job title (include the main tools/discipline mentioned by the title).');
  }

  return { scoreDelta: scoreParts.reduce((a, b) => a + b, 0), suggestions };
}

export function analyzeCandidateJobMismatch(input: MismatchPreventionInput): MismatchPreventionResult {
  const desc = input.description ?? '';
  const title = input.title ?? '';
  const requiredSkills = input.requiredSkills ?? [];

  const section = extractSectionSignals(desc);

  // Base quality score: start at 60 and adjust
  let score = 60;

  // Structure signals
  if (section.wordCount < 80) score -= 15;
  if (section.wordCount >= 150) score += 10;
  if (!section.bullets) score -= 5;

  // Responsibilities
  if (section.hasResponsibilities) score += 8;
  else score -= 10;

  // Requirements
  if (section.hasRequirements) score += 6;
  else score -= 8;

  // Experience
  if (section.hasExperienceSignals) score += 7;
  else score -= 6;

  // Education
  if (section.hasEducation) score += 4;
  else score -= 3;

  // Benefits and location
  if (section.hasBenefits) score += 4;
  else score -= 3;

  if (section.hasLocation) score += 4;
  else score -= 3;

  // Template/copy-like detection
  const template = detectCopiedOrTemplate(desc);
  if (template.isTemplateLike) {
    score -= 12;
  }

  // Title/content mismatch heuristics
  const titleMismatch = mismatchTitleVsContent(title, desc, requiredSkills);
  score += titleMismatch.scoreDelta;

  // Skills coverage
  const skills = skillsCoverageAndSpecificity(title, requiredSkills, desc);
  score += skills.scoreDelta;

  // Normalize score clamp
  score = Math.max(0, Math.min(100, Math.round(score)));

  const rating: JobQualityRating = score >= 80 ? 'Good' : score >= 50 ? 'Average' : 'Bad';

  const alerts: MismatchAlert[] = [];

  if (titleMismatch.alert) {
    alerts.push({ severity: titleMismatch.scoreDelta <= -10 ? 'High' : 'Medium', ...titleMismatch.alert });
  }

  if (template.isTemplateLike) {
    alerts.push({
      severity: 'Medium',
      title: 'Possible generic/copied job content',
      details: 'The JD contains multiple template-like phrases and repetitive competency language.',
      recommendations: [
        'Replace generic phrasing with role-specific outcomes, scope, and deliverables.',
        'Add concrete responsibility bullets tailored to this role.',
        'Ensure required skills match the content (mention tools/tech you actually expect the candidate to use).',
      ],
    });
  }

  if (!section.hasResponsibilities) {
    alerts.push({
      severity: 'High',
      title: 'Responsibilities section is missing or unclear',
      details: 'Candidates may not understand what they will do day-to-day.',
      recommendations: [
        'Add a “Responsibilities / What you’ll do” section.',
        'Use 6–10 bullet points starting with action verbs.',
        'Tie each bullet to measurable outcomes where possible.',
      ],
    });
  }

  if (requiredSkills.length < 3) {
    alerts.push({
      severity: 'Medium',
      title: 'Required skills list is too short',
      details: 'A short skills list reduces discovery accuracy and increases mismatches.',
      recommendations: [
        'Add at least 3 required skills/tools; aim for 5–10.',
        'Ensure skills are explicitly mentioned in the JD text.',
      ],
    });
  }

  const improvementSuggestions: string[] = [];

  // Quality suggestions
  if (!input.title.trim()) improvementSuggestions.push('Provide a clear, specific job title (role + discipline + seniority).');

  if (section.wordCount < 80) improvementSuggestions.push('Expand the JD with more detail (aim for 120+ words).');

  if (!section.hasEducation) improvementSuggestions.push('Add educational qualifications (degree level/field) if required for screening.');

  if (!section.hasBenefits) improvementSuggestions.push('Add a brief benefits/perks section to set expectations.');

  if (!section.hasLocation) improvementSuggestions.push('Add work location model (remote/hybrid/on-site) and region/city if applicable.');

  improvementSuggestions.push(...skills.suggestions);

  // De-dupe while preserving order
  const unique = Array.from(new Set(improvementSuggestions));

  // If we have no alerts, still provide improvement suggestions from section
  if (alerts.length === 0 && unique.length === 0) {
    unique.push('JD looks sufficiently specific; verify that required skills are explicitly referenced in the description.');
  }

  return {
    quality: { rating, score },
    alerts,
    improvementSuggestions: unique,
  };
}

