import { Activity, BriefcaseBusiness, CalendarClock, CheckCircle2, UsersRound, BellRing } from 'lucide-react';
import type { ElementType } from 'react';
import HiringFunnelChart from '@/components/charts/HiringFunnelChart';
import { StatusBadge } from '@/components/StatusBadge';
import { useCollection } from '@/hooks/useCollection';
import type { Candidate, Interview, Job, NotificationItem } from '@/types';

export default function DashboardPage() {
  const { items: jobs } = useCollection<Job>('jobs');
  const { items: candidates } = useCollection<Candidate>('candidates');
  const { items: interviews } = useCollection<Interview>('interviews');
  const { items: notifications } = useCollection<NotificationItem>('notifications');

  const activeJobs = jobs.filter((job) => job.status === 'Active').length;
  const offers = candidates.filter((candidate) => candidate.status === 'Offered').length;
  const avgMatch = candidates.length ? Math.round(candidates.reduce((sum, candidate) => sum + candidate.matchScore, 0) / candidates.length) : 0;

  return (
    <div className="space-y-6 w-full mx-auto">
      {/* Page Header - Premium Editorial Command Center */}
      <header className="border-b border-[#ECE8E2] pb-5 mb-4">
        <p className="folio-mono text-[9px] uppercase tracking-[0.2em] text-brand-lavender mb-1.5 font-bold">
          Recruitment Dashboard
        </p>
        <h1 className="folio-page-title font-light text-brand-navy leading-none tracking-tight">
          Recruitment Operations
        </h1>
        <p className="mt-2 text-xs text-[#6D6B8D]/80 font-sans max-w-xl">
          Coordinate global requisitions, candidate evaluation pipelines, and interview calendars from a single design-first workspace.
        </p>
        
        {/* Executive Summary Row (Figma Style Space Mono chips) */}
        <div className="flex flex-wrap items-center gap-2 mt-4.5 folio-mono text-[9px] uppercase tracking-wide text-brand-navy">
          <span className="bg-white border border-[#ECE8E2] rounded-lg px-2.5 py-1.5 shadow-sm font-bold">14.5 Days <span className="text-[#6D6B8D]/70 font-normal">Hiring Velocity</span></span>
          <span className="bg-white border border-[#ECE8E2] rounded-lg px-2.5 py-1.5 shadow-sm font-bold">87% <span className="text-[#6D6B8D]/70 font-normal">Average Match</span></span>
          <span className="bg-white border border-[#ECE8E2] rounded-lg px-2.5 py-1.5 shadow-sm font-bold">3 <span className="text-[#6D6B8D]/70 font-normal">Interviews Scheduled</span></span>
          <span className="bg-white border border-[#ECE8E2] rounded-lg px-2.5 py-1.5 shadow-sm font-bold">18% <span className="text-[#6D6B8D]/70 font-normal">Offer Conversion</span></span>
          <span className="bg-white border border-[#ECE8E2] rounded-lg px-2.5 py-1.5 shadow-sm font-bold">{jobs.length} <span className="text-[#6D6B8D]/70 font-normal">Open Requisitions</span></span>
        </div>
      </header>

      {/* Metrics Grid - Rebuilt with growth tags */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={BriefcaseBusiness} label="Active jobs" value={activeJobs.toString()} hint={`${jobs.length} requisitions`} trend="▲ +2 this week" trendColor="indigo" />
        <Metric icon={UsersRound} label="Candidates" value={candidates.length.toString()} hint={`${avgMatch}% avg match`} trend="▲ +12% MoM" trendColor="purple" />
        <Metric icon={CalendarClock} label="Interviews" value={interviews.length.toString()} hint="Active calendar" trend="▲ 2 today" trendColor="orange" />
        <Metric icon={CheckCircle2} label="Offers sent" value={offers.toString()} hint="Pending validation" trend="● Stable" trendColor="mint" />
      </section>

      {/* Analytics & Priority Requisitions Grid */}
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Hiring Funnel Card */}
        <div className="rounded-2xl border border-stone-200/60 bg-white p-6 flex flex-col justify-between shadow-sm">
          <div className="mb-4 flex items-start justify-between border-b border-[#ECE8E2] pb-4">
            <div>
              <h2 className="folio-section-title text-brand-navy">Hiring Funnel</h2>
              <p className="mt-0.5 folio-meta text-[#6D6B8D] uppercase">Standard candidate conversion funnel.</p>
            </div>
            <Activity className="h-4.5 w-4.5 text-[#6D6B8D]" strokeWidth={1.5} />
          </div>
          
          {/* Summary Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mb-4 border-b border-[#ECE8E2] pb-4 text-xs">
            <div>
              <span className="folio-label text-[8px] uppercase tracking-[0.12em] text-[#6D6B8D] font-bold block mb-0.5">Top Stage</span>
              <span className="folio-mono font-bold text-brand-navy text-xs block">Applied</span>
              <span className="text-[9px] text-[#6D6B8D] font-sans mt-0.5 block">120 candidates</span>
            </div>
            <div>
              <span className="folio-label text-[8px] uppercase tracking-[0.12em] text-[#6D6B8D] font-bold block mb-0.5">Bottleneck Stage</span>
              <span className="folio-mono font-bold text-brand-orange text-xs block">Interviewing</span>
              <span className="text-[9px] text-[#6D6B8D] font-sans mt-0.5 block">19 candidates</span>
            </div>
            <div>
              <span className="folio-label text-[8px] uppercase tracking-[0.12em] text-[#6D6B8D] font-bold block mb-0.5">Conversion Ratio</span>
              <span className="folio-mono font-bold text-brand-mint text-xs block">2.5% Hired</span>
              <span className="text-[9px] text-[#6D6B8D] font-sans mt-0.5 block">3 candidates hired</span>
            </div>
          </div>
 
          <div className="w-full">
            <HiringFunnelChart candidates={candidates} />
          </div>
        </div>
 
        {/* Right Column: Requisitions & Notifications */}
        <div className="space-y-6">
          {/* Priority Requisitions Card */}
          <div className="rounded-2xl border border-stone-200/60 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="mb-4 border-b border-[#ECE8E2] pb-4">
                <h2 className="folio-section-title text-brand-navy">Priority Requisitions</h2>
                <p className="mt-0.5 folio-meta text-[#6D6B8D] uppercase">Open roles requiring immediate sourcing.</p>
              </div>
              <div className="space-y-3.5">
                {jobs.slice(0, 2).map((job) => (
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
                    
                    {/* Rich metadata display (Days remaining & hiring velocity) */}
                    <div className="mt-4 pt-2.5 border-t border-[#ECE8E2] grid grid-cols-3 gap-2 text-[10px]">
                      <div>
                        <div className="folio-label text-[8px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold mb-0.5">Sourcing</div>
                        <div className="folio-mono font-bold text-brand-navy">{job.applicantsCount} Candidates</div>
                      </div>
                      <div>
                        <div className="folio-label text-[8px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold mb-0.5">Timeline</div>
                        <div className="folio-mono font-bold text-brand-orange">14 Days Left</div>
                      </div>
                      <div>
                        <div className="folio-label text-[8px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold mb-0.5">Urgency</div>
                        <div className="folio-mono font-bold text-brand-purple">Velocity: Fast</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compact Notifications Widget */}
          <div className="rounded-2xl border border-stone-200/60 bg-white p-6 shadow-sm">
            <div className="mb-4 border-b border-[#ECE8E2] pb-4 flex items-center justify-between">
              <div>
                <h2 className="folio-section-title text-brand-navy">Outbound Queue</h2>
                <p className="mt-0.5 folio-meta text-[#6D6B8D] uppercase">Latest communication logs.</p>
              </div>
              <BellRing className="h-4.5 w-4.5 text-[#6D6B8D]/80" strokeWidth={1.5} />
            </div>
            
            <div className="space-y-3">
              {notifications.slice(0, 3).map((item) => (
                <div key={item.id} className="text-xs border-b border-stone-100 pb-2.5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-brand-navy leading-tight">{item.title}</span>
                    <span className="text-[8px] font-mono text-brand-purple bg-brand-purple/5 px-1.5 py-0.5 rounded border border-brand-purple/10 uppercase font-bold">{item.channel}</span>
                  </div>
                  <p className="text-[#6D6B8D]/85 mt-1 leading-normal font-sans text-[11px]">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
 
      {/* Recent Candidate Movement Section */}
      <section className="rounded-2xl border border-stone-200/60 bg-white p-6 shadow-sm overflow-hidden">
        <div className="mb-4 border-b border-[#ECE8E2] pb-4">
          <h2 className="folio-section-title text-brand-navy">Recent Candidate Movement</h2>
          <p className="mt-0.5 folio-meta text-[#6D6B8D] uppercase">Latest transitions in candidate evaluation status.</p>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle px-6">
            <table className="w-full min-w-[720px] text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#ECE8E2] pb-2">
                  <th className="folio-label text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] pb-2 font-bold">Candidate</th>
                  <th className="folio-label text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] pb-2 font-bold">Role</th>
                  <th className="folio-label text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] pb-2 font-bold">Source</th>
                  <th className="folio-label text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] pb-2 font-bold">Match</th>
                  <th className="folio-label text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] pb-2 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE8E2]">
                {candidates.slice(0, 5).map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-[#151633]/[0.02] transition-colors">
                    <td className="py-2 font-sans font-bold text-brand-navy text-[13.5px]">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-navy text-white text-[10px] font-sans font-bold flex-shrink-0">
                          {candidate.name.charAt(0)}
                        </div>
                        <span>{candidate.name}</span>
                      </div>
                    </td>
                    <td className="py-2 text-[#6D6B8D]/90 font-sans text-[12.5px]">{candidate.jobTitle}</td>
                    <td className="py-2 text-[#6D6B8D]/90 font-sans text-[12.5px]">{candidate.source}</td>
                    <td className="py-2">
                      <span className="folio-mono font-bold text-brand-purple text-[10.5px] bg-brand-purple/5 px-2 py-0.5 rounded border border-brand-purple/10">
                        {candidate.matchScore}%
                      </span>
                    </td>
                    <td className="py-2"><StatusBadge value={candidate.status} /></td>
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
  let trendClass = 'text-[#6D6B8D] bg-stone-50 border-[#ECE8E2]';
  
  if (trendColor === 'purple') {
    indicatorDotColor = 'bg-brand-purple';
    trendClass = 'text-brand-purple bg-brand-purple/5 border-brand-purple/10';
  } else if (trendColor === 'orange') {
    indicatorDotColor = 'bg-brand-orange';
    trendClass = 'text-brand-orange bg-brand-orange/5 border-brand-orange/10';
  } else if (trendColor === 'mint') {
    indicatorDotColor = 'bg-brand-mint';
    trendClass = 'text-brand-mint bg-brand-mint/5 border-brand-mint/10';
  } else if (trendColor === 'navy') {
    indicatorDotColor = 'bg-blue-600';
    trendClass = 'text-blue-600 bg-blue-50 border-blue-100';
  }

  return (
    <div className="p-4 rounded-xl border border-stone-200/60 bg-white transition-all duration-300 card-hover flex flex-col justify-between min-h-[105px] shadow-sm">
      <div className="flex items-start justify-between">
        <span className="folio-mono text-[8px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold">
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          <span className={`h-1 w-1 rounded-full ${indicatorDotColor}`} />
          <Icon className="h-3.5 w-3.5 text-[#6D6B8D]" strokeWidth={1.5} />
        </div>
      </div>
      <div className="mt-2.5 flex items-baseline justify-between gap-2">
        <div>
          <div className="folio-mono text-2xl font-bold tracking-tight text-brand-navy leading-none">
            {value}
          </div>
          <p className="text-[9px] text-[#6D6B8D]/80 font-sans mt-0.5">
            {hint}
          </p>
        </div>
        <span className={`folio-mono text-[7.5px] font-bold uppercase tracking-wider border px-1.5 py-0.5 rounded flex-shrink-0 ${trendClass}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}
