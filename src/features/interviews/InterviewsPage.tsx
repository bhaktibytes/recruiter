import { CalendarPlus, CheckCircle2, Clock3, Video, Briefcase } from 'lucide-react';
import type { ElementType } from 'react';
import { useCollection } from '@/hooks/useCollection';
import type { Candidate, Interview } from '@/types';

export default function InterviewsPage() {
  const { items: interviews, addItem, updateItem } = useCollection<Interview>('interviews');
  const { items: candidates } = useCollection<Candidate>('candidates');

  const formatDateTime = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return iso.replace('T', ' ');
    }
  };

  const scheduleForCandidate = async (candidate: Candidate) => {
    await addItem({
      candidateId: candidate.id,
      candidateName: candidate.name,
      jobTitle: candidate.jobTitle,
      interviewer: 'Hiring Panel',
      stage: 'Technical',
      scheduledAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      mode: 'Video',
      status: 'Scheduled',
    });
  };

  return (
    <div className="space-y-12 w-full mx-auto">
      {/* Page Header */}
      <header className="border-b border-[#ECE8E2] pb-8 mb-8">
        <p className="folio-mono text-[10px] uppercase tracking-[0.2em] text-brand-lavender mb-2 font-bold">
          Interview Management
        </p>
        <h1 className="folio-heading text-4xl md:text-5xl font-light text-brand-navy leading-tight tracking-tight">
          Interview Calendar
        </h1>
        <p className="mt-4 text-[#6D6B8D] font-sans text-base max-w-2xl leading-relaxed">
          Calibrate candidate interview stages, review feedback indicators, and schedule assessments for active pipeline candidates.
        </p>
      </header>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        {/* Left Column: Interview Schedule List */}
        <section className="rounded-2xl border border-[#ECE8E2] bg-white p-8 h-fit shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="mb-6 border-b border-[#ECE8E2] pb-5">
            <h2 className="font-sans font-bold text-xl text-brand-navy">Interview Schedule</h2>
            <p className="mt-1 folio-mono text-[9px] text-[#6D6B8D] uppercase tracking-wider font-bold">Track stage, interviewer, mode, and assessment state.</p>
          </div>
          
          <div className="divide-y divide-[#ECE8E2]">
            {interviews.map((interview) => {
              const statusColor = 
                interview.status === 'Scheduled' || interview.status === 'Feedback Due'
                  ? 'bg-brand-orange'
                  : 'bg-brand-mint';

              return (
                <article key={interview.id} className="py-6 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-[260px]">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-white text-xs font-sans font-bold flex-shrink-0">
                          {interview.candidateName.charAt(0)}
                        </div>
                        <h3 className="font-sans font-bold text-brand-navy text-base leading-tight">
                          {interview.candidateName}
                        </h3>
                        <span className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${statusColor}`} />
                          <span className="folio-mono text-[9px] uppercase tracking-[0.1em] text-[#6D6B8D] font-bold leading-none">
                            {interview.status}
                          </span>
                        </span>
                      </div>
                      <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#6D6B8D] font-sans pl-11">
                        <Briefcase className="h-3.5 w-3.5 opacity-70" strokeWidth={1.5} />
                        <span>{interview.jobTitle}</span>
                        <span>·</span>
                        <span className="font-bold text-brand-navy">{interview.stage} Interview</span>
                      </div>
                    </div>
                    
                    {/* Selector Status Control */}
                    <div className="flex-shrink-0">
                      <select 
                        className="input py-2 text-xs font-bold folio-mono uppercase cursor-pointer max-w-[150px]" 
                        value={interview.status} 
                        onChange={(event) => void updateItem(interview.id, { status: event.target.value as Interview['status'] })}
                      >
                        <option>Scheduled</option>
                        <option>Feedback Due</option>
                        <option>Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#ECE8E2]/60 grid gap-4 text-xs sm:grid-cols-4 pl-11">
                    <Info icon={Clock3} label="Time" value={formatDateTime(interview.scheduledAt)} />
                    <Info icon={Video} label="Mode" value={interview.mode} />
                    <Info icon={CheckCircle2} label="Interviewer" value={interview.interviewer} />
                    <Info icon={CalendarPlus} label="Candidate ID" value={`#${interview.candidateId.substring(0, 8)}`} />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Right Column: Ready to Schedule list */}
        <section className="rounded-2xl border border-[#ECE8E2] bg-white p-8 h-fit shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="mb-6 border-b border-[#ECE8E2] pb-5">
            <h2 className="font-sans font-bold text-xl text-brand-navy">Ready to Schedule</h2>
            <p className="mt-1 folio-mono text-[9px] text-[#6D6B8D] uppercase tracking-wider font-bold">Shortlisted and active candidates.</p>
          </div>
          <div className="space-y-4">
            {candidates
              .filter((candidate) => ['Shortlisted', 'Interviewing'].includes(candidate.status))
              .map((candidate) => (
                <div key={candidate.id} className="rounded-xl border border-[#ECE8E2] bg-white p-5 hover:border-brand-purple transition-all duration-300 card-hover">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-white text-xs font-sans font-bold flex-shrink-0">
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-sans font-bold text-brand-navy text-base leading-tight">{candidate.name}</div>
                        <div className="mt-1 text-xs text-[#6D6B8D] font-sans">{candidate.jobTitle}</div>
                      </div>
                    </div>
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-md bg-stone-50 px-2 py-0.5 folio-mono text-[8px] font-bold text-brand-orange border border-[#ECE8E2] uppercase">
                      {candidate.status}
                    </span>
                  </div>
                  <button 
                    onClick={() => void scheduleForCandidate(candidate)} 
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#ECE8E2] bg-stone-50/50 px-4 py-2.5 text-xs font-bold text-brand-navy hover:border-brand-purple hover:bg-brand-purple hover:text-white transition-all duration-150 cursor-pointer" 
                    type="button"
                  >
                    <CalendarPlus className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Schedule Interview
                  </button>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-3.5 w-3.5 text-brand-lavender" strokeWidth={1.5} />
      <div>
        <div className="folio-label text-[9px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold">{label}</div>
        <div className="mt-1 folio-mono text-xs font-bold text-brand-navy">{value}</div>
      </div>
    </div>
  );
}
