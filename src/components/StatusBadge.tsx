const toneMap: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-800',
  Draft: 'bg-stone-100 text-stone-700',
  Closed: 'bg-slate-100 text-slate-700',
  Archived: 'bg-stone-200 text-stone-700',
  Critical: 'bg-rose-100 text-rose-800',
  High: 'bg-amber-100 text-amber-800',
  Medium: 'bg-sky-100 text-sky-800',
  Applied: 'bg-stone-100 text-stone-700',
  Matched: 'bg-sky-100 text-sky-800',
  'Assessment Pending': 'bg-amber-100 text-amber-800',
  'Assessment Completed': 'bg-lime-100 text-lime-800',
  Shortlisted: 'bg-emerald-100 text-emerald-800',
  Interviewing: 'bg-indigo-100 text-indigo-800',
  Offered: 'bg-teal-100 text-teal-800',
  Hired: 'bg-green-100 text-green-800',
  Scheduled: 'bg-sky-100 text-sky-800',
  'Feedback Due': 'bg-rose-100 text-rose-800',
  Completed: 'bg-emerald-100 text-emerald-800',
  Planning: 'bg-amber-100 text-amber-800',
  Live: 'bg-emerald-100 text-emerald-800',
  Sent: 'bg-stone-100 text-stone-700',
};

export function StatusBadge({ value }: { value: string }) {
  return <span className={`badge ${toneMap[value] ?? 'bg-stone-100 text-stone-700'}`}>{value}</span>;
}
