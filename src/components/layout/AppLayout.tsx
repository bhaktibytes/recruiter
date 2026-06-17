import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, BriefcaseBusiness, Building2, CalendarClock, Gauge, LogOut, MessageSquare, Settings2, SlidersHorizontal, UsersRound } from 'lucide-react';
import { useAuth } from '@/contexts/useAuth';

const navItems = [
  { to: '/', label: 'Overview', icon: Gauge },
  { to: '/jobs', label: 'Jobs', icon: BriefcaseBusiness },
  { to: '/requirements', label: 'Requirements', icon: SlidersHorizontal },
  { to: '/pipeline', label: 'Pipeline', icon: UsersRound },
  { to: '/interviews', label: 'Interviews', icon: CalendarClock },
  { to: '/campus', label: 'Campus', icon: Building2 },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin', label: 'Admin', icon: Settings2 },
];

const titles: Record<string, string> = {
  '/': 'Overview',
  '/jobs': 'Job requisitions',
  '/requirements': 'Requirement builder',
  '/pipeline': 'Candidate pipeline',
  '/interviews': 'Interview builder',
  '/campus': 'Campus drives',
  '/notifications': 'Notifications',
  '/admin': 'Admin console',
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f5f7f4] text-stone-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-stone-200 bg-stone-950 text-white lg:flex lg:flex-col">
        <div className="border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-stone-950">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>
            <div>
              <div className="font-black">RecruiterOS</div>
              <div className="text-xs text-stone-400">Local simulation mode</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                  isActive ? 'bg-white text-stone-950' : 'text-stone-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="rounded-lg bg-white/10 p-3">
            <div className="text-sm font-bold">{user?.displayName}</div>
            <div className="mt-1 text-xs text-stone-400">{user?.role}</div>
          </div>
          <button onClick={handleLogout} className="mt-3 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-rose-200 hover:bg-white/10">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-stone-200 bg-[#f5f7f4]/90 px-4 py-4 backdrop-blur sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{user?.role}</p>
              <h1 className="mt-1 text-2xl font-black text-stone-950">{titles[location.pathname] ?? 'Overview'}</h1>
            </div>
            <div className="hidden items-center gap-3 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-600 sm:flex">
              <MessageSquare className="h-4 w-4 text-emerald-700" />
              {user?.displayName}
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-6">
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold ${isActive ? 'bg-stone-950 text-white' : 'bg-white text-stone-700'}`
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
