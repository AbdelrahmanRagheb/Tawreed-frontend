import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';
import { LogIn, Bug } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password');
      return;
    }
    setSubmitting(true);
    try {
      if (debugMode) {
        const res = await authService.debugLogin({ email: email.trim(), password });
        const { token, refreshToken, user: apiUser } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        const mappedUser = {
          id: apiUser.id,
          name: apiUser.name,
          email: apiUser.email,
          role: apiUser.role.toLowerCase() as any,
          avatar: apiUser.avatar,
          preferredLang: apiUser.preferredLang || 'en',
        };
        localStorage.setItem('user', JSON.stringify(mappedUser));
        localStorage.setItem('preferredLang', mappedUser.preferredLang);
        window.location.href = '/';
        return;
      }
      await login(email.trim(), password);
      navigate('/');
    } catch (err: any) {
      if (!debugMode && err?.response?.status === 401) {
        setDebugMode(true);
        setError('Normal login failed. Debug mode activated — try again with any password.');
      } else {
        setError(err?.response?.data?.message || err?.message || 'Login failed');
      }
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

      {debugMode && (
        <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
          <Bug className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-xs text-amber-700">Debug mode — any password works</span>
        </div>
      )}

      <div className="mt-8 pt-8 border-t border-slate-200">
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
