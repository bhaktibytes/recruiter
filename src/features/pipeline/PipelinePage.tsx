import { ArrowRight, CheckCircle2, UsersRound } from 'lucide-react';
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
    <div className="space-y-6 w-full mx-auto">
      {/* Page Header - Compact */}
      <header className="border-b border-[#ECE8E2] pb-5 mb-5">
        <p className="folio-mono text-[9px] uppercase tracking-[0.2em] text-brand-lavender mb-1 font-bold">
          Candidate Pipeline
        </p>
        <h1 className="folio-heading text-3xl font-light text-brand-navy leading-tight tracking-tight">
          Candidate Pipeline
        </h1>
        <p className="mt-1.5 text-xs text-[#6D6B8D] font-sans max-w-xl">
          Advance candidates through stages and compare match evaluations computed across candidate portfolios.
        </p>
      </header>

      {/* Top Metrics Grid - Compact */}
      <section className="grid gap-4 md:grid-cols-3">
        {/* Pipeline Health */}
        <div className="p-4.5 rounded-xl border border-[#ECE8E2] bg-white transition-all duration-300 card-hover flex flex-col justify-between min-h-[110px] shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
          <div className="flex items-start justify-between">
            <span className="folio-mono text-[8px] uppercase tracking-[0.18em] text-[#6D6B8D] font-bold">
              Pipeline health
            </span>
            <div className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-brand-navy" />
              <UsersRound className="h-3.5 w-3.5 text-[#6D6B8D]" strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="folio-mono text-2.5xl font-bold tracking-tight text-brand-navy leading-none">
              {candidates.length}
            </div>
            <p className="text-[10px] text-[#6D6B8D] font-sans mt-1">
              active candidates in process
            </p>
          </div>
        </div>

        {/* Top Match */}
        <div className="p-4.5 rounded-xl border border-[#ECE8E2] bg-white transition-all duration-300 card-hover flex flex-col justify-between min-h-[110px] shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
          <div className="flex items-start justify-between">
            <span className="folio-mono text-[8px] uppercase tracking-[0.18em] text-[#6D6B8D] font-bold">
              Top match
            </span>
            <div className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-brand-purple" />
              <ArrowRight className="h-3.5 w-3.5 text-brand-purple" strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="folio-mono text-2.5xl font-bold tracking-tight text-brand-purple leading-none">
              {candidates.length ? Math.max(0, ...candidates.map((candidate) => candidate.matchScore)) : 0}%
            </div>
            <p className="text-[10px] text-[#6D6B8D] font-sans mt-1">
              highest compatibility score
            </p>
          </div>
        </div>

        {/* Offer Queue */}
        <div className="p-4.5 rounded-xl border border-[#ECE8E2] bg-white transition-all duration-300 card-hover flex flex-col justify-between min-h-[110px] shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
          <div className="flex items-start justify-between">
            <span className="folio-mono text-[8px] uppercase tracking-[0.18em] text-[#6D6B8D] font-bold">
              Offer queue
            </span>
            <div className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-brand-orange" />
              <CheckCircle2 className="h-3.5 w-3.5 text-brand-orange" strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="folio-mono text-2.5xl font-bold tracking-tight text-brand-orange leading-none">
              {candidates.filter((candidate) => candidate.status === 'Offered').length}
            </div>
            <p className="text-[10px] text-[#6D6B8D] font-sans mt-1">
              candidates awaiting approval
            </p>
          </div>
        </div>
      </section>

      {/* Kanban Board */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3 pb-6 overflow-x-auto">
        {stages.map((stage) => {
          const stageCandidates = candidates.filter((candidate) => candidate.status === stage);
          const stageColorClass = 
            stage === 'Applied'
              ? 'text-stone-500'
              : stage === 'Matched' || stage === 'Assessment Completed'
              ? 'text-brand-purple'
              : stage === 'Shortlisted' || stage === 'Interviewing' || stage === 'Offered'
              ? 'text-brand-orange'
              : stage === 'Hired'
              ? 'text-brand-mint'
              : 'text-brand-navy';

          return (
            <div key={stage} className="flex flex-col w-full min-w-[190px] flex-shrink-0 bg-stone-50/40 rounded-xl p-2 border border-[#ECE8E2]/50">
              {/* Column Header */}
              <div className="mb-3 flex items-center justify-between border-b border-[#ECE8E2] pb-2 px-1">
                <div className="flex items-center gap-1 min-w-0">
                  <h2 className={`folio-mono text-[8.5px] uppercase tracking-[0.12em] font-bold truncate ${stageColorClass}`}>
                    {stage}
                  </h2>
                </div>
                <span className="flex h-4.5 min-w-[18px] items-center justify-center rounded bg-brand-navy/5 px-1 folio-mono text-[8px] font-bold text-brand-navy/60 border border-brand-navy/5">
                  {stageCandidates.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="space-y-2.5">
                {stageCandidates.map((candidate) => (
                  <article
                    key={candidate.id}
                    className="rounded-xl border border-[#ECE8E2] bg-white p-3 shadow-sm hover:border-brand-purple transition-all duration-200 card-hover flex flex-col justify-between min-h-[145px]"
                  >
                    <div>
                      {/* Top Row: Initial Avatar & Match percentage badge */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-brand-navy text-white text-[10px] font-sans font-bold flex-shrink-0">
                          {candidate.name.charAt(0)}
                        </div>
                        
                        <span className="folio-mono text-[8px] font-bold text-brand-purple bg-brand-purple/5 px-1.5 py-0.5 rounded border border-brand-purple/10">
                          {candidate.matchScore}% FIT
                        </span>
                      </div>

                      {/* Candidate Name & Role */}
                      <div className="mb-2">
                        <h3 className="font-sans font-bold text-brand-navy text-[12.5px] leading-snug truncate" title={candidate.name}>
                          {candidate.name}
                        </h3>
                        <p className="font-sans text-[10px] text-[#6D6B8D] mt-0.5 truncate" title={candidate.jobTitle}>
                          {candidate.jobTitle}
                        </p>
                      </div>

                      {/* AI Recommended indicator (Figma dot badge style) */}
                      {candidate.matchScore >= 85 && (
                        <div className="mb-2 inline-flex items-center gap-1 rounded bg-brand-purple/5 border border-brand-purple/10 px-1.5 py-0.2">
                          <span className="h-1 w-1 rounded-full bg-brand-purple" />
                          <span className="folio-mono text-[7px] uppercase tracking-wider text-brand-purple font-bold">
                            AI Recommend
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar & Action */}
                    <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between gap-2.5">
                      <div className="flex-1">
                        <div className="h-1 rounded-full bg-[#ECE8E2] overflow-hidden">
                          <div
                            className="h-1 rounded-full bg-brand-purple"
                            style={{ width: `${candidate.matchScore}%` }}
                          />
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => void advanceCandidate(candidate)}
                        disabled={candidate.status === 'Hired'}
                        className="flex h-6 w-6 items-center justify-center rounded-lg bg-stone-50 border border-[#ECE8E2] text-brand-navy transition duration-150 hover:bg-brand-purple hover:text-white disabled:opacity-40 disabled:hover:bg-stone-50 disabled:hover:text-brand-navy cursor-pointer flex-shrink-0"
                        title="Advance candidate"
                      >
                        <ArrowRight className="h-3 w-3" strokeWidth={2} />
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
