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

  // Sample static channel analytics to support visual richness
  const channelStats = {
    Email: { success: '98.4%', engagement: '74.2%' },
    Slack: { success: '100.0%', engagement: '92.8%' },
    'In-app': { success: '100.0%', engagement: '48.6%' },
  };

  return (
    <div className="space-y-10 w-full mx-auto max-w-5xl">
      {/* Page Header */}
      <header className="border-b border-[#ECE8E2] pb-6 mb-6">
        <p className="folio-meta text-brand-purple uppercase mb-2">
          Outbound Communications System
        </p>
        <h1 className="folio-page-title text-brand-navy mb-4">
          Notifications Center
        </h1>
        <p className="mt-2 text-[#6D6B8D] font-sans text-base max-w-2xl leading-relaxed">
          Orchestrate message templates, schedule automated campaign triggers, and manage the delivery lifecycle across outbound recruitment channels.
        </p>
      </header>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left Column: Message Mix */}
        <section className="rounded-2xl border border-[#ECE8E2] bg-[#FCFBF9] p-6 h-fit shadow-sm">
          <div className="mb-5 border-b border-[#ECE8E2] pb-4">
            <h2 className="folio-section-title text-brand-navy">Message Mix</h2>
            <p className="mt-1 folio-meta text-[#6D6B8D] uppercase">Templates by delivery channel.</p>
          </div>
          <div className="space-y-4">
            {(['Email', 'Slack', 'In-app'] as NotificationItem['channel'][]).map((channel) => {
              const stats = channelStats[channel as keyof typeof channelStats] || { success: '100%', engagement: '50%' };
              return (
                <div key={channel} className="rounded-xl border border-[#ECE8E2] bg-white p-4 transition duration-150 hover:border-brand-purple/20 hover:shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-purple/5 text-brand-purple border border-brand-purple/10">
                        {channel === 'Email' ? (
                          <Mail className="h-4 w-4" strokeWidth={1.5} />
                        ) : channel === 'Slack' ? (
                          <MessageSquare className="h-4 w-4" strokeWidth={1.5} />
                        ) : (
                          <BellRing className="h-4 w-4" strokeWidth={1.5} />
                        )}
                      </div>
                      <span className="folio-meta text-xs font-bold uppercase text-brand-navy">{channel}</span>
                    </div>
                    <div className="font-serif text-2xl text-brand-navy font-normal">
                      {notifications.filter((item) => item.channel === channel).length} <span className="text-xs text-stone-400 font-sans">templates</span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-stone-100 grid grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-stone-400">Delivery Rate</div>
                      <div className="text-brand-mint font-semibold mt-0.5">{stats.success}</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-stone-400">Engagement</div>
                      <div className="text-brand-purple font-semibold mt-0.5">{stats.engagement}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Column: Metrics & Queue */}
        <section className="space-y-6">
          {/* Compact Metrics Strip */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Sent Today */}
            <div className="p-4 rounded-2xl border border-[#ECE8E2] bg-white flex flex-col justify-between min-h-[110px] transition duration-150 hover:border-brand-purple/20 shadow-sm">
              <div className="flex items-start justify-between">
                <span className="folio-meta text-[#6D6B8D] uppercase">
                  Sent
                </span>
                <Send className="h-3.5 w-3.5 text-brand-mint" strokeWidth={1.5} />
              </div>
              <div className="mt-2">
                <div className="font-serif text-3xl font-normal text-brand-mint leading-none">
                  {notifications.filter((item) => item.status === 'Sent').length}
                </div>
                <p className="text-[10px] text-stone-400 font-sans mt-1">completed actions</p>
              </div>
            </div>

            {/* Scheduled */}
            <div className="p-4 rounded-2xl border border-[#ECE8E2] bg-white flex flex-col justify-between min-h-[110px] transition duration-150 hover:border-brand-purple/20 shadow-sm">
              <div className="flex items-start justify-between">
                <span className="folio-meta text-[#6D6B8D] uppercase">
                  Scheduled
                </span>
                <BellRing className="h-3.5 w-3.5 text-brand-orange" strokeWidth={1.5} />
              </div>
              <div className="mt-2">
                <div className="font-serif text-3xl font-normal text-brand-orange leading-none">
                  {notifications.filter((item) => item.status === 'Scheduled').length}
                </div>
                <p className="text-[10px] text-stone-400 font-sans mt-1">active triggers</p>
              </div>
            </div>

            {/* Pending Drafts */}
            <div className="p-4 rounded-2xl border border-[#ECE8E2] bg-white flex flex-col justify-between min-h-[110px] transition duration-150 hover:border-brand-purple/20 shadow-sm">
              <div className="flex items-start justify-between">
                <span className="folio-meta text-[#6D6B8D] uppercase">
                  Drafts
                </span>
                <Mail className="h-3.5 w-3.5 text-brand-navy opacity-80" strokeWidth={1.5} />
              </div>
              <div className="mt-2">
                <div className="font-serif text-3xl font-normal text-brand-navy leading-none">
                  {notifications.filter((item) => item.status === 'Draft').length}
                </div>
                <p className="text-[10px] text-stone-400 font-sans mt-1">awaiting review</p>
              </div>
            </div>
          </div>

          {/* Queue List */}
          <div className="rounded-2xl border border-[#ECE8E2] bg-[#FCFBF9] p-6 shadow-sm">
            <div className="mb-5 border-b border-[#ECE8E2] pb-4">
              <h2 className="folio-section-title text-brand-navy">Notification Queue</h2>
              <p className="mt-1 folio-meta text-[#6D6B8D] uppercase">Lifecycle actions of active notifications.</p>
            </div>
            
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12 border border-dashed border-[#ECE8E2] rounded-2xl bg-stone-50/50">
                  <BellRing className="h-10 w-10 text-stone-400 mb-3" strokeWidth={1.5} />
                  <h3 className="font-sans font-semibold text-sm text-brand-navy">No pending notifications</h3>
                  <p className="mt-1 text-xs text-[#6D6B8D] max-w-xs">All outbound campaign queues are currently empty and synced.</p>
                </div>
              ) : (
                notifications.map((item) => {
                  const statusColor = 
                    item.status === 'Draft'
                      ? 'bg-stone-400'
                      : item.status === 'Scheduled'
                      ? 'bg-brand-orange'
                      : 'bg-brand-mint';

                  return (
                    <article key={item.id} className="p-4 rounded-xl border border-[#ECE8E2] bg-white transition duration-150 hover:border-brand-purple/20 hover:shadow-sm">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="folio-card-title text-brand-navy leading-tight">
                              {item.title}
                            </h3>
                            <span className="flex items-center gap-1.5">
                              <span className={`h-1.5 w-1.5 rounded-full ${statusColor}`} />
                              <span className="folio-meta text-[9px] text-[#6D6B8D] uppercase font-bold">
                                {item.status}
                              </span>
                            </span>
                          </div>
                          <p className="mt-2 text-[#6D6B8D] font-sans text-xs leading-relaxed max-w-xl">
                            {item.detail}
                          </p>
                        </div>
                        
                        {/* Selector control */}
                        <div className="flex-shrink-0">
                          <select 
                            className="input py-1.5 px-3 text-[10px] font-bold folio-mono uppercase cursor-pointer max-w-[130px] border-[#ECE8E2] rounded-lg" 
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
                      <div className="mt-4 pt-3.5 border-t border-[#ECE8E2]/60 grid gap-3 items-center sm:grid-cols-[1fr_1fr_1fr_0.8fr] text-xs">
                        <QueueInfo label="Channel" value={item.channel} />
                        <QueueInfo label="Audience" value={item.audience} />
                        <QueueInfo label="Send at" value={formatDateTime(item.sendAt)} />
                        <div className="flex justify-end">
                          <button 
                            className="folio-mono text-[9px] font-bold uppercase tracking-wider text-white bg-brand-purple hover:bg-brand-orange px-3 py-2 rounded-lg transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto" 
                            type="button" 
                            onClick={() => void updateItem(item.id, { status: 'Sent' })}
                          >
                            <Send className="h-3 w-3" strokeWidth={1.5} />
                            Send Now
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
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
      <div className="folio-meta text-[9px] uppercase text-[#6D6B8D]">{label}</div>
      <div className="mt-0.5 folio-mono text-[10px] font-bold text-brand-navy truncate max-w-[120px]">{value}</div>
    </div>
  );
}
