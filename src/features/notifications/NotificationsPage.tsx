import { BellRing, Mail, MessageSquare, Send } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { useCollection } from '@/hooks/useCollection';
import type { NotificationItem } from '@/types';

export default function NotificationsPage() {
  const { items: notifications, updateItem } = useCollection<NotificationItem>('notifications');

  return (
    <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
      <section className="panel h-fit p-5">
        <h2 className="text-lg font-black">Message mix</h2>
        <p className="mt-1 text-sm text-stone-500">Notification templates grouped by delivery channel.</p>
        <div className="mt-5 space-y-3">
          {(['Email', 'Slack', 'In-app'] as NotificationItem['channel'][]).map((channel) => (
            <div key={channel} className="flex items-center justify-between rounded-lg border border-stone-200 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                  {channel === 'Email' ? <Mail className="h-4 w-4" /> : channel === 'Slack' ? <MessageSquare className="h-4 w-4" /> : <BellRing className="h-4 w-4" />}
                </div>
                <div className="font-bold">{channel}</div>
              </div>
              <div className="text-xl font-black">{notifications.filter((item) => item.channel === channel).length}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="border-b border-stone-200 p-5">
          <h2 className="text-lg font-black">Notification queue</h2>
          <p className="mt-1 text-sm text-stone-500">Edit status as messages move from draft to sent.</p>
        </div>
        <div className="divide-y divide-stone-100">
          {notifications.map((item) => (
            <article key={item.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black">{item.title}</h3>
                    <StatusBadge value={item.status} />
                  </div>
                  <p className="mt-2 max-w-2xl text-sm text-stone-600">{item.detail}</p>
                </div>
                <select className="input w-36" value={item.status} onChange={(event) => void updateItem(item.id, { status: event.target.value as NotificationItem['status'] })}>
                  <option>Draft</option>
                  <option>Scheduled</option>
                  <option>Sent</option>
                </select>
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
                <QueueInfo label="Channel" value={item.channel} />
                <QueueInfo label="Audience" value={item.audience} />
                <QueueInfo label="Send at" value={item.sendAt.replace('T', ' ')} />
                <button className="button-secondary" type="button" onClick={() => void updateItem(item.id, { status: 'Sent' })}>
                  <Send className="h-4 w-4" />
                  Mark sent
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function QueueInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase text-stone-400">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}
