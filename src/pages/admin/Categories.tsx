import { useState, useEffect } from 'react';
import { Tags, Search, ToggleRight, ToggleLeft, TrendingUp, TrendingDown, Minus, Flame, Package, Store, DollarSign, ShoppingCart, X, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { adminService, type AdminCategory, type AdminCategoryDetail } from '../../services/admin.service';

export function AdminCategories() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AdminCategoryDetail | null>(null);

  useEffect(() => {
    adminService.listCategories({ page: 1, limit: 100 })
      .then((res) => setCategories(res.data.items))
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load categories'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = categories.filter((c) =>
    (language === 'ar' ? c.nameAr : c.nameEn).toLowerCase().includes(search.toLowerCase())
  );

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      if (currentActive) {
        await adminService.deactivateCategory(id);
      } else {
        await adminService.activateCategory(id);
      }
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
      );
    } catch (err: any) {
      console.error('Failed to toggle category', err);
    }
  };

  const openDetail = async (category: AdminCategory) => {
    try {
      const res = await adminService.getCategoryDetail(category.id);
      setSelectedCategory(res.data);
    } catch {
      setSelectedCategory(null);
    }
  };

  const totalCategories = categories.length;
  const activeCount = categories.filter((c) => c.isActive).length;
  const inactiveCount = categories.filter((c) => !c.isActive).length;

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
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('categories')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('categoryManagement')}</p>
        </div>
      </div>

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
          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center mb-2">
            <Package className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{categories.reduce((s, c) => s + c.productCount, 0)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('products')}</p>
        </div>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => openDetail(category)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Tags className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{language === 'ar' ? category.nameAr : category.nameEn}</h3>
                  <span className="text-[10px] text-slate-400">{language === 'en' ? category.nameAr : category.nameEn}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-slate-50 rounded-lg p-2 text-center">
                <p className="text-xs font-bold text-slate-900">{category.productCount}</p>
                <p className="text-[9px] text-slate-500">{t('products')}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2 text-center">
                <p className="text-xs font-bold text-slate-900">{category.supplierCount}</p>
                <p className="text-[9px] text-slate-500">{t('suppliers')}</p>
              </div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); toggleActive(category.id, category.isActive); }}
              className={`w-full flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                category.isActive
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {category.isActive ? <ToggleRight className="w-3 h-3" /> : <ToggleLeft className="w-3 h-3" />}
              {category.isActive ? t('active') : t('inactive')}
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-sm text-slate-500">{t('noCategoriesFound')}</div>
      )}

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
                  <h2 className="text-lg font-bold text-slate-900">{language === 'ar' ? selectedCategory.nameAr : selectedCategory.nameEn}</h2>
                  <p className="text-xs text-slate-400">{language === 'en' ? selectedCategory.nameAr : selectedCategory.nameEn}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCategory(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
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
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('categoryActions')}</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { toggleActive(selectedCategory.id, selectedCategory.isActive); setSelectedCategory(null); }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      selectedCategory.isActive
                        ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {selectedCategory.isActive ? <ToggleLeft className="w-3.5 h-3.5" /> : <ToggleRight className="w-3.5 h-3.5" />}
                    {selectedCategory.isActive ? t('deactivateCategory') : t('activateSupplier')}
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
