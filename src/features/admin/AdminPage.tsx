import { useState } from 'react';
import { Cloud, Database, RotateCcw, ShieldCheck, UserRoundCog } from 'lucide-react';
import { seedUsers } from '@/data/seed';
import { hasFirebaseConfig } from '@/services/firebase/app';
import { ensureSeedData, seedFirestoreData } from '@/services/firebase/db';

const collectionKeys = ['jobs', 'candidates', 'interviews', 'campusDrives', 'notifications'];

export default function AdminPage() {
  const [seedStatus, setSeedStatus] = useState('');

  const resetLocalData = () => {
    collectionKeys.forEach((key) => localStorage.removeItem(`recruiter_app_${key}`));
    ensureSeedData();
    window.location.reload();
  };

  const handleSeedFirestore = async () => {
    await seedFirestoreData();
    setSeedStatus(hasFirebaseConfig ? 'Seed data synced to Firestore.' : 'Local fallback data reset.');
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <section className="panel p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            {hasFirebaseConfig ? <Cloud className="h-5 w-5" /> : <Database className="h-5 w-5" />}
          </div>
          <div>
            <h2 className="text-lg font-black">{hasFirebaseConfig ? 'Firestore connected' : 'Database fallback'}</h2>
            <p className="text-sm text-stone-500">{hasFirebaseConfig ? 'Firebase environment values detected.' : 'Firebase keys absent, local simulation active.'}</p>
          </div>
        </div>
        <div className="mt-5 rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-600">
          {hasFirebaseConfig
            ? 'The app is using Cloud Firestore for jobs, candidates, interviews, campus drives, and notifications. Use the seed action to create starter documents in your Firebase project.'
            : 'The app seeds browser localStorage with jobs, candidates, interviews, campus drives, and notifications. The service layer mirrors a small Firestore-style API so real Firebase calls can replace it later.'}
        </div>
        <button type="button" onClick={() => void handleSeedFirestore()} className="button-primary mt-5 w-full">
          <Cloud className="h-4 w-4" />
          {hasFirebaseConfig ? 'Seed Firestore data' : 'Seed local data'}
        </button>
        <button type="button" onClick={resetLocalData} className="button-secondary mt-5 w-full">
          <RotateCcw className="h-4 w-4" />
          Reset seeded data
        </button>
        {seedStatus && <div className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">{seedStatus}</div>}
      </section>

      <section className="panel overflow-hidden">
        <div className="border-b border-stone-200 p-5">
          <h2 className="text-lg font-black">Seed users</h2>
          <p className="mt-1 text-sm text-stone-500">Pre-registered accounts shown on the login screen.</p>
        </div>
        <div className="divide-y divide-stone-100">
          {seedUsers.map((user) => (
            <article key={user.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
                  {user.role === 'Admin' ? <ShieldCheck className="h-5 w-5" /> : <UserRoundCog className="h-5 w-5" />}
                </div>
                <div>
                  <div className="font-black">{user.displayName}</div>
                  <div className="text-sm text-stone-500">{user.email}</div>
                </div>
              </div>
              <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">{user.role}</div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
