import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Package, Truck, Users, Settings, User, LogOut, PackageSearch, Globe, Archive, Bell, FileText, Clock, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!approvalStatus?.isApproved) {
    const isPending = approvalStatus?.status === 'PendingApproval';
    const isRejected = approvalStatus?.status === 'Rejected';
    const isSuspended = approvalStatus?.status === 'Suspended';

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className={`w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center ${
            isPending ? 'bg-amber-100' : isRejected ? 'bg-red-100' : 'bg-red-100'
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
    { icon: User, key: 'profile', path: '/supplier/profile' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen shrink-0">
        <div className="h-24 flex items-center px-6 border-b border-slate-200">
          <img src="/tawreed-logo.png" alt="Tawreed" className="h-28 w-auto shrink-0" />
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/supplier'}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
          <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shrink-0 md:hidden">
             <div className="flex items-center gap-2">
                 <img src="/tawreed-logo.png" alt="Tawreed" className="h-20 w-auto shrink-0" />
             </div>
              <div className="flex items-center gap-2">
                 <NavLink
                   to="/supplier/profile"
                   className="text-slate-500 hover:text-indigo-600 transition-colors"
                 >
                   <User className="w-5 h-5" />
                 </NavLink>
                 <button
                   onClick={() => {
                     const newLang = language === 'en' ? 'ar' : 'en';
                     setLanguage(newLang);
                     syncPreferredLang(user?.role, newLang);
                   }}
                   className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 font-medium"
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
          {navItems.filter((item) => item.key !== 'profile').map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/supplier'}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center w-full h-full text-[10px] font-medium transition-colors",
                  isActive ? "text-indigo-600" : "text-slate-500"
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
