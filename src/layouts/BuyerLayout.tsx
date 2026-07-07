import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Package, PlusCircle, Bell, User, LogOut, Globe, Bookmark, Truck, Search, ShoppingBag, X } from 'lucide-react';
import { useLanguage, toArabicNumeral } from '../i18n';
import { cn } from '../lib/utils';
import { syncPreferredLang } from '../services/auth.service';
import { useState, useEffect, useRef } from 'react';
import { publicService, type PublicProduct } from '../services/public.service';
import { buyerService, type SearchResult } from '../services/buyer.service';

export function BuyerLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PublicProduct | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(() => {
      buyerService.search(searchQuery.trim())
        .then((res) => {
          setSearchResults(res.data);
          setShowDropdown(true);
        })
        .catch(() => setShowDropdown(false));
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalResults = (searchResults?.products.length ?? 0) + (searchResults?.orders.length ?? 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { icon: Home, key: 'home', path: '/buyer' },
    { icon: Package, key: 'orders', path: '/buyer/orders' },
    { icon: Bookmark, key: 'saved', path: '/buyer/saved' },
    { icon: PlusCircle, key: 'create', path: '/buyer/create' },
    { icon: Bell, key: 'alerts', path: '/buyer/notifications' },
    { icon: Truck, key: 'deliveries', path: '/buyer/deliveries' },
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
              const isActive = location.pathname === item.path || (item.path !== '/buyer' && location.pathname.startsWith(item.path));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/buyer'}
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
        <div className="h-full">
          {/* Search + Actions */}
          <div className="px-4 md:px-8 pt-4 md:pt-6 pb-2">
            <div className="flex items-center gap-3">
              <div className="relative flex-1" ref={dropdownRef}>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={t('searchSupplies')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (searchResults && totalResults > 0) setShowDropdown(true); }}
                  className="w-full pl-12 pr-10 py-3.5 bg-white/85 backdrop-blur-xl border border-white/70 rounded-[2rem] text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] shadow-xl shadow-slate-200/60 placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setSearchResults(null); setShowDropdown(false); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {showDropdown && searchResults && totalResults > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-900/10 z-50 max-h-[70vh] overflow-y-auto">
                    {searchResults.products.length > 0 && (
                      <div className="p-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <Package className="w-3 h-3" /> {t('products' as any)}
                        </p>
                        <div className="space-y-1">
                          {searchResults.products.slice(0, 5).map((p) => (
                            <div
                              key={p.id}
                              onClick={async () => {
                                try {
                                  const res = await publicService.getProduct(p.id);
                                  setSelectedProduct(res.data);
                                } catch (_) {}
                              }}
                              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                            >
                              <div>
                                <p className="text-sm font-medium text-slate-900">{p.name}</p>
                                <p className="text-[11px] text-slate-400">{p.categoryName}</p>
                              </div>
                              <span className="text-sm font-bold text-[#1e3a8a]">{toArabicNumeral(p.price.toFixed(2), language)} {t('currency')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {searchResults.orders.length > 0 && (
                      <div className="p-3 border-t border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3" /> {t('orders' as any)}
                        </p>
                        <div className="space-y-1">
                          {searchResults.orders.slice(0, 5).map((o) => (
                            <div
                              key={o.id}
                              onClick={() => { navigate(`/buyer/orders/${o.id}`); setShowDropdown(false); setSearchQuery(''); setSearchResults(null); }}
                              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                            >
                              <p className="text-sm font-medium text-slate-900">{o.title}</p>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                o.status === 'Open' ? 'bg-emerald-100 text-emerald-700' :
                                o.status === 'Closed' ? 'bg-slate-200 text-slate-600' :
                                o.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                o.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-indigo-100 text-indigo-700'
                              }`}>
                                {o.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
                to="/buyer/profile"
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
              const isActive = location.pathname === item.path || (item.path !== '/buyer' && location.pathname.startsWith(item.path));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/buyer'}
                  className="group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5"
                >
                  {isActive && (
                    <span className="absolute -top-1.5 mx-auto h-1 w-7 rounded-full bg-[#1e3a8a]" />
                  )}
                  <Icon className={`${isActive ? "text-[#1e3a8a]" : "text-slate-400 group-active:text-[#1e3a8a] transition-colors"} ${!isActive && "scale-110 opacity-60"}`} />
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

      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="h-36 bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] flex items-center justify-center relative">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Package className="w-10 h-10 text-white" />
              </div>
              <button onClick={() => setSelectedProduct(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/30 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selectedProduct.name}</h2>
                <span className="inline-block mt-1 text-[11px] font-medium text-white bg-slate-200 rounded-full px-3 py-1 bg-[#eef3f9] text-[#1e3a8a]">{selectedProduct.categoryName}</span>
              </div>

              <div className="flex items-end gap-2">
                <span className="text-3xl font-extrabold text-[#1e3a8a]">{toArabicNumeral((selectedProduct.marketPrice ?? 0).toFixed(2), language)}</span>
                <span className="text-sm font-bold text-slate-400 mb-1">{t('currency')}</span>
              </div>

              {selectedProduct.description && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{t('description' as any)}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedProduct.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
