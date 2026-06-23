import { ArrowRight, CheckCircle2, UsersRound, MapPin } from 'lucide-react';
import { useCollection } from '@/hooks/useCollection';
import type { Candidate } from '@/types';

const stages: Candidate['status'][] = ['Applied', 'Matched', 'Assessment Completed', 'Shortlisted', 'Interviewing', 'Offered', 'Hired'];

export default function PipelinePage() {
  const { items: candidates, updateItem } = useCollection<Candidate>('candidates');

  const advanceCandidate = async (candidate: Candidate) => {
    const currentIndex = stages.indexOf(candidate.status);
    const textNext = stages[Math.min(currentIndex + 1, stages.length - 1)];
    await updateItem(candidate.id, { status: textNext });
  };

  return (
    <div className="space-y-10 w-full mx-auto max-w-5xl">
      {/* Page Header */}
      <header className="border-b border-[#ECE8E2] pb-6 mb-6">
        <p className="folio-meta text-brand-purple uppercase mb-2">
          Candidate Pipeline
        </p>
        <h1 className="folio-page-title text-brand-navy mb-4">
          Pipeline Flow
        </h1>
        <p className="mt-2 text-[#6D6B8D] font-sans text-base max-w-2xl leading-relaxed">
          Coordinate automated profile intakes, examine match ratios, and advance candidates through evaluation nodes.
        </p>
      </header>

      {/* Top Metrics Row - Compact */}
      <section className="grid gap-6 md:grid-cols-3">
        {/* Pipeline Health */}
        <div className="p-5 rounded-2xl border border-[#ECE8E2] bg-white transition-all duration-300 card-hover flex flex-col justify-between min-h-[130px] shadow-sm">
          <div className="flex items-start justify-between">
            <span className="folio-meta text-[#6D6B8D] uppercase">
              Pipeline Health
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-50 border border-[#ECE8E2]">
              <UsersRound className="h-3.5 w-3.5 text-[#6D6B8D]" strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-serif text-3xl font-normal tracking-tight text-brand-navy">
              {candidates.length}
            </div>
            <p className="text-[11px] text-[#6D6B8D] font-sans mt-1">
              active candidates in process
            </p>
          </div>
        </div>

        {/* Top Match */}
        <div className="p-5 rounded-2xl border border-[#ECE8E2] bg-white transition-all duration-300 card-hover flex flex-col justify-between min-h-[130px] shadow-sm">
          <div className="flex items-start justify-between">
            <span className="folio-meta text-[#6D6B8D] uppercase">
              Top Match Ratio
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-purple/5 border border-brand-purple/10">
              <ArrowRight className="h-3.5 w-3.5 text-brand-purple" strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-serif text-3xl font-normal tracking-tight text-brand-purple">
              {candidates.length ? Math.max(0, ...candidates.map((candidate) => candidate.matchScore)) : 0}%
            </div>
            <p className="text-[11px] text-[#6D6B8D] font-sans mt-1">
              highest compatibility score
            </p>
          </div>
        </div>

        {/* Offer Queue */}
        <div className="p-5 rounded-2xl border border-[#ECE8E2] bg-white transition-all duration-300 card-hover flex flex-col justify-between min-h-[130px] shadow-sm">
          <div className="flex items-start justify-between">
            <span className="folio-meta text-[#6D6B8D] uppercase">
              Offers Dispatched
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-orange/5 border border-brand-orange/10">
              <CheckCircle2 className="h-3.5 w-3.5 text-brand-orange" strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-serif text-3xl font-normal tracking-tight text-brand-orange">
              {candidates.filter((candidate) => candidate.status === 'Offered').length}
            </div>
            <p className="text-[11px] text-[#6D6B8D] font-sans mt-1">
              awaiting approval
            </p>
          </div>
        </div>
      </section>

      {/* Kanban Board */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3 pb-6 overflow-x-auto select-none">
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
            <div key={stage} className="flex flex-col w-full min-w-[200px] flex-shrink-0 bg-[#FCFBF9] rounded-xl p-3 border border-[#ECE8E2] shadow-sm">
              {/* Column Header */}
              <div className="mb-3.5 flex items-center justify-between border-b border-[#ECE8E2] pb-2 px-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <h2 className={`folio-meta text-[10px] font-bold uppercase truncate tracking-wider ${stageColorClass}`}>
                    {stage}
                  </h2>
                </div>
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-navy/5 px-1.5 folio-mono text-[9px] font-bold text-brand-navy/60 border border-brand-navy/10">
                  {stageCandidates.length}
                </span>
              </div>

              {/* Column Cards / Empty states */}
              <div className="space-y-3.5 flex-1 flex flex-col justify-start">
                {stageCandidates.length === 0 ? (
                  /* Premium Empty State System */
                  <div className="flex flex-col items-center justify-center py-8 px-3 border border-dashed border-[#ECE8E2] rounded-xl bg-white/40 text-center flex-1 min-h-[150px]">
                    <span className="folio-meta text-[9px] font-bold text-stone-400 uppercase tracking-widest block">✓ Empty</span>
                    <p className="text-[10px] text-stone-400 font-sans mt-1 leading-relaxed">No candidates in this stage</p>
                  </div>
                ) : (
                  stageCandidates.map((candidate) => (
                    <article
                      key={candidate.id}
                      className="rounded-xl border border-[#ECE8E2] bg-white p-3.5 hover:translate-y-[-3px] transition-all duration-200 shadow-sm hover:shadow-md hover:border-brand-purple/35 flex flex-col justify-between min-h-[175px]"
                    >
                      <div>
                        {/* Top: Avatar circle & score circle badge */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-white text-[11px] font-sans font-bold flex-shrink-0 shadow-sm">
                            {candidate.name.charAt(0)}
                          </div>
                          
                          <span className="folio-mono text-[8px] font-bold text-brand-purple bg-brand-purple/10 border border-brand-purple/20 px-2 py-0.5 rounded-full">
                            {candidate.matchScore}% MATCH
                          </span>
                        </div>

                        {/* Name and Role title */}
                        <div className="mb-2.5">
                          <h3 className="font-sans font-bold text-brand-navy text-[13px] leading-snug truncate" title={candidate.name}>
                            {candidate.name}
                          </h3>
                          <p className="font-sans text-[10.5px] text-[#6D6B8D] mt-0.5 truncate" title={candidate.jobTitle}>
                            {candidate.jobTitle}
                          </p>
                        </div>

                        {/* Skill Pills */}
                        {candidate.skills && candidate.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2.5">
                            {candidate.skills.slice(0, 2).map((skill, index) => (
                              <span key={index} className="text-[9px] font-medium font-mono text-stone-500 bg-stone-50 border border-stone-200/60 px-1.5 py-0.5 rounded">
                                {skill}
                              </span>
                            ))}
                            {candidate.skills.length > 2 && (
                              <span className="text-[9px] font-medium font-mono text-stone-400 bg-stone-50 border border-stone-200/60 px-1.5 py-0.5 rounded">
                                +{candidate.skills.length - 2}
                              </span>
                            )}
                          </div>
                        )}

                        {/* AI Recommended Badge indicator */}
                        {candidate.matchScore >= 85 && (
                          <div className="mb-2.5 inline-flex items-center gap-1 rounded bg-brand-purple/5 border border-brand-purple/10 px-1.5 py-0.5">
                            <span className="h-1 w-1 rounded-full bg-brand-purple animate-ping" />
                            <span className="folio-mono text-[7px] uppercase tracking-wider text-brand-purple font-bold">
                              AI RECOMMEND
                            </span>
                          </div>
                        )}

                        {/* Metadata location & source */}
                        <div className="flex items-center gap-2 text-[9px] text-stone-400 font-sans mb-3">
                          <span className="flex items-center gap-0.5 truncate max-w-[80px]">
                            <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
                            {candidate.location}
                          </span>
                          <span>·</span>
                          <span className="truncate max-w-[80px]">{candidate.source}</span>
                        </div>
                      </div>

                      {/* Progress Bar & Sourcing Actions */}
                      <div className="mt-auto pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2.5">
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
                          title="Advance stage"
                        >
                          <ArrowRight className="h-3 w-3" strokeWidth={2} />
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
