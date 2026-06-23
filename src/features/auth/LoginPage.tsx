import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/useAuth';
import { roleCredentials } from '@/data/seed';
import { Role } from '@/types';

const roles: Role[] = ['Recruiter', 'Hiring Manager', 'Admin'];

export default function LoginPage() {
  const { login, signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Sign up form states
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<Role>('Recruiter');

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    // Auto-detect role from email to avoid requiring a dropdown
    let resolvedRole: Role = 'Recruiter';
    if (email.trim().toLowerCase().includes('manager')) {
      resolvedRole = 'Hiring Manager';
    } else if (email.trim().toLowerCase().includes('admin')) {
      resolvedRole = 'Admin';
    }

    const isAuthenticated = login(email, password, resolvedRole);
    if (!isAuthenticated) {
      setError('Use recruiter@demo.com, manager@demo.com, or admin@demo.com');
      return;
    }
    navigate('/');
  };

  const handleSignUp = (event: React.FormEvent) => {
    event.preventDefault();
    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    const success = signUp(signUpName, signUpEmail, signUpPassword, signUpRole);
    if (!success) {
      setError('Email address already registered.');
      return;
    }
    navigate('/');
  };

  const loginAsRecruiterDirectly = () => {
    login(roleCredentials.Recruiter.email, roleCredentials.Recruiter.password, 'Recruiter');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] flex flex-col items-center justify-center p-6 text-brand-navy font-sans">
      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center gap-2.5 text-center">
        <div className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-[#ECE8E2]">
            <span className="h-5.5 w-5.5 rounded-full bg-gradient-to-tr from-[#5B4FE9] to-[#FF6B35] flex items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          </div>
          <span className="font-serif text-xl font-bold text-brand-navy tracking-tight">Folio</span>
        </div>
        <h1 className="font-sans text-2xl font-semibold text-brand-navy tracking-tight mt-2">
          {isLoginMode ? 'Sign in to Folio' : 'Sign up to Folio'}
        </h1>
      </div>

      {/* Auth Card */}
      <div className="bg-white border border-[#ECE8E2] rounded-2xl p-8 shadow-[0_4px_25px_-5px_rgba(21,22,51,0.03)] max-w-sm w-full space-y-5">
        {isLoginMode ? (
          /* Sign In Form */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={(event) => setEmail(event.target.value)} 
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#5B4FE9] text-xs font-sans placeholder-stone-400" 
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Password
              </label>
              <input 
                type="password" 
                value={password} 
                onChange={(event) => setPassword(event.target.value)} 
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#5B4FE9] text-xs font-sans placeholder-stone-400" 
                placeholder="8+ characters"
                required
              />
              <div className="text-right mt-1.5">
                <a href="#" className="text-[11px] text-[#5B4FE9] font-semibold hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/50 px-4 py-2.5 text-[11px] font-semibold text-rose-700">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-3 mt-2 rounded-xl text-white font-semibold bg-[#5B4FE9] hover:bg-[#4a3fd4] transition duration-150 cursor-pointer text-xs flex items-center justify-center"
            >
              Sign in
            </button>
          </form>
        ) : (
          /* Sign Up Form */
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name
              </label>
              <input 
                type="text" 
                value={signUpName} 
                onChange={(event) => setSignUpName(event.target.value)} 
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#5B4FE9] text-xs font-sans placeholder-stone-400" 
                placeholder="your name"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email
              </label>
              <input 
                type="email" 
                value={signUpEmail} 
                onChange={(event) => setSignUpEmail(event.target.value)} 
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#5B4FE9] text-xs font-sans placeholder-stone-400" 
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Password
              </label>
              <input 
                type="password" 
                value={signUpPassword} 
                onChange={(event) => setSignUpPassword(event.target.value)} 
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#5B4FE9] text-xs font-sans placeholder-stone-400" 
                placeholder="8+ characters"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Workspace Role
              </label>
              <select 
                value={signUpRole} 
                onChange={(event) => setSignUpRole(event.target.value as Role)} 
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#5B4FE9] text-xs font-sans bg-white cursor-pointer"
              >
                {roles.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/50 px-4 py-2.5 text-[11px] font-semibold text-rose-700">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-3 mt-2 rounded-xl text-white font-semibold bg-[#5B4FE9] hover:bg-[#4a3fd4] transition duration-150 cursor-pointer text-xs flex items-center justify-center"
            >
              Sign up
            </button>
          </form>
        )}

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-100" />
          </div>
          <div className="relative flex justify-center text-[10px] text-stone-400">
            <span className="bg-white px-2">or</span>
          </div>
        </div>

        {/* Google Authentication */}
        <button 
          type="button"
          onClick={loginAsRecruiterDirectly}
          className="w-full py-3 rounded-xl border border-stone-200 hover:bg-stone-50 bg-white transition duration-150 cursor-pointer text-xs font-semibold flex items-center justify-center gap-2"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.478 0-6.3-2.822-6.3-6.3s2.822-6.3 6.3-6.3c1.554 0 2.978.567 4.084 1.503l3.056-3.056C19.348 2.76 15.996 1.5 12.24 1.5 6.308 1.5 1.5 6.308 1.5 1.5 12.24s4.808 10.74 10.74 10.74c6.208 0 10.323-4.364 10.323-10.5 0-.709-.082-1.396-.24-2.083h-10.083z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Links */}
        <div className="flex flex-col items-center gap-2 pt-2 text-xs text-stone-500 font-sans text-center">
          {isLoginMode ? (
            <div>
              <span>No account? </span>
              <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginMode(false); setError(''); }} className="text-[#5B4FE9] font-semibold hover:underline">
                Sign up
              </a>
            </div>
          ) : (
            <div>
              <span>Already have an account? </span>
              <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginMode(true); setError(''); }} className="text-[#5B4FE9] font-semibold hover:underline">
                Sign in
              </a>
            </div>
          )}
          
          <div className="text-[11px]">
            <span>Are you a Recruiter? </span>
            <button 
              type="button" 
              onClick={loginAsRecruiterDirectly} 
              className="text-[#5B4FE9] font-semibold hover:underline cursor-pointer"
            >
              Instant Login (Demo)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
