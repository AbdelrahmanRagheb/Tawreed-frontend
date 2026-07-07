import { useState, useEffect } from 'react';
import { Tags, Search, ToggleRight, ToggleLeft, TrendingUp, TrendingDown, Minus, Flame, Package, Store, DollarSign, ShoppingCart, X, AlertTriangle, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useLanguage, toArabicNumeral } from '../../i18n';
import { adminService, type AdminCategory, type AdminCategoryDetail } from '../../services/admin.service';

export function AdminCategories() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AdminCategoryDetail | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminCategoryDetail | null>(null);
  const [formNameAr, setFormNameAr] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formSortOrder, setFormSortOrder] = useState(0);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    adminService.listCategories()
      .then(res => setCategories(res.data.items || []))
      .catch(() => setError('Failed to load categories'))
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryClick = async (cat: AdminCategory) => {
    try {
      const res = await adminService.getCategoryDetail(cat.id);
      setSelectedCategory(res.data);
    } catch {
      setError('Failed to load category details');
    }
  };

  const openCreateModal = () => {
    setEditTarget(null);
    setFormNameAr('');
    setFormNameEn('');
    setFormSortOrder(0);
    setFormError('');
    setShowForm(true);
  };

  const openEditModal = () => {
    if (!selectedCategory) return;
    setEditTarget(selectedCategory);
    setFormNameAr(selectedCategory.nameAr);
    setFormNameEn(selectedCategory.nameEn);
    setFormSortOrder(selectedCategory.sortOrder);
    setFormError('');
    setShowForm(true);
    setSelectedCategory(null);
  };

  const handleFormSubmit = async () => {
    setFormLoading(true);
    setFormError('');
    try {
      if (editTarget) {
        await adminService.updateCategory(editTarget.id, { nameAr: formNameAr, nameEn: formNameEn, sortOrder: formSortOrder });
      } else {
        await adminService.createCategory({ nameAr: formNameAr, nameEn: formNameEn, sortOrder: formSortOrder });
      }
      setShowForm(false);
      setEditTarget(null);
      const res = await adminService.listCategories();
      setCategories(res.data.items || []);
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'Failed to save category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await adminService.deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      const res = await adminService.listCategories();
      setCategories(res.data.items || []);
    } catch {
      setError('Failed to delete category');
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleActive = async (cat: AdminCategory) => {
    try {
      if (cat.isActive) {
        await adminService.deactivateCategory(cat.id);
      } else {
        await adminService.activateCategory(cat.id);
      }
      const res = await adminService.listCategories();
      setCategories(res.data.items || []);
    } catch {
      setError('Failed to toggle category');
    }
  };

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('categories')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('categoryManagement')}</p>
        </div>
        <button onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors">
          <Plus className="w-3.5 h-3.5" /> {t('addCategory')}
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchCategories')}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">{t('name')}</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">{language === 'ar' ? 'الاسم بالعربية' : 'Arabic Name'}</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500">{t('status')}</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500">{t('sortOrder')}</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {categories
                .filter(c => search ? c.nameEn.toLowerCase().includes(search.toLowerCase()) || c.nameAr.includes(search) : true)
                .map(cat => (
                  <tr key={cat.id} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer" onClick={() => handleCategoryClick(cat)}>
                    <td className="py-3 px-4">
                      <span className="text-slate-800 font-medium text-xs">{cat.nameEn}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-600 text-xs">{cat.nameAr}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        cat.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {cat.isActive ? t('active') : t('inactive')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-xs text-slate-600">{toArabicNumeral(String(cat.sortOrder), language)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={(e) => { e.stopPropagation(); toggleActive(cat); }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            cat.isActive ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
                          }`}>
                          {cat.isActive ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-sm text-slate-500">{t('noCategories')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto bottom-16 md:bottom-0" onClick={() => setSelectedCategory(null)}>
          <div className="fixed inset-0 bg-black/30 bottom-16 md:bottom-0" />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Tags className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{language === 'ar' ? selectedCategory.nameAr : selectedCategory.nameEn}</h2>
                    <p className="text-xs text-slate-500">{t('categoryDetail')}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCategory(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">{t('nameEn')}</p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">{selectedCategory.nameEn}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">{t('nameAr')}</p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">{selectedCategory.nameAr}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">{t('sortOrder')}</p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">{selectedCategory.sortOrder}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">{t('status')}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${
                      selectedCategory.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {selectedCategory.isActive ? t('active') : t('inactive')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-lg bg-slate-50">
                    <Package className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-slate-900">{toArabicNumeral(String(selectedCategory.productCount), language)}</p>
                    <p className="text-[11px] text-slate-500">{t('products')}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-slate-50">
                    <Store className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-slate-900">{toArabicNumeral(String(selectedCategory.supplierCount), language)}</p>
                    <p className="text-[11px] text-slate-500">{t('suppliers')}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-slate-50">
                    <Tags className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-slate-900">{selectedCategory.parentId ? '-' : toArabicNumeral('0', language)}</p>
                    <p className="text-[11px] text-slate-500">{t('subcategories')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button onClick={openEditModal}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100">
                    <Pencil className="w-3.5 h-3.5" /> {t('editCategory')}
                  </button>
                  <button onClick={() => setDeleteTarget(selectedCategory)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors bg-red-50 text-red-700 border border-red-200 hover:bg-red-100">
                    <Trash2 className="w-3.5 h-3.5" /> {t('deleteCategory')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bottom-16 md:bottom-0" onClick={() => { if (!formLoading) { setShowForm(false); setEditTarget(null); } }}>
          <div className="fixed inset-0 bg-black/30 bottom-16 md:bottom-0" />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  {editTarget ? <Pencil className="w-5 h-5 text-indigo-600" /> : <Plus className="w-5 h-5 text-indigo-600" />}
                </div>
                <h2 className="text-lg font-bold text-slate-900">{editTarget ? t('editCategory') : t('addCategory')}</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Name (Arabic) *</label>
                  <input type="text" value={formNameAr} onChange={(e) => setFormNameAr(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Name (English) *</label>
                  <input type="text" value={formNameEn} onChange={(e) => setFormNameEn(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Sort Order</label>
                  <input type="number" value={formSortOrder} onChange={(e) => setFormSortOrder(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                {formError && <p className="text-xs text-red-600">{formError}</p>}

                <div className="flex gap-2 justify-end pt-2">
                  <button onClick={() => { setShowForm(false); setEditTarget(null); }}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                    {t('cancel')}
                  </button>
                  <button onClick={handleFormSubmit} disabled={formLoading}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50">
                    {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {t('save')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto bottom-16 md:bottom-0" onClick={() => setDeleteTarget(null)}>
          <div className="fixed inset-0 bg-black/30 bottom-16 md:bottom-0" />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{t('deleteCategory')}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{t('deleteConfirm')}</p>
                </div>
              </div>

              <p className="text-sm text-slate-700 mb-2">
                {language === 'ar' ? deleteTarget.nameAr : deleteTarget.nameEn}
              </p>
              <p className="text-xs text-slate-500 mb-4">
                {t('deleteWarning')}
              </p>

              <div className="flex gap-2 justify-end">
                <button onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                  {t('cancel')}
                </button>
                <button onClick={handleDelete} disabled={deleteLoading}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50">
                  {deleteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t('delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
