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

  const filteredJobs = jobs.filter((job) => `${job.title} ${job.department} ${job.location}`.toLowerCase().includes(query.toLowerCase()));

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
    <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
      <form onSubmit={createJob} className="panel h-fit p-5">
        <div className="mb-5">
          <h2 className="text-lg font-black">Create requisition</h2>
          <p className="mt-1 text-sm text-stone-500">Add a new role to the local recruiting workspace.</p>
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-stone-700">
            Job title
            <input className="input mt-1" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Senior React Engineer" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-stone-700">
              Department
              <input className="input mt-1" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} />
            </label>
            <label className="block text-sm font-semibold text-stone-700">
              Location
              <input className="input mt-1" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
            </label>
          </div>
          <label className="block text-sm font-semibold text-stone-700">
            Hiring manager
            <input className="input mt-1" value={form.hiringManager} onChange={(event) => setForm({ ...form, hiringManager: event.target.value })} placeholder="Manager name" />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm font-semibold text-stone-700">
              Type
              <select className="input mt-1" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as Job['type'] })}>
                <option>Full-time</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>
            </label>
            <label className="block text-sm font-semibold text-stone-700">
              Priority
              <select className="input mt-1" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as Job['priority'] })}>
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
              </select>
            </label>
            <label className="block text-sm font-semibold text-stone-700">
              Target
              <input className="input mt-1" type="date" value={form.targetDate} onChange={(event) => setForm({ ...form, targetDate: event.target.value })} />
            </label>
          </div>
          <label className="block text-sm font-semibold text-stone-700">
            Description
            <textarea className="input mt-1 min-h-24" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </label>
          <button className="button-primary w-full" type="submit">
            <Plus className="h-4 w-4" />
            Add requisition
          </button>
        </div>
      </form>

      <section className="panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-stone-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black">Open roles</h2>
            <p className="mt-1 text-sm text-stone-500">{filteredJobs.length} requisitions visible</p>
          </div>
          <label className="relative block w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input className="input pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search jobs" />
          </label>
        </div>
        <div className="divide-y divide-stone-100">
          {filteredJobs.map((job) => (
            <article key={job.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-black">{job.title}</h3>
                    <StatusBadge value={job.status} />
                    <StatusBadge value={job.priority} />
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">{job.description}</p>
                </div>
                <select className="input w-36" value={job.status} onChange={(event) => void updateItem(job.id, { status: event.target.value as Job['status'] })}>
                  <option>Active</option>
                  <option>Draft</option>
                  <option>Closed</option>
                  <option>Archived</option>
                </select>
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
                <Field label="Department" value={job.department} />
                <Field label="Location" value={job.location} />
                <Field label="Applicants" value={job.applicantsCount.toString()} />
                <Field label="Hiring manager" value={job.hiringManager} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase text-stone-400">{label}</div>
      <div className="mt-1 font-semibold text-stone-800">{value}</div>
    </div>
  );
}
