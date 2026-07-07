import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Search,
  X,
  ArrowLeft,
  ArrowRight,
  Users,
  Store,
  ShoppingCart,
  Package,
} from "lucide-react";
import { useLanguage } from '../../i18n';
import { adminService, type AdminSearchResult } from '../../services/admin.service';

export function AdminSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);

  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<AdminSearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      adminService.search(searchQuery.trim())
        .then((res) => setSearchResults(res.data))
        .catch(() => setSearchResults(null))
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() }, { replace: true });
    }
  }, [searchQuery]);

  const totalResults =
    (searchResults?.users.length ?? 0) +
    (searchResults?.suppliers.length ?? 0) +
    (searchResults?.orders.length ?? 0) +
    (searchResults?.products.length ?? 0);

  return (
    <div className="fixed inset-0 z-50 bg-[#eef3f9] h-screen flex flex-col">
      <div className="shrink-0 px-4 pt-4 pb-2 bg-[#eef3f9]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="shrink-0 w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition"
          >
            {language === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchSupplies')}
              className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setSearchResults(null); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && !searchResults && !searchQuery.trim() && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-10 h-10 text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">{language === 'ar' ? 'ابدأ بالكتابة للبحث' : 'Start typing to search'}</p>
          </div>
        )}

        {!loading && searchResults && totalResults === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-10 h-10 text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">{t('noResults')}</p>
          </div>
        )}

        {!loading && searchResults && totalResults > 0 && (
          <div className="space-y-4">
            {searchResults.users.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('users')} ({searchResults.users.length})</p>
                </div>
                {searchResults.users.map((u) => (
                  <Link
                    key={u.id}
                    to={`/admin/buyers?detail=${u.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition border-b border-slate-50 last:border-0"
                  >
                    <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{u.name}</p>
                      <p className="text-xs text-slate-500 truncate">{u.email}</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0 bg-slate-100 px-2 py-1 rounded-full">{u.role}</span>
                  </Link>
                ))}
              </div>
            )}

            {searchResults.suppliers.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('suppliers')} ({searchResults.suppliers.length})</p>
                </div>
                {searchResults.suppliers.map((s) => (
                  <Link
                    key={s.id}
                    to={`/admin/suppliers?detail=${s.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition border-b border-slate-50 last:border-0"
                  >
                    <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <Store className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{s.companyName}</p>
                      <p className="text-xs text-slate-500 truncate">{s.email}</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0 bg-slate-100 px-2 py-1 rounded-full">{s.status}</span>
                  </Link>
                ))}
              </div>
            )}

            {searchResults.orders.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('orders')} ({searchResults.orders.length})</p>
                </div>
                {searchResults.orders.map((o) => (
                  <Link
                    key={o.id}
                    to={`/admin/orders?detail=${o.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition border-b border-slate-50 last:border-0"
                  >
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                      <ShoppingCart className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{o.title}</p>
                      <p className="text-xs text-slate-500 truncate">{o.buyerName}</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0 bg-slate-100 px-2 py-1 rounded-full">{o.status}</span>
                  </Link>
                ))}
              </div>
            )}

            {searchResults.products.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('products')} ({searchResults.products.length})</p>
                </div>
                {searchResults.products.map((p) => (
                  <Link
                    key={p.id}
                    to="/admin/categories"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition border-b border-slate-50 last:border-0"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                      <p className="text-xs text-slate-500 truncate">{p.categoryName}</p>
                    </div>
                    {p.marketPrice != null && (
                      <span className="text-xs font-bold text-slate-600 shrink-0">{p.marketPrice} EGP</span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
