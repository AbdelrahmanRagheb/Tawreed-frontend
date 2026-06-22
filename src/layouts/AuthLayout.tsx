import { Outlet, Link } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { Globe2 } from 'lucide-react';

export function AuthLayout() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex flex-col">
      {/* Top language bar */}
      <div className="w-full flex items-center justify-end px-4 sm:px-8 py-3">
        <button
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 text-xs font-bold transition-all shadow-sm"
        >
          <Globe2 className="w-3.5 h-3.5" />
          {language === 'ar' ? 'English' : 'العربية'}
        </button>
      </div>

      {/* Centered card container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="block text-center mb-8">
            <div className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-white text-lg font-extrabold">ت</span>
              </div>
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {t('appTitle')}
              </span>
            </div>
          </Link>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-6 sm:p-8">
              <Outlet />
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-[11px] text-slate-400 mt-6">
            &copy; {new Date().getFullYear()} {t('appTitle')} &middot; {t('appTagline')}
          </p>
        </div>
      </div>
    </div>
  );
}
