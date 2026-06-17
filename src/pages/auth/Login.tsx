import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronDown, LogIn } from 'lucide-react';

const roleOptions = [
  { value: 'admin@tawreed.com', label: 'Admin', pass: '123456' },
  { value: 'ahmad.ali@example.com', label: 'Buyer', pass: '123456' },
  { value: 'supplier.juhayna@example.com', label: 'Supplier', pass: '123456' },
];

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState(roleOptions[1].value);
  const [password, setPassword] = useState(roleOptions[1].pass);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password');
      return;
    }
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
        <p className="text-sm text-slate-500">Sign in to continue to Tawreed</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-slate-200">
        <div className="relative mb-4">
          <select
            value={email}
            onChange={(e) => {
              const opt = roleOptions.find((o) => o.value === e.target.value);
              if (opt) {
                setEmail(opt.value);
                setPassword(opt.pass);
              }
            }}
            className="w-full appearance-none px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Quick select a role...</option>
            {roleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {error && (
          <p className="text-xs text-red-600 mb-3 text-center">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={submitting}
          className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <LogIn className="w-4 h-4" />
          )}
          {submitting ? 'Signing in...' : 'Login'}
        </button>

        <p className="text-center text-xs text-slate-500 mt-4">
          Don't have an account?{' '}
          <a href="/auth/register" className="text-indigo-600 font-semibold hover:underline">Create one</a>
        </p>
      </div>
    </div>
  );
}
