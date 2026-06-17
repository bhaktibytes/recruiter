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

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={BriefcaseBusiness} label="Active jobs" value={activeJobs.toString()} hint={`${jobs.length} total requisitions`} />
        <Metric icon={UsersRound} label="Candidates" value={candidates.length.toString()} hint={`${avgMatch}% avg match score`} />
        <Metric icon={CalendarClock} label="Interviews" value={interviews.length.toString()} hint="Scheduled and feedback due" />
        <Metric icon={CheckCircle2} label="Offers sent" value={offers.toString()} hint="Awaiting approval or response" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black">Hiring funnel</h2>
              <p className="text-sm text-stone-500">Current candidate movement across open roles.</p>
            </div>
            <Activity className="h-5 w-5 text-emerald-700" />
          </div>
          <HiringFunnelChart candidates={candidates} />
        </div>

        <div className="panel p-5">
          <h2 className="text-lg font-black">Priority requisitions</h2>
          <div className="mt-4 space-y-3">
            {jobs.slice(0, 4).map((job) => (
              <div key={job.id} className="rounded-lg border border-stone-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-stone-950">{job.title}</div>
                    <div className="mt-1 text-sm text-stone-500">{job.department} · {job.location}</div>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge value={job.priority} />
                    <StatusBadge value={job.status} />
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-stone-500">Applicants</div>
                    <div className="font-bold">{job.applicantsCount}</div>
                  </div>
                  <div>
                    <div className="text-stone-500">Manager</div>
                    <div className="font-bold">{job.hiringManager}</div>
                  </div>
                  <div>
                    <div className="text-stone-500">Target</div>
                    <div className="font-bold">{job.targetDate}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="border-b border-stone-200 p-5">
          <h2 className="text-lg font-black">Recent candidate movement</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase text-stone-500">
              <tr>
                <th className="px-5 py-3">Candidate</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Source</th>
                <th className="px-5 py-3">Match</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {candidates.slice(0, 5).map((candidate) => (
                <tr key={candidate.id}>
                  <td className="px-5 py-4 font-bold">{candidate.name}</td>
                  <td className="px-5 py-4">{candidate.jobTitle}</td>
                  <td className="px-5 py-4">{candidate.source}</td>
                  <td className="px-5 py-4">{candidate.matchScore}%</td>
                  <td className="px-5 py-4"><StatusBadge value={candidate.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value, hint }: { icon: ElementType; label: string; value: string; hint: string }) {
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-stone-500">{label}</div>
        <Icon className="h-5 w-5 text-emerald-700" />
      </div>
      <div className="mt-3 text-3xl font-black text-stone-950">{value}</div>
      <div className="mt-1 text-sm text-stone-500">{hint}</div>
    </div>
  );
}
