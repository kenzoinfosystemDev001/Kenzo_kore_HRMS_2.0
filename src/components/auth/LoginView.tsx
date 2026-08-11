import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Key } from 'lucide-react';
import { UserAccount } from '../../types';
import { KenzoLogo } from '../KenzoLogo';

interface LoginViewProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predefinedUsers = [
    { name: 'Sujal kumar', email: 'sujal.kumar@kenzoinfosystems.com', role: 'Employee', title: 'Software Engineer' },
    { name: 'Laxmi Narayan', email: 'laxminarayan.ojha@kenzoinfosystems.com', role: 'Employee', title: 'Senior Frontend Dev' },
    { name: 'Ankit sethi', email: 'Ankit.sethi@kenzoinfosystems.com', role: 'Admin', title: 'HR Administrator' },
    { name: 'Jitender Saini', email: 'Jitender.saini@kenzoinfosystems.com', role: 'Admin', title: 'VP of Operations' },
    { name: 'Chanchal Saini', email: 'Chanchal.saini@kenzoinfosystems.com', role: 'Admin', title: 'Chief Admin Officer' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err?.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('kenzo123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Subtle Gradient Spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 p-8 lg:p-10 relative z-10">
        
        {/* Bold and Stylish KENZO - HRMS Header with Web Icon on the Left */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <KenzoLogo className="w-12 h-12 shrink-0 drop-shadow-md" />
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wider bg-gradient-to-r from-[#0060ac] via-[#004e8c] to-[#48bbbe] bg-clip-text text-transparent uppercase drop-shadow-xs">
              KENZO - HRMS
            </h1>
          </div>

          <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mt-1">
            Kenzo Infosystems Enterprise Portal
          </p>

          <div className="w-16 h-1 bg-gradient-to-r from-[#0060ac] to-[#48bbbe] mx-auto rounded-full mt-3 mb-4" />

          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Sign In to Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enter your work email and password to access your role-based portal.
          </p>
        </div>

        {/* Predefined Quick Select User Pills */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span>Select Account (1-Click Login)</span>
            <span className="text-teal-600 font-mono">Password: kenzo123</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {predefinedUsers.map((u) => (
              <button
                key={u.email}
                type="button"
                onClick={() => handleQuickSelect(u.email)}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                  email.toLowerCase() === u.email.toLowerCase()
                    ? 'bg-blue-50 border-[#0060ac] text-[#0060ac] shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{u.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{u.title}</p>
                </div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                  u.role === 'Admin' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
                }`}>
                  {u.role}
                </span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <Lock className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Work Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="e.g. sujal.kumar@kenzoinfosystems.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0060ac] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Account Password</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0060ac] focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0060ac] hover:bg-[#004e8c] text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In & Access Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Kenzo Infosystems</span>
          <span className="flex items-center gap-1 text-teal-600 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Neon Postgres Hashed Auth
          </span>
        </div>

      </div>
    </div>
  );
};
