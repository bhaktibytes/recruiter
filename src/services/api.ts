/**
 * RecruiterOS Service Layer Adapter
 * Establish clean interfaces and mock pipelines to integrate with downstream microservice APIs:
 * - AI Matchmaking Engine
 * - Portfolio Intelligence Evaluator
 * - Outbound Communication Integrations
 */

export interface MatchScoreResponse {
  matchScore: number;
  jobId: string;
  candidateId: string;
  competencyBreakdown: Record<string, number>;
  recommendationRating: 'High' | 'Medium' | 'Low';
  aiDecisionBadge: boolean;
}

export interface JDQualityResponse {
  rating: 'Good' | 'Average' | 'Bad';
  score: number; // 0 - 100
  suggestions: string[];
  mismatchFound: boolean;
  conflictingKeywords: string[];
  mismatchAlerts: string[];
  redFlags: string[];
  recommendedSkills: string[];
  recommendedResponsibilities: string[];
  analysis: {
    titleClarity: number;
    responsibilities: number;
    skills: number;
    experience: number;
    education: number;
    benefits: number;
    location: number;
    structure: number;
  };
}

export class MatchingEngineService {
  /**
   * Fetch matching score for a candidate against a particular job requisition
   */
  static async fetchMatchScore(jobId: string, candidateId: string): Promise<MatchScoreResponse> {
    // Mock network latency for future AJAX request (e.g. GET /api/v1/match?jobId={jobId}&candidateId={candidateId})
    await new Promise((resolve) => setTimeout(resolve, 350));

    // Dynamic mock generation
    const calculatedScore = Math.floor(Math.random() * 30) + 70; // 70 - 100

    return {
      matchScore: calculatedScore,
      jobId,
      candidateId,
      competencyBreakdown: {
        Creativity: Math.floor(Math.random() * 40) + 60,
        Leadership: Math.floor(Math.random() * 40) + 60,
        Teamwork: Math.floor(Math.random() * 40) + 60,
        Communication: Math.floor(Math.random() * 40) + 60,
        'Problem Solving': Math.floor(Math.random() * 40) + 60,
      },
      recommendationRating: calculatedScore >= 85 ? 'High' : 'Medium',
      aiDecisionBadge: calculatedScore >= 85,
    };
  }

