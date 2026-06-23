import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, BriefcaseBusiness, Building2, CalendarClock, Gauge, LogOut, Settings2, SlidersHorizontal, UsersRound } from 'lucide-react';
import { useAuth } from '@/contexts/useAuth';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Gauge },
  { to: '/jobs', label: 'Job Posts', icon: BriefcaseBusiness },
  { to: '/requirements', label: 'Requirements', icon: SlidersHorizontal },
  { to: '/pipeline', label: 'Candidates', icon: UsersRound },
  { to: '/interviews', label: 'Interviews', icon: CalendarClock },
  { to: '/campus', label: 'Campus Drives', icon: Building2 },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin', label: 'System Settings', icon: Settings2 },
];

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/jobs': 'Job Requisitions',
  '/requirements': 'Competency Blueprint',
  '/pipeline': 'Candidate Pipeline',
  '/interviews': 'Interview Calendar',
  '/campus': 'Campus Recruitment',
  '/notifications': 'Notifications Center',
  '/admin': 'System Settings',
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'A';

  return (
    <div className="min-h-screen bg-[#F2EFEA] text-brand-navy font-sans antialiased">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 bg-[#151633] text-white lg:flex lg:flex-col border-r border-white/5">
        {/* Brand Header */}
        <div className="border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
              <span className="h-5.5 w-5.5 rounded-full bg-gradient-to-tr from-[#5B4FE9] to-[#FF6B35] flex items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-[#151633]" />
              </span>
            </div>
            <div>
              <div className="font-serif text-lg font-normal tracking-tight text-white">
                RecruiterOS
              </div>
              <div className="folio-mono text-[8px] uppercase tracking-widest text-stone-500 font-semibold mt-0.5">
                Local simulation
              </div>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1 px-3 py-5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-2.5 text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#242656] text-white font-semibold shadow-sm'
                    : 'text-stone-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4 opacity-80" strokeWidth={1.5} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User Card & Logout */}
        <div className="border-t border-white/10 p-4 mt-auto">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
            <div className="font-sans font-semibold text-sm text-white truncate">
              {user?.displayName}
            </div>
            <div className="mt-1 folio-mono text-[8px] uppercase tracking-wider text-brand-lavender font-bold">
              {user?.role}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-stone-400 hover:text-white transition-all duration-150"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="lg:pl-60">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-10 border-b border-[#ECE8E2] bg-[#F2EFEA]/90 px-6 py-4 backdrop-blur sm:px-8">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
            {/* Workspace Breadcrumbs */}
            <div className="flex items-center gap-2.5">
              <span className="folio-mono text-[10px] uppercase tracking-[0.2em] text-[#6D6B8D] font-semibold">Workspace</span>
              <span className="text-[#ECE8E2] text-sm">/</span>
              <span className="folio-mono text-[10px] uppercase tracking-[0.2em] text-brand-navy font-bold">
                {titles[location.pathname] ?? 'Overview'}
              </span>
            </div>

            {/* Quick Actions & Profile Panel */}
            <div className="flex items-center gap-4">
              {/* Optional role status indicator badge */}
              <div className="hidden items-center gap-2.5 rounded-full border border-[#ECE8E2] bg-white px-3.5 py-1.5 text-xs text-brand-navy sm:flex font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-purple" />
                <span className="folio-mono text-[9px] uppercase tracking-wider text-stone-500 font-bold">{user?.role}</span>
              </div>
              
              {/* Notifications Icon */}
              <button 
                onClick={() => navigate('/notifications')}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#ECE8E2] bg-white text-brand-navy hover:bg-stone-50 transition"
              >
                <Bell className="h-4 w-4" strokeWidth={1.5} />
                <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-brand-orange" />
              </button>

              {/* User Avatar Circle */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-navy text-white text-xs font-bold font-sans border border-brand-navy/10 shadow-sm">
                {userInitial}
              </div>
            </div>
          </div>
        </header>

        {/* Actual Content Area */}
        <main className="mx-auto max-w-[1600px] p-6 sm:p-8">
          {/* Mobile responsive navigation toolbar */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2 lg:hidden scrollbar-none">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold border transition ${
                    isActive 
                      ? 'bg-brand-navy text-white border-brand-navy' 
                      : 'bg-white text-stone-600 border-[#ECE8E2] hover:bg-stone-50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
          
          <Outlet />
        </main>
      </div>
    </div>
  );
}
