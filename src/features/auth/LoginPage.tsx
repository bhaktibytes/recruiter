import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, CheckCircle2, KeyRound, ShieldCheck, Users } from 'lucide-react';
import { useAuth } from '@/contexts/useAuth';
import { roleCredentials } from '@/data/seed';
import { Role } from '@/types';

const roles: Role[] = ['Recruiter', 'Hiring Manager', 'Admin'];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('Recruiter');
  const [email, setEmail] = useState(roleCredentials.Recruiter.email);
  const [password, setPassword] = useState(roleCredentials.Recruiter.password);
  const [error, setError] = useState('');

  const selectRole = (nextRole: Role) => {
    setRole(nextRole);
    setEmail(roleCredentials[nextRole].email);
    setPassword(roleCredentials[nextRole].password);
    setError('');
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    const isAuthenticated = login(email, password, role);
    if (!isAuthenticated) {
      setError('Use one of the seeded credential sets shown on this screen.');
      return;
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e1f3ea_0,#f7f7f2_38%,#eef3f5_100%)] p-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-sm font-semibold text-emerald-800">
            <BriefcaseBusiness className="h-4 w-4" />
            RecruiterOS
          </div>
          <div>
            <h1 className="max-w-2xl text-4xl font-black leading-tight text-stone-950 sm:text-5xl">
              Hiring operations, from role intake to offer approval.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-stone-600">
              Manage requisitions, candidate movement, interviews, campus drives, and notifications from one local-first workspace.
            </p>
          </div>
          <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
            {roles.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => selectRole(item)}
                className={`rounded-lg border p-4 text-left transition ${
                  role === item ? 'border-emerald-700 bg-emerald-50 text-emerald-950' : 'border-stone-200 bg-white/70 text-stone-700 hover:bg-white'
                }`}
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-white shadow-sm">
                  {item === 'Admin' ? <ShieldCheck className="h-5 w-5" /> : item === 'Hiring Manager' ? <Users className="h-5 w-5" /> : <KeyRound className="h-5 w-5" />}
                </div>
                <div className="text-sm font-bold">{item}</div>
                <div className="mt-1 text-xs text-stone-500">{roleCredentials[item].email}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="panel p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-stone-950">Sign in</h2>
            <p className="mt-1 text-sm text-stone-500">Seeded credentials are prefilled by role.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block text-sm font-semibold text-stone-700">
              Email
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="input mt-1" />
            </label>
            <label className="block text-sm font-semibold text-stone-700">
              Password
              <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="input mt-1" />
            </label>
            <label className="block text-sm font-semibold text-stone-700">
              Role
              <select value={role} onChange={(event) => selectRole(event.target.value as Role)} className="input mt-1">
                {roles.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
            {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
            <button type="submit" className="button-primary w-full">
              <CheckCircle2 className="h-4 w-4" />
              Enter workspace
            </button>
          </form>
          <div className="mt-6 rounded-lg bg-stone-50 p-4 text-sm text-stone-600">
            <div className="font-bold text-stone-800">Seed users</div>
            <div className="mt-2 space-y-1">
              {roles.map((item) => (
                <div key={item} className="flex items-center justify-between gap-3">
                  <span>{item}</span>
                  <code className="text-xs">{roleCredentials[item].password}</code>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
