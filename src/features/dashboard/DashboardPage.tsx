import { BriefcaseBusiness, CalendarClock, CheckCircle2, UsersRound, Send, ArrowUpRight, Plus, Layers } from 'lucide-react';
import { ElementType, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import { useCollection } from '@/hooks/useCollection';
import { useAuth } from '@/contexts/useAuth';
import RecruiterProfileModal from '@/features/recruiter/RecruiterProfileModal';
import type { Candidate, Interview, Job } from '@/types';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, recruiterProfile } = useAuth();
  const { items: jobs } = useCollection<Job>('jobs');
  const { items: candidates } = useCollection<Candidate>('candidates');
  const { items: interviews } = useCollection<Interview>('interviews');
  
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Dynamic calculations
  const activeJobs = jobs.filter((job) => job.status === 'Active').length;
  const offersCount = candidates.filter((candidate) => candidate.status === 'Offered').length;
  const avgMatch = candidates.length 
    ? Math.round(candidates.reduce((sum, candidate) => sum + candidate.matchScore, 0) / candidates.length) 
    : 0;

  // Dynamic calculations for trend lines
  const todayDateStr = '2026-06-24'; // System locked date from metadata
  const interviewsTodayCount = interviews.filter(i => i.scheduledAt.startsWith(todayDateStr)).length;
  const newCandidatesThisMonth = candidates.filter(c => c.appliedDate >= '2026-06-01').length;
  const offersPendingCount = candidates.filter(c => c.status === 'Offered').length;

  // Top matches sorting
  const topMatchedCandidates = [...candidates]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6);

  const labelFontStyle = { fontFamily: '"DM Sans", system-ui, sans-serif' };

  // Calculate profile completion percentage based on 13 fields from recruiter onboarding
  const profileCompletion = useMemo(() => {
    if (!recruiterProfile) return { percentage: 0, nextAction: 'Complete Recruiter Profile' };
    
    const requiredFields = [
      recruiterProfile.fullName,
      recruiterProfile.designation,
      recruiterProfile.email,
      recruiterProfile.phoneNumber,
      recruiterProfile.companyName,
      recruiterProfile.companyWebsite,
      recruiterProfile.industry,
      recruiterProfile.companySize,
      recruiterProfile.officeLocation,
      recruiterProfile.hiringDepartments,
      recruiterProfile.preferredLocations
    ];
    
    const optionalFields = [
      recruiterProfile.companyLogo,
      recruiterProfile.linkedinUrl
    ];
    
    const completedRequired = requiredFields.filter(f => {
      if (Array.isArray(f)) return f.length > 0;
      return f && f.toString().trim() !== '';
    }).length;
    
    const completedOptional = optionalFields.filter(f => f && f.toString().trim() !== '').length;
    
    const total = requiredFields.length + optionalFields.length;
    const completed = completedRequired + completedOptional;
    const percentage = Math.round((completed / total) * 100);
    
    let nextAction = 'Profile is 100% complete!';
    if (!recruiterProfile.companyName || !recruiterProfile.companyWebsite || !recruiterProfile.industry || !recruiterProfile.companySize) {
      nextAction = 'Complete Company Profile';
    } else if (!recruiterProfile.officeLocation || !recruiterProfile.hiringDepartments || !recruiterProfile.preferredLocations) {
      nextAction = 'Complete Hiring Preferences';
    } else if (!recruiterProfile.companyLogo || !recruiterProfile.linkedinUrl) {
      nextAction = 'Add Logo & Social links';
    }
    
    return { percentage, nextAction };
  }, [recruiterProfile]);

  return (
     <div className="space-y-6 w-full mx-auto animate-slide-up will-change-transform">
      {/* Page Header - Premium Editorial Command Center */}
      <header className="border-b border-[#ECE8E2] pb-5 mb-4">
        <h1 className="font-serif text-[32px] tracking-tight text-brand-navy mb-1.5">
          Recruitment Operations
        </h1>
        <p className="max-w-3xl text-[15px] leading-relaxed text-[#1A1C2E99]">
          Connect a portfolio source to get your first intelligence report. The analysis extracts your skills, tools, and design domains from actual work.
        </p>
        
        {/* Executive Summary Row (Figma Style Space Mono chips) */}
        <div className="flex flex-wrap items-center gap-2 mt-6 folio-mono text-[9px] uppercase tracking-wide text-brand-navy">
          <span className="bg-white border border-[#ECE8E2] rounded-lg px-2.5 py-1.5 shadow-sm font-bold">14.5 Days <span className="text-[#6D6B8D]/70 font-normal">Hiring Velocity</span></span>
          <span className="bg-white border border-[#ECE8E2] rounded-lg px-2.5 py-1.5 shadow-sm font-bold">{avgMatch}% <span className="text-[#6D6B8D]/70 font-normal">Average Match</span></span>
          <span className="bg-white border border-[#ECE8E2] rounded-lg px-2.5 py-1.5 shadow-sm font-bold">{interviewsTodayCount} <span className="text-[#6D6B8D]/70 font-normal">Interviews Today</span></span>
          <span className="bg-white border border-[#ECE8E2] rounded-lg px-2.5 py-1.5 shadow-sm font-bold">{activeJobs} <span className="text-[#6D6B8D]/70 font-normal">Active Requisitions</span></span>
        </div>

        {/* Recruiter Quick Actions Bar */}
        <div className="flex flex-wrap gap-2.5 mt-7">
          <button 
            onClick={() => navigate('/jobs')} 
            className="button-primary py-2 px-4 flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Job
          </button>
          <button 
            onClick={() => navigate('/pipeline')} 
            className="button-secondary py-2 px-4 flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase cursor-pointer"
          >
            <Layers className="h-3.5 w-3.5 text-brand-purple" />
            View Pipeline
          </button>
          <button 
            onClick={() => navigate('/interviews')} 
            className="button-secondary py-2 px-4 flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase cursor-pointer"
          >
            📅 Schedule Interview
          </button>
          <button 
            onClick={() => navigate('/offers')} 
            className="button-secondary py-2 px-4 flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase cursor-pointer"
          >
            <Send className="h-3.5 w-3.5 text-brand-mint" />
            Manage Offers
          </button>
        </div>
      </header>

      {/* Metrics Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric 
          icon={BriefcaseBusiness} 
          label="Active jobs" 
          value={activeJobs.toString()} 
          hint={`${jobs.length} total requisitions`} 
          trend="▲ View Jobs" 
          trendColor="indigo" 
          onClick={() => navigate('/jobs')}
        />
        <Metric 
          icon={UsersRound} 
          label="Candidates" 
          value={candidates.length.toString()} 
          hint={`${avgMatch}% average match`} 
          trend={`▲ +${newCandidatesThisMonth} this month`} 
          trendColor="purple" 
          onClick={() => navigate('/pipeline')}
        />
        <Metric 
          icon={CalendarClock} 
          label="Interviews" 
          value={interviews.length.toString()} 
          hint="Active scheduling queue" 
          trend={interviewsTodayCount > 0 ? `▲ ${interviewsTodayCount} scheduled today` : '● No sessions today'} 
          trendColor="orange" 
          onClick={() => navigate('/interviews')}
        />
        <Metric 
          icon={CheckCircle2} 
          label="Offers sent" 
          value={offersCount.toString()} 
          hint="Compensation review desk" 
          trend={offersPendingCount > 0 ? `▲ ${offersPendingCount} pending signature` : '● All clear'} 
          trendColor="mint" 
          onClick={() => navigate('/offers')}
        />
      </section>

      {/* Optimized Main Content Sections Grid */}
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left: Recent Candidate Movement Table */}
        <div className="rounded-2xl border border-stone-200/60 bg-white p-6 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="mb-4 border-b border-[#ECE8E2] pb-4">
              <h2 className="text-[20px] font-bold text-brand-navy" style={labelFontStyle}>Recent Candidate Movement</h2>
              <p className="text-[10.5px] mt-0.5 folio-meta text-[#6D6B8D] uppercase">Latest transitions in candidate evaluation status.</p>
            </div>
            <div className="overflow-x-auto -mx-6">
              <div className="inline-block min-w-full align-middle px-6">
                <table className="w-full min-w-[500px] text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[#ECE8E2] pb-2">
                      <th className="folio-label text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] pb-2 font-bold">Candidate</th>
                      <th className="folio-label text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] pb-2 font-bold">Role</th>
                      <th className="folio-label text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] pb-2 font-bold">Source</th>
                      <th className="folio-label text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] pb-2 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECE8E2]">
                    {candidates.slice(0, 5).map((candidate) => (
                      <tr key={candidate.id} className="hover:bg-[#151633]/[0.02] transition-colors cursor-pointer" onClick={() => navigate('/pipeline')}>
                        <td className="py-2.5 font-sans font-bold text-brand-navy text-[13.5px]">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-navy text-white text-[10px] font-sans font-bold flex-shrink-0">
                              {candidate.name.charAt(0)}
                            </div>
                            <span>{candidate.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-[#6D6B8D]/90 font-sans text-[12.5px]">{candidate.jobTitle}</td>
                        <td className="py-2.5 text-[#6D6B8D]/90 font-sans text-[12.5px]">{candidate.source}</td>
                        <td className="py-2.5"><StatusBadge value={candidate.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Column containing Profile Completion (if Recruiter) and Priority Requisitions */}
        <div className="space-y-6 flex flex-col justify-start">
          {user?.role === 'Recruiter' && (
            <div className="rounded-2xl border border-stone-200/60 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="mb-4 border-b border-[#ECE8E2] pb-4">
                  <h2 className="text-[20px] font-bold text-brand-navy" style={labelFontStyle}>Profile completion</h2>
                  <p className="text-[10.5px] mt-0.5 folio-meta text-[#6D6B8D] uppercase">Keep your recruiter workspace updated.</p>
                </div>
                
                <div className="flex items-center gap-5 mt-4 mb-6">
                  {/* SVG Circle Progress Bar */}
                  <div className="relative flex items-center justify-center flex-shrink-0">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        className="text-stone-100"
                        strokeWidth="5.5"
                        stroke="currentColor"
                        fill="transparent"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        className="text-[#5B4FE9] transition-all duration-300"
                        strokeWidth="5.5"
                        strokeDasharray={2 * Math.PI * 26}
                        strokeDashoffset={2 * Math.PI * 26 - (profileCompletion.percentage / 100) * (2 * Math.PI * 26)}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                      />
                    </svg>
                    <span className="absolute text-xs font-mono font-bold text-[#151633]">
                      {profileCompletion.percentage}%
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-brand-navy" style={labelFontStyle}>
                      {profileCompletion.percentage}% complete
                    </h3>
                    <p className="text-[11px] text-[#6D6B8D] mt-0.5 font-sans leading-relaxed">
                      {profileCompletion.nextAction}
                    </p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowProfileModal(true)}
                  className="w-full rounded-xl border border-stone-200 py-2.5 text-center text-xs font-bold text-brand-navy hover:bg-stone-50 transition cursor-pointer bg-white"
                  style={labelFontStyle}
                >
                  Complete profile
                </button>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-stone-200/60 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="mb-4 border-b border-[#ECE8E2] pb-4">
                <h2 className="text-[20px] font-bold text-brand-navy" style={labelFontStyle}>Priority Requisitions</h2>
                <p className="text-[10.5px] mt-0.5 folio-meta text-[#6D6B8D] uppercase">Open roles requiring immediate sourcing.</p>
              </div>
              <div className="space-y-3.5">
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
                    
                    <div className="mt-4 pt-2.5 border-t border-[#ECE8E2] grid grid-cols-3 gap-2 text-[10px]">
                      <div>
                        <div className="folio-label text-[8px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold mb-0.5">Sourcing</div>
                        <div className="folio-mono font-bold text-brand-navy">{job.applicantsCount} Candidates</div>
                      </div>
                      <div>
                        <div className="folio-label text-[8px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold mb-0.5">Timeline</div>
                        <div className="folio-mono font-bold text-brand-orange">Target Date</div>
                      </div>
                      <div>
                        <div className="folio-label text-[8px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold mb-0.5">Priority</div>
                        <div className="folio-mono font-bold text-brand-purple">{job.priority}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* Optimized Top Matches Section taking up full width */}
      <section className="w-full">
        <div className="rounded-2xl border border-stone-200/60 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-4 border-b border-[#ECE8E2] pb-4">
            <h2 className="text-[20px] font-bold text-brand-navy" style={labelFontStyle}>Top Matches</h2>
            <p className="text-[10.5px] mt-0.5 folio-meta text-[#6D6B8D] uppercase">Best fitting profiles in pool.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topMatchedCandidates.map((candidate, idx) => (
              <div 
                key={candidate.id} 
                className="rounded-xl border border-[#ECE8E2] bg-white p-3.5 hover:border-brand-purple hover:translate-y-[-1px] transition-all duration-200 shadow-xs cursor-pointer"
                onClick={() => navigate('/pipeline')}
              >
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-brand-purple/10 text-brand-purple font-mono text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-sans font-bold text-brand-navy text-[13px] leading-tight">{candidate.name}</h4>
                      <p className="text-[10px] text-[#6D6B8D] mt-0.5 font-sans">{candidate.jobTitle}</p>
                    </div>
                  </div>
                  <span className="folio-mono text-[9px] font-bold text-brand-mint bg-brand-mint/5 px-2 py-0.5 rounded border border-brand-mint/10 flex-shrink-0">
                    {candidate.matchScore}%
                  </span>
                </div>

                {/* Skills tags */}
                {candidate.skills && candidate.skills.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1 ml-7">
                    {candidate.skills.slice(0, 2).map((skill, idx) => (
                      <span key={idx} className="text-[8.5px] font-mono text-stone-500 bg-stone-50 border border-stone-200/60 px-1.5 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* AI Recommendation tag */}
                {candidate.matchScore >= 85 && (
                  <div className="mt-2.5 ml-7 inline-flex items-center gap-1 rounded bg-brand-purple/5 border border-brand-purple/10 px-1.5 py-0.5 w-fit">
                    <span className="h-1 w-1 rounded-full bg-brand-purple animate-ping" />
                    <span className="folio-mono text-[6.5px] uppercase tracking-wider text-brand-purple font-bold">
                      AI RECOMMEND
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruiter Profile Modal */}
      <RecruiterProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </div>
  );
}

function Metric({ icon: Icon, label, value, hint, trend, trendColor, onClick }: { icon: ElementType; label: string; value: string; hint: string; trend: string; trendColor: string; onClick?: () => void }) {
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
  } else if (trendColor === 'indigo') {
    indicatorDotColor = 'bg-indigo-600';
    trendClass = 'text-indigo-600 bg-indigo-50 border-indigo-100';
  }

  return (
    <div 
      className="p-4 rounded-xl border border-stone-200/60 bg-white transition-all duration-300 card-hover flex flex-col justify-between min-h-[105px] shadow-sm cursor-pointer"
      onClick={onClick}
    >
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
        <span className={`folio-mono text-[7.5px] font-bold uppercase tracking-wider border px-1.5 py-0.5 rounded flex-shrink-0 flex items-center gap-0.5 ${trendClass}`}>
          {trend}
          {trend.includes("View") && <ArrowUpRight className="h-2 w-2" />}
        </span>
      </div>
    </div>
  );
}