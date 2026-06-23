import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
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
};

export default function JobsPage() {
  const { items: jobs, addItem, updateItem } = useCollection<Job>('jobs');
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<JobForm>(initialForm);

  const filteredJobs = jobs.filter((job) => 
    `${job.title} ${job.department} ${job.location}`.toLowerCase().includes(query.toLowerCase())
  );

  const createJob = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.hiringManager.trim()) {
      return;
    }
    await addItem({
      ...form,
      applicantsCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    });
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
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Left: Form Container Card (Stripe styled visual panel) */}
        <form onSubmit={createJob} className="rounded-2xl border border-stone-200/60 bg-stone-50/50 p-6 h-fit shadow-sm">
          <div className="mb-5 border-b border-[#ECE8E2] pb-4">
            <span className="folio-meta text-[#6D6B8D] uppercase block mb-1">Requisition Details</span>
            <h2 className="folio-section-title text-brand-navy">Create Requisition</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block folio-meta text-[#6D6B8D] mb-2 uppercase">
                Job Title
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
                Hiring Manager
              </label>
              <input 
                className="input" 
                value={form.hiringManager} 
                onChange={(event) => setForm({ ...form, hiringManager: event.target.value })} 
                placeholder="Manager name" 
                required
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
                  className="input cursor-pointer" 
                  type="date" 
                  value={form.targetDate} 
                  onChange={(event) => setForm({ ...form, targetDate: event.target.value })} 
                  required
                />
              </div>
            </div>

            <div>
              <label className="block folio-meta text-[#6D6B8D] mb-2 uppercase">
                Description
              </label>
              <textarea 
                className="input min-h-20 resize-none" 
                value={form.description} 
                onChange={(event) => setForm({ ...form, description: event.target.value })} 
                placeholder="Job description parameters..."
              />
            </div>

            <button 
              className="button-primary w-full py-3.5 mt-2 flex items-center justify-center font-bold hover:bg-brand-orange transition duration-150 cursor-pointer" 
              type="submit"
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              Add requisition
            </button>
          </div>
        </form>

        {/* Right: Open Roles Directory Card (Stripe styled white card) */}
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
