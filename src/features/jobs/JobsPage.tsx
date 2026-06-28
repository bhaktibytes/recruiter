import { useState, useMemo } from 'react';
import { Plus, Search, AlertTriangle, Sparkles, ArrowLeft, ChevronDown } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { useCollection } from '@/hooks/useCollection';
import type { Job } from '@/types';

type JobForm = Omit<Job, 'id' | 'applicantsCount' | 'createdAt'>;

const initialForm: JobForm = {
  title: '',
  category: 'Engineering',
  department: 'Engineering',
  location: 'Bengaluru',
  workMode: 'Hybrid',
  type: 'Full-time',
  status: 'Draft',
  hiringManager: '',
  priority: 'Medium',

  experienceRequired: '1-3 years',
  salaryRange: '',
  keyResponsibilities: '',
  requiredSkills: [],
  educationalQualifications: '',
  numberOfOpenings: 1,
  applicationDeadline: '',

  targetDate: '2026-07-31',
  description: '',

  experienceLevel: 'Mid-level',
  keywords: [],
  certifications: '',
  requirementsWeights: {
    Creativity: 20,
    Leadership: 20,
    Teamwork: 20,
    Communication: 20,
    'Problem Solving': 20,
  },
};

const skillsList = ['Creativity', 'Leadership', 'Teamwork', 'Communication', 'Problem Solving'];

const titleSuggestionsMap: Record<string, string[]> = {
  developer: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'React Developer'],
  dev: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'React Developer'],
  engineer: ['Software Engineer', 'React Engineer', 'Cloud Engineer', 'DevOps Engineer'],
  eng: ['Software Engineer', 'React Engineer', 'Cloud Engineer', 'DevOps Engineer'],
  designer: ['UI/UX Designer', 'Product Designer', 'Visual Designer', 'Graphic Designer'],
  des: ['UI/UX Designer', 'Product Designer', 'Visual Designer', 'Graphic Designer'],
  analyst: ['Data Analyst', 'Business Analyst', 'Systems Analyst', 'Financial Analyst'],
  ana: ['Data Analyst', 'Business Analyst', 'Systems Analyst', 'Financial Analyst'],
  manager: ['Product Manager', 'Project Manager', 'Engineering Manager', 'Hiring Manager'],
  man: ['Product Manager', 'Project Manager', 'Engineering Manager', 'Hiring Manager']
};

const cleanCommaString = (input: string, toLowercase = false): string[] => {
  return input
    .split(',')
    .map((s) => s.trim())
    .map((s) => (toLowercase ? s.toLowerCase() : s))
    .filter((val, idx, arr) => val !== '' && arr.indexOf(val) === idx);
};

const normalizeKeywords = (input: string): string[] => {
  return cleanCommaString(input, true);
};

const normalizeSkills = (input: string): string[] => {
  return cleanCommaString(input, false);
};

