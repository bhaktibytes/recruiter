import { Building2, CalendarDays, GraduationCap, UsersRound, Clock, Briefcase } from 'lucide-react';
import { useCollection } from '@/hooks/useCollection';
import type { CampusDrive } from '@/types';

export default function CampusPage() {
  const { items: drives, updateItem } = useCollection<CampusDrive>('campusDrives');

  const activeDrives = drives.filter((d) => d.status === 'Live').length;
  const totalRegistrations = drives.reduce((sum, d) => sum + d.registrations, 0);
  const totalShortlisted = drives.reduce((sum, d) => sum + d.shortlisted, 0);
  const shortlistRatio = totalRegistrations ? Math.round((totalShortlisted / totalRegistrations) * 100) : 0;
  const upcomingDrives = drives.filter((d) => d.status === 'Planning');

  return (
    <div className="space-y-12 w-full mx-auto">
      {/* Page Header */}
      <header className="border-b border-[#ECE8E2] pb-8 mb-8">
        <p className="folio-mono text-[10px] uppercase tracking-[0.2em] text-brand-lavender mb-2 font-bold">
          Talent Pipeline Outreach
        </p>
        <h1 className="folio-heading text-4xl md:text-5xl font-light text-brand-navy leading-tight tracking-tight">
          Campus Recruitment
        </h1>
        <p className="mt-4 text-[#6D6B8D] font-sans text-base max-w-2xl leading-relaxed">
          Manage university outreach drives, track candidate registration metrics, and evaluate shortlist ratios to source early-career talent.
        </p>
      </header>

      {/* Metrics Row - Simple, clean white cards */}
      <section className="grid gap-6 sm:grid-cols-3">
        {/* Active Campaigns */}
        <div className="p-6 rounded-2xl border border-[#ECE8E2] bg-white transition-all duration-300 card-hover flex flex-col justify-between min-h-[150px] shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="flex items-start justify-between">
            <span className="folio-mono text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] font-bold">
              Active campaigns
            </span>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-navy" />
              <Building2 className="h-4 w-4 text-[#6D6B8D]" strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-4">
            <div className="folio-mono text-3.5xl font-bold tracking-tight text-brand-navy">
              {activeDrives}
            </div>
            <p className="mt-1.5 text-[11px] text-[#6D6B8D] font-sans">
              live campus drives
            </p>
          </div>
        </div>

        {/* Student Registrations */}
        <div className="p-6 rounded-2xl border border-[#ECE8E2] bg-white transition-all duration-300 card-hover flex flex-col justify-between min-h-[150px] shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="flex items-start justify-between">
            <span className="folio-mono text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] font-bold">
              Student Registrations
            </span>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-purple" />
              <UsersRound className="h-4 w-4 text-brand-purple" strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-4">
            <div className="folio-mono text-3.5xl font-bold tracking-tight text-brand-purple">
              {totalRegistrations}
            </div>
            <p className="mt-1.5 text-[11px] text-[#6D6B8D] font-sans">
              registered candidates
            </p>
          </div>
        </div>

        {/* Shortlist Conversion */}
        <div className="p-6 rounded-2xl border border-[#ECE8E2] bg-white transition-all duration-300 card-hover flex flex-col justify-between min-h-[150px] shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="flex items-start justify-between">
            <span className="folio-mono text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] font-bold">
              Shortlist Conversion
            </span>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-mint" />
              <GraduationCap className="h-4 w-4 text-brand-mint" strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-4">
            <div className="folio-mono text-3.5xl font-bold tracking-tight text-brand-mint">
              {shortlistRatio}%
            </div>
            <p className="mt-1.5 text-[11px] text-[#6D6B8D] font-sans">
              average shortlist ratio
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Campaigns & Timeline Activity */}
      <section className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        {/* Left Column: Drives Directory */}
        <div className="rounded-2xl border border-[#ECE8E2] bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="mb-6 border-b border-[#ECE8E2] pb-5">
            <h2 className="font-sans font-bold text-xl text-brand-navy">Recruitment Campaigns</h2>
            <p className="mt-1 folio-mono text-[9px] text-[#6D6B8D] uppercase tracking-wider font-bold">Active and historic campus drives.</p>
          </div>
          
          <div className="space-y-6 divide-y divide-[#ECE8E2]">
            {drives.map((drive, index) => {
              const statusColor = 
                drive.status === 'Planning'
                  ? 'bg-stone-400'
                  : drive.status === 'Live'
                  ? 'bg-brand-orange'
                  : 'bg-brand-mint';

              return (
                <article key={drive.id} className={`hover:bg-stone-50/30 transition-all duration-300 ${index > 0 ? 'pt-6' : ''}`}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="font-sans font-bold text-brand-navy text-lg leading-tight">{drive.institution}</h3>
                      <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#6D6B8D] font-sans">
                        <Briefcase className="h-3.5 w-3.5 opacity-75" strokeWidth={1.5} />
                        <span>{drive.role}</span>
                        <span>·</span>
                        <CalendarDays className="h-3.5 w-3.5 opacity-75" strokeWidth={1.5} />
                        <span>{drive.date}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${statusColor}`} />
                        <span className="folio-mono text-[9px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold leading-none">
                          {drive.status}
                        </span>
                      </span>
                      <select 
                        className="folio-mono text-[10px] uppercase font-bold text-brand-navy border border-[#ECE8E2] rounded-xl bg-white px-3 py-2 outline-none transition cursor-pointer hover:border-brand-purple" 
                        value={drive.status} 
                        onChange={(event) => void updateItem(drive.id, { status: event.target.value as CampusDrive['status'] })}
                      >
                        <option>Planning</option>
                        <option>Live</option>
                        <option>Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#ECE8E2]/60 grid grid-cols-3 gap-4 text-xs pb-1">
                    <CampusNumber label="Registrations" value={drive.registrations} />
                    <CampusNumber label="Shortlisted" value={drive.shortlisted} />
                    <div>
                      <div className="folio-label text-[9px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold mb-1">Campaign Owner</div>
                      <div className="font-sans font-bold text-brand-navy text-sm truncate max-w-[150px]">{drive.owner}</div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Right Column: Upcoming Activity Timeline */}
        <div className="rounded-2xl border border-[#ECE8E2] bg-white p-8 h-fit shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="mb-6 border-b border-[#ECE8E2] pb-5">
            <h2 className="font-sans font-bold text-xl text-brand-navy">Upcoming Activity</h2>
            <p className="mt-1 folio-mono text-[9px] text-[#6D6B8D] uppercase tracking-wider font-bold">Drives currently in planning stage.</p>
          </div>
          <div className="space-y-5">
            {upcomingDrives.length === 0 ? (
              <div className="text-center py-8 text-sm text-[#6D6B8D] font-sans">
                No upcoming drives scheduled.
              </div>
            ) : (
              upcomingDrives.map((drive) => (
                <div key={drive.id} className="flex gap-4 items-start">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange/5 text-brand-orange border border-brand-orange/10 flex-shrink-0">
                    <Clock className="h-4 w-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-brand-navy text-sm leading-tight">{drive.institution}</h4>
                    <p className="text-xs text-[#6D6B8D] font-sans mt-0.5">{drive.role} · {drive.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function CampusNumber({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="folio-label text-[9px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold mb-1">{label}</div>
      <div className="folio-mono font-bold text-brand-navy text-sm">{value}</div>
    </div>
  );
}
