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
    <div className="space-y-6 w-full mx-auto">
      {/* Page Header - Compact */}
      <header className="border-b border-[#ECE8E2] pb-5 mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="folio-mono text-[9px] uppercase tracking-[0.2em] text-brand-lavender mb-1 font-bold">
            Recruitment Dashboard
          </p>
          <h1 className="folio-heading text-3xl font-light text-brand-navy leading-tight tracking-tight">
            Recruitment Operations
          </h1>
          <p className="mt-1.5 text-xs text-[#6D6B8D] font-sans max-w-xl">
            Monitor and coordinate open requisitions, candidate evaluation streams, and interview activities.
          </p>
        </div>
      </header>

      {/* Metrics Grid - More Compact */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={BriefcaseBusiness} label="Active jobs" value={activeJobs.toString()} hint={`${jobs.length} total roles`} trend="+2 new" trendColor="navy" />
        <Metric icon={UsersRound} label="Candidates" value={candidates.length.toString()} hint={`${avgMatch}% avg match`} trend="+12% MoM" trendColor="purple" />
        <Metric icon={CalendarClock} label="Interviews" value={interviews.length.toString()} hint="Active calendar" trend="2 today" trendColor="orange" />
        <Metric icon={CheckCircle2} label="Offers sent" value={offers.toString()} hint="Pending validation" trend="1 pending" trendColor="mint" />
      </section>

      {/* Insights Strip (Figma Style) */}
      <section className="grid gap-4 grid-cols-2 md:grid-cols-4 bg-white border border-[#ECE8E2] rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] text-xs">
        <div className="flex flex-col gap-0.5">
          <span className="folio-mono text-[8px] uppercase tracking-wider text-[#6D6B8D] font-bold">Hiring Velocity</span>
          <span className="font-sans font-bold text-brand-navy">14.5 days average</span>
        </div>
        <div className="flex flex-col gap-0.5 border-l border-[#ECE8E2] pl-4">
          <span className="folio-mono text-[8px] uppercase tracking-wider text-[#6D6B8D] font-bold">Average Match Score</span>
          <span className="font-sans font-bold text-brand-navy">{avgMatch}% platform fit</span>
        </div>
        <div className="flex flex-col gap-0.5 border-l border-[#ECE8E2] pl-4">
          <span className="folio-mono text-[8px] uppercase tracking-wider text-[#6D6B8D] font-bold">Interviews Scheduled</span>
          <span className="font-sans font-bold text-brand-navy">{interviews.length} this week</span>
        </div>
        <div className="flex flex-col gap-0.5 border-l border-[#ECE8E2] pl-4">
          <span className="folio-mono text-[8px] uppercase tracking-wider text-[#6D6B8D] font-bold">Offer Conversion</span>
          <span className="font-sans font-bold text-brand-navy">{placementRate}% placement rate</span>
        </div>
      </section>

      {/* Analytics & Priority Requisitions Grid */}
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Hiring Funnel Card */}
        <div className="rounded-2xl border border-[#ECE8E2] bg-white p-6 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="mb-4 flex items-start justify-between border-b border-[#ECE8E2] pb-4">
            <div>
              <h2 className="font-sans font-bold text-lg text-brand-navy">Hiring funnel</h2>
              <p className="mt-0.5 folio-mono text-[8.5px] text-[#6D6B8D] uppercase tracking-wider font-bold">Candidate movements through pipeline.</p>
            </div>
            <Activity className="h-4.5 w-4.5 text-[#6D6B8D]" strokeWidth={1.5} />
          </div>
          
          {/* Summary Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mb-4 border-b border-[#ECE8E2] pb-4 text-xs">
            <div>
              <span className="folio-label text-[8px] uppercase tracking-[0.12em] text-[#6D6B8D] font-bold block mb-0.5">Strongest Stage</span>
              <span className="folio-mono font-bold text-brand-navy text-xs block truncate">{strongestStage.stage}</span>
              <span className="text-[9px] text-stone-400 font-sans mt-0.5 block">{strongestStage.count} active</span>
            </div>
            <div>
              <span className="folio-label text-[8px] uppercase tracking-[0.12em] text-[#6D6B8D] font-bold block mb-0.5">Potential Bottleneck</span>
              <span className="folio-mono font-bold text-brand-orange text-xs block truncate">{bottleneckStage.stage}</span>
              <span className="text-[9px] text-stone-400 font-sans mt-0.5 block">{bottleneckStage.count} pending</span>
            </div>
            <div>
              <span className="folio-label text-[8px] uppercase tracking-[0.12em] text-[#6D6B8D] font-bold block mb-0.5">Conversion Ratio</span>
              <span className="folio-mono font-bold text-brand-mint text-xs block truncate">{placementRate}% Placement</span>
              <span className="text-[9px] text-stone-400 font-sans mt-0.5 block">{hiredCount} hired</span>
            </div>
          </div>

          <div className="w-full">
            {/* Tighter chart height */}
            <HiringFunnelChart candidates={candidates} />
          </div>
        </div>

        {/* Priority Requisitions Card */}
        <div className="rounded-2xl border border-[#ECE8E2] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col justify-between">
          <div>
            <div className="mb-4 border-b border-[#ECE8E2] pb-4">
              <h2 className="font-sans font-bold text-lg text-brand-navy">Priority requisitions</h2>
              <p className="mt-0.5 folio-mono text-[8.5px] text-[#6D6B8D] uppercase tracking-wider font-bold">Open roles demanding immediate focus.</p>
            </div>
            <div className="space-y-3">
              {jobs.slice(0, 3).map((job) => (
                <div key={job.id} className="rounded-xl border border-[#ECE8E2] bg-white p-4 hover:border-brand-purple transition-all duration-300 card-hover">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-sans font-bold text-brand-navy text-sm leading-tight">{job.title}</h3>
                      <p className="mt-0.5 text-[11px] text-[#6D6B8D] font-sans">{job.department} · {job.location}</p>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      <StatusBadge value={job.priority} />
                      <StatusBadge value={job.status} />
                    </div>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-[#ECE8E2] grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="folio-label text-[8px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold mb-0.5">Applicants</div>
                      <div className="folio-mono font-bold text-brand-navy text-xs">{job.applicantsCount}</div>
                    </div>
                    <div>
                      <div className="folio-label text-[8px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold mb-0.5">Manager</div>
                      <div className="font-sans font-bold text-brand-navy text-xs truncate max-w-[85px]">{job.hiringManager}</div>
                    </div>
                    <div>
                      <div className="folio-label text-[8px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold mb-0.5">Target</div>
                      <div className="folio-mono font-bold text-brand-navy text-xs">{job.targetDate}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Candidate Movement Section */}
      <section className="rounded-2xl border border-[#ECE8E2] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
        <div className="mb-4 border-b border-[#ECE8E2] pb-4">
          <h2 className="font-sans font-bold text-lg text-brand-navy">Recent candidate movement</h2>
          <p className="mt-0.5 folio-mono text-[8.5px] text-[#6D6B8D] uppercase tracking-wider font-bold">Latest transitions in candidate evaluation status.</p>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle px-6">
            <table className="w-full min-w-[720px] text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#ECE8E2] pb-2">
                  <th className="folio-label text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] pb-2.5 font-bold">Candidate</th>
                  <th className="folio-label text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] pb-2.5 font-bold">Role</th>
                  <th className="folio-label text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] pb-2.5 font-bold">Source</th>
                  <th className="folio-label text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] pb-2.5 font-bold">Match</th>
                  <th className="folio-label text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] pb-2.5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE8E2]">
                {candidates.slice(0, 5).map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-brand-bg/20 transition-colors">
                    <td className="py-2.5 font-sans font-bold text-brand-navy text-[14px]">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-navy text-white text-[10px] font-sans font-bold flex-shrink-0">
                          {candidate.name.charAt(0)}
                        </div>
                        <span>{candidate.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-[#6D6B8D] font-sans text-[13px]">{candidate.jobTitle}</td>
                    <td className="py-2.5 text-[#6D6B8D] font-sans text-[13px]">{candidate.source}</td>
                    <td className="py-2.5">
                      <span className="folio-mono font-bold text-brand-purple text-[11px] bg-brand-purple/5 px-2 py-0.5 rounded border border-brand-purple/10">
                        {candidate.matchScore}%
                      </span>
                    </td>
                    <td className="py-2.5"><StatusBadge value={candidate.status} /></td>
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

function Metric({ icon: Icon, label, value, hint, trend, trendColor }: { icon: ElementType; label: string; value: string; hint: string; trend: string; trendColor: string }) {
  let indicatorDotColor = 'bg-brand-navy';
  if (trendColor === 'purple') indicatorDotColor = 'bg-brand-purple';
  else if (trendColor === 'orange') indicatorDotColor = 'bg-brand-orange';
  else if (trendColor === 'mint') indicatorDotColor = 'bg-brand-mint';
  else if (trendColor === 'navy') indicatorDotColor = 'bg-blue-600';

  return (
    <div className="p-4.5 rounded-xl border border-[#ECE8E2] bg-white transition-all duration-300 card-hover flex flex-col justify-between min-h-[110px] shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
      <div className="flex items-start justify-between">
        <span className="folio-mono text-[8px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold">
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          <span className={`h-1 w-1 rounded-full ${indicatorDotColor}`} />
          <Icon className="h-3.5 w-3.5 text-[#6D6B8D]" strokeWidth={1.5} />
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div>
          <div className="folio-mono text-2.5xl font-bold tracking-tight text-brand-navy leading-none">
            {value}
          </div>
          <p className="text-[9.5px] text-[#6D6B8D] font-sans mt-1">
            {hint}
          </p>
        </div>
        <span className="folio-mono text-[8px] font-bold uppercase tracking-wider text-[#6D6B8D] bg-stone-50 border border-[#ECE8E2] px-1.5 py-0.5 rounded flex-shrink-0">
          {trend}
        </span>
      </div>
    </div>
  );
}
