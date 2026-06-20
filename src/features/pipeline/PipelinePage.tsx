import { ArrowRight, Mail, MapPin } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { useCollection } from '@/hooks/useCollection';
import type { Candidate } from '@/types';

const stages: Candidate['status'][] = ['Applied', 'Matched', 'Assessment Completed', 'Shortlisted', 'Interviewing', 'Offered', 'Hired'];

export default function PipelinePage() {
  const { items: candidates, updateItem } = useCollection<Candidate>('candidates');

  const advanceCandidate = async (candidate: Candidate) => {
    const currentIndex = stages.indexOf(candidate.status);
    const nextStatus = stages[Math.min(currentIndex + 1, stages.length - 1)];
    await updateItem(candidate.id, { status: nextStatus });
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-6 md:grid-cols-3">
        <div className="metric-card">
          <div className="text-sm font-semibold uppercase tracking-wider text-stone-500">
  Pipeline health
</div>
          <div className="mt-3 text-5xl font-black text-stone-900">{candidates.length}</div>
          <div className="text-sm text-stone-500">active candidates</div>
        </div>
        <div className="metric-card">
          <div className="text-sm font-semibold uppercase tracking-wider text-stone-500">
  Top match
</div>
          <div className="mt-3 text-5xl font-black text-emerald-700">{Math.max(0, ...candidates.map((candidate) => candidate.matchScore))}%</div>
          <div className="text-sm text-stone-500">AI fit score</div>
        </div>
        <div className="metric-card">
          <div className="text-sm font-semibold uppercase tracking-wider text-stone-500">
  Offer queue
</div>
          <div className="mt-3 text-3xl font-black">{candidates.filter((candidate) => candidate.status === 'Offered').length}</div>
          <div className="text-sm text-stone-500">awaiting next action</div>
        </div>
      </section>

      <section className="flex gap-6 overflow-x-auto pb-6 snap-x">
        {stages.map((stage) => {
          const stageCandidates = candidates.filter((candidate) => candidate.status === stage);
          return (
            <div key={stage} className="panel min-w-[360px] p-5 flex-shrink-0 bg-[#FAFAFD] border border-[#F1F1F5] rounded-[36px]">
<div className="mb-5 flex items-center justify-between border-b border-stone-100 pb-3">                <h2
  className={`text-xl font-black tracking-tight ${
    stage === 'Applied'
      ? 'text-blue-600'
      : stage === 'Matched'
      ? 'text-[#5B4FE9]'
      : stage === 'Assessment Completed'
      ? 'text-orange-500'
      : stage === 'Shortlisted'
      ? 'text-emerald-600'
      : stage === 'Interviewing'
      ? 'text-indigo-600'
      : stage === 'Offered'
      ? 'text-green-600'
      : 'text-stone-900'
  }`}
>
  {stage}
</h2>
                <span className="rounded-full bg-[#F6F5FF] px-3 py-1 text-xs font-bold text-[#5B4FE9]">{stageCandidates.length}</span>
              </div>
              <div className="space-y-3">
                {stageCandidates.map((candidate) => (
                  <article
  key={candidate.id}
  className="rounded-3xl border border-[#ECEAFB] bg-[#FAFAFD] p-4 shadow-[0_8px_30px_rgba(91,79,233,0.08)] hover:border-[#ECEAFB] hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
>
  <div className="flex items-start justify-between">
    <div className="flex items-center gap-3">

  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF0FF] font-bold text-lg text-[#5B4FE9]">
    {candidate.name.charAt(0)}
  </div>

  <div>
    <h3 className="text-[20px] font-black tracking-tight text-[#151633]">
      {candidate.name}
    </h3>

    <p className="text-sm text-[#6D6B8D]">
      {candidate.jobTitle}
    </p>
  </div>

</div>

    <div className="rounded-full bg-[#EEF2FF] px-4 py-1 text-sm font-black text-[#5B4FE9]">
      {candidate.matchScore}%
    </div>
  </div>

  <div className="mt-4 space-y-2 text-xs text-stone-400">
    <div className="flex items-center gap-2">
      <Mail className="h-3.5 w-3.5" />
      {candidate.email}
    </div>

    <div className="flex items-center gap-2">
      <MapPin className="h-3.5 w-3.5" />
      {candidate.location}
    </div>
  </div>
  
  <div className="mt-3 flex items-center justify-between rounded-xl bg-[#F3F2FF] px-3 py-2">
  <span className="text-xs font-semibold text-[#5B4FE9]">
    Portfolio Intelligence
  </span>

  <span className="text-xs font-black text-[#5B4FE9]">
    {candidate.matchScore + 5}%
  </span>
</div>
  <div className="mt-4 flex flex-wrap gap-2">
    {candidate.skills.slice(0, 3).map((skill) => (
      <span
        key={skill}
        className="rounded-full border border-[#F1F1F5] bg-white px-3 py-1 text-xs font-medium text-[#151633]"
      >
        {skill}
      </span>
    ))}
  </div>

  <div className="mt-4 flex items-center justify-between">
    <StatusBadge value={candidate.source} />

    <button
      type="button"
      onClick={() => void advanceCandidate(candidate)}
      disabled={candidate.status === 'Hired'}
      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ECEAFB] bg-white hover:bg-[#5B4FE9] hover:text-white transition-all duration-300 rounded-xl border border-stone-200 hover:bg-stone-50"
    >
      <ArrowRight className="h-4 w-4" />
    </button>
  </div>
</article>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
