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
    <div className="space-y-12 w-full mx-auto">
      {/* Page Header */}
      <header className="border-b border-[#ECE8E2] pb-8 mb-8">
        <p className="folio-mono text-[10px] uppercase tracking-[0.2em] text-brand-lavender mb-2 font-bold">
          Candidate Pipeline
        </p>
        <h1 className="folio-heading text-4xl md:text-5xl font-light text-brand-navy leading-tight tracking-tight">
          Evaluation Pipeline
        </h1>
        <p className="mt-4 text-[#6D6B8D] font-sans text-base max-w-2xl leading-relaxed">
          Review match scores, track candidate movement through the recruitment stages, and advance candidates with AI-powered fit analysis.
        </p>
      </header>

      {/* Top Metrics Grid */}
      <section className="grid gap-6 md:grid-cols-3">
        {/* Pipeline Health */}
        <div className="p-6 rounded-2xl border border-[#ECE8E2] bg-white transition-all duration-300 card-hover flex flex-col justify-between min-h-[150px] shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="flex items-start justify-between">
            <span className="folio-mono text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] font-bold">
              Pipeline health
            </span>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-navy" />
              <UsersRound className="h-4 w-4 text-[#6D6B8D]" strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-4">
            <div className="folio-mono text-3.5xl font-bold tracking-tight text-brand-navy">
              {candidates.length}
            </div>
            <p className="mt-1.5 text-[11px] text-[#6D6B8D] font-sans">
              active candidates in process
            </p>
          </div>
        </div>

        {/* Top Match */}
        <div className="p-6 rounded-2xl border border-[#ECE8E2] bg-white transition-all duration-300 card-hover flex flex-col justify-between min-h-[150px] shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="flex items-start justify-between">
            <span className="folio-mono text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] font-bold">
              Top match
            </span>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-purple" />
              <ArrowRight className="h-4 w-4 text-brand-purple" strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-4">
            <div className="folio-mono text-3.5xl font-bold tracking-tight text-brand-purple">
              {candidates.length ? Math.max(0, ...candidates.map((candidate) => candidate.matchScore)) : 0}%
            </div>
            <p className="mt-1.5 text-[11px] text-[#6D6B8D] font-sans">
              highest compatibility score
            </p>
          </div>
        </div>

        {/* Offer Queue */}
        <div className="p-6 rounded-2xl border border-[#ECE8E2] bg-white transition-all duration-300 card-hover flex flex-col justify-between min-h-[150px] shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="flex items-start justify-between">
            <span className="folio-mono text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] font-bold">
              Offer queue
            </span>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
              <CheckCircle2 className="h-4 w-4 text-brand-orange" strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-4">
            <div className="folio-mono text-3.5xl font-bold tracking-tight text-brand-orange">
              {candidates.filter((candidate) => candidate.status === 'Offered').length}
            </div>
            <p className="mt-1.5 text-[11px] text-[#6D6B8D] font-sans">
              candidates awaiting approval
            </p>
          </div>
        </div>
      </section>

      {/* Kanban Board */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 pb-6 overflow-x-auto">
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
            <div key={stage} className="flex flex-col w-full min-w-[200px] flex-shrink-0">
              {/* Column Header */}
              <div className="mb-4 flex items-center justify-between border-b border-[#ECE8E2] pb-3">
                <div className="flex items-center gap-1.5 min-w-0">
                  <h2 className={`folio-mono text-[9px] uppercase tracking-[0.12em] font-bold truncate ${stageColorClass}`}>
                    {stage}
                  </h2>
                </div>
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-md bg-brand-navy/5 px-1.5 folio-mono text-[8px] font-bold text-brand-navy/60 border border-brand-navy/5">
                  {stageCandidates.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="space-y-4">
                {stageCandidates.map((candidate) => (
                  <article
                    key={candidate.id}
                    className="rounded-2xl border border-[#ECE8E2] bg-white p-4.5 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:border-brand-purple transition-all duration-300 card-hover flex flex-col justify-between min-h-[190px]"
                  >
                    <div>
                      {/* Avatar and Match tag */}
                      <div className="flex items-start justify-between gap-2 mb-3.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-white text-[11px] font-sans font-bold flex-shrink-0">
                          {candidate.name.charAt(0)}
                        </div>
                        
                        {/* Match Score Badge */}
                        <span className="folio-mono text-[9px] font-bold text-brand-purple bg-brand-purple/5 px-2 py-0.5 rounded border border-brand-purple/10">
                          {candidate.matchScore}% Match
                        </span>
                      </div>

                      {/* Candidate Name, Job Title */}
                      <div className="mb-3">
                        <h3 className="font-sans font-bold text-brand-navy text-sm leading-snug truncate" title={candidate.name}>
                          {candidate.name}
                        </h3>
                        <p className="font-sans text-[11px] text-[#6D6B8D] mt-0.5 truncate" title={candidate.jobTitle}>
                          {candidate.jobTitle}
                        </p>
                      </div>

                      {/* Portfolio Score Progress Bar */}
                      <div className="mt-3.5 pt-3 border-t border-stone-100">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="folio-mono text-[8px] uppercase tracking-[0.1em] text-stone-400 font-bold">
                            Portfolio Score
                          </span>
                          <span className="folio-mono text-[9px] font-bold text-brand-purple">
                            {candidate.matchScore}%
                          </span>
                        </div>
                        <div className="h-1 rounded-full bg-[#ECE8E2] overflow-hidden">
                          <div
                            className="h-1 rounded-full bg-brand-purple"
                            style={{ width: `${candidate.matchScore}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Top Skills List & Actions */}
                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1 min-w-0">
                        {candidate.skills.slice(0, 1).map((skill) => (
                          <span
                            key={skill}
                            className="rounded bg-[#F2EFEA] px-1.5 py-0.5 folio-mono text-[8px] font-bold uppercase text-stone-500 border border-[#ECE8E2] truncate"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => void advanceCandidate(candidate)}
                        disabled={candidate.status === 'Hired'}
                        className="flex h-7 w-7 items-center justify-center rounded-xl bg-stone-50 border border-[#ECE8E2] text-brand-navy transition duration-150 hover:bg-brand-purple hover:text-white disabled:opacity-40 disabled:hover:bg-stone-50 disabled:hover:text-brand-navy cursor-pointer flex-shrink-0"
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
