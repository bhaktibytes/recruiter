import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, BriefcaseBusiness, Building2, CalendarClock, Gauge, LogOut, Settings2, SlidersHorizontal, UsersRound, Handshake } from 'lucide-react';
import { useAuth } from '@/contexts/useAuth';
import { useCollection } from '@/hooks/useCollection';
import type { NotificationItem } from '@/types';
import { useState, useRef, useEffect } from 'react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Gauge },
  { to: '/jobs', label: 'Job Posts', icon: BriefcaseBusiness },
  { to: '/pipeline', label: 'Candidates', icon: UsersRound },
  { to: '/interviews', label: 'Interviews', icon: CalendarClock },
  { to: '/campus', label: 'Campus Drives', icon: Building2 },
  { to: '/offers', label: 'Offer Desk', icon: Handshake },
  { to: '/admin', label: 'System Settings', icon: Settings2 },
];

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/jobs': 'Job Requisitions',
  '/pipeline': 'Candidate Pipeline',
  '/interviews': 'Interview Calendar',
  '/campus': 'Campus Recruitment',
  '/offers': 'Offer Desk',
  
  '/admin': 'System Settings',
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { items: notifications, updateItem } = useCollection<NotificationItem>('notifications');
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'A';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowNotifPopover(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#F2EFEA] text-brand-navy font-sans antialiased">
      {/* Desktop Sidebar (Figma Proportions: 225px width) */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-shrink-0 flex-col justify-between bg-[#1B1C38] px-5 py-7 lg:flex border-r border-white/5">
      <div>
        {/* Brand Header */}
        <div className="mb-10 flex items-center gap-3 px-2">
        <div className="relative flex h-[36px] w-[36px] items-center justify-center">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-[3px] border-[#5B4FE9]" />

          {/* Middle Circle */}
          <div className="flex h-[17px] w-[17px] items-center justify-center rounded-full bg-[#2b2864]">
            {/* Orange Dot */}
            <div className="h-[10px] w-[10px] rounded-full bg-[#FF6B35]" />
          </div>
        </div>

          <span
            className="text-xl tracking-wide"
            style={{ fontFamily: "DM Serif Display" }}
          >
            <span className="text-white">Fo</span>
            <span className="text-[#8B82FF]">lio</span>
          </span>
        </div>
        <div className="w-[224px] h-px bg-white/10"></div>

        {/* Navigation links */}
        <nav className="mt-6 flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex h-[46.4px] w-[216px] items-center gap-3 rounded-xl px-4 py-3 transition-all duration-150 ${
                isActive
                  ? "bg-[#5B4EFF40] text-white"
                  : "text-[#FFFFFF8C] hover:bg-white/5 hover:text-white"
              }`
            }
            style={{
              fontFamily: '"DM Sans", system-ui, sans-serif',
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            <Icon
              className="h-5 w-5 flex-shrink-0"
              strokeWidth={1.75}
            />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      </div>

        {/* User Card & Logout */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex h-[46px] w-[216px] items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium text-[#A1A1AA] transition-all duration-150 hover:bg-white/5 hover:text-white"
          style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
        >
          <LogOut className="h-5 w-5" strokeWidth={1.75} />
          <span>Sign out</span>
        </button>
      </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="lg:pl-[225px]">
        {/* Sticky Top Header (Compact Figma size) */}
        <header className="sticky top-0 z-10 border-b border-[#ECE8E2] bg-[#F2EFEA]/90 px-6 py-2.5 backdrop-blur sm:px-8 shadow-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            {/* Workspace Breadcrumbs */}
            <div className="flex items-center gap-2">
              <span className="folio-mono text-[9px] uppercase tracking-[0.2em] text-[#6D6B8D] font-bold">Workspace</span>
              <span className="text-[#ECE8E2] text-xs">/</span>
              <span className="folio-mono text-[9px] uppercase tracking-[0.2em] text-brand-navy font-extrabold">
                {titles[location.pathname] ?? 'Overview'}
              </span>
            </div>

            {/* Quick Actions & Profile Panel */}
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-[#ECE8E2] bg-white px-3 py-1 text-xs text-brand-navy sm:flex font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-purple" />
                <span className="folio-mono text-[8.5px] uppercase tracking-wider text-stone-500 font-bold">{user?.role}</span>
              </div>
              
              {/* Notifications Icon Popover trigger */}
              <div className="relative" ref={popoverRef}>
                <button 
                  onClick={() => setShowNotifPopover(!showNotifPopover)}
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[#ECE8E2] bg-white text-brand-navy hover:bg-stone-50 transition cursor-pointer"
                >
                  <Bell className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {notifications.some(n => n.status !== 'Sent') && (
                    <span className="absolute right-2.5 top-2.5 h-1 w-1 rounded-full bg-brand-orange animate-pulse" />
                  )}
                </button>
                
                {showNotifPopover && (
                  <div className="absolute right-0 mt-2.5 w-80 bg-white border border-[#ECE8E2] rounded-2xl p-4 shadow-xl z-30 text-xs text-brand-navy">
                    <div className="flex items-center justify-between border-b border-[#ECE8E2] pb-2 mb-2 font-mono text-[9px] uppercase tracking-wider text-stone-500 font-bold">
                      <span>Notifications</span>
                      <span className="text-brand-purple">{notifications.filter(n => n.status !== 'Sent').length} Pending</span>
                    </div>
                    
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-stone-400 text-center py-4">No notifications found.</p>
                      ) : (
                        notifications.map((notif) => (
                          <div key={notif.id} className="border-b border-stone-100 pb-2 last:border-0 last:pb-0">
                            <div className="flex items-start justify-between gap-1.5 mb-1.5">
                              <div>
                                <h4 className="font-sans font-bold text-brand-navy text-[11px] leading-tight">{notif.title}</h4>
                                <p className="text-[10px] text-stone-500 font-sans mt-0.5 leading-snug">{notif.detail}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[7.5px] font-mono text-stone-400 uppercase font-bold bg-stone-50 border border-stone-200/40 px-1 py-0.5 rounded">
                                {notif.channel}
                              </span>
                              {notif.status !== 'Sent' && (
                                <button 
                                  onClick={() => void updateItem(notif.id, { status: 'Sent' })}
                                  className="text-[8px] font-mono font-bold uppercase tracking-wider text-white bg-brand-purple hover:bg-brand-orange px-2 py-0.5 rounded transition duration-150 cursor-pointer"
                                >
                                  Send Now
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="border-t border-[#ECE8E2] pt-2 mt-2 text-center">
                      <button 
                        onClick={() => {
                          setShowNotifPopover(false);
                          navigate('/notifications');
                        }}
                        className="text-[9px] font-mono font-bold uppercase tracking-wider text-brand-purple hover:text-brand-orange transition"
                      >
                        View Notification Center →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar Circle */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-white text-[11px] font-bold font-sans border border-brand-navy/10 shadow-sm">
                {userInitial}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="mx-auto max-w-5xl p-5 sm:p-6">
          {/* Mobile responsive navigation toolbar */}
          <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1.5 lg:hidden scrollbar-none">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-xl px-3 py-1.5 text-[11px] font-bold border transition ${
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
