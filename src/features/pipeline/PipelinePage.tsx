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
      <section className="grid gap-4 md:grid-cols-3">
        <div className="metric-card">
          <div className="text-sm font-semibold text-stone-500">Pipeline health</div>
          <div className="mt-3 text-3xl font-black">{candidates.length}</div>
          <div className="text-sm text-stone-500">active candidates</div>
        </div>
        <div className="metric-card">
          <div className="text-sm font-semibold text-stone-500">Top match</div>
          <div className="mt-3 text-3xl font-black">{Math.max(0, ...candidates.map((candidate) => candidate.matchScore))}%</div>
          <div className="text-sm text-stone-500">AI fit score</div>
        </div>
        <div className="metric-card">
          <div className="text-sm font-semibold text-stone-500">Offer queue</div>
          <div className="mt-3 text-3xl font-black">{candidates.filter((candidate) => candidate.status === 'Offered').length}</div>
          <div className="text-sm text-stone-500">awaiting next action</div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-7">
        {stages.map((stage) => {
          const stageCandidates = candidates.filter((candidate) => candidate.status === stage);
          return (
            <div key={stage} className="panel min-h-80 p-3">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-black">{stage}</h2>
                <span className="rounded-full bg-stone-100 px-2 py-1 text-xs font-bold text-stone-600">{stageCandidates.length}</span>
              </div>
              <div className="space-y-3">
                {stageCandidates.map((candidate) => (
                  <article key={candidate.id} className="rounded-lg border border-stone-200 bg-white p-3 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-black">{candidate.name}</h3>
                        <p className="mt-1 text-xs text-stone-500">{candidate.jobTitle}</p>
                      </div>
                      <div className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-800">{candidate.matchScore}%</div>
                    </div>
                    <div className="mt-3 space-y-1 text-xs text-stone-500">
                      <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{candidate.email}</div>
                      <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{candidate.location}</div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 2).map((skill) => (
                        <span key={skill} className="rounded-full bg-stone-100 px-2 py-1 text-xs font-semibold text-stone-600">{skill}</span>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <StatusBadge value={candidate.source} />
                      <button
                        type="button"
                        onClick={() => void advanceCandidate(candidate)}
                        className="rounded-md border border-stone-200 p-2 text-stone-600 hover:bg-stone-50"
                        title="Advance candidate"
                        disabled={candidate.status === 'Hired'}
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
