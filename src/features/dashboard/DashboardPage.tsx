import { Activity, BriefcaseBusiness, CalendarClock, CheckCircle2, UsersRound } from 'lucide-react';
import type { ElementType } from 'react';
import HiringFunnelChart from '@/components/charts/HiringFunnelChart';
import { StatusBadge } from '@/components/StatusBadge';
import { useCollection } from '@/hooks/useCollection';
import type { Candidate, Interview, Job } from '@/types';

export default function DashboardPage() {
  const { items: jobs } = useCollection<Job>('jobs');
  const { items: candidates } = useCollection<Candidate>('candidates');
  const { items: interviews } = useCollection<Interview>('interviews');

  const activeJobs = jobs.filter((job) => job.status === 'Active').length;
  const offers = candidates.filter((candidate) => candidate.status === 'Offered').length;
  const avgMatch = candidates.length ? Math.round(candidates.reduce((sum, candidate) => sum + candidate.matchScore, 0) / candidates.length) : 0;

  // Candidate funnel insights
  const stages: Candidate['status'][] = ['Applied', 'Matched', 'Assessment Completed', 'Shortlisted', 'Interviewing', 'Offered', 'Hired'];
  const stageCounts = stages.map((stage) => ({
    stage,
    count: candidates.filter((c) => c.status === stage).length
  }));
  const strongestStage = stageCounts.reduce((max, current) => current.count > max.count ? current : max, { stage: 'None', count: 0 });
  
  const pipelineStages = ['Matched', 'Assessment Completed', 'Shortlisted', 'Interviewing'];
  const bottleneckStage = stageCounts
    .filter((s) => pipelineStages.includes(s.stage))
    .reduce((max, current) => current.count > max.count ? current : max, { stage: 'None', count: 0 });

  const hiredCount = candidates.filter((c) => c.status === 'Hired').length;
  const placementRate = candidates.length ? Math.round((hiredCount / candidates.length) * 100) : 0;

  return (
    <div className="space-y-12 w-full mx-auto">
      {/* Page Header */}
      <header className="border-b border-[#ECE8E2] pb-8 mb-8">
        <p className="folio-mono text-[10px] uppercase tracking-[0.2em] text-brand-lavender mb-2 font-bold">
          Recruitment Dashboard
        </p>
        <h1 className="folio-heading text-4xl md:text-5xl font-light text-brand-navy leading-tight tracking-tight">
          Recruitment Operations Dashboard
        </h1>
        <p className="mt-4 text-[#6D6B8D] font-sans text-base max-w-2xl leading-relaxed">
          Manage requisitions, candidate pipelines, interviews, campus drives and hiring operations from a single workspace.
        </p>
      </header>

      {/* Metrics Row - Simple, clean white cards */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={BriefcaseBusiness} label="Active jobs" value={activeJobs.toString()} hint={`${jobs.length} total requisitions`} />
        <Metric icon={UsersRound} label="Candidates" value={candidates.length.toString()} hint={`${avgMatch}% avg match score`} />
        <Metric icon={CalendarClock} label="Interviews" value={interviews.length.toString()} hint="Scheduled and feedback due" />
        <Metric icon={CheckCircle2} label="Offers sent" value={offers.toString()} hint="Awaiting approval or response" />
      </section>

      {/* Analytics & Priority Requisitions Grid */}
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Hiring Funnel Card */}
        <div className="rounded-2xl border border-[#ECE8E2] bg-white p-8 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="mb-6 flex items-start justify-between border-b border-[#ECE8E2] pb-5">
            <div>
              <h2 className="font-sans font-bold text-xl text-brand-navy">Hiring funnel</h2>
              <p className="mt-1 folio-mono text-[9px] text-[#6D6B8D] uppercase tracking-wider font-bold">Current candidate movement across open roles.</p>
            </div>
            <Activity className="h-5 w-5 text-[#6D6B8D]" strokeWidth={1.5} />
          </div>
          
          {/* Summary Stats Bar */}
          <div className="grid grid-cols-3 gap-6 mb-6 border-b border-[#ECE8E2] pb-5">
            <div>
              <span className="folio-label text-[9px] uppercase tracking-[0.12em] text-[#6D6B8D] font-bold block mb-1">Strongest Stage</span>
              <span className="folio-mono font-bold text-brand-navy text-sm block">{strongestStage.stage}</span>
              <span className="text-[10px] text-stone-400 font-sans mt-0.5 block">{strongestStage.count} candidates active</span>
            </div>
            <div>
              <span className="folio-label text-[9px] uppercase tracking-[0.12em] text-[#6D6B8D] font-bold block mb-1">Potential Bottleneck</span>
              <span className="folio-mono font-bold text-brand-orange text-sm block">{bottleneckStage.stage}</span>
              <span className="text-[10px] text-stone-400 font-sans mt-0.5 block">{bottleneckStage.count} awaiting review</span>
            </div>
            <div>
              <span className="folio-label text-[9px] uppercase tracking-[0.12em] text-[#6D6B8D] font-bold block mb-1">Conversion Ratio</span>
              <span className="folio-mono font-bold text-brand-mint text-sm block">{placementRate}% Placement</span>
              <span className="text-[10px] text-stone-400 font-sans mt-0.5 block">{hiredCount} candidates hired</span>
            </div>
          </div>

          <div className="w-full">
            <HiringFunnelChart candidates={candidates} />
          </div>
        </div>

        {/* Priority Requisitions Card */}
        <div className="rounded-2xl border border-[#ECE8E2] bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="mb-6 border-b border-[#ECE8E2] pb-5">
            <h2 className="font-sans font-bold text-xl text-brand-navy">Priority requisitions</h2>
            <p className="mt-1 folio-mono text-[9px] text-[#6D6B8D] uppercase tracking-wider font-bold">Requisitions demanding immediate attention.</p>
          </div>
          <div className="space-y-4">
            {jobs.slice(0, 4).map((job) => (
              <div key={job.id} className="rounded-xl border border-[#ECE8E2] bg-white p-5 hover:border-brand-purple transition-all duration-300 card-hover">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-sans font-bold text-brand-navy text-base leading-tight">{job.title}</h3>
                    <p className="mt-1 text-xs text-[#6D6B8D] font-sans">{job.department} · {job.location}</p>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    <StatusBadge value={job.priority} />
                    <StatusBadge value={job.status} />
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-[#ECE8E2] grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="folio-label text-[9px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold mb-0.5">Applicants</div>
                    <div className="folio-mono font-bold text-brand-navy text-sm">{job.applicantsCount}</div>
                  </div>
                  <div>
                    <div className="folio-label text-[9px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold mb-0.5">Manager</div>
                    <div className="font-sans font-bold text-brand-navy text-sm truncate max-w-[90px]">{job.hiringManager}</div>
                  </div>
                  <div>
                    <div className="folio-label text-[9px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold mb-0.5">Target</div>
                    <div className="folio-mono font-bold text-brand-navy text-sm">{job.targetDate}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Candidate Movement Section */}
      <section className="rounded-2xl border border-[#ECE8E2] bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
        <div className="mb-6 border-b border-[#ECE8E2] pb-5">
          <h2 className="font-sans font-bold text-xl text-brand-navy">Recent candidate movement</h2>
          <p className="mt-1 folio-mono text-[9px] text-[#6D6B8D] uppercase tracking-wider font-bold">Latest candidate transitions in the evaluation pod.</p>
        </div>
        <div className="overflow-x-auto -mx-8">
          <div className="inline-block min-w-full align-middle px-8">
            <table className="w-full min-w-[720px] text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#ECE8E2] pb-3">
                  <th className="folio-label text-[10px] uppercase tracking-[0.18em] text-[#6D6B8D] pb-3 font-bold">Candidate</th>
                  <th className="folio-label text-[10px] uppercase tracking-[0.18em] text-[#6D6B8D] pb-3 font-bold">Role</th>
                  <th className="folio-label text-[10px] uppercase tracking-[0.18em] text-[#6D6B8D] pb-3 font-bold">Source</th>
                  <th className="folio-label text-[10px] uppercase tracking-[0.18em] text-[#6D6B8D] pb-3 font-bold">Match</th>
                  <th className="folio-label text-[10px] uppercase tracking-[0.18em] text-[#6D6B8D] pb-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE8E2]">
                {candidates.slice(0, 5).map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-brand-bg/30 transition-colors">
                    <td className="py-4 font-sans font-bold text-brand-navy text-[15px]">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-white text-xs font-sans font-bold flex-shrink-0">
                          {candidate.name.charAt(0)}
                        </div>
                        <span>{candidate.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-[#6D6B8D] font-sans text-[14px]">{candidate.jobTitle}</td>
                    <td className="py-4 text-[#6D6B8D] font-sans text-[14px]">{candidate.source}</td>
                    <td className="py-4">
                      <span className="folio-mono font-bold text-brand-purple text-xs bg-brand-purple/5 px-2 py-0.5 rounded border border-brand-purple/10">
                        {candidate.matchScore}%
                      </span>
                    </td>
                    <td className="py-4"><StatusBadge value={candidate.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value, hint }: { icon: ElementType; label: string; value: string; hint: string }) {
  const labelLower = label.toLowerCase();
  let statusIndicatorColor = 'bg-brand-navy';
  if (labelLower.includes('candidate')) {
    statusIndicatorColor = 'bg-brand-purple';
  } else if (labelLower.includes('interview')) {
    statusIndicatorColor = 'bg-brand-orange';
  } else if (labelLower.includes('offer')) {
    statusIndicatorColor = 'bg-brand-mint';
  }

  return (
    <div className="p-6 rounded-2xl border border-[#ECE8E2] bg-white transition-all duration-300 card-hover flex flex-col justify-between min-h-[150px] shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
      <div className="flex items-start justify-between">
        <span className="folio-mono text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] font-bold">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${statusIndicatorColor}`} />
          <Icon className="h-4 w-4 text-[#6D6B8D]" strokeWidth={1.5} />
        </div>
      </div>
      <div className="mt-4">
        <div className="folio-mono text-3.5xl font-bold tracking-tight text-brand-navy">
          {value}
        </div>
        <p className="mt-1.5 text-[11px] text-[#6D6B8D] font-sans">
          {hint}
        </p>
      </div>
    </div>
  );
}