const getTopWeights = (weightsRecord?: Record<string, number>) => {
  const defaultWeights = { Creativity: 20, Leadership: 20, Teamwork: 20, Communication: 20, 'Problem Solving': 20 };
  const w = (weightsRecord && typeof weightsRecord === 'object') ? weightsRecord : defaultWeights;
  return Object.entries(w)
    .filter(([_, val]) => val > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
};

const getAIInsights = (job: Job) => {
  const insights: string[] = [];
  const desc = (job.description || '').toLowerCase();
  const skills = (Array.isArray(job.requiredSkills) ? job.requiredSkills : []).map((s) => s.toLowerCase());
  const weights = job.requirementsWeights || {};

  if (desc.includes('react') || skills.includes('react')) {
    insights.push('Strong React requirement');
  }
  if (!job.salaryRange) {
    insights.push('Missing salary details');
  }
  if (weights.Leadership && weights.Leadership > 25) {
    insights.push('Leadership weighted heavily');
  }
  const keywordsCount = (Array.isArray(job.keywords) ? job.keywords : []).length;
  if (desc.length > 300 && keywordsCount >= 3) {
    insights.push('Good search visibility');
  } else {
    insights.push('Low search visibility - add keywords/details');
  }
  if (job.experienceLevel === 'Senior' || job.experienceLevel === 'Lead') {
    insights.push('Senior leadership position');
  }
  if (job.priority === 'Critical') {
    insights.push('Urgent requisition fulfillment');
  }
  return insights;
};

const analyzeJD = (
  desc: string,
  skillsText: string,
  salaryRange: string,
  experienceLevel: string,
  certifications: string,
  title: string,
  keywordsText: string
) => {
  const suggestions: string[] = [];
  let score = 100;

  const trimmedDesc = desc.trim();
  if (trimmedDesc.length === 0) {
    score -= 30;
    suggestions.push('Job description is empty. Please add candidate responsibilities.');
  } else if (trimmedDesc.length < 150) {
    score -= 20;
    suggestions.push('Job description is too short (min 150 chars).');
  } else if (trimmedDesc.length < 300) {
    score -= 10;
    suggestions.push('Extend the job description to explain candidate responsibilities (min 300 chars).');
  }

  const skillsCount = skillsText.split(',').map((s) => s.trim()).filter(Boolean).length;
  if (skillsCount === 0) {
    score -= 15;
    suggestions.push('Add required skills to target qualified applicants.');
  } else if (skillsCount < 3) {
    score -= 10;
    suggestions.push('Specify at least 3 required skills/tools for better matching.');
  }

  const keywordsCount = keywordsText.split(',').map((k) => k.trim()).filter(Boolean).length;
  if (keywordsCount === 0) {
    score -= 10;
    suggestions.push('Incorporate industry-standard keywords to increase searchability.');
  }

  if (!salaryRange.trim()) {
    score -= 10;
    suggestions.push('Specify a salary range to increase applicant response rate.');
  }
  if (!experienceLevel) {
    score -= 10;
    suggestions.push('Specify a target experience level.');
  }
  if (!certifications.trim()) {
    score -= 5;
    suggestions.push('Mention target certifications if applicable.');
  }

  const genericTitles = ['developer', 'engineer', 'designer', 'analyst', 'manager', 'lead', 'intern', 'consultant'];
  if (genericTitles.includes(title.trim().toLowerCase())) {
    score -= 15;
    suggestions.push("Avoid generic titles. Be specific (e.g., 'React Developer' instead of 'Developer').");
  }

  const words = trimmedDesc.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const wordCounts: Record<string, number> = {};
  words.forEach((w) => {
    wordCounts[w] = (wordCounts[w] || 0) + 1;
  });
  const repeated = Object.entries(wordCounts).filter(([_, count]) => count > 5);
  if (repeated.length > 0) {
    score -= 10;
    const wordList = repeated.slice(0, 3).map(([w]) => `"${w}"`).join(', ');
    suggestions.push(`Reduce word repetition for words like ${wordList} to improve description quality.`);
  }

  score = Math.max(0, Math.min(100, score));

  let rating: 'Excellent' | 'Good' | 'Average' | 'Poor' = 'Poor';
  if (score >= 85) rating = 'Excellent';
  else if (score >= 70) rating = 'Good';
  else if (score >= 50) rating = 'Average';

  return { score, rating, suggestions };
};

export default function JobsPage() {
  const { items: jobs, addItem, updateItem } = useCollection<Job>('jobs');
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<JobForm>(initialForm);
  const [skillsInput, setSkillsInput] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [weights, setWeights] = useState<Record<string, number>>({
    Creativity: 20,
    Leadership: 20,
    Teamwork: 20,
    Communication: 20,
    'Problem Solving': 20
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [viewMode, setViewMode] = useState<'create' | 'directory'>('create');

  const filteredJobs = useMemo(() => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return jobs;
    return jobs.filter((job) => {
      const fields = [
        job.title || '',
        job.department || '',
        job.location || '',
        job.experienceLevel || '',
        job.status || '',
        job.hiringManager || '',
        job.salaryRange || '',
        job.certifications || '',
        ...(Array.isArray(job.keywords) ? job.keywords : []),
        ...(Array.isArray(job.requiredSkills) ? job.requiredSkills : [])
      ].map((f) => (f || '').toLowerCase());
      
      return fields.some((f) => f.includes(lowerQuery));
    });
  }, [jobs, query]);

  const handleSliderChange = (changedSkill: string, newValue: number) => {
    setWeights((current) => ({
      ...current,
      [changedSkill]: newValue,
    }));
  };

  const detectMismatch = (title: string, dept: string, desc: string) => {
    const d = dept.toLowerCase();
    const t = title.toLowerCase();
    const text = (t + " " + desc).toLowerCase();
    
    const designKeywords = ["figma", "sketch", "ux design", "ui design", "creative direction", "graphic design", "adobe", "illustrator", "photoshop", "portfolio"];
    const engineeringKeywords = ["react", "typescript", "kubernetes", "docker", "c++", "backend", "frontend", "infrastructure", "python", "javascript", "developer", "engineer"];
    
    if (d.includes("engineering")) {
      const conflicts = designKeywords.filter(w => text.includes(w));
      if (conflicts.length >= 2 && !t.includes("designer")) {
        return {
          message: "Department is set to Engineering, but the description emphasizes design/portfolio responsibilities.",
          conflicts
        };
      }
    } else if (d.includes("design")) {
      const conflicts = engineeringKeywords.filter(w => text.includes(w));
      if (conflicts.length >= 2 && !t.includes("engineer") && !t.includes("developer")) {
        return {
          message: "Department is set to Design, but the description emphasizes engineering tasks.",
          conflicts
        };
      }
    }
    return null;
  };

  const titleSuggestions = useMemo(() => {
    const lowercaseVal = form.title.trim().toLowerCase();
    if (!lowercaseVal) return [];
    for (const [key, suggestions] of Object.entries(titleSuggestionsMap)) {
      if (key.includes(lowercaseVal) || lowercaseVal.includes(key)) {
        return suggestions.filter((s) => s.toLowerCase() !== lowercaseVal);
      }
    }
    return [];
  }, [form.title]);

  const hasDuplicateWarning = useMemo(() => {
    if (!form.title.trim() || !form.department.trim() || !form.location.trim()) return false;
    return jobs.some((j) => 
      j.title.trim().toLowerCase() === form.title.trim().toLowerCase() &&
      j.department.trim().toLowerCase() === form.department.trim().toLowerCase() &&
      j.location.trim().toLowerCase() === form.location.trim().toLowerCase()
    );
  }, [form.title, form.department, form.location, jobs]);

  const getCurrentErrors = (f: JobForm) => {
    const now = new Date().toISOString().slice(0, 10);
    const next: Record<string, string> = {};

    // Validate only fields that are actually present in the UI
    if (!f.title.trim()) next.title = 'Job Title is required.';
    if (!f.hiringManager.trim()) next.hiringManager = 'Hiring Manager is required.';
    if (!f.location.trim()) next.location = 'Location is required.';
    if (f.targetDate < now) next.targetDate = 'Target Date cannot be in the past.';

    return next;
  };

  const createJob = async (event: React.FormEvent) => {
    event.preventDefault();

    const newErrors = getCurrentErrors(form);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSaving(true);

    // Mock network latency to prevent duplicate submissions
    await new Promise((resolve) => setTimeout(resolve, 500));

    const finalSkills = normalizeSkills(skillsInput);
    const finalKeywords = normalizeKeywords(keywordsInput);

    // Populate required database schema fields with fallback values if they are not in the UI
    const finalFormVal = {
      ...form,
      requiredSkills: finalSkills,
      keywords: finalKeywords,
      requirementsWeights: weights,
      keyResponsibilities: form.keyResponsibilities?.trim() || form.description || 'Not specified',
      educationalQualifications: form.educationalQualifications?.trim() || 'Not specified',
      applicationDeadline: form.applicationDeadline?.trim() || form.targetDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      applicantsCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    await addItem(finalFormVal);
    
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      setQuery(''); // Reset search query to make sure the newly created job is visible
      setViewMode('directory');
    }, 1500);

    setForm(initialForm);
    setSkillsInput('');
    setKeywordsInput('');
    setWeights({
      Creativity: 20,
      Leadership: 20,
      Teamwork: 20,
      Communication: 20,
      'Problem Solving': 20,
    });
    setIsSaving(false);
  };

  const mismatch = detectMismatch(form.title, form.department, form.description);
  
  const jdAnalysis = useMemo(() => {
    return analyzeJD(
      form.description,
      skillsInput,
      form.salaryRange || '',
      form.experienceLevel || '',
      form.certifications || '',
      form.title,
      keywordsInput
    );
  }, [form.description, skillsInput, form.salaryRange, form.experienceLevel, form.certifications, form.title, keywordsInput]);

  const ratingColors = {
    Excellent: 'text-brand-mint bg-brand-mint/5 border-brand-mint/15',
    Good: 'text-brand-mint bg-brand-mint/5 border-brand-mint/15',
    Average: 'text-brand-purple bg-brand-purple/5 border-brand-purple/15',
    Poor: 'text-brand-orange bg-brand-orange/5 border-brand-orange/20',
  };

  const labelFontStyle = { fontFamily: '"DM Sans", system-ui, sans-serif' };

  return (
    <div className="space-y-6 w-full">
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="w-[380px] rounded-2xl bg-white p-8 shadow-2xl animate-slide-up">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-center text-[24px] font-bold text-[#1A1C2E]" style={labelFontStyle}>
              Role Posted
            </h2>
            <p className="mt-3 text-center text-[15px] text-[#6B7280]" style={labelFontStyle}>
              Your requisition has been successfully posted.
            </p>
          </div>
        </div>
      )}

      {/* Main Layout Slot wrapper */}
      <div className="w-full">
        {viewMode === 'create' ? (
          /* REQUISITION CREATION WORKSPACE */
          <div key={viewMode} className="space-y-6 animate-slide-up">
            <div className="flex justify-between items-center gap-4 pb-2">
              <div>
                <h1 className="text-2xl font-bold text-brand-navy" style={labelFontStyle}>
                  Create Requisition
                </h1>
                <span className="text-[11px] mt-0.5 folio-meta text-[#6D6B8D] uppercase block tracking-wider font-bold">
                  REQUISITION DETAILS
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewMode('directory')}
                className="flex items-center gap-2 px-4 py-2 border border-[#ECE8E2] rounded-xl bg-white hover:bg-stone-50 text-xs font-bold text-brand-navy shadow-xs transition duration-150 cursor-pointer"
              >
                See Open Roles
              </button>
            </div>

            <form onSubmit={createJob} className="space-y-6 pt-2 w-full">
              {mismatch && (
                <div className="rounded-xl border border-brand-orange/20 bg-brand-orange/5 p-4 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-brand-orange uppercase folio-mono mb-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Mismatch Warning</span>
                  </div>
                  <p className="text-stone-600 mb-2 leading-relaxed">{mismatch.message}</p>
                  <div className="flex flex-wrap gap-1 items-center mt-1">
                    <span className="text-[9px] text-stone-400 font-mono">Conflicting:</span>
                    {mismatch.conflicts.map(kw => (
                      <span key={kw} className="bg-brand-orange/10 text-brand-orange text-[9px] font-mono px-1.5 py-0.5 rounded">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {hasDuplicateWarning && (
                <div className="rounded-xl border border-brand-purple/20 bg-brand-purple/5 p-4 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-brand-purple uppercase folio-mono mb-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Duplicate Warning</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    A job requisition with the same Title, Department, and Location already exists. You can still add this, but please verify if it is a duplicate.
                  </p>
                </div>
              )}

              <div>
                <label className="block folio-meta text-[#6D6B8D] mb-2 uppercase tracking-wide text-[12px] font-bold" style={labelFontStyle}>Job Title</label>
                <input 
                  className={`input w-full ${errors.title ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10' : ''}`}
                  value={form.title} 
                  onChange={(event) => setForm({ ...form, title: event.target.value })} 
                  placeholder="Senior React Engineer" 
                />
                {errors.title && <p className="mt-1 text-[10px] text-rose-500 font-medium font-sans">{errors.title}</p>}
                
                {titleSuggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 items-center transition duration-200">
                    <span className="text-[10px] text-stone-400 font-sans" style={labelFontStyle}>Suggestions:</span>
                    {titleSuggestions.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setForm({ ...form, title: sug })}
                        className="text-[9.5px] text-[#5B4FE9] bg-[#5B4FE9]/5 border border-[#5B4FE9]/10 px-2 py-0.5 rounded-full hover:bg-[#5B4FE9]/10 transition duration-200 cursor-pointer"
                        style={labelFontStyle}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block folio-meta text-[#6D6B8D] mb-1.5 uppercase tracking-wide text-[12px] font-bold" style={labelFontStyle}>Department</label>
                  <input 
                    className="input w-full" 
                    value={form.department} 
                    onChange={(event) => setForm({ ...form, department: event.target.value })} 
                    required
                  />
                </div>
                <div>
                  <label className="block folio-meta text-[#6D6B8D] mb-1.5 uppercase tracking-wide text-[12px] font-bold" style={labelFontStyle}>Location</label>
                  <input 
                    className="input w-full" 
                    value={form.location} 
                    onChange={(event) => setForm({ ...form, location: event.target.value })} 
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block folio-meta text-[#6D6B8D] mb-2 uppercase tracking-wide text-[12px] font-bold" style={labelFontStyle}>Requirements</label>
                <button
                  type="button"
                  onClick={() => setShowRequirements(true)}
                  className="w-full rounded-xl border border-brand-purple/20 bg-brand-purple/5 px-4 py-3 text-sm font-semibold text-brand-purple hover:bg-brand-purple/10 transition cursor-pointer"
                >
                  Configure Requirements
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block folio-meta text-[#6D6B8D] mb-2 uppercase tracking-wide text-[12px] font-bold" style={labelFontStyle}>Hiring Manager</label>
                  <input 
                    className={`input w-full ${errors.hiringManager ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10' : ''}`}
                    value={form.hiringManager} 
                    onChange={(event) => setForm({ ...form, hiringManager: event.target.value })} 
                    placeholder="Manager name" 
                  />
                  {errors.hiringManager && <p className="mt-1 text-[10px] text-rose-500 font-medium font-sans">{errors.hiringManager}</p>}
                </div>

                <div>
                  <label className="block folio-meta text-[#6D6B8D] mb-2 uppercase tracking-wide text-[12px] font-bold" style={labelFontStyle}>Experience Level</label>
                  <select 
                    className="input w-full cursor-pointer font-sans"
                    value={form.experienceLevel} 
                    onChange={(event) => setForm({ ...form, experienceLevel: event.target.value as Job['experienceLevel'] })}
                  >
                    <option value="Junior">Junior</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block folio-meta text-[#6D6B8D] mb-2 uppercase tracking-wide text-[12px] font-bold" style={labelFontStyle}>Salary Range</label>
                  <input 
                    className="input w-full" 
                    value={form.salaryRange} 
                    onChange={(event) => setForm({ ...form, salaryRange: event.target.value })} 
                    placeholder="e.g. $80,000 - $110,000" 
                  />
                </div>

                <div>
                  <label className="block folio-meta text-[#6D6B8D] mb-2 uppercase tracking-wide text-[12px] font-bold" style={labelFontStyle}>Certifications</label>
                  <input 
                    className="input w-full" 
                    value={form.certifications} 
                    onChange={(event) => setForm({ ...form, certifications: event.target.value })} 
                    placeholder="e.g. AWS Solutions Architect" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block folio-meta text-[#6D6B8D] mb-2 uppercase tracking-wide text-[12px] font-bold" style={labelFontStyle}>Required Skills (Comma-separated)</label>
                  <input 
                    className="input w-full" 
                    value={skillsInput} 
                    onChange={(event) => setSkillsInput(event.target.value)} 
                    placeholder="React, TypeScript, CSS" 
                  />
                </div>

                <div>
                  <label className="block folio-meta text-[#6D6B8D] mb-2 uppercase tracking-wide text-[12px] font-bold" style={labelFontStyle}>Keywords (Comma-separated)</label>
                  <input 
                    className="input w-full" 
                    value={keywordsInput} 
                    onChange={(event) => setKeywordsInput(event.target.value)} 
                    placeholder="AI, React, Leadership, UI/UX" 
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block folio-meta text-[#6D6B8D] mb-1.5 uppercase tracking-wide text-[12px] font-bold" style={labelFontStyle}>Type</label>
                  <select 
                    className="input w-full cursor-pointer" 
                    value={form.type} 
                    onChange={(event) => setForm({ ...form, type: event.target.value as Job['type'] })}
                  >
                    <option>Full-time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block folio-meta text-[#6D6B8D] mb-1.5 uppercase tracking-wide text-[12px] font-bold" style={labelFontStyle}>Priority</label>
                  <select 
                    className="input w-full cursor-pointer" 
                    value={form.priority} 
                    onChange={(event) => setForm({ ...form, priority: event.target.value as Job['priority'] })}
                  >
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                  </select>
                </div>
                <div>
                  <label className="block folio-meta text-[#6D6B8D] mb-1.5 uppercase tracking-wide text-[12px] font-bold" style={labelFontStyle}>Target Date</label>
                  <input 
                    className={`input w-full cursor-pointer ${errors.targetDate ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10' : ''}`}
                    type="date" 
                    value={form.targetDate} 
                    onChange={(event) => setForm({ ...form, targetDate: event.target.value })} 
                  />
                  {errors.targetDate && <p className="mt-1 text-[10px] text-rose-500 font-medium font-sans">{errors.targetDate}</p>}
                </div>
              </div>

              <div>
                <label className="block folio-meta text-[#6D6B8D] mb-2 uppercase tracking-wide text-[12px] font-bold" style={labelFontStyle}>Description</label>
                <textarea 
                  className="input w-full min-h-24 resize-none font-sans" 
                  value={form.description} 
                  onChange={(event) => setForm({ ...form, description: event.target.value })} 
                  placeholder="Job description parameters..."
                />
              </div>

              {form.description.length > 0 && (
                <div className="rounded-xl border border-[#ECE8E2] bg-white p-4 shadow-sm text-xs">
                  <div className="flex items-center justify-between border-b border-[#ECE8E2] pb-2 mb-2">
                    <span className="folio-mono text-[9px] uppercase tracking-wider text-stone-500 font-bold flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-brand-purple" />
                      JD Quality Analysis ({jdAnalysis.score}%)
                    </span>
                    <span className={`folio-mono text-[9.5px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded ${ratingColors[jdAnalysis.rating]}`}>
                      {jdAnalysis.rating} Quality
                    </span>
                  </div>
                  {jdAnalysis.suggestions.length > 0 ? (
                    <ul className="space-y-1.5 text-stone-500 list-disc pl-4 text-[10.5px]">
                      {jdAnalysis.suggestions.map((sug, idx) => (
                        <li key={idx} className="leading-snug">{sug}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-brand-mint font-semibold text-[10.5px]">✓ Content meets standard guidelines for discovery indexing.</p>
                  )}
                </div>
              )}

              <button 
                className="button-primary w-full py-4 mt-4 flex items-center justify-center font-bold hover:bg-brand-orange transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
                disabled={isSaving}
              >
                <Plus className="h-4 w-4 mr-1" strokeWidth={2} />
                {isSaving ? 'Adding...' : 'Add Requisition'}
              </button>
            </form>
          </div>
        ) : (
          /* OPEN ROLES VIEW */
          <div key={viewMode} className="space-y-6 animate-slide-up">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setViewMode('create')}
                    className="p-1 -ml-1 rounded-lg text-brand-navy hover:bg-stone-100 transition-colors cursor-pointer"
                    aria-label="Go back to Create Requisition"
                  >
                    <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
                  </button>
                  <h2 className="text-2xl font-bold text-brand-navy" style={labelFontStyle}>
                    Open Roles
                  </h2>
                </div>
                <p className="mt-1 ml-7 folio-meta text-[#6D6B8D] uppercase tracking-wider text-[13px] font-bold">
                  {filteredJobs.length} requisitions visible
                </p>
              </div>
              
              <label className="relative block w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" strokeWidth={1.5} />
                <input 
                  className="input pl-10 pr-4 py-2 border-[#ECE8E2] focus:border-[#5B4FE9] shadow-sm text-xs w-full" 
                  value={query} 
                  onChange={(event) => setQuery(event.target.value)} 
                  placeholder="Search jobs..." 
                />
              </label>
            </div>
            
            <div className="space-y-4">
              {filteredJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white rounded-2xl border border-stone-200/60 shadow-sm">
                  <Search className="h-10 w-10 text-stone-400 mb-3" strokeWidth={1.5} />
                  <h3 className="font-sans font-semibold text-sm text-brand-navy" style={labelFontStyle}>No requisitions found</h3>
                  <p className="mt-1 text-xs text-[#6D6B8D] max-w-xs">Try adjusting your search query or add a new job requisition.</p>
                </div>
              ) : (
                filteredJobs.map((job) => {
                  const scoreDetails = analyzeJD(
                    job.description || '',
                    (Array.isArray(job.requiredSkills) ? job.requiredSkills : []).join(','),
                    job.salaryRange || '',
                    job.experienceLevel || '',
                    job.certifications || '',
                    job.title || '',
                    (Array.isArray(job.keywords) ? job.keywords : []).join(',')
                  );
                  
                  const topWeights = getTopWeights(job.requirementsWeights);
                  const aiInsights = getAIInsights(job);

                  return (
                    /* Premium Styled Card Container based on image_074c79.png analysis */
                    <article 
                      key={job.id} 
                      className="p-6 bg-white rounded-2xl border border-stone-200/60 shadow-xs hover:border-brand-purple/30 hover:-translate-y-0.5 transition-all duration-300 ease-out flex flex-col justify-between w-full"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4 w-full pb-4">
                        <div className="space-y-1.5 flex-1 min-w-[260px] max-w-4xl">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="text-lg font-bold text-brand-navy tracking-tight leading-none" style={labelFontStyle}>
                              {job.title}
                            </h3>
                            <div className="flex gap-1.5 items-center flex-wrap">
                              <StatusBadge value={job.status} />
                              <StatusBadge value={job.priority} />
                              <span className={`text-[9.5px] font-mono font-bold uppercase tracking-wider border px-2 py-0.5 rounded-full ${ratingColors[scoreDetails.rating]}`}>
                                JD: {scoreDetails.score}%
                              </span>
                            </div>
                          </div>
                          <p className="text-[13px] leading-relaxed text-[#6D6B8D] font-normal max-w-3xl">
                            {job.description || "Manage requisition criteria, view incoming applicant matches, and control pipeline stages."}
                          </p>
                        </div>

                        {/* Editorial Dropdown Control */}
                        <div className="relative flex-shrink-0 w-full sm:w-auto">
                          <select 
                            className="appearance-none bg-white border border-stone-200 rounded-full pl-4 pr-9 py-1.5 text-[10px] font-mono tracking-wider uppercase text-brand-navy font-bold shadow-xs hover:bg-stone-50 transition cursor-pointer focus:outline-hidden focus:border-brand-purple/40 w-full sm:w-32" 
                            value={job.status} 
                            onChange={(event) => void updateItem(job.id, { status: event.target.value as Job['status'] })}
                          >
                            <option value="Active">Active</option>
                            <option value="Draft">Draft</option>
                            <option value="Closed">Closed</option>
                            <option value="Archived">Archived</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-[#6D6B8D] pointer-events-none" strokeWidth={2} />
                        </div>
                      </div>

                      {/* Thin Editorial Section Divider Block */}
                      <div className="w-full border-t border-[#ECE8E2]/60 my-1" />

                      {/* Metadata Instrument Matrix Grid */}
                      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 md:grid-cols-5 pt-4 w-full">
                        <Field label="Department" value={job.department} />
                        <Field label="Location" value={job.location} />
                        <Field label="Applicants" value={job.applicantsCount?.toString() || '0'} isMono={true} />
                        <Field label="Hiring Manager" value={job.hiringManager} />
                        {job.experienceLevel && <Field label="Experience" value={job.experienceLevel} />}
                        {job.salaryRange && <Field label="Salary Range" value={job.salaryRange} />}
                        {job.certifications && <Field label="Certifications" value={job.certifications} />}
                      </div>

                      {/* Requirement Summary Chips */}
                      {topWeights.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5 items-center">
                          <span className="text-[8.5px] font-mono font-bold uppercase tracking-[0.15em] text-[#6D6B8D]">Top Requirements:</span>
                          {topWeights.map(([skill, val]) => (
                            <span key={skill} className="text-[9px] font-mono font-medium text-brand-purple bg-brand-purple/5 border border-brand-purple/15 px-1.5 py-0.5 rounded">
                              {skill} ({val}%)
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Skills Chips */}
                      {Array.isArray(job.requiredSkills) && job.requiredSkills.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5 items-center">
                          <span className="text-[8.5px] font-mono font-bold uppercase tracking-[0.15em] text-[#6D6B8D]">Skills:</span>
                          {job.requiredSkills.map(skill => (
                            <span key={skill} className="text-[9px] font-mono font-medium text-stone-500 bg-stone-50 border border-stone-200/60 px-1.5 py-0.5 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Keywords Chips */}
                      {Array.isArray(job.keywords) && job.keywords.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5 items-center">
                          <span className="text-[8.5px] font-mono font-bold uppercase tracking-[0.15em] text-[#6D6B8D]">Keywords:</span>
                          {job.keywords.map(keyword => (
                            <span key={keyword} className="text-[9px] font-mono font-medium text-brand-purple bg-brand-purple/10 border border-brand-purple/20 px-2 py-0.5 rounded-full">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* AI Insights widget */}
                      {aiInsights.length > 0 && (
                        <div className="mt-4 p-3 bg-stone-50/50 border border-stone-100 rounded-xl">
                          <div className="flex items-center gap-1 mb-1.5">
                            <Sparkles className="h-3 w-3 text-brand-purple" />
                            <span className="text-[8.5px] font-mono font-bold uppercase tracking-[0.15em] text-[#6D6B8D]">AI Insights</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {aiInsights.map((insight, idx) => (
                              <span key={idx} className="text-[9.5px] font-sans font-medium text-stone-600 bg-white border border-stone-200/65 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#5B4FE9]"></span>
                                {insight}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Requirements Slider Window */}
      {showRequirements && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[700px] max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-6" style={labelFontStyle}>Requirements Builder</h2>
            {skillsList.map((skill) => (
              <div key={skill} className="mb-5">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold" style={labelFontStyle}>{skill}</span>
                  <span className="text-sm font-mono">{weights[skill]}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSliderChange(skill, Math.max(0, weights[skill] - 5))}
                    className="h-8 w-8 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 font-bold"
                  >
                    -
                  </button>
                  <div className="relative flex-1">
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div className="h-2 rounded-full bg-brand-purple" style={{ width: `${weights[skill]}%` }} />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={weights[skill]}
                      onChange={(e) => handleSliderChange(skill, Number(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSliderChange(skill, Math.min(100, weights[skill] + 5))}
                    className="h-8 w-8 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRequirements(false)}
                className="rounded-lg border px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-stone-50"
                style={labelFontStyle}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm({ ...form, requirementsWeights: weights });
                  setShowRequirements(false);
                }}
                className="rounded-lg bg-brand-purple px-5 py-2 text-white text-sm font-semibold cursor-pointer hover:opacity-90"
                style={labelFontStyle}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  isMono?: boolean;
}

function Field({ label, value, isMono = false }: FieldProps) {
  return (
    <div>
      <span className="block text-[8.5px] font-mono font-bold uppercase tracking-[0.15em] text-[#6D6B8D] mb-1.5">
        {label}
      </span>
      <span className={`block text-[13.5px] font-bold text-brand-navy ${isMono ? 'font-mono' : 'font-sans'}`}>
        {value || "Unassigned"}
      </span>
    </div>
  );
}