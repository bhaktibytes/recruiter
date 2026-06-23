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
    <div className="space-y-12 w-full mx-auto">
      {/* Page Header */}
      <header className="border-b border-[#ECE8E2] pb-8 mb-8">
        <p className="folio-mono text-[10px] uppercase tracking-[0.2em] text-brand-lavender mb-2 font-bold">
          Role Blueprint Repository
        </p>
        <h1 className="folio-heading text-4xl md:text-5xl font-light text-brand-navy leading-tight tracking-tight">
          Job Requisitions
        </h1>
        <p className="mt-4 text-[#6D6B8D] font-sans text-base max-w-2xl leading-relaxed">
          Create and monitor open roles, assign hiring managers, and review target timelines for active requisitions.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        {/* Left Column: Create Form */}
        <form onSubmit={createJob} className="rounded-2xl border border-[#ECE8E2] bg-white p-8 h-fit shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="mb-6 border-b border-[#ECE8E2] pb-5">
            <span className="folio-mono text-[9px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold block mb-1">Requisition Details</span>
            <h2 className="font-sans font-bold text-xl text-brand-navy">Create requisition</h2>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block folio-mono text-[9px] uppercase tracking-wider text-[#6D6B8D] font-bold mb-2">
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
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block folio-mono text-[9px] uppercase tracking-wider text-[#6D6B8D] font-bold mb-2">
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
                <label className="block folio-mono text-[9px] uppercase tracking-wider text-[#6D6B8D] font-bold mb-2">
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
              <label className="block folio-mono text-[9px] uppercase tracking-wider text-[#6D6B8D] font-bold mb-2">
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

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block folio-mono text-[9px] uppercase tracking-wider text-[#6D6B8D] font-bold mb-2">
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
                <label className="block folio-mono text-[9px] uppercase tracking-wider text-[#6D6B8D] font-bold mb-2">
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
                <label className="block folio-mono text-[9px] uppercase tracking-wider text-[#6D6B8D] font-bold mb-2">
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
              <label className="block folio-mono text-[9px] uppercase tracking-wider text-[#6D6B8D] font-bold mb-2">
                Description
              </label>
              <textarea 
                className="input min-h-24 resize-none" 
                value={form.description} 
                onChange={(event) => setForm({ ...form, description: event.target.value })} 
                placeholder="Details of the job requirements..."
              />
            </div>

            <button 
              className="button-primary w-full py-3.5 mt-2 flex items-center justify-center font-bold hover:bg-[#FF6B35] transition duration-150 cursor-pointer" 
              type="submit"
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              Add requisition
            </button>
          </div>
        </form>

        {/* Right Column: Requisitions List */}
        <section className="rounded-2xl border border-[#ECE8E2] bg-white overflow-hidden h-fit shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="flex flex-col gap-4 border-b border-[#ECE8E2] p-8 sm:flex-row sm:items-center sm:justify-between bg-stone-50/50">
            <div>
              <h2 className="font-sans font-bold text-xl text-brand-navy">Open roles</h2>
              <p className="mt-1 folio-mono text-[9px] uppercase tracking-wider text-[#6D6B8D] font-bold">{filteredJobs.length} requisitions visible</p>
            </div>
            <label className="relative block w-full sm:w-72">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" strokeWidth={1.5} />
              <input 
                className="input pl-10 border-[#ECE8E2] focus:border-[#5B4FE9]" 
                value={query} 
                onChange={(event) => setQuery(event.target.value)} 
                placeholder="Search jobs..." 
              />
            </label>
          </div>
          
          <div className="divide-y divide-[#ECE8E2]">
            {filteredJobs.map((job) => (
              <article key={job.id} className="p-8 bg-white hover:bg-stone-50/30 transition-colors duration-150">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-3 flex-1 min-w-[260px]">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-lg font-bold text-brand-navy">{job.title}</h3>
                      <div className="flex gap-1.5 flex-wrap">
                        <StatusBadge value={job.status} />
                        <StatusBadge value={job.priority} />
                      </div>
                    </div>
                    <p className="max-w-2xl text-sm leading-relaxed text-[#6D6B8D]">{job.description}</p>
                  </div>
                  <select 
                    className="w-full sm:w-36 input py-2 text-xs cursor-pointer font-bold transition" 
                    value={job.status} 
                    onChange={(event) => void updateItem(job.id, { status: event.target.value as Job['status'] })}
                  >
                    <option>Active</option>
                    <option>Draft</option>
                    <option>Closed</option>
                    <option>Archived</option>
                  </select>
                </div>
                <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-4 border-t border-[#ECE8E2] pt-5">
                  <Field label="Department" value={job.department} />
                  <Field label="Location" value={job.location} />
                  <Field label="Applicants" value={job.applicantsCount.toString()} />
                  <Field label="Hiring Manager" value={job.hiringManager} />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="folio-mono text-[9px] uppercase tracking-[0.12em] text-[#6D6B8D] font-bold">{label}</div>
      <div className="mt-1 font-sans font-bold text-brand-navy text-sm">{value}</div>
    </div>
  );
}
