import { useState } from 'react';
import { Plus, Search, Sparkles, SlidersHorizontal } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { useCollection } from '@/hooks/useCollection';
import type { Job } from '@/types';

type JobForm = {
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Contract';
  status: 'Active' | 'Draft' | 'Closed' | 'Archived';
  hiringManager: string;
  priority: 'Critical' | 'High' | 'Medium';
  targetDate: string;
  description: string;
  skillsRequired: string;
  experienceRequired: string;
  weights: Record<string, number>;
};

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
  skillsRequired: '',
  experienceRequired: '1-3 years',
  weights: { Creativity: 33, Leadership: 33, Teamwork: 34 }
};

const templates = [
  {
    name: 'Select high-quality template...',
    title: '',
    department: '',
    description: '',
    skillsRequired: '',
    experienceRequired: '',
    weights: { Creativity: 33, Leadership: 33, Teamwork: 34 }
  },
  {
    name: 'React Frontend Engineer',
    title: 'Senior React Frontend Engineer',
    department: 'Engineering',
    description: 'We are seeking a Senior React Frontend Engineer to build premium, design-first user interfaces. You will own reusable component libraries, coordinate with Figma designers, and optimize web app performance. Responsibilities include mentoring interns and setting visual coding standards.',
    skillsRequired: 'React, TypeScript, CSS, Design Systems',
    experienceRequired: '3-5 years',
    weights: { Creativity: 40, Leadership: 20, Teamwork: 40 }
  },
  {
    name: 'Product UI/UX Designer',
    title: 'Senior Product UI/UX Designer',
    department: 'Design',
    description: 'Join us to design the future of recruiter workspaces. You will conduct user research, create interactive high-fidelity prototypes in Figma, and build out complete visual systems. You should have a strong design aesthetic and experience working in cross-functional product teams.',
    skillsRequired: 'Figma, Visual Design, UX Research, Prototyping',
    experienceRequired: '2-4 years',
    weights: { Creativity: 60, Leadership: 10, Teamwork: 30 }
  },
  {
    name: 'SaaS Sales Specialist',
    title: 'Enterprise SaaS Sales Specialist',
    department: 'Revenue',
    description: 'We are looking for an Enterprise SaaS Sales Specialist to drive outbound enterprise customer acquisition. Responsibilities include building strategic pipelines, demonstrating product value to executives, negotiating large contract values, and collaborating with product teams to align with customer needs.',
    skillsRequired: 'Enterprise Sales, Negotiation, CRM, Pipeline Management',
    experienceRequired: '5+ years',
    weights: { Creativity: 20, Leadership: 40, Teamwork: 40 }
  }
];

const getJDQuality = (desc: string): 'Good' | 'Average' | 'Bad' => {
  const length = desc.trim().length;
  if (length === 0) return 'Bad';
  const keywords = ['responsibilities', 'seeking', 'skills', 'experience', 'build', 'collaborate', 'design', 'manage'];
  const matchedKeywords = keywords.filter(word => desc.toLowerCase().includes(word)).length;
  if (length > 120 && matchedKeywords >= 3) return 'Good';
  if (length > 50 && matchedKeywords >= 1) return 'Average';
  return 'Bad';
};