  /**
   * Submit JD and required skills for a real-time quality evaluation
   */
  static async evaluateJDQuality(
    description: string,
    skills: string[],
    title = '',
    department = '',
    location = '',
    experienceLevel = '',
    salaryRange = '',
    options?: {
      keyResponsibilities?: string;
      educationQualifications?: string;
      benefitsHint?: string;
      workMode?: string;
    }
  ): Promise<JDQualityResponse> {
    await new Promise((resolve) => setTimeout(resolve, 250));

    const normalizedDescription = description.toLowerCase();
    const normalizedTitle = title.toLowerCase();
    const normalizedDepartment = department.toLowerCase();

    const suggestions: string[] = [];

    const analysis: JDQualityResponse['analysis'] = {
      titleClarity: 0,
      responsibilities: 0,
      skills: 0,
      experience: 0,
      education: 0,
      benefits: 0,
      location: 0,
      structure: 0,
    };

    const mergedDescription = [options?.keyResponsibilities, description].filter(Boolean).join('\n');

    updateTitleClarity(title, analysis, suggestions);
    updateResponsibilities(mergedDescription, analysis, suggestions);
    updateSkillCoverage(skills, analysis, suggestions);
    updateExperienceCoverage(mergedDescription, experienceLevel, analysis, suggestions);
    updateEducationCoverage(mergedDescription, salaryRange, options?.educationQualifications ?? '', analysis, suggestions);
    updateBenefitsCoverage(
      mergedDescription,
      location,
      salaryRange,
      options?.benefitsHint ?? '',
      options?.workMode ?? '',
      analysis,
      suggestions
    );
    updateLocationCoverage(mergedDescription, location, options?.workMode ?? '', analysis, suggestions);
    updateStructure(mergedDescription, analysis, suggestions);

    const roleFamily = inferRoleFamily(title, mergedDescription, department);
    const mismatchAlerts = detectMismatchAlerts(roleFamily, title, mergedDescription, skills);
    const redFlags = detectRedFlags(mergedDescription, skills, title, location);
    const recommendedSkills = buildRecommendedSkills(roleFamily, skills);
    const recommendedResponsibilities = buildRecommendedResponsibilities(roleFamily);

    if (mismatchAlerts.length > 0) {
      suggestions.push(
        'Align the title, responsibilities, and skills to the same role family so candidates understand the scope.'
      );
    }

    if (redFlags.includes('generic')) {
      suggestions.push('Replace generic phrasing with concrete responsibilities, scope, and measurable outcomes.');
    }

    if (redFlags.includes('copied')) {
      suggestions.push('Rewrite boilerplate copy into role-specific duties, tools, and expectations.');
    }

    if (redFlags.includes('outdated')) {
      suggestions.push('Refresh outdated terms and tool references to keep the job posting current.');
    }

    if (redFlags.includes('incomplete')) {
      suggestions.push('Add missing experience, qualification, and location details to remove ambiguity.');
    }

    const baseScore = Object.values(analysis).reduce((total, value) => total + value, 0);
    let score = Math.min(100, baseScore);

    if (mismatchAlerts.length > 0) score = Math.max(0, score - 8);
    if (redFlags.includes('generic')) score = Math.max(0, score - 6);
    if (redFlags.includes('copied')) score = Math.max(0, score - 8);
    if (redFlags.includes('outdated')) score = Math.max(0, score - 4);
    if (redFlags.includes('incomplete')) score = Math.max(0, score - 6);

    const conflictingKeywords = findConflictingKeywords(normalizedDepartment, normalizedDescription, normalizedTitle);

    let rating: JDQualityResponse['rating'] = 'Bad';
    if (score >= 80) rating = 'Good';
    else if (score >= 50) rating = 'Average';

    return {
      rating,
      score,
      suggestions,
      mismatchFound: mismatchAlerts.length > 0 || conflictingKeywords.length > 0,
      conflictingKeywords,
      mismatchAlerts,
      redFlags,
      recommendedSkills,
      recommendedResponsibilities,
      analysis,
    };
  }
}

function updateTitleClarity(title: string, analysis: Record<string, number>, suggestions: string[]) {
  if (title.trim().length >= 6 && /(engineer|developer|manager|analyst|designer|specialist|architect|lead)/i.test(title)) {
    analysis.titleClarity = 12;
  } else if (title.trim().length >= 6) {
    analysis.titleClarity = 8;
    suggestions.push("Clarify the job title with a role + level + domain label such as 'Senior React Engineer'.");
  } else {
    analysis.titleClarity = 6;
    suggestions.push('Add a clear role title so candidates can instantly understand the opportunity.');
  }
}

function updateResponsibilities(description: string, analysis: Record<string, number>, suggestions: string[]) {
  const responsibilitySignals = /(responsibilities|owns|build|develop|lead|manage|collaborate|deliver|support|drive|design|implement|maintain)/i;
  const segments = description.split(/[.\n]/).filter((segment) => segment.trim().length > 0);
  if (responsibilitySignals.test(description) && segments.length >= 2) {
    analysis.responsibilities = 18;
  } else if (description.length >= 120) {
    analysis.responsibilities = 10;
    suggestions.push('Expand the responsibilities section with concrete day-to-day ownership and outcomes.');
  } else {
    analysis.responsibilities = 6;
    suggestions.push('Describe the core responsibilities more fully to reduce ambiguity for applicants.');
  }
}

function updateSkillCoverage(skills: string[], analysis: Record<string, number>, suggestions: string[]) {
  if (skills.length >= 3) {
    analysis.skills = 16;
  } else if (skills.length >= 1) {
    analysis.skills = 8;
    suggestions.push('Add at least 3 specific required skills or tools to improve candidate matching.');
  } else {
    analysis.skills = 4;
    suggestions.push('List the must-have skills and tools so the JD is easier to screen against.');
  }
}

function updateExperienceCoverage(description: string, experienceLevel: string, analysis: Record<string, number>, suggestions: string[]) {
  if (/(experience|years?|yrs?)/i.test(description) || /(senior|mid-level|junior|lead)/i.test(experienceLevel)) {
    analysis.experience = 10;
  } else {
    analysis.experience = 6;
    suggestions.push('State the expected experience level or years of experience for better targeting.');
  }
}

