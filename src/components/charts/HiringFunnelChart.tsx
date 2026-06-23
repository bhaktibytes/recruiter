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
          <CartesianGrid strokeDasharray="3 3" stroke="#ECE8E2" vertical={false} />
          <XAxis dataKey="stage" tick={{ fill: '#6D6B8D', fontSize: 10, fontFamily: '"Space Mono", monospace' }} interval={0} />
          <YAxis allowDecimals={false} tick={{ fill: '#6D6B8D', fontSize: 10, fontFamily: '"Space Mono", monospace' }} />
          <Tooltip cursor={{ fill: '#F2EFEA' }} contentStyle={{ backgroundColor: '#FCFBF9', border: '1px solid #ECE8E2', borderRadius: '12px', fontFamily: '"DM Sans", sans-serif' }} />
          <Bar dataKey="count" fill="#5B4FE9" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
