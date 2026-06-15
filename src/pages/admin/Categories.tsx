import { useState } from 'react';
import { Tags, Plus, Search, ToggleRight, ToggleLeft, TrendingUp, TrendingDown, Minus, Flame, Package, Store, DollarSign, ShoppingCart, X, Eye, Activity, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { mockCategoryEntries } from '../../data';
import { CategoryEntry } from '../../types';

const trendIcons: Record<string, typeof Flame> = {
  hot: Flame,
  growing: TrendingUp,
  stable: Minus,
  declining: TrendingDown,
};

const trendColors: Record<string, string> = {
  hot: 'text-orange-600 bg-orange-100',
  growing: 'text-emerald-600 bg-emerald-100',
  stable: 'text-slate-600 bg-slate-100',
  declining: 'text-red-600 bg-red-100',
};

export function AdminCategories() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState(mockCategoryEntries);
  const [selectedCategory, setSelectedCategory] = useState<CategoryEntry | null>(null);

  const filtered = categories.filter((c) =>
    c.name[language].toLowerCase().includes(search.toLowerCase())
  );

  const toggleActive = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const totalCategories = categories.length;
  const activeCount = categories.filter((c) => c.active).length;
  const inactiveCount = categories.filter((c) => !c.active).length;
  const hotCount = categories.filter((c) => c.trend === 'hot').length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('categories')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('categoryManagement')}</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" />
          {t('addCategory')}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center mb-2">
            <Tags className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{totalCategories}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('totalCategories')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center mb-2">
            <ToggleRight className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{activeCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('active')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center mb-2">
            <ToggleLeft className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-xl font-bold text-slate-900">{inactiveCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('inactive')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center mb-2">
            <Flame className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{hotCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('hotCategories')}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchCategories')}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((category) => {
          const TrendIcon = trendIcons[category.trend] || Minus;
          return (
            <div
              key={category.id}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Tags className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{category.name[language]}</h3>
                    <span className="text-[10px] text-slate-400">{category.name[language === 'en' ? 'ar' : 'en']}</span>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${trendColors[category.trend]}`}>
                  <TrendIcon className="w-3 h-3" />
                  {t(category.trend)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                  <p className="text-xs font-bold text-slate-900">{category.productCount}</p>
                  <p className="text-[9px] text-slate-500">{t('products')}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                  <p className="text-xs font-bold text-slate-900">{category.supplierCount}</p>
                  <p className="text-[9px] text-slate-500">{t('suppliers')}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                  <p className="text-xs font-bold text-slate-900">{category.monthlyOrders.toLocaleString()}</p>
                  <p className="text-[9px] text-slate-500">{t('monthlyOrdersLabel')}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <DollarSign className="w-3 h-3 text-emerald-500" />
                  <span className="font-semibold text-slate-700">SAR {category.revenue.toLocaleString()}</span>
                  <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${category.growth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {category.growth >= 0 ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                    {Math.abs(category.growth)}%
                  </span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleActive(category.id); }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                    category.active
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {category.active ? <ToggleRight className="w-3 h-3" /> : <ToggleLeft className="w-3 h-3" />}
                  {category.active ? t('active') : t('inactive')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-sm text-slate-500">{t('noCategoriesFound') || 'No categories found'}</div>
      )}

      {/* Category Detail Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCategory(null)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Tags className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedCategory.name[language]}</h2>
                  <p className="text-xs text-slate-400">{selectedCategory.name[language === 'en' ? 'ar' : 'en']}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCategory(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Section 1: Overview */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('categoryOverview')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                      <Package className="w-4 h-4 text-indigo-400" />
                      <span>{t('products')}</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900">{selectedCategory.productCount}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                      <Store className="w-4 h-4 text-indigo-400" />
                      <span>{t('suppliers')}</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900">{selectedCategory.supplierCount}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                      <ShoppingCart className="w-4 h-4 text-indigo-400" />
                      <span>{t('monthlyOrdersLabel')}</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900">{selectedCategory.monthlyOrders.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span>{t('revenueGenerated')}</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900">SAR {selectedCategory.revenue.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 text-sm">
                  <span className="text-slate-500">{t('growth')}:</span>
                  <span className={`inline-flex items-center gap-1 font-bold ${selectedCategory.growth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {selectedCategory.growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {selectedCategory.growth >= 0 ? '+' : ''}{selectedCategory.growth}%
                  </span>
                  {(() => {
                    const TrendIcon = trendIcons[selectedCategory.trend] || Minus;
                    return (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${trendColors[selectedCategory.trend]}`}>
                        <TrendIcon className="w-3 h-3" />
                        {t(selectedCategory.trend)}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Section 2: Top Products */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('topProductsTitle')}</h3>
                <div className="space-y-1.5">
                  {selectedCategory.topProducts.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">{idx + 1}</span>
                        <span className="text-sm font-medium text-slate-700">{p.name}</span>
                      </div>
                      <span className="text-xs text-slate-500">{p.orders} {t('orders')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Suppliers in Category */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('suppliersInCategory')}</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <div className="w-8 h-8 mx-auto rounded-lg bg-blue-100 flex items-center justify-center mb-1">
                      <Store className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">{selectedCategory.supplierBreakdown.large}</p>
                    <p className="text-[10px] text-slate-500">{t('large')}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <div className="w-8 h-8 mx-auto rounded-lg bg-amber-100 flex items-center justify-center mb-1">
                      <Store className="w-4 h-4 text-amber-600" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">{selectedCategory.supplierBreakdown.medium}</p>
                    <p className="text-[10px] text-slate-500">{t('medium')}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <div className="w-8 h-8 mx-auto rounded-lg bg-slate-100 flex items-center justify-center mb-1">
                      <Store className="w-4 h-4 text-slate-500" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">{selectedCategory.supplierBreakdown.small}</p>
                    <p className="text-[10px] text-slate-500">{t('small')}</p>
                  </div>
                </div>
              </div>

              {/* Section 4: Order Trends */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('orderTrends')}</h3>
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500">{t('monthlyOrdersLabel')}</span>
                    <span className="text-lg font-black text-slate-900">{selectedCategory.monthlyOrders.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600" style={{ width: `${Math.min(100, (selectedCategory.monthlyOrders / 1500) * 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {selectedCategory.growth >= 0
                      ? `${t('growth')}: +${selectedCategory.growth}% ${t('growing')}`
                      : `${t('growth')}: ${selectedCategory.growth}% ${t('declining')}`}
                  </p>
                </div>
              </div>

              {/* Section 5: Actions */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('categoryActions')}</h3>
                <div className="flex flex-wrap gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors">
                    <Eye className="w-3.5 h-3.5" /> {t('editCategory')}
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">
                    <Package className="w-3.5 h-3.5" /> {t('addProductToCategory')}
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">
                    <ChevronRight className="w-3.5 h-3.5" /> {t('reassignProducts')}
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">
                    <Activity className="w-3.5 h-3.5" /> {t('mergeCategory')}
                  </button>
                  <button
                    onClick={() => { toggleActive(selectedCategory.id); setSelectedCategory(null); }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors"
                  >
                    {selectedCategory.active ? <ToggleLeft className="w-3.5 h-3.5" /> : <ToggleRight className="w-3.5 h-3.5" />}
                    {selectedCategory.active ? t('deactivateCategory') : t('activateSupplier')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}