import { useState } from 'react';
import { Plus, Search, Edit3, Trash2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { mockProductList } from '../../data';

const productUnits: Record<string, string> = {
  'sp1': 'KG', 'sp2': 'KG', 'sp3': 'L', 'sp4': 'TIN',
  'sp5': 'BOX', 'sp6': 'JAR',
};

export function SupplierProducts() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');

  const filtered = mockProductList.filter((p) =>
    p.name[language].toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = mockProductList.filter((p) => p.stock < 100).length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('productsManagement')}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {mockProductList.length} {t('productsListed')}
            {lowStockCount > 0 && (
              <span className="text-amber-600 ml-2">
                &middot; {lowStockCount} {t('lowStockProducts').toLowerCase()}
              </span>
            )}
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" />
          {t('addProduct')}
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchProducts')}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('product')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('category')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('stock')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('price')}</th>
                <th className="text-center px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('status')}</th>
                <th className="text-end px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((product) => {
                const unit = productUnits[product.id] || 'UNIT';
                const isLowStock = product.stock < 100;
                return (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                          <img src={product.image} alt={product.name[language]} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm font-medium text-slate-900">{product.name[language]}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{product.category}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${isLowStock ? 'text-amber-600' : 'text-slate-900'}`}>
                          {product.stock} {unit}
                        </span>
                        {isLowStock && (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{product.price} EGP</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        product.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-end">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors" title={t('editProduct')}>
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors" title={t('deleteProduct')}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-slate-500">{t('noProductsFound')}</div>
        )}
      </div>
    </div>
  );
}
