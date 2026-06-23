import { useState } from 'react';
import { Cloud, Database, RotateCcw } from 'lucide-react';
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
    <div className="space-y-12 w-full mx-auto">
      {/* Page Header */}
      <header className="border-b border-[#ECE8E2] pb-8 mb-8">
        <p className="folio-mono text-[10px] uppercase tracking-[0.2em] text-brand-lavender mb-2 font-bold">
          Admin Console
        </p>
        <h1 className="folio-heading text-4xl md:text-5xl font-light text-brand-navy leading-tight tracking-tight">
          System Settings
        </h1>
        <p className="mt-4 text-[#6D6B8D] font-sans text-base max-w-2xl leading-relaxed">
          Monitor service layer connectivity, initialize mock records, and review pre-registered simulation accounts.
        </p>
      </header>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left Column: Data Management */}
        <section className="rounded-2xl border border-[#ECE8E2] bg-white p-8 h-fit shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="flex items-start gap-4 border-b border-[#ECE8E2] pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-purple/5 text-brand-purple border border-brand-purple/10 flex-shrink-0">
              {hasFirebaseConfig ? <Cloud className="h-5 w-5" strokeWidth={1.5} /> : <Database className="h-5 w-5" strokeWidth={1.5} />}
            </div>
            <div>
              <h2 className="font-sans font-bold text-xl text-brand-navy">{hasFirebaseConfig ? 'Firestore connected' : 'Database fallback'}</h2>
              <p className="mt-1 folio-mono text-[9px] text-[#6D6B8D] uppercase tracking-wider font-bold">{hasFirebaseConfig ? 'Firebase environment values detected.' : 'Firebase keys absent, local simulation active.'}</p>
            </div>
          </div>
          <div className="mt-6 rounded-xl border border-[#ECE8E2] bg-stone-50/30 p-5 text-sm leading-relaxed text-[#6D6B8D] font-sans">
            {hasFirebaseConfig
              ? 'The app is using Cloud Firestore for jobs, candidates, interviews, campus drives, and notifications. Use the seed action to create starter documents in your Firebase project.'
              : 'The app seeds browser localStorage with jobs, candidates, interviews, campus drives, and notifications. The service layer mirrors a small Firestore-style API so real Firebase calls can replace it later.'}
          </div>
          <div className="mt-6 space-y-3">
            <button 
              type="button" 
              onClick={() => void handleSeedFirestore()} 
              className="button-primary w-full py-3.5 flex items-center justify-center font-bold hover:bg-brand-orange transition duration-150 cursor-pointer"
            >
              <Cloud className="h-4 w-4" strokeWidth={1.5} />
              {hasFirebaseConfig ? 'Seed Firestore data' : 'Seed local data'}
            </button>
            <button 
              type="button" 
              onClick={resetLocalData} 
              className="folio-mono text-xs font-bold text-brand-navy border border-[#ECE8E2] bg-white hover:bg-stone-50 px-4 py-3 rounded-xl transition duration-150 flex items-center justify-center gap-2 w-full cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
              Reset seeded data
            </button>
          </div>
          {seedStatus && (
            <div className="mt-4 rounded-xl bg-brand-mint/5 border border-brand-mint/15 px-4 py-2.5 text-xs font-sans font-semibold text-brand-mint text-center">
              {seedStatus}
            </div>
          )}
        </section>

        {/* Right Column: Pre-registered Users */}
        <section className="rounded-2xl border border-[#ECE8E2] bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="mb-6 border-b border-[#ECE8E2] pb-5">
            <h2 className="font-sans font-bold text-xl text-brand-navy">Seed Users</h2>
            <p className="mt-1 folio-mono text-[9px] text-[#6D6B8D] uppercase tracking-wider font-bold">Pre-registered accounts shown on the login screen.</p>
          </div>
          
          <div className="divide-y divide-[#ECE8E2]">
            {seedUsers.map((user, index) => (
              <article key={user.id} className={`flex flex-wrap items-center justify-between gap-4 py-4 hover:bg-stone-50/20 transition duration-150 ${index === 0 ? 'pt-0' : ''} last:pb-0`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-white text-xs font-sans font-bold flex-shrink-0">
                    {user.displayName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-sans font-bold text-brand-navy text-base">{user.displayName}</div>
                    <div className="text-xs text-[#6D6B8D] font-mono mt-0.5">{user.email}</div>
                  </div>
                </div>
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-md bg-stone-50 px-2.5 py-0.5 folio-mono text-[8px] font-bold text-brand-purple border border-[#ECE8E2] uppercase">
                  {user.role}
                </span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