function updateEducationCoverage(
  description: string,
  salaryRange: string,
  educationQualifications: string,
  analysis: Record<string, number>,
  suggestions: string[]
) {
  const combined = `${description}\n${educationQualifications}`.toLowerCase();
  if (
    /(bachelor|master|degree|diploma|education|qualification|certification)/i.test(combined) ||
    /(bachelor|master|degree|diploma)/i.test(salaryRange)
  ) {
    analysis.education = 8;
  } else {
    analysis.education = 4;
    suggestions.push('Include educational qualifications or equivalent experience expectations where relevant.');
  }
}

function updateBenefitsCoverage(
  description: string,
  location: string,
  salaryRange: string,
  benefitsHint: string,
  workMode: string,
  analysis: Record<string, number>,
  suggestions: string[]
) {
  const combined = `${description}\n${benefitsHint}\n${workMode}`.toLowerCase();
  const hasExplicitBenefits = /(benefit|benefits|bonus|equity|health|leave|learning|growth|wellness|stock)/i.test(combined);
  const hasWorkMode = /(remote|hybrid)/i.test(workMode) || /(remote|hybrid)/i.test(location);
  const hasCompContext = /(salary|bonus|equity)/i.test(combined) || !!salaryRange.trim();

  if (hasExplicitBenefits || hasWorkMode || hasCompContext) {
    analysis.benefits = 8;
  } else {
    analysis.benefits = 4;
    suggestions.push('Mention benefits, compensation context, or growth opportunities to strengthen the offer.');
  }
}

function updateLocationCoverage(description: string, location: string, workMode: string, analysis: Record<string, number>, suggestions: string[]) {
  const combined = `${description}\n${workMode}`.toLowerCase();
  if (location.trim() || /(remote|hybrid|onsite|office|bengaluru|mumbai|delhi|pune)/i.test(combined)) {
    analysis.location = 8;
  } else {
    analysis.location = 4;
    suggestions.push('Specify where the work is based or whether the role is remote or hybrid.');
  }
}

function updateStructure(description: string, analysis: Record<string, number>, suggestions: string[]) {
  const structureSignals = description.split(/[.\n]/).filter((segment) => segment.trim().length > 10).length;
  if (description.length >= 180 && structureSignals >= 3) {
    analysis.structure = 10;
  } else if (description.length >= 100) {
    analysis.structure = 6;
    suggestions.push('Improve the JD structure with short sections or bullets for better readability.');
  } else {
    analysis.structure = 4;
    suggestions.push('Break the JD into clearer sections such as responsibilities, skills, and qualifications.');
  }
}

function findConflictingKeywords(normalizedDepartment: string, normalizedDescription: string, normalizedTitle: string) {
  const conflictingKeywords: string[] = [];
  const designKeywords = ['figma', 'ux', 'ui', 'design', 'portfolio', 'creative'];
  const engineeringKeywords = ['react', 'typescript', 'kubernetes', 'docker', 'backend', 'frontend', 'developer', 'engineer', 'api'];

  if (normalizedDepartment.includes('engineering')) {
    const conflicts = designKeywords.filter((keyword) => normalizedDescription.includes(keyword));
    if (conflicts.length >= 2 && !normalizedTitle.includes('designer')) {
      conflictingKeywords.push(...conflicts.slice(0, 2));
    }
  } else if (normalizedDepartment.includes('design')) {
    const conflicts = engineeringKeywords.filter((keyword) => normalizedDescription.includes(keyword));
    if (conflicts.length >= 2 && !normalizedTitle.includes('engineer') && !normalizedTitle.includes('developer')) {
      conflictingKeywords.push(...conflicts.slice(0, 2));
    }
  }

  return conflictingKeywords;
}

function inferRoleFamily(title: string, description: string, department: string) {
  const text = `${title} ${description} ${department}`.toLowerCase();
  if (/(marketing|campaign|brand|seo|social|growth|content|demand)/i.test(text)) {
    return 'marketing';
  }
  if (/(design|ux|ui|figma|creative|visual|prototype|product design)/i.test(text)) {
    return 'design';
  }
  if (/(engineer|developer|software|react|typescript|api|backend|frontend|cloud|data)/i.test(text)) {
    return 'engineering';
  }
