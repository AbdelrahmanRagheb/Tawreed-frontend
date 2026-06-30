import { useEffect, useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { useLanguage, getUnitDisplay, toArabicNumeral } from '../../i18n';
import { supplierService, type SupplierProductListItem } from '../../services/supplier.service';

export function SupplierInventory() {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState<SupplierProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');

  useEffect(() => {
    supplierService.listProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const nameMatch = (p.productName || '').toLowerCase().includes(search.toLowerCase());
    if (!nameMatch) return false;
    if (filter === 'low') return p.stock < 100;
    if (filter === 'out') return p.stock === 0;
    return true;
  });

  const criticalCount = products.filter((p) => p.stock < 50).length;
  const lowCount = products.filter((p) => p.stock >= 50 && p.stock < 100).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('inventory')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('inventoryDesc')}</p>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-2xl font-bold text-slate-900">{toArabicNumeral(String(products.length), language)}</p>
          <p className="text-xs text-slate-500 mt-1">{t('totalProducts')}</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-amber-700">{toArabicNumeral(String(lowCount + criticalCount), language)}</p>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xs text-amber-700 mt-1">{t('lowStock')}</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-red-700">{toArabicNumeral(String(criticalCount), language)}</p>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-xs text-red-700 mt-1">{t('criticalStock')}</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchProducts')}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-1">
          {(['all', 'low', 'out'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                filter === f
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f === 'all' ? t('all') : f === 'low' ? t('lowStock') : t('outOfStock')}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('product')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('stock')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('price')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((product) => {
                const unit = product.unit || 'UNIT';
                const stockStatus = product.stock === 0 ? 'out' : product.stock < 50 ? 'critical' : product.stock < 100 ? 'low' : 'ok';
                const statusConfig = {
                  out: { label: t('outOfStock'), color: 'text-red-700', bg: 'bg-red-100' },
                  critical: { label: t('critical'), color: 'text-red-600', bg: 'bg-red-50' },
                  low: { label: t('low'), color: 'text-amber-600', bg: 'bg-amber-50' },
                  ok: { label: t('inStock'), color: 'text-emerald-600', bg: 'bg-emerald-50' },
                };
                const cfg = statusConfig[stockStatus];
                return (
                  <tr key={product.id} className={`hover:bg-slate-50 transition-colors ${
                    stockStatus === 'out' ? 'bg-red-50/30' : stockStatus === 'critical' ? 'bg-red-50/10' : ''
                  }`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.productName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-slate-900">{product.productName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${
                          stockStatus === 'out' ? 'text-red-600' : stockStatus === 'critical' ? 'text-red-500' : stockStatus === 'low' ? 'text-amber-600' : 'text-slate-900'
                        }`}>
                          {toArabicNumeral(String(product.stock), language)} {getUnitDisplay(unit, language)}
                        </span>
                        {(stockStatus === 'critical' || stockStatus === 'out') && (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{toArabicNumeral(String(product.price), language)} {t('currency')}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.color}`}>
                        {stockStatus === 'ok' ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            {products.length === 0 ? t('noProductsYet') : t('noProductsFound')}
          </div>
        )}
      </div>
    </div>
  );
}
