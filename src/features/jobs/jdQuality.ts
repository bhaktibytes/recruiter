import type { JDQualityResponse } from '@/services/api';
import { MatchingEngineService } from '@/services/api';

export type JDQualityRating = JDQualityResponse['rating'];

export interface JDQualityInput {
  title: string;
  department: string;
  location: string;
  description: string;
  experienceLevel?: string;
  salaryRange?: string;
  certifications?: string;
  requiredSkills: string[];
}

// For now, the mock evaluator already returns rating/score/suggestions.
export type JDQualityAnalysis = JDQualityResponse;

const normalizeText = (v: string) => (v ?? '').toLowerCase();

function computeHeuristicFactorHints(input: JDQualityInput): {
  scoreDelta: number;
  suggestions: string[];
} {
  const description = input.description ?? '';
  const title = input.title ?? '';
  const location = input.location ?? '';
  const dept = input.department ?? '';
  const requiredSkills = input.requiredSkills ?? [];
  const exp = input.experienceLevel ?? '';
  const salary = input.salaryRange ?? '';
  const certs = input.certifications ?? '';

  const suggestions: string[] = [];
  let scoreDelta = 0;

  // 1) Job title clarity
  const titleNorm = title.trim();
  if (!titleNorm) {
    suggestions.push('Add a clear job title (e.g. “Senior Frontend Engineer”) so candidates understand the role immediately.');
  } else {
    const hasSeniority = /(junior|mid|senior|lead)/i.test(titleNorm);
    const hasDiscipline = /(engineer|developer|designer|manager|architect|analyst|consultant|intern|lead)/i.test(titleNorm);
    if (hasDiscipline) scoreDelta += 5;
    else suggestions.push('Make the job title more specific (role + discipline), not just a generic label.');
    if (hasSeniority) scoreDelta += 5;
  }

  // 2) Responsibilities / responsibilities section

  const hasResponsibilitiesSignals = /(responsibilit|you will|you'll|what you'll|key duties|duties)/i.test(description);
  const hasBullets = /\n\s*[-*•]/.test(description);
  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;

  if (wordCount >= 120) scoreDelta += 10;
  else if (wordCount >= 60) {
    scoreDelta += 6;
    suggestions.push('Expand the description with a dedicated responsibilities section (what the candidate will do day-to-day).');
  } else {
    suggestions.push('Job description is too short. Add more detail (aim for 120+ words and clearer responsibilities).');
  }

  if (hasResponsibilitiesSignals) scoreDelta += 8;
  else suggestions.push('Add explicit responsibilities/duties (bulleted is best) to improve role clarity and candidate-job fit.');

  // 3) Required skills
  const uniqueSkills = Array.from(new Set(requiredSkills.map((s) => s.trim()).filter(Boolean)));
  if (uniqueSkills.length >= 5) scoreDelta += 10;
  else if (uniqueSkills.length >= 3) {
    scoreDelta += 6;
    suggestions.push('Include 5–10 required skills/tools (not just 1–2) for better matching and discovery indexing.');
  } else if (uniqueSkills.length > 0) {
    scoreDelta += 2;
    suggestions.push('Add more required skills (aim for at least 3) so the matching engine can index the role accurately.');
  } else {
    suggestions.push('Add required skills/tools to your JD (e.g. React, TypeScript, SQL) to reduce mismatches.');
  }

  // 4) Experience requirements
  const hasExperienceSignals = /(years? (of )?|experience level|minimum|required experience|preferred experience)/i.test(description);
  if (exp) scoreDelta += 6;
  if (hasExperienceSignals) scoreDelta += 8;
  else suggestions.push('Specify experience requirements (years/level) clearly (e.g. “3–5 years” or “Mid-level expectations”).');

  // 5) Educational qualifications
  const hasEducationSignals = /(bachelor|b\.?tech|master|phd|degree|education|university)/i.test(description);
  if (hasEducationSignals) scoreDelta += 6;
  else suggestions.push('Add educational requirements (e.g. degree level/field) if it is important for the role.');

  // 6) Benefits
  const hasBenefitsSignals = /(benefit|perks|compensation|health insurance|401\(k\)|retirement|vacation|leave|wellness|stock)/i.test(description);
  if (hasBenefitsSignals) scoreDelta += 6;
  else suggestions.push('Add a brief benefits/perks section to set expectations and improve candidate quality (even 1–2 lines help).');

  // 7) Work location
  const hasLocationSignals = /(remote|hybrid|on[- ]?site|onsite|location|based in)/i.test(description);
  if (location.trim()) scoreDelta += 6;
  if (hasLocationSignals) scoreDelta += 6;
  else suggestions.push('Mention the work location model clearly (remote/hybrid/on-site) and the city/region if applicable.');

  // 8) Overall structure
  if (hasBullets) scoreDelta += 6;
  else suggestions.push('Improve structure by using bullet points and headings (Responsibilities, Skills, Experience, Benefits).');

  // small signals based on department/role keywords (helps reduce generic templates)
  const depNorm = normalizeText(dept);
  if (depNorm.includes('engineering') && /(react|typescript|backend|frontend|api|architecture)/i.test(description)) scoreDelta += 3;

  // salary/certs signals (optional)
  if (salary.trim()) scoreDelta += 4;
  if (certs.trim()) scoreDelta += 3;

  // Cap suggestions: no empty spam
  const uniqueSuggestions = Array.from(new Set(suggestions));
  return { scoreDelta, suggestions: uniqueSuggestions };
}

export async function analyzeJDQuality(input: JDQualityInput): Promise<JDQualityAnalysis> {
  // Base result from existing mock evaluator
  const base = await MatchingEngineService.evaluateJDQuality(input.description ?? '', input.requiredSkills ?? []);

  // Additional actionable improvements to cover the requested factors.
  const { scoreDelta, suggestions: heuristicSuggestions } = computeHeuristicFactorHints(input);

  // Combine score carefully: base is already 0-100; we clamp after delta.
  const combinedScore = Math.max(0, Math.min(100, base.score + Math.round(scoreDelta * 0.8)));

  let rating: JDQualityRating = 'Bad';
  if (combinedScore >= 80) rating = 'Good';
  else if (combinedScore >= 50) rating = 'Average';

  // Merge suggestions with de-dupe; keep base suggestions first.
  const mergedSuggestions = Array.from(new Set([...(base.suggestions ?? []), ...heuristicSuggestions]));

  return {
    rating,
    score: combinedScore,
    suggestions: mergedSuggestions,
    mismatchFound: rating === 'Bad',
    conflictingKeywords: base.conflictingKeywords ?? [],
  };
}

