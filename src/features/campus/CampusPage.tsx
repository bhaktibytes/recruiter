import { Building2, CalendarDays, GraduationCap, UsersRound } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { useCollection } from '@/hooks/useCollection';
import type { CampusDrive } from '@/types';

export default function CampusPage() {
  const { items: drives, updateItem } = useCollection<CampusDrive>('campusDrives');

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="metric-card">
          <Building2 className="h-5 w-5 text-emerald-700" />
          <div className="mt-3 text-3xl font-black">{drives.length}</div>
          <div className="text-sm text-stone-500">campus drives</div>
        </div>
        <div className="metric-card">
          <UsersRound className="h-5 w-5 text-emerald-700" />
          <div className="mt-3 text-3xl font-black">{drives.reduce((sum, drive) => sum + drive.registrations, 0)}</div>
          <div className="text-sm text-stone-500">registered students</div>
        </div>
        <div className="metric-card">
          <GraduationCap className="h-5 w-5 text-emerald-700" />
          <div className="mt-3 text-3xl font-black">{drives.reduce((sum, drive) => sum + drive.shortlisted, 0)}</div>
          <div className="text-sm text-stone-500">shortlisted profiles</div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {drives.map((drive) => (
          <article key={drive.id} className="panel p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black">{drive.institution}</h2>
                <p className="mt-1 text-sm text-stone-500">{drive.role}</p>
              </div>
              <StatusBadge value={drive.status} />
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-stone-600">
                <CalendarDays className="h-4 w-4 text-emerald-700" />
                {drive.date}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <CampusNumber label="Registrations" value={drive.registrations} />
                <CampusNumber label="Shortlisted" value={drive.shortlisted} />
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-stone-400">Owner</div>
                <div className="mt-1 font-semibold">{drive.owner}</div>
              </div>
              <select className="input" value={drive.status} onChange={(event) => void updateItem(drive.id, { status: event.target.value as CampusDrive['status'] })}>
                <option>Planning</option>
                <option>Live</option>
                <option>Completed</option>
              </select>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function CampusNumber({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-stone-50 p-3">
      <div className="text-xs font-bold uppercase text-stone-400">{label}</div>
      <div className="mt-1 text-xl font-black">{value}</div>
    </div>
  );
}
