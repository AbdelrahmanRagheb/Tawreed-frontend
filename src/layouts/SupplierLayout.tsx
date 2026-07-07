import { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Package, Truck, Users, Settings, User, LogOut, PackageSearch, Archive, Bell, FileText, Clock, XCircle, Loader2, Globe, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../i18n';
import { syncPreferredLang } from '../services/auth.service';
import { supplierService } from '../services/supplier.service';

export function SupplierLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [approvalStatus, setApprovalStatus] = useState<{ status: string; isApproved: boolean } | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await supplierService.getRegistrationStatus();
        setApprovalStatus(res.data);
      } catch {
        setApprovalStatus({ status: 'PendingApproval', isApproved: false });
      } finally {
        setChecking(false);
      }
    };
    check();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#eef3f9] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#1e3a8a] animate-spin" />
      </div>
    );
  }

  if (!approvalStatus?.isApproved) {
    const isPending = approvalStatus?.status === 'PendingApproval';
    const isRejected = approvalStatus?.status === 'Rejected';
    const isSuspended = approvalStatus?.status === 'Suspended';

    return (
      <div className="min-h-screen bg-[#eef3f9] flex items-center justify-center p-4">
        <div className="rounded-[2rem] border border-white/70 bg-white/90 shadow-xl shadow-slate-200/60 max-w-md w-full p-8 text-center">
          <div className={`w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center ${
            isPending ? 'bg-amber-100' : 'bg-red-100'
          }`}>
            {isPending ? (
              <Clock className="w-8 h-8 text-amber-600" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600" />
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {isPending ? t('accountUnderReview') : isRejected ? t('accountRejected') : t('accountSuspended')}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            {isPending
              ? t('pendingApprovalMessage')
              : isRejected
                ? t('rejectedMessage')
                : t('suspendedMessage')}
          </p>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="px-6 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            {t('goHome')}
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { icon: LayoutDashboard, key: 'dashboard', path: '/supplier' },
    { icon: PackageSearch, key: 'products', path: '/supplier/products' },
    { icon: Archive, key: 'inventory', path: '/supplier/inventory' },
    { icon: Package, key: 'orders', path: '/supplier/orders' },
    { icon: Truck, key: 'deliveries', path: '/supplier/deliveries' },
    { icon: Bell, key: 'notifications', path: '/supplier/notifications' },
    { icon: FileText, key: 'reports', path: '/supplier/reports' },
  ];

  return (
    <div className="min-h-screen bg-[#eef3f9] flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 shrink-0 p-3 lg:p-4">
        <div className="sticky top-4 flex h-[calc(100vh-32px)] flex-col rounded-[2rem] border border-white/70 bg-white/85 shadow-xl shadow-slate-200/70 backdrop-blur-xl">
          {/* Brand */}
          <div className="mb-2 flex items-center gap-3 rounded-3xl bg-slate-50 m-4 p-3">
            <img src="/tawreed-logo.png" alt="Tawreed" className="h-auto w-auto shrink-0" />
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/supplier' && location.pathname.startsWith(item.path));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/supplier'}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition",
                    isActive
                      ? "bg-gradient-to-l from-[#1e3a8a] to-[#2563eb] text-white shadow-lg shadow-blue-900/20"
                      : "text-slate-500 hover:bg-slate-100 hover:text-[#1e3a8a]"
                  )}
                >
                  <span className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                    isActive ? "bg-white/15" : "bg-white text-slate-400 group-hover:text-[#1e3a8a]"
                  )}>
                    <Icon className="w-4.5 h-4.5" />
                  </span>
                  {t(item.key as any)}
                </NavLink>
              );
            })}
          </nav>

        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-0 overflow-y-auto h-screen relative">
        <header className="h-20 bg-white/85 backdrop-blur-xl border-b border-white/70 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shrink-0 md:hidden shadow-xl shadow-slate-200/60">
          <Link to="/" className="flex items-center gap-2">
            <img src="/tawreed-logo.png" alt="Tawreed" className="h-12 w-auto shrink-0" />
          </Link>
          <div className="flex items-center gap-2">
            <NavLink
              to="/supplier/profile"
              className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] text-white text-sm font-extrabold shadow-lg"
            >
              {user?.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
            </NavLink>
          </div>
        </header>
        <div className="h-full">
          {/* Search + Actions */}
          <div className="px-4 md:px-8 pt-4 md:pt-6 pb-2">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder={t('searchSupplies')}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/85 backdrop-blur-xl border border-white/70 rounded-[2rem] text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] shadow-xl shadow-slate-200/60 placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={() => {
                  const newLang = language === 'en' ? 'ar' : 'en';
                  setLanguage(newLang);
                  syncPreferredLang(user?.role, newLang);
                }}
                className="shrink-0 rounded-2xl border border-white/70 bg-white/85 backdrop-blur-xl px-3 py-3.5 text-xs font-bold text-slate-600 shadow-xl shadow-slate-200/60 transition hover:border-[#1e3a8a] hover:text-[#1e3a8a] flex items-center gap-1.5"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{language === 'en' ? 'AR' : 'EN'}</span>
              </button>
              <NavLink
                to="/supplier/profile"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] text-white text-sm font-extrabold shadow-lg"
              >
                {user?.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
              </NavLink>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="shrink-0 rounded-2xl border border-white/70 bg-white/85 backdrop-blur-xl px-3 py-3.5 text-xs font-bold text-red-600 shadow-xl shadow-slate-200/60 transition hover:border-red-300 hover:bg-red-50 flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t('logout')}</span>
              </button>
            </div>
          </div>
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed inset-x-0 bottom-0 z-50">
        <div className="pointer-events-none absolute -inset-x-0 -top-6 h-6 bg-gradient-to-t from-white/95 to-transparent" />
        <div className="border-t border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-[0_-4px_30px_rgba(0,0,0,.06)]">
          <div className="mx-auto flex h-16 max-w-[1500px] items-stretch justify-around px-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/supplier' && location.pathname.startsWith(item.path));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/supplier'}
                  className="group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5"
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#1e3a8a]" : "text-slate-400 group-active:text-[#1e3a8a] transition-colors"}`} />
                  <span className={`text-[11px] font-extrabold tracking-tight ${
                    isActive ? "text-[#1e3a8a]" : "font-semibold text-slate-400 group-active:text-[#1e3a8a]"
                  }`}>
                    {t(item.key as any)}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>
        <div className="h-safe-area-inset-bottom" />
      </nav>
    </div>
  );
}
