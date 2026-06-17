import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Candidate } from '@/types';

const stages: Candidate['status'][] = ['Applied', 'Matched', 'Shortlisted', 'Interviewing', 'Offered', 'Hired'];

export default function HiringFunnelChart({ candidates }: { candidates: Candidate[] }) {
  const data = stages.map((stage) => ({
    stage,
    count: candidates.filter((candidate) => candidate.status === stage).length,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
          <XAxis dataKey="stage" tick={{ fill: '#78716c', fontSize: 12 }} interval={0} />
          <YAxis allowDecimals={false} tick={{ fill: '#78716c', fontSize: 12 }} />
          <Tooltip cursor={{ fill: '#f5f5f4' }} />
          <Bar dataKey="count" fill="#047857" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
