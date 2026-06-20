import { CalendarPlus, CheckCircle2, Clock3, Video } from 'lucide-react';
import type { ElementType } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { useCollection } from '@/hooks/useCollection';
import type { Candidate, Interview } from '@/types';

export default function InterviewsPage() {
  const { items: interviews, addItem, updateItem } = useCollection<Interview>('interviews');
  const { items: candidates } = useCollection<Candidate>('candidates');

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
    <div className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
      <section className="panel overflow-hidden bg-[#FCFCFF] border border-[#ECEAFB] rounded-[32px] shadow-[0_8px_30px_rgba(91,79,233,0.08)]">
        <div className="border-b border-stone-200 p-5">
          <h2 className="text-[22px] font-black tracking-tight text-[#151633]">Interview schedule</h2>
          <p className="mt-1 text-sm text-[#6D6B8D]">Track stage, interviewer, mode, and feedback state.</p>
        </div>
        <div className="divide-y divide-stone-100">
          {interviews.map((interview) => (
            <article
  key={interview.id}
  className="p-5 hover:bg-[#FAFAFD] transition-all duration-300"
>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[20px] font-black tracking-tight text-[#151633]">{interview.candidateName}</h3>
                    <StatusBadge value={interview.status} />
                  </div>
                  <p className="mt-1 text-sm text-stone-500">{interview.jobTitle} · {interview.stage}</p>
                </div>
                <select className="input w-44 rounded-2xl" value={interview.status} onChange={(event) => void updateItem(interview.id, { status: event.target.value as Interview['status'] })}>
                  <option>Scheduled</option>
                  <option>Feedback Due</option>
                  <option>Completed</option>
                </select>
              </div>
              <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
                <Info icon={Clock3} label="Time" value={interview.scheduledAt.replace('T', ' ')} />
                <Info icon={Video} label="Mode" value={interview.mode} />
                <Info icon={CheckCircle2} label="Interviewer" value={interview.interviewer} />
                <Info icon={CalendarPlus} label="Candidate ID" value={interview.candidateId} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel h-fit p-6 bg-[#FCFCFF] border border-[#ECEAFB] rounded-[32px] shadow-[0_8px_30px_rgba(91,79,233,0.08)]">        <h2 className="text-lg font-black">Ready to schedule</h2>
        <p className="mt-1 text-sm text-stone-500">Shortlisted and interviewing candidates can be pushed into the calendar.</p>
        <div className="mt-4 space-y-3">
          {candidates
            .filter((candidate) => ['Shortlisted', 'Interviewing'].includes(candidate.status))
            .map((candidate) => (
              <div key={candidate.id} className="rounded-[24px] border border-[#ECEAFB] bg-white p-5 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-black">{candidate.name}</div>
                    <div className="mt-1 text-sm text-stone-500">{candidate.jobTitle}</div>
                  </div>
                  <StatusBadge value={candidate.status} />
                </div>
                <button onClick={() => void scheduleForCandidate(candidate)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#ECEAFB] bg-white px-4 py-3 font-semibold text-[#151633] hover:border-[#5B4FE9] hover:text-[#5B4FE9] transition-all duration-300" type="button">
                  <CalendarPlus className="h-4 w-4" />
                  Schedule interview
                </button>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 text-emerald-700" />
      <div>
        <div className="text-xs font-bold uppercase text-[#9D9AB8]">{label}</div>
        <div className="mt-1 font-semibold">{value}</div>
      </div>
    </div>
  );
}
