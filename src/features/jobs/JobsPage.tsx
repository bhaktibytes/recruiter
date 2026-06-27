import { useState } from 'react';
import { Plus, Search, AlertTriangle, Sparkles } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { useCollection } from '@/hooks/useCollection';
import type { Job } from '@/types';

type JobForm = Omit<Job, 'id' | 'applicantsCount' | 'createdAt'>;

const initialForm: JobForm = {
  title: '',
  department: 'Engineering',
  location: 'Bengaluru',
  type: 'Full-time',
  status: 'Draft',
  hiringManager: '',
  priority: 'Medium',
  targetDate: '2026-07-31',
  description: '',
  experienceLevel: 'Mid-level',
  salaryRange: '',
  requiredSkills: [],
  certifications: '',
  requirementsWeights: { Creativity: 20, Leadership: 20, Teamwork: 20, Communication: 20, 'Problem Solving': 20 }
};

const skillsList = ['Creativity', 'Leadership', 'Teamwork', 'Communication', 'Problem Solving'];

export default function JobsPage() {
  const { items: jobs, addItem, updateItem } = useCollection<Job>('jobs');
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<JobForm>(initialForm);
  const [skillsInput, setSkillsInput] = useState('');
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

  const filteredJobs = jobs.filter((job) => 
    `${job.title} ${job.department} ${job.location}`.toLowerCase().includes(query.toLowerCase())
  );

const handleSliderChange = (
  changedSkill: string,
  newValue: number
) => {
  setWeights((current) => ({
    ...current,
    [changedSkill]: newValue,
  }));
};

  const analyzeJD = (desc: string, skillsText: string) => {
    const suggestions: string[] = [];
    let score = 0;
    
    if (desc.length > 150) {
      score += 2;
    } else if (desc.length > 50) {
      score += 1;
      suggestions.push("Extend the job description to explain candidate responsibilities (min 150 chars).");
    } else {
      suggestions.push("Job description is too short (min 150 chars).");
    }

    const skillsCount = skillsText.split(',').map(s => s.trim()).filter(Boolean).length;
    if (skillsCount >= 3) {
      score += 2;
    } else if (skillsCount >= 1) {
      score += 1;
      suggestions.push("Specify at least 3 required skills/tools for better matching.");
    } else {
      suggestions.push("Add required skills to target qualified applicants.");
    }

    const keywords = ["react", "typescript", "design", "analytics", "sql", "sales", "experience", "development", "architecture", "figma"];
    const matches = keywords.filter(kw => desc.toLowerCase().includes(kw));
    if (matches.length >= 3) {
      score += 2;
    } else if (matches.length >= 1) {
      score += 1;
      suggestions.push("Enrich description with technical frameworks, tools, or department keywords.");
    } else {
      suggestions.push("Incorporate industry-standard keywords to increase searchability.");
    }

    let rating: 'Good' | 'Average' | 'Bad' = 'Bad';
    if (score >= 5) rating = 'Good';
    else if (score >= 3) rating = 'Average';

    return { rating, suggestions };
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

  const createJob = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const today = new Date().toISOString().slice(0, 10);
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) newErrors.title = "Job Title is required.";
    if (!form.hiringManager.trim()) newErrors.hiringManager = "Hiring Manager is required.";
    if (form.targetDate < today) {
      newErrors.targetDate = "Target Date cannot be in the past.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSaving(true);

    // Mock network latency to prevent duplicate submissions
    await new Promise(resolve => setTimeout(resolve, 500));

    const finalSkills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);

    await addItem({
      ...form,
      requiredSkills: finalSkills,
      requirementsWeights: weights,
      applicantsCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    });
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 2500);
    setForm(initialForm);
    setSkillsInput('');
    setWeights({
      Creativity: 20,
      Leadership: 20,
      Teamwork: 20,
      Communication: 20,
      'Problem Solving': 20
    });
    setIsSaving(false);
  };

  const mismatch = detectMismatch(form.title, form.department, form.description);
  const jdAnalysis = analyzeJD(form.description, skillsInput);
  const ratingColors = {
    Good: 'text-brand-mint bg-brand-mint/5 border-brand-mint/15',
    Average: 'text-brand-purple bg-brand-purple/5 border-brand-purple/15',
    Bad: 'text-brand-orange bg-brand-orange/5 border-brand-orange/20',
  };

  return (
    <div className="space-y-6 w-full mx-auto">
      {/* Grid Separation */}
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="w-[380px] rounded-2xl bg-white p-8 shadow-2xl animate-slide-up">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2
                className="text-center text-[24px] font-bold text-[#1A1C2E]"
                style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
              >
                Role Posted
              </h2>

              <p
                className="mt-3 text-center text-[15px] text-[#6B7280]"
                style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
              >
                Your requisition has been successfully posted.
              </p>
            </div>
          </div>
        )}
        {/* Left: Form Container Card (Stripe styled visual panel) */}
        <form onSubmit={createJob} className="rounded-2xl border border-stone-200/60 bg-[#FFFFFF] p-6 h-fit shadow-sm">
          <div className="mb-5 border-b border-[#ECE8E2] pb-4">
            <h2 className="text-[25px] font-bold text-brand-navy"
                style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}>Create Requisition</h2>
            <span className="text-[10.5px] mt-0.5 folio-meta text-[#6D6B8D] uppercase">Requisition Details</span>
          </div>
          
          <div className="space-y-4">
            {/* Mismatch Warning Banner */}
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

            <div>
              <label className="block folio-meta text-[#6D6B8D] mb-2 uppercase">
                Job Title
              </label>
              <input 
                className={`input ${errors.title ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10' : ''}`}
                value={form.title} 
                onChange={(event) => setForm({ ...form, title: event.target.value })} 
                placeholder="Senior React Engineer" 
              />
              {errors.title && <p className="mt-1 text-[10px] text-rose-500 font-medium font-sans">{errors.title}</p>}
            </div>
            
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block folio-meta text-[#6D6B8D] mb-1.5 uppercase">
                  Department
                </label>
                <input 
                  className="input" 
                  value={form.department} 
                  onChange={(event) => setForm({ ...form, department: event.target.value })} 
                  required
                />
              </div>
              <div>
                <label className="block folio-meta text-[#6D6B8D] mb-1.5 uppercase">
                  Location
                </label>
                <input 
                  className="input" 
                  value={form.location} 
                  onChange={(event) => setForm({ ...form, location: event.target.value })} 
                  required
                />
              </div>
            </div>

            <div>
              <label className="block folio-meta text-[#6D6B8D] mb-2 uppercase">
                Requirements
              </label>

              <button
                type="button"
                onClick={() => setShowRequirements(true)}
                className="w-full rounded-xl border border-brand-purple/20 bg-brand-purple/5 px-4 py-3 text-sm font-semibold text-brand-purple hover:bg-brand-purple/10"
              >
                Configure Requirements
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block folio-meta text-[#6D6B8D] mb-2 uppercase">
                  Hiring Manager
                </label>
                <input 
                  className={`input ${errors.hiringManager ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10' : ''}`}
                  value={form.hiringManager} 
                  onChange={(event) => setForm({ ...form, hiringManager: event.target.value })} 
                  placeholder="Manager name" 
                />
                {errors.hiringManager && <p className="mt-1 text-[10px] text-rose-500 font-medium font-sans">{errors.hiringManager}</p>}
              </div>

              <div>
                <label className="block folio-meta text-[#6D6B8D] mb-2 uppercase">
                  Experience Level
                </label>
                <select 
                  className="input cursor-pointer font-sans"
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

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block folio-meta text-[#6D6B8D] mb-2 uppercase">
                  Salary Range
                </label>
                <input 
                  className="input" 
                  value={form.salaryRange} 
                  onChange={(event) => setForm({ ...form, salaryRange: event.target.value })} 
                  placeholder="e.g. $80,000 - $110,000" 
                />
              </div>

              <div>
                <label className="block folio-meta text-[#6D6B8D] mb-2 uppercase">
                  Certifications
                </label>
                <input 
                  className="input" 
                  value={form.certifications} 
                  onChange={(event) => setForm({ ...form, certifications: event.target.value })} 
                  placeholder="e.g. AWS Solutions Architect" 
                />
              </div>
            </div>

            <div>
              <label className="block folio-meta text-[#6D6B8D] mb-2 uppercase">
                Required Skills (Comma-separated)
              </label>
              <input 
                className="input" 
                value={skillsInput} 
                onChange={(event) => setSkillsInput(event.target.value)} 
                placeholder="React, TypeScript, CSS" 
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="block folio-meta text-[#6D6B8D] mb-1.5 uppercase">
                  Type
                </label>
                <select 
                  className="input cursor-pointer" 
                  value={form.type} 
                  onChange={(event) => setForm({ ...form, type: event.target.value as Job['type'] })}
                >
                  <option>Full-time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                </select>
              </div>
              <div>
                <label className="block folio-meta text-[#6D6B8D] mb-1.5 uppercase">
                  Priority
                </label>
                <select 
                  className="input cursor-pointer" 
                  value={form.priority} 
                  onChange={(event) => setForm({ ...form, priority: event.target.value as Job['priority'] })}
                >
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                </select>
              </div>
              <div>
                <label className="block folio-meta text-[#6D6B8D] mb-1.5 uppercase">
                  Target Date
                </label>
                <input 
                  className={`input cursor-pointer ${errors.targetDate ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10' : ''}`}
                  type="date" 
                  value={form.targetDate} 
                  onChange={(event) => setForm({ ...form, targetDate: event.target.value })} 
                />
                {errors.targetDate && <p className="mt-1 text-[10px] text-rose-500 font-medium font-sans">{errors.targetDate}</p>}
              </div>
            </div>

            <div>
              <label className="block folio-meta text-[#6D6B8D] mb-2 uppercase">
                Description
              </label>
              <textarea 
                className="input min-h-20 resize-none font-sans" 
                value={form.description} 
                onChange={(event) => setForm({ ...form, description: event.target.value })} 
                placeholder="Job description parameters..."
              />
            </div>

            {/* JD Quality Analysis Widget */}
            {form.description.length > 0 && (
              <div className="rounded-xl border border-[#ECE8E2] bg-white p-3.5 shadow-sm text-xs">
                <div className="flex items-center justify-between border-b border-[#ECE8E2] pb-2 mb-2">
                  <span className="folio-mono text-[9px] uppercase tracking-wider text-stone-500 font-bold flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-brand-purple" />
                    JD Quality Analysis
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

            {/* Collapsible Requirements Weights */}
            <div className="border-t border-[#ECE8E2] pt-4 mt-4">
              <button
                type="button"
                onClick={() => setShowRequirements(!showRequirements)}
                className="flex w-full items-center justify-between text-left folio-mono text-[10px] uppercase tracking-wider text-stone-500 font-bold py-1 cursor-pointer"
              >
                <span>Competency Weights ({showRequirements ? 'Hide' : 'Show'})</span>
                <span className="text-brand-purple text-xs">{showRequirements ? '▲' : '▼'}</span>
              </button>
              
              {showRequirements && (
                <div className="mt-4 p-4 border border-[#ECE8E2] bg-white rounded-xl space-y-4 shadow-inner">
                  <p className="text-[10.5px] text-stone-500 leading-normal mb-2 font-sans">
                       Rate each competency independently from 0–100.
                  </p>
                  {skillsList.map((skill) => (
                    <div key={skill} className="grid gap-2 grid-cols-[110px_1fr_45px] items-center">
                      <span className="folio-mono text-[9px] text-brand-navy font-bold uppercase truncate">{skill}</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={weights[skill] || 0}
                        onChange={(e) => handleSliderChange(skill, Number(e.target.value))}
                        className="w-full h-2 cursor-pointer accent-brand-purple"
                      />
                      <span className="folio-mono text-right text-[9.5px] font-bold text-brand-purple">
                        {Math.round(weights[skill])}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              className="button-primary w-full py-3.5 mt-2 flex items-center justify-center font-bold hover:bg-brand-orange transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
              type="submit"
              disabled={isSaving}
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              {isSaving ? 'Adding...' : 'Add Requisition'}
            </button>
          </div>
        </form>

        {/* Right: Open Roles Directory Card (Stripe styled white card) */}
        <section className="rounded-2xl border border-stone-200/60 bg-white overflow-hidden h-fit shadow-sm">
          <div className="flex flex-col gap-4 border-b border-[#ECE8E2] p-6 sm:flex-row sm:items-center sm:justify-between bg-stone-50/30">
            <div>
              <h2 className="text-[25px] font-bold text-brand-navy"
                style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}>Open Roles</h2>
              <p className="mt-0.5 folio-meta text-[#6D6B8D] uppercase">{filteredJobs.length} requisitions visible</p>
            </div>
            {/* Prominent Search bar */}
            <label className="relative block w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" strokeWidth={1.5} />
              <input 
                className="input pl-9.5 py-2 border-[#ECE8E2] focus:border-[#5B4FE9] shadow-sm text-xs" 
                value={query} 
                onChange={(event) => setQuery(event.target.value)} 
                placeholder="Search jobs..." 
              />
            </label>
          </div>
          
          <div className="divide-y divide-[#ECE8E2]">
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-12 px-6 border-stone-100 rounded-2xl bg-stone-50/20">
                <Search className="h-10 w-10 text-stone-400 mb-3" strokeWidth={1.5} />
                <h3 className="font-sans font-semibold text-sm text-brand-navy">No requisitions found</h3>
                <p className="mt-1 text-xs text-[#6D6B8D] max-w-xs">Try adjusting your search query or add a new job requisition in the panel on the left.</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <article key={job.id} className="p-6 bg-white hover:bg-stone-50/20 transition-all duration-200 hover:translate-x-[2px]">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2 flex-1 min-w-[260px]">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="folio-card-title text-brand-navy leading-tight">{job.title}</h3>
                        <div className="flex gap-1 flex-wrap">
                          <StatusBadge value={job.status} />
                          <StatusBadge value={job.priority} />
                        </div>
                      </div>
                      <p className="max-w-2xl text-xs leading-relaxed text-[#6D6B8D]">{job.description}</p>
                    </div>
                    <select 
                      className="w-full sm:w-32 input py-2 text-xs cursor-pointer font-bold transition" 
                      value={job.status} 
                      onChange={(event) => void updateItem(job.id, { status: event.target.value as Job['status'] })}
                    >
                      <option>Active</option>
                      <option>Draft</option>
                      <option>Closed</option>
                      <option>Archived</option>
                    </select>
                  </div>
                  <div className="mt-4 grid gap-4 grid-cols-2 sm:grid-cols-4 border-t border-[#ECE8E2] pt-4.5">
                    <Field label="Department" value={job.department} />
                    <Field label="Location" value={job.location} />
                    <Field label="Applicants" value={job.applicantsCount.toString()} />
                    <Field label="Hiring Manager" value={job.hiringManager} />
                    {job.experienceLevel && <Field label="Experience" value={job.experienceLevel} />}
                    {job.salaryRange && <Field label="Salary Range" value={job.salaryRange} />}
                    {job.certifications && <Field label="Certifications" value={job.certifications} />}
                  </div>
                  {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <div className="mt-3.5 flex flex-wrap gap-1.5 items-center">
                      <span className="folio-mono text-[8px] uppercase tracking-wider text-[#6D6B8D] font-bold">Skills:</span>
                      {job.requiredSkills.map(skill => (
                        <span key={skill} className="text-[9px] font-mono font-medium text-stone-500 bg-stone-50 border border-stone-200/60 px-1.5 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      </div>
      {showRequirements && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="w-[700px] max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
      
      <h2 className="text-xl font-bold mb-6">
        Requirements Builder
      </h2>

    {skillsList.map((skill) => (
  <div key={skill} className="mb-5">
  <div className="flex justify-between mb-2">
    <span>{skill}</span>
    <span>{weights[skill]}%</span>
  </div>

  <div className="flex items-center gap-3">

    <button
      type="button"
      onClick={() =>
        handleSliderChange(skill, Math.max(0, weights[skill] - 5))
      }
      className="h-8 w-8 rounded-full border"
    >
      -
    </button>

    <div className="relative flex-1">
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-brand-purple"
          style={{
            width: `${weights[skill]}%`,
          }}
        />
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={weights[skill]}
        onChange={(e) =>
          handleSliderChange(skill, Number(e.target.value))
        }
        className="absolute inset-0 w-full opacity-0 cursor-pointer"
      />
    </div>

    <button
      type="button"
      onClick={() =>
        handleSliderChange(skill, Math.min(100, weights[skill] + 5))
      }
      className="h-8 w-8 rounded-full border"
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
          className="rounded-lg border px-4 py-2"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => {
            setForm({
              ...form,
              requirementsWeights: weights,
            });

            setShowRequirements(false);
          }}
          className="rounded-lg bg-brand-purple px-5 py-2 text-white"
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}``  
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="folio-mono text-[8.5px] uppercase tracking-[0.12em] text-[#6D6B8D] font-bold">{label}</div>
      <div className="mt-1 font-sans font-bold text-brand-navy text-xs">{value}</div>
    </div>
  );
}
