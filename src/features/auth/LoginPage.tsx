import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      setError('Use one of the seeded credential sets shown below.');
      return;
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F2EFEA] flex flex-col items-center justify-center p-6 text-brand-navy">
      {/* Brand Header */}
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm border border-[#ECE8E2]">
          <span className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#5B4FE9] to-[#FF6B35] flex items-center justify-center">
            <span className="h-2.5 w-2.5 rounded-full bg-white" />
          </span>
        </div>
        <h1 className="font-serif text-3xl font-light text-brand-navy tracking-tight mt-1">
          Sign in to RecruiterOS
        </h1>
        <p className="folio-mono text-[9px] uppercase tracking-[0.2em] text-[#6D6B8D] font-bold">
          Workspace authentication
        </p>
      </div>

      {/* Login Form Container Card */}
      <div className="bg-white border border-[#ECE8E2] rounded-2xl p-8 shadow-[0_10px_35px_-10px_rgba(21,22,51,0.04)] max-w-md w-full">
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block folio-mono text-[10px] uppercase tracking-wider text-stone-500 font-bold mb-2">
              Email Address
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={(event) => setEmail(event.target.value)} 
              className="input" 
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block folio-mono text-[10px] uppercase tracking-wider text-stone-500 font-bold mb-2">
              Password
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(event) => setPassword(event.target.value)} 
              className="input" 
              placeholder="8+ characters"
              required
            />
          </div>

          <div>
            <label className="block folio-mono text-[10px] uppercase tracking-wider text-stone-500 font-bold mb-2">
              Workspace Role
            </label>
            <select 
              value={role} 
              onChange={(event) => selectRole(event.target.value as Role)} 
              className="input cursor-pointer"
            >
              {roles.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 px-4 py-3 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="button-primary w-full py-3.5 mt-2 flex items-center justify-center font-bold hover:bg-[#FF6B35] transition duration-150 cursor-pointer"
          >
            Enter workspace
          </button>
        </form>

        <div className="relative my-6.5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#ECE8E2]" />
          </div>
          <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-widest folio-mono">
            <span className="bg-white px-3 text-[#6D6B8D]">or prefill credentials</span>
          </div>
        </div>

        {/* Clickable Quick Role Prefills */}
        <div className="grid grid-cols-3 gap-2.5">
          {roles.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => selectRole(item)}
              className={`rounded-xl border py-2.5 text-center transition duration-150 cursor-pointer ${
                role === item 
                  ? 'border-brand-purple bg-brand-purple/5 text-brand-purple font-bold' 
                  : 'border-[#ECE8E2] bg-white text-stone-500 hover:bg-stone-50 hover:border-stone-300'
              }`}
            >
              <div className="text-[11px] font-bold tracking-tight">{item}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
