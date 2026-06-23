import { BellRing, Mail, MessageSquare, Send } from 'lucide-react';
import { useCollection } from '@/hooks/useCollection';
import type { NotificationItem } from '@/types';

export default function NotificationsPage() {
  const { items: notifications, updateItem } = useCollection<NotificationItem>('notifications');

  const formatDateTime = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return iso.replace('T', ' ');
    }
  };

  return (
    <div className="space-y-12 w-full mx-auto">
      {/* Page Header */}
      <header className="border-b border-[#ECE8E2] pb-8 mb-8">
        <p className="folio-mono text-[10px] uppercase tracking-[0.2em] text-brand-lavender mb-2 font-bold">
          Outbound Communications System
        </p>
        <h1 className="folio-heading text-4xl md:text-5xl font-light text-brand-navy leading-tight tracking-tight">
          Notifications Center
        </h1>
        <p className="mt-4 text-[#6D6B8D] font-sans text-base max-w-2xl leading-relaxed">
          Orchestrate message templates, schedule automated campaign triggers, and manage the delivery lifecycle across outbound recruitment channels.
        </p>
      </header>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1.9fr]">
        {/* Left Column: Message Mix */}
        <section className="rounded-2xl border border-[#ECE8E2] bg-white p-8 h-fit shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="mb-6 border-b border-[#ECE8E2] pb-5">
            <h2 className="font-sans font-bold text-xl text-brand-navy">Message mix</h2>
            <p className="mt-1 folio-mono text-[9px] text-[#6D6B8D] uppercase tracking-wider font-bold">Templates by delivery channel.</p>
          </div>
          <div className="space-y-4">
            {(['Email', 'Slack', 'In-app'] as NotificationItem['channel'][]).map((channel) => (
              <div key={channel} className="flex items-center justify-between rounded-xl border border-[#ECE8E2] bg-white p-5 hover:border-brand-purple transition-all duration-300 card-hover">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-purple/5 text-brand-purple border border-brand-purple/10">
                    {channel === 'Email' ? (
                      <Mail className="h-4 w-4" strokeWidth={1.5} />
                    ) : channel === 'Slack' ? (
                      <MessageSquare className="h-4 w-4" strokeWidth={1.5} />
                    ) : (
                      <BellRing className="h-4 w-4" strokeWidth={1.5} />
                    )}
                  </div>
                  <span className="folio-mono text-xs font-bold uppercase tracking-wider text-brand-navy">{channel}</span>
                </div>
                <div className="folio-mono text-2xl font-bold text-brand-navy">
                  {notifications.filter((item) => item.channel === channel).length}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Metrics & Queue */}
        <section className="space-y-6">
          {/* Compact Metrics Strip */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Sent Today */}
            <div className="p-5 rounded-2xl border border-[#ECE8E2] bg-white flex flex-col justify-between min-h-[120px] transition-all hover:border-brand-purple shadow-[0_4px_20px_rgba(0,0,0,0.01)] card-hover">
              <div className="flex items-start justify-between">
                <span className="folio-mono text-[9px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold">
                  Sent Today
                </span>
                <Send className="h-3.5 w-3.5 text-brand-mint opacity-85" strokeWidth={1.5} />
              </div>
              <div>
                <div className="folio-mono text-2.5xl font-bold text-brand-mint leading-none">
                  {notifications.filter((item) => item.status === 'Sent').length}
                </div>
                <p className="text-[10px] text-stone-400 font-sans mt-1.5 leading-none">completed actions</p>
              </div>
            </div>

            {/* Scheduled */}
            <div className="p-5 rounded-2xl border border-[#ECE8E2] bg-white flex flex-col justify-between min-h-[120px] transition-all hover:border-brand-purple shadow-[0_4px_20px_rgba(0,0,0,0.01)] card-hover">
              <div className="flex items-start justify-between">
                <span className="folio-mono text-[9px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold">
                  Scheduled
                </span>
                <BellRing className="h-3.5 w-3.5 text-brand-orange opacity-85" strokeWidth={1.5} />
              </div>
              <div>
                <div className="folio-mono text-2.5xl font-bold text-brand-orange leading-none">
                  {notifications.filter((item) => item.status === 'Scheduled').length}
                </div>
                <p className="text-[10px] text-stone-400 font-sans mt-1.5 leading-none">active triggers</p>
              </div>
            </div>

            {/* Pending Drafts */}
            <div className="p-5 rounded-2xl border border-[#ECE8E2] bg-white flex flex-col justify-between min-h-[120px] transition-all hover:border-brand-purple shadow-[0_4px_20px_rgba(0,0,0,0.01)] card-hover">
              <div className="flex items-start justify-between">
                <span className="folio-mono text-[9px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold">
                  Drafts
                </span>
                <Mail className="h-3.5 w-3.5 text-[#6D6B8D] opacity-85" strokeWidth={1.5} />
              </div>
              <div>
                <div className="folio-mono text-2.5xl font-bold text-brand-navy leading-none">
                  {notifications.filter((item) => item.status === 'Draft').length}
                </div>
                <p className="text-[10px] text-stone-400 font-sans mt-1.5 leading-none">awaiting review</p>
              </div>
            </div>
          </div>

          {/* Queue List */}
          <div className="rounded-2xl border border-[#ECE8E2] bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <div className="mb-6 border-b border-[#ECE8E2] pb-5">
              <h2 className="font-sans font-bold text-xl text-brand-navy">Notification queue</h2>
              <p className="mt-1 folio-mono text-[9px] text-[#6D6B8D] uppercase tracking-wider font-bold">Lifecycle actions of active notifications.</p>
            </div>
            
            <div className="divide-y divide-[#ECE8E2]">
              {notifications.map((item, index) => {
                const statusColor = 
                  item.status === 'Draft'
                    ? 'bg-stone-400'
                    : item.status === 'Scheduled'
                    ? 'bg-brand-orange'
                    : 'bg-brand-mint';

                return (
                  <article key={item.id} className={`hover:bg-stone-50/30 transition-all duration-300 ${index > 0 ? 'pt-6' : ''}`}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1 min-w-[260px]">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-sans font-bold text-brand-navy text-base leading-tight">
                            {item.title}
                          </h3>
                          <span className="flex items-center gap-1.5">
                            <span className={`h-1.5 w-1.5 rounded-full ${statusColor}`} />
                            <span className="folio-mono text-[9px] uppercase tracking-[0.1em] text-[#6D6B8D] font-bold leading-none">
                              {item.status}
                            </span>
                          </span>
                        </div>
                        <p className="mt-2 text-[#6D6B8D] font-sans text-[14px] leading-relaxed max-w-xl">
                          {item.detail}
                        </p>
                      </div>
                      
                      {/* Selector control */}
                      <div className="flex-shrink-0">
                        <select 
                          className="input py-2 text-xs font-bold folio-mono uppercase cursor-pointer max-w-[130px]" 
                          value={item.status} 
                          onChange={(event) => void updateItem(item.id, { status: event.target.value as NotificationItem['status'] })}
                        >
                          <option>Draft</option>
                          <option>Scheduled</option>
                          <option>Sent</option>
                        </select>
                      </div>
                    </div>

                    {/* Metadata strip */}
                    <div className="mt-5 pt-3 border-t border-[#ECE8E2]/60 grid gap-4 items-center sm:grid-cols-[1.1fr_1.1fr_1.1fr_0.7fr] pb-1">
                      <QueueInfo label="Channel" value={item.channel} />
                      <QueueInfo label="Audience" value={item.audience} />
                      <QueueInfo label="Send at" value={formatDateTime(item.sendAt)} />
                      <div className="flex justify-end">
                        <button 
                          className="folio-mono text-[10px] font-bold uppercase tracking-wider text-white bg-brand-purple hover:bg-brand-orange px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto" 
                          type="button" 
                          onClick={() => void updateItem(item.id, { status: 'Sent' })}
                        >
                          <Send className="h-3.5 w-3.5" strokeWidth={1.5} />
                          Send Now
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function QueueInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="folio-label text-[9px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold">{label}</div>
      <div className="mt-1 folio-mono text-xs font-bold text-brand-navy">{value}</div>
    </div>
  );
}