export default function JobsPage() {
  const { items: jobs, addItem, updateItem } = useCollection<Job>('jobs');
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<JobForm>(initialForm);

  const filteredJobs = jobs.filter((job) => 
    `${job.title} ${job.department} ${job.location}`.toLowerCase().includes(query.toLowerCase())
  );

  const applyTemplate = (index: number) => {
    if (index === 0) return;
    const selected = templates[index];
    setForm({
      ...form,
      title: selected.title,
      department: selected.department,
      description: selected.description,
      skillsRequired: selected.skillsRequired,
      experienceRequired: selected.experienceRequired,
      weights: selected.weights
    });
  };

  const handleSliderChange = (skill: string, value: number) => {
    setForm(prev => {
      const next = { ...prev };
      next.weights = { ...prev.weights, [skill]: value };
      return next;
    });
  };

  const createJob = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.hiringManager.trim() || !form.description.trim() || !form.skillsRequired.trim()) {
      alert('Please fill out all mandatory fields: Title, Hiring Manager, Description, and Key Skills.');
      return;
    }
    const quality = getJDQuality(form.description);
    const skillsArray = form.skillsRequired.split(',').map(s => s.trim()).filter(Boolean);

    await addItem({
      title: form.title,
      department: form.department,
      location: form.location,
      type: form.type,
      status: form.status,
      hiringManager: form.hiringManager,
      priority: form.priority,
      targetDate: form.targetDate,
      description: form.description,
      jdQuality: quality,
      skillsRequired: skillsArray,
      experienceRequired: form.experienceRequired,
      weights: form.weights,
      applicantsCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    } as any);
    setForm(initialForm);
  };

  return (
    <div className="space-y-6 w-full mx-auto">
      {/* Page Header */}
      <header className="border-b border-[#ECE8E2] pb-5 mb-4">
        <p className="folio-mono text-[9px] uppercase tracking-[0.2em] text-brand-lavender mb-1.5 font-bold">
          Role Blueprint Repository
        </p>
        <h1 className="folio-page-title font-light text-brand-navy leading-none tracking-tight">
          Job Requisitions
        </h1>
        <p className="mt-2 text-xs text-[#6D6B8D]/80 font-sans max-w-xl">
          Create and monitor open roles, assign hiring managers, and review target timelines for active requisitions.
        </p>
      </header>

      {/* Grid Separation */}
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Left: Form Container Card */}
        <form onSubmit={createJob} className="rounded-2xl border border-stone-200/60 bg-stone-50/50 p-6 h-fit shadow-sm space-y-4">
          <div className="border-b border-[#ECE8E2] pb-3">
            <span className="folio-meta text-[#6D6B8D] uppercase block mb-1">Requisition Details</span>
            <h2 className="folio-section-title text-brand-navy">Create Requisition</h2>
          </div>
          
          {/* Template Selector */}
          <div>
            <label className="block folio-meta text-brand-purple mb-2 uppercase font-bold flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Auto-fill Template (Avoid Mismatch)
            </label>
            <select 
              className="input cursor-pointer border-brand-purple/20 focus:border-brand-purple font-semibold text-xs" 
              onChange={(event) => applyTemplate(Number(event.target.value))}
            >
              {templates.map((item, idx) => (
                <option key={idx} value={idx}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block folio-meta text-[#6D6B8D] mb-1.5 uppercase">
                Job Title *
              </label>
              <input 
                className="input" 
                value={form.title} 
                onChange={(event) => setForm({ ...form, title: event.target.value })} 
                placeholder="Senior React Engineer" 
                required
              />
            </div>
            
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block folio-meta text-[#6D6B8D] mb-1.5 uppercase">
                  Department *
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
                  Location *
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
              <label className="block folio-meta text-[#6D6B8D] mb-1.5 uppercase">
                Hiring Manager *
              </label>
              <input 
                className="input" 
                value={form.hiringManager} 
                onChange={(event) => setForm({ ...form, hiringManager: event.target.value })} 
                placeholder="Manager name" 
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block folio-meta text-[#6D6B8D] mb-1.5 uppercase">
                  Key Skills Required (Comma separated) *
                </label>
                <input 
                  className="input" 
                  value={form.skillsRequired} 
                  onChange={(event) => setForm({ ...form, skillsRequired: event.target.value })} 
                  placeholder="e.g. React, TypeScript, CSS" 
                  required
                />
              </div>
              <div>
                <label className="block folio-meta text-[#6D6B8D] mb-1.5 uppercase">
                  Experience Required *
                </label>
                <select 
                  className="input cursor-pointer font-bold text-xs" 
                  value={form.experienceRequired} 
                  onChange={(event) => setForm({ ...form, experienceRequired: event.target.value })}
                >
                  <option>Fresher / Student</option>
                  <option>1-3 years</option>
                  <option>3-5 years</option>
                  <option>5+ years</option>
                </select>
              </div>
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
                  Target Date *
                </label>
                <input 
                  className="input cursor-pointer" 
                  type="date" 
                  value={form.targetDate} 
                  onChange={(event) => setForm({ ...form, targetDate: event.target.value })} 
                  required
                />
              </div>
            </div>

            {/* soft competency weightages */}
            <div className="border-t border-[#ECE8E2] pt-3.5 space-y-2.5">
              <label className="block folio-meta text-brand-navy mb-1 uppercase font-bold flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5 text-brand-purple" /> Soft Competency Weightages
              </label>
              {Object.keys(form.weights).map((skill) => (
                <div key={skill} className="grid gap-2 grid-cols-[90px_1fr_40px] items-center">
                  <span className="folio-mono text-[9px] text-[#6D6B8D] font-bold uppercase">{skill}</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.weights[skill]}
                    onChange={(event) => handleSliderChange(skill, Number(event.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#ECE8E2] accent-brand-purple"
                  />
                  <span className="folio-mono text-right text-[10px] font-bold text-brand-purple">{form.weights[skill]}%</span>
                </div>
              ))}
            </div>

            <div>
              <label className="block folio-meta text-[#6D6B8D] mb-1.5 uppercase">
                Job Description (JD) *
              </label>
              <textarea 
                className="input min-h-24 resize-none text-xs" 
                value={form.description} 
                onChange={(event) => setForm({ ...form, description: event.target.value })} 
                placeholder="Describe role responsibilities, required background..."
                required
              />
              {form.description.trim() && (
                <div className={`mt-2 flex flex-col gap-1 border rounded-xl p-2.5 text-xs font-semibold ${
                  getJDQuality(form.description) === 'Good' 
                    ? 'text-brand-mint bg-brand-mint/5 border-brand-mint/20' 
                    : getJDQuality(form.description) === 'Average' 
                    ? 'text-brand-orange bg-brand-orange/5 border-brand-orange/20' 
                    : 'text-rose-600 bg-rose-50 border-rose-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span>JD Quality Rating: <span className="font-extrabold uppercase">{getJDQuality(form.description)}</span></span>
                  </div>
                  <span className="text-[10px] font-normal opacity-90 leading-tight">
                    {getJDQuality(form.description) === 'Good' 
                      ? '✓ Excellent structured job description. Ready for highly accurate matching.' 
                      : getJDQuality(form.description) === 'Average' 
                      ? '⚠ Average quality. Consider adding sections detailing specific responsibilities and experience.' 
                      : '✗ Poor description. Try using one of our templates or expanding on skills/responsibilities to avoid candidate mismatch.'}
                  </span>
                </div>
              )}
            </div>

            <button 
              className="button-primary w-full py-3.5 mt-2 flex items-center justify-center font-bold hover:bg-brand-orange transition duration-150 cursor-pointer text-xs" 
              type="submit"
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              Create Requisition
            </button>
          </div>
        </form>

        {/* Right: Open Roles Directory Card */}
        <section className="rounded-2xl border border-stone-200/60 bg-white overflow-hidden h-fit shadow-sm">
          <div className="flex flex-col gap-4 border-b border-[#ECE8E2] p-6 sm:flex-row sm:items-center sm:justify-between bg-stone-50/30">
            <div>
              <h2 className="folio-section-title text-brand-navy">Open Roles</h2>
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
                          {job.jdQuality && (
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                              job.jdQuality === 'Good' 
                                ? 'bg-brand-mint/5 border-brand-mint/20 text-brand-mint' 
                                : job.jdQuality === 'Average' 
                                ? 'bg-brand-orange/5 border-brand-orange/20 text-brand-orange' 
                                : 'bg-rose-50 border-rose-200 text-rose-600'
                            }`}>
                              JD: {job.jdQuality}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="max-w-2xl text-xs leading-relaxed text-[#6D6B8D]">{job.description}</p>
                      
                      {job.skillsRequired && job.skillsRequired.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1.5">
                          {job.skillsRequired.map((skill, idx) => (
                            <span key={idx} className="text-[9px] font-semibold font-mono text-brand-purple bg-brand-purple/5 border border-brand-purple/10 px-2 py-0.5 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {job.weights && (
                        <div className="text-[9px] font-sans text-stone-500 pt-1.5 flex gap-3 font-semibold">
                          <span>Creativity: {job.weights.Creativity || 0}%</span>
                          <span>Leadership: {job.weights.Leadership || 0}%</span>
                          <span>Teamwork: {job.weights.Teamwork || 0}%</span>
                        </div>
                      )}
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
                    <Field label="Exp. Level" value={job.experienceRequired || '1-3 years'} />
                    <Field label="Hiring Manager" value={job.hiringManager} />
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
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
