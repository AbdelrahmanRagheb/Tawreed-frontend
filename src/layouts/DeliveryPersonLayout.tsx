import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Truck, User, LogOut, Globe, ClipboardList } from 'lucide-react';
import { useLanguage } from '../i18n';
import { cn } from '../lib/utils';
import { syncPreferredLang } from '../services/auth.service';

export function DeliveryPersonLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { icon: LayoutDashboard, key: 'dashboard', path: '/delivery/dashboard' },
    { icon: ClipboardList, key: 'deliveries', path: '/delivery/deliveries' },
    { icon: User, key: 'profile', path: '/delivery/profile' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="w-8 h-8 bg-emerald-600 flex items-center justify-center rounded-sm shrink-0">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <span className="ms-2 text-xl font-bold tracking-tight text-slate-800 uppercase">{t('appTitle')}</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/delivery/dashboard'}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {t(item.key as any)}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200 space-y-1">
          <button
            onClick={() => {
              const newLang = language === 'en' ? 'ar' : 'en';
              setLanguage(newLang);
              syncPreferredLang(user?.role, newLang);
            }}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Globe className="w-5 h-5" />
            <span className="uppercase font-bold">{language === 'en' ? 'AR' : 'EN'}</span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            {t('logout')}
          </button>
        </div>
      </aside>

      <main className="flex-1 pb-16 md:pb-0 overflow-y-auto h-screen relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shrink-0 md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-600 flex items-center justify-center rounded-sm shrink-0">
              <Truck className="w-3 h-3 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-800 uppercase">{t('appTitle')}</span>
          </div>
          <div className="flex items-center gap-2">
            <NavLink to="/delivery/profile" className="text-slate-500 hover:text-emerald-600 transition-colors">
              <User className="w-5 h-5" />
            </NavLink>
            <button
              onClick={() => {
                const newLang = language === 'en' ? 'ar' : 'en';
                setLanguage(newLang);
                syncPreferredLang(user?.role, newLang);
              }}
              className="text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-1 font-medium"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm uppercase font-bold">{language === 'en' ? 'AR' : 'EN'}</span>
            </button>
          </div>
        </header>
        <div className="h-full">
          <Outlet />
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 w-full z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/delivery/dashboard'}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full text-[10px] font-medium transition-colors",
                isActive ? "text-emerald-600" : "text-slate-500 hover:text-slate-900"
              )
            }
          >
            <item.icon className="w-5 h-5 mb-1" />
            {t(item.key as any)}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}