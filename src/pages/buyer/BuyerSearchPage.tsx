import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, X, ArrowLeft, Package, ShoppingBag } from 'lucide-react';
import { useLanguage, toArabicNumeral } from '../../i18n';
import { buyerService, type SearchResult } from '../../services/buyer.service';
import { publicService, type PublicProduct } from '../../services/public.service';

export function BuyerSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);

  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PublicProduct | null>(null);

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
      buyerService.search(searchQuery.trim())
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

  const totalResults = (searchResults?.products.length ?? 0) + (searchResults?.orders.length ?? 0);

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
            {searchResults.products.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('products')} ({searchResults.products.length})</p>
                </div>
                {searchResults.products.map((p) => (
                  <div
                    key={p.id}
                    onClick={async () => {
                      try {
                        const res = await publicService.getProduct(p.id);
                        setSelectedProduct(res.data);
                      } catch (_) {}
                    }}
                    className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition border-b border-slate-50 last:border-0 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                        <p className="text-xs text-slate-500 truncate">{p.categoryName}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#1e3a8a] shrink-0 ml-3">{toArabicNumeral(p.price.toFixed(2), language)} {t('currency')}</span>
                  </div>
                ))}
              </div>
            )}

            {searchResults.orders.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('orders')} ({searchResults.orders.length})</p>
                </div>
                {searchResults.orders.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => { navigate(`/buyer/orders/${o.id}`); }}
                    className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition border-b border-slate-50 last:border-0 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-4 h-4 text-emerald-600" />
                      </div>
                      <p className="text-sm font-semibold text-slate-800 truncate">{o.title}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ml-3 ${
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
            )}
          </div>
        )}
      </div>

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
