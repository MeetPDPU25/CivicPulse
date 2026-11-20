import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, UserCheck, HardHat, User } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (data.user.role === 'staff') {
        navigate('/staff/dashboard');
      } else {
        navigate('/citizen/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Municipal Portal Sign In</h2>
          <p className="text-xs text-slate-500 mt-1">Access Citizen, Admin, or Field Staff Services</p>
        </div>

        {/* Demo Credentials Quick-Select Pill Group */}
        <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Quick Demo Accounts (1-Click)</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => fillCredentials('admin@civic.gov', 'admin123')}
              className="px-2.5 py-1.5 text-left rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-colors flex items-center gap-1.5 font-medium text-slate-700"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('meet@student.pdpu.ac.in', 'password123')}
              className="px-2.5 py-1.5 text-left rounded-lg bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors flex items-center gap-1.5 font-medium text-slate-700"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Citizen</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('ramesh.staff@civic.gov', 'password123')}
              className="px-2.5 py-1.5 text-left rounded-lg bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-colors flex items-center gap-1.5 font-medium text-slate-700"
            >
              <HardHat className="w-3.5 h-3.5 text-amber-600" />
              <span>Roads Staff</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('suresh.staff@civic.gov', 'password123')}
              className="px-2.5 py-1.5 text-left rounded-lg bg-white border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 transition-colors flex items-center gap-1.5 font-medium text-slate-700"
            >
              <HardHat className="w-3.5 h-3.5 text-purple-600" />
              <span>Sanitation Staff</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@civic.gov or user@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
          Citizen without an account?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register as a Citizen
          </Link>
        </div>

      </div>
    </div>
  );
}
