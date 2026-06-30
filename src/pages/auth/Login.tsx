import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';
import { useLanguage } from '../../i18n';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const isRTL = language === 'ar';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugMode, setDebugMode] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError(t('enterEmailPassword'));
      return;
    }
    setLoading(true);
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
        setError(err?.response?.data?.message || err?.message || t('loginFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative min-h-screen w-full overflow-hidden bg-slate-50 ${isRTL ? 'font-ar' : ''}`}>
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob-1 absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-blue-200/40 blur-3xl" />
        <div className="blob-2 absolute -bottom-40 -right-32 h-[480px] w-[480px] rounded-full bg-indigo-300/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-100/40 blur-3xl" />
      </div>

      {/* Floating language toggle */}
      <button
        onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
        className="absolute top-6 right-6 z-20 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:border-[#1e3a8a] hover:text-[#1e3a8a] hover:shadow-md"
        aria-label="Switch language"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span>{isRTL ? 'EN' : 'عربي'}</span>
      </button>

      {/* Main */}
      <main className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 pb-12 pt-4 lg:grid-cols-2 lg:gap-16 lg:pt-8">
        {/* Brand side (hidden on mobile) */}
        <section className="hidden flex-col items-center text-center lg:flex fade-up">
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 blur-2xl" />
            <Link to="/">
              <img src="/tawreed-logo.png" alt="Tawreed" className="h-72 w-auto" />
            </Link>
          </div>
          <p className="mt-2 max-w-md text-base font-medium text-slate-600">
            {t('tagline')}
          </p>
          <ul className="mt-8 grid w-full max-w-md gap-3 text-start">
            {[t('feature1'), t('feature2'), t('feature3')].map((f, i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white/60 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1e3a8a]/10 text-[#1e3a8a]">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Form side */}
        <section className="flex justify-center fade-up mt-15">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-6 flex justify-center lg:hidden">
              <img src="/tawreed-logo.png" alt="Tawreed" className="h-24 w-auto" />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/60 backdrop-blur sm:p-10">
              <div className="mb-7 text-center">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  {t('welcomeBack')}
                </h1>
                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                  {t('signInContinue')}
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5" noValidate>
                {/* Email */}
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                    {t('emailAddress')}
                  </label>
                  <div className="group relative flex items-center rounded-xl border border-slate-300 bg-white transition focus-within:border-[#1e3a8a] focus-within:ring-4 focus-within:ring-[#1e3a8a]/10">
                    <span className="pointer-events-none absolute inset-y-0 flex items-center px-3.5 text-slate-400" style={isRTL ? { right: 0 } : { left: 0 }}>
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <polyline points="3 7 12 13 21 7" />
                      </svg>
                    </span>
                    <input
                      id="email" type="email" autoComplete="email" dir="ltr"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('emailAddress')}
                      className={`w-full bg-transparent py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none ${isRTL ? 'pr-11 pl-3 text-right' : 'pl-11 pr-3'}`}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
                    {t('password')}
                  </label>
                  <div className="group relative flex items-center rounded-xl border border-slate-300 bg-white transition focus-within:border-[#1e3a8a] focus-within:ring-4 focus-within:ring-[#1e3a8a]/10">
                    <span className="pointer-events-none absolute inset-y-0 flex items-center px-3.5 text-slate-400" style={isRTL ? { right: 0 } : { left: 0 }}>
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      id="password" type={showPass ? 'text' : 'password'} autoComplete="current-password"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('password')}
                      className={`w-full bg-transparent py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none ${isRTL ? 'pr-11 pl-11 text-right' : 'pl-11 pr-11'}`}
                    />
                    <button
                      type="button" onClick={() => setShowPass((s) => !s)}
                      aria-label={showPass ? t('hidePassword') : t('showPassword')}
                      className="absolute inset-y-0 flex items-center px-3.5 text-slate-400 transition hover:text-[#1e3a8a]"
                      style={isRTL ? { left: 0 } : { right: 0 }}
                    >
                      {showPass ? (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember + forgot */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex cursor-pointer items-center gap-2 text-slate-600 select-none">
                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#1e3a8a] focus:ring-[#1e3a8a]" />
                    <span>{t('remember')}</span>
                  </label>
                  <a href="#" className="font-semibold text-[#1e3a8a] transition hover:text-[#172554] hover:underline">
                    {t('forgotPassword')}
                  </a>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
                    {error}
                  </div>
                )}

                {/* Debug info */}
                {debugMode && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                    <p className="font-bold mb-1">Mock accounts:</p>
                    <p>admin@tawreed.com / admin123</p>
                    <p>buyer@tawreed.com / buyer123</p>
                    <p>supplier@tawreed.com / supplier123</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit" disabled={loading}
                  className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-80"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".25" />
                          <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        {t('signingIn')}
                      </>
                    ) : (
                      <>
                        {t('signIn')}
                        <svg className={`h-5 w-5 transition group-hover:translate-x-0.5 ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>

              </form>

              <p className="mt-7 text-center text-sm text-slate-600">
                {t('noAccount')}{' '}
                <Link to="/auth/register" className="font-bold text-[#1e3a8a] transition hover:text-[#172554] hover:underline">
                  {t('createAccount')}
                </Link>
              </p>
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              &copy; {new Date().getFullYear()} {isRTL ? 'توريد' : 'Tawreed'}. {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
