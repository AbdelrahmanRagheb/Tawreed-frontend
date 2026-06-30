import { useState, useEffect, useCallback } from 'react';
import { Search, Edit3, Trash2, AlertTriangle, X, Layers, Save, Plus, ChevronDown, ChevronUp, Package, ShoppingBag, Tags, Loader2 } from 'lucide-react';
import { useLanguage, getUnitDisplay, toArabicNumeral } from '../../i18n';
import { publicService, type PublicProduct, type PublicCategory } from '../../services/public.service';
import { supplierService, type SupplierProductListItem, type PricingTier, type CreatePricingTierRequest, type UpdatePricingTierRequest } from '../../services/supplier.service';

type Tab = 'mine' | 'browse' | 'categories';

const emptyTierForm: CreatePricingTierRequest = { minQty: 1, maxQty: null, unitPrice: 0 };

export function SupplierProducts() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<Tab>('mine');

  const [catalogProducts, setCatalogProducts] = useState<PublicProduct[]>([]);
  const [supplierProducts, setSupplierProducts] = useState<SupplierProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add modal
  const [addModalProduct, setAddModalProduct] = useState<PublicProduct | null>(null);
  const [addForm, setAddForm] = useState({ price: 0, stock: 0 });
  const [addTiers, setAddTiers] = useState<{ minQty: number; maxQty: number | null; unitPrice: number }[]>([]);

  // Detail modal
  const [detailProduct, setDetailProduct] = useState<SupplierProductListItem | null>(null);
  const [detailForm, setDetailForm] = useState({ price: 0, stock: 0, isActive: true });

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<SupplierProductListItem | null>(null);

  // Tier state (inside detail modal)
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [tiersLoading, setTiersLoading] = useState(false);
  const [tierForm, setTierForm] = useState<CreatePricingTierRequest>(emptyTierForm);
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [tierError, setTierError] = useState('');
  const [tiersExpanded, setTiersExpanded] = useState(false);

  // Categories state
  const [allCategories, setAllCategories] = useState<PublicCategory[]>([]);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [savingCategory, setSavingCategory] = useState<string | null>(null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [joinPrompt, setJoinPrompt] = useState<{product: PublicProduct; categoryName: string} | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [catRes, supRes] = await Promise.all([
        publicService.listProducts(),
        supplierService.listProducts(),
      ]);
      setCatalogProducts(catRes.data);
      setSupplierProducts(supRes.data);
      if (supRes.data.length === 0) setTab('browse');
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const loadCategories = useCallback(async () => {
    const [catRes, idsRes] = await Promise.all([
      publicService.listCategories().catch(() => ({ data: [] as PublicCategory[] })),
      supplierService.getCategoryIds().catch(() => ({ data: [] as string[] })),
    ]);
    setAllCategories(catRes.data);
    setCategoryIds(idsRes.data);
    setCategoriesLoading(false);
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  const supplierByProductId = new Map<string, SupplierProductListItem>();
  supplierProducts.forEach(sp => supplierByProductId.set(sp.productId, sp));

  const ownedProducts = supplierProducts;
  const unownedProducts = catalogProducts.filter(cat => !supplierByProductId.has(cat.id));

  const unownedInCategories = unownedProducts.filter(p => categoryIds.includes(p.categoryId));
  const unownedOutsideCategories = unownedProducts.filter(p => !categoryIds.includes(p.categoryId));
  const browseProducts = showAllProducts ? unownedProducts : unownedInCategories;
  const filteredBrowseProducts = browseProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOwned = ownedProducts.filter(sp =>
    sp.productName.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCategories = allCategories.filter(c =>
    (language === 'ar' ? c.nameAr : c.nameEn).toLowerCase().includes(search.toLowerCase())
  );

  const toggleCategory = async (id: string) => {
    const updated = categoryIds.includes(id)
      ? categoryIds.filter((c) => c !== id)
      : [...categoryIds, id];
    setCategoryIds(updated);
    setSavingCategory(id);
    try {
      await supplierService.updateCategories(updated);
    } catch {
      setCategoryIds(categoryIds);
    } finally {
      setSavingCategory(null);
    }
  };

  const closeAll = () => {
    setAddModalProduct(null);
    setDetailProduct(null);
    setDeleteTarget(null);
    setJoinPrompt(null);
  };

  const handleJoinAndAdd = async () => {
    if (!joinPrompt) return;
    const { product } = joinPrompt;
    const updated = [...categoryIds, product.categoryId];
    setCategoryIds(updated);
    try {
      await supplierService.updateCategories(updated);
      setJoinPrompt(null);
      openAdd(product);
    } catch {
      setCategoryIds(categoryIds);
    }
  };

  // --- Add logic ---
  const openAdd = (cat: PublicProduct) => {
    setAddModalProduct(cat);
    setAddForm({ price: 0, stock: 0 });
    setAddTiers([]);
  };

  const handleAdd = async () => {
    if (!addModalProduct) return;
    try {
      await supplierService.addProduct({
        productId: addModalProduct.id,
        price: addForm.price,
        stock: addForm.stock,
        tiers: addTiers.length > 0 ? addTiers : undefined,
      });
      closeAll();
      loadData();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to add product');
    }
  };

  // --- Detail logic ---
  const openDetail = (sp: SupplierProductListItem) => {
    setDetailProduct(sp);
    setDetailForm({ price: sp.price, stock: sp.stock, isActive: sp.isActive });
    setTierForm(emptyTierForm);
    setEditingTierId(null);
    setTierError('');
    setTiersExpanded(false);
    loadTiers(sp.id);
  };

  const handleSaveDetail = async () => {
    if (!detailProduct) return;
    try {
      const res = await supplierService.updateProduct(detailProduct.id, {
        price: detailForm.price,
        stock: detailForm.stock,
        isActive: detailForm.isActive,
      });
      const updated = res.data as SupplierProductListItem;
      setDetailProduct(updated);
      setSupplierProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to update product');
    }
  };

  // --- Delete logic ---
  const openDelete = (sp: SupplierProductListItem) => {
    setDeleteTarget(sp);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await supplierService.removeProduct(deleteTarget.id);
      closeAll();
      loadData();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to remove product');
    }
  };

  // --- Tier logic (inside detail modal) ---
  const loadTiers = useCallback(async (supplierProductId: string) => {
    setTiersLoading(true);
    setTierError('');
    try {
      const res = await supplierService.getTiers(supplierProductId);
      setTiers(res.data);
    } catch {
      setTierError('Failed to load pricing tiers');
    } finally {
      setTiersLoading(false);
    }
  }, []);

  const handleSaveTier = async () => {
    if (!detailProduct) return;
    setTierError('');
    try {
      if (editingTierId) {
        await supplierService.updateTier(detailProduct.id, editingTierId, tierForm);
      } else {
        await supplierService.createTier(detailProduct.id, tierForm);
      }
      setTierForm(emptyTierForm);
      setEditingTierId(null);
      loadTiers(detailProduct.id);
    } catch (err: any) {
      setTierError(err?.response?.data?.error || 'Failed to save pricing tier');
    }
  };

  const handleEditTier = (tier: PricingTier) => {
    setTierForm({ minQty: tier.minQty, maxQty: tier.maxQty, unitPrice: tier.unitPrice });
    setEditingTierId(tier.id);
  };

  const handleDeleteTier = async (tierId: string) => {
    if (!detailProduct) return;
    setTierError('');
    try {
      await supplierService.deleteTier(detailProduct.id, tierId);
      loadTiers(detailProduct.id);
    } catch (err: any) {
      setTierError(err?.response?.data?.error || 'Failed to delete pricing tier');
    }
  };

  // --- Render ---
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {error && (
        <div className="mb-4 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {error}
          <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('productsManagement')}</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-slate-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('mine')}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            tab === 'mine'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Package className="w-4 h-4" />
          {t('yourProducts')}
          {ownedProducts.length > 0 && (
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
              tab === 'mine' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
            }`}>
              {toArabicNumeral(String(ownedProducts.length), language)}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('browse')}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            tab === 'browse'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          {t('browseCatalog')}
          {unownedProducts.length > 0 && (
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
              tab === 'browse' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
            }`}>
              {toArabicNumeral(String(unownedProducts.length), language)}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('categories')}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            tab === 'categories'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Tags className="w-4 h-4" />
          {t('categories')}
          {categoryIds.length > 0 && (
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
              tab === 'categories' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
            }`}>
              {toArabicNumeral(String(categoryIds.length), language)}
            </span>
          )}
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={tab === 'mine' ? t('searchYourProducts') : tab === 'categories' ? t('searchCategories') : t('searchProducts')}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tab === 'mine' ? (
        /* ───── My Products Table ───── */
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
                {filteredOwned.map((sp) => {
                  const isLowStock = sp.stock < 100;
                  return (
                    <tr key={sp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
                            {sp.productName.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-slate-900">{sp.productName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{sp.categoryName}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${isLowStock ? 'text-amber-600' : 'text-slate-900'}`}>
                            {toArabicNumeral(String(sp.stock), language)} {getUnitDisplay(sp.unit, language)}
                          </span>
                          {isLowStock && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{toArabicNumeral(String(sp.price), language)} {t('currency')}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          sp.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {sp.isActive ? t('active') : t('inactive')}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-end">
                        <button
                          onClick={() => openDetail(sp)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          {t('details')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredOwned.length === 0 && (
            <div className="px-5 py-12 text-center">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">{search ? t('noProductsFound') : t('noProductsYet')}</p>
              {!search && (
                <button
                  onClick={() => setTab('browse')}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {t('browseCatalog')}
                </button>
              )}
            </div>
          )}
        </div>
      ) : tab === 'categories' ? (
        /* ───── Categories ───── */
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          {categoriesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div>
              <p className="text-sm text-slate-600 mb-4">{t('categoriesConfigured')}: {toArabicNumeral(String(categoryIds.length), language)}</p>
              <div className="flex flex-wrap gap-2">
                {allCategories.length === 0 ? (
                  <p className="text-sm text-slate-400 w-full">{t('noCategories')}</p>
                ) : filteredCategories.length === 0 ? (
                  <p className="text-sm text-slate-400 w-full">{t('noResults')}</p>
                ) : (
                  filteredCategories.map((c) => {
                    const selected = categoryIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleCategory(c.id)}
                        disabled={savingCategory === c.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all disabled:opacity-50 ${
                          selected
                            ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        {savingCategory === c.id && <Loader2 className="w-3 h-3 animate-spin" />}
                        {language === 'ar' ? c.nameAr : c.nameEn}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ───── Browse Catalog ───── */
        <div>
          {/* Toggle */}
          {categoryIds.length > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setShowAllProducts(!showAllProducts)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                  showAllProducts ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  showAllProducts ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
              <span className="text-sm text-slate-600">{t('showAllProducts')}</span>
            </div>
          )}

          {/* No categories selected */}
          {!showAllProducts && categoryIds.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <Tags className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">{t('selectCategoriesFirst')}</p>
              <button
                onClick={() => setTab('categories')}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Tags className="w-4 h-4" />
                {t('categories')}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('product')}</th>
                      <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('category')}</th>
                      <th className="text-end px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBrowseProducts.map((cat) => {
                      const inCategory = categoryIds.includes(cat.categoryId);
                      return (
                        <tr key={cat.id} className={`transition-colors ${!inCategory ? 'bg-amber-50/40' : 'hover:bg-slate-50'}`}>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-50 to-slate-100 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0">
                                {cat.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-medium text-slate-900">{cat.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-sm">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-slate-600">{cat.categoryName}</span>
                              {!inCategory && (
                                <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-200 whitespace-nowrap">
                                  {t('notInYourCategories')}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-end">
                            {inCategory ? (
                              <button
                                onClick={() => openAdd(cat)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                                {t('add')}
                              </button>
                            ) : (
                              <button
                                onClick={() => setJoinPrompt({ product: cat, categoryName: cat.categoryName })}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                                {t('add')}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredBrowseProducts.length === 0 && (
                <div className="px-5 py-12 text-center">
                  <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">{t('noProductsInCatalog')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ───── Join Category Prompt ───── */}
      {joinPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30" onClick={closeAll}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Tags className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{t('categories')}</h2>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              {language === 'ar'
                ? `هذا المنتج ضمن ${joinPrompt.categoryName}. هل تريد إضافة هذا التصنيف لحسابك؟`
                : `This product is in ${joinPrompt.categoryName}. Add this category to your profile?`
              }
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={closeAll}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleJoinAndAdd}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {t('addCategoryAndContinue')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───── Add Modal ───── */}
      {addModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30" onClick={closeAll}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h2 className="text-lg font-bold text-slate-900">{t('addToMyProducts')}</h2>
              <button onClick={closeAll} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-semibold text-slate-900">{addModalProduct.name}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {addModalProduct.categoryName} &middot; {getUnitDisplay(addModalProduct.unit, language)}
                </p>
                {addModalProduct.description && (
                  <p className="text-xs text-slate-500 mt-2">{addModalProduct.description}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{t('price')} ({t('currency')})</label>
                  <input type="number" min="0" step="0.01" value={addForm.price || ''}
                    onChange={(e) => setAddForm({ ...addForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{t('stock')}</label>
                  <input type="number" min="0" value={addForm.stock || ''}
                    onChange={(e) => setAddForm({ ...addForm, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              {/* Pricing Tiers (optional) */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setAddTiers(addTiers.length === 0 ? [{ minQty: 1, maxQty: null, unitPrice: addForm.price }] : [])}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-semibold text-slate-900">{t('pricingTiers')}</span>
                    {addTiers.length > 0 && (
                      <span className="text-[11px] text-slate-500">({toArabicNumeral(String(addTiers.length), language)})</span>
                    )}
                  </div>
                  {addTiers.length > 0 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {addTiers.length > 0 && (
                  <div className="px-4 pb-4 space-y-2">
                    {addTiers.map((tier, i) => (
                      <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                        <div className="flex-1 grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] font-medium text-slate-500 mb-0.5">{t('minQty')}</label>
                            <input type="number" min="0" value={tier.minQty}
                              onChange={(e) => {
                                const next = [...addTiers];
                                next[i] = { ...next[i], minQty: parseInt(e.target.value) || 0 };
                                setAddTiers(next);
                              }}
                              className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-amber-500" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-medium text-slate-500 mb-0.5">{t('maxQty')}</label>
                            <input type="number" min="0" placeholder="∞"
                              value={tier.maxQty ?? ''}
                              onChange={(e) => {
                                const next = [...addTiers];
                                next[i] = { ...next[i], maxQty: e.target.value ? parseInt(e.target.value) : null };
                                setAddTiers(next);
                              }}
                              className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-amber-500" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-medium text-slate-500 mb-0.5">{t('unitPrice')}</label>
                            <input type="number" min="0" step="0.01" value={tier.unitPrice || ''}
                              onChange={(e) => {
                                const next = [...addTiers];
                                next[i] = { ...next[i], unitPrice: parseFloat(e.target.value) || 0 };
                                setAddTiers(next);
                              }}
                              className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-amber-500" />
                          </div>
                        </div>
                        <button
                          onClick={() => setAddTiers(prev => prev.filter((_, j) => j !== i))}
                          className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const last = addTiers[addTiers.length - 1];
                        const nextMin = last.maxQty != null ? last.maxQty + 1 : last.minQty + 1;
                        setAddTiers(prev => [...prev, { minQty: nextMin, maxQty: null, unitPrice: addForm.price }]);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      {t('addTier')}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 shrink-0">
              <button onClick={closeAll} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">{t('cancel')}</button>
              <button onClick={handleAdd} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">{t('add')}</button>
            </div>
          </div>
        </div>
      )}

      {/* ───── Detail Modal ───── */}
      {detailProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30" onClick={closeAll}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{t('productDetails')}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{detailProduct.productName}</p>
              </div>
              <button onClick={closeAll} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('productInfo')}</h3>
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center text-lg font-bold text-indigo-400 shrink-0">
                    {detailProduct.productName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{detailProduct.productName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {detailProduct.categoryName} &middot; {getUnitDisplay(detailProduct.unit, language)}
                    </p>
                    {detailProduct.description && (
                      <p className="text-xs text-slate-500 mt-1">{detailProduct.description}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('yourPricing')}</h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">{t('price')} ({t('currency')})</label>
                    <input type="number" min="0" step="0.01" value={detailForm.price || ''}
                      onChange={(e) => setDetailForm({ ...detailForm, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">{t('stock')}</label>
                    <input type="number" min="0" value={detailForm.stock || ''}
                      onChange={(e) => setDetailForm({ ...detailForm, stock: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">{t('status')}</label>
                    <select value={detailForm.isActive ? 'active' : 'inactive'}
                      onChange={(e) => setDetailForm({ ...detailForm, isActive: e.target.value === 'active' })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="active">{t('active')}</option>
                      <option value="inactive">{t('inactive')}</option>
                    </select>
                  </div>
                </div>
                <button onClick={handleSaveDetail}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                  <Save className="w-4 h-4" />
                  {t('saveChanges')}
                </button>
              </div>

              {/* Pricing Tiers */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setTiersExpanded(!tiersExpanded)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-semibold text-slate-900">{t('pricingTiers')}</span>
                    {tiers.length > 0 && (
                      <span className="text-[11px] text-slate-500">({toArabicNumeral(String(tiers.length), language)})</span>
                    )}
                  </div>
                  {tiersExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {tiersExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    {tierError && (
                      <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{tierError}</div>
                    )}

                    {tiersLoading ? (
                      <div className="flex items-center justify-center py-6">
                        <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : tiers.length === 0 && !editingTierId ? (
                      <div className="text-center py-6">
                        <Layers className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                        <p className="text-xs text-slate-500">{t('noTiersDefined')}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {tiers.map((tier) => (
                          <div key={tier.id} className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
                            <div className="flex-1 grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-[11px] text-slate-500 block">{t('minQty')}</span>
                                <span className="font-semibold text-slate-900">{toArabicNumeral(String(tier.minQty), language)}</span>
                              </div>
                              <div>
                                <span className="text-[11px] text-slate-500 block">{t('maxQty')}</span>
                                <span className="font-semibold text-slate-900">{tier.maxQty != null ? toArabicNumeral(String(tier.maxQty), language) : '∞'}</span>
                              </div>
                              <div>
                                <span className="text-[11px] text-slate-500 block">{t('unitPrice')}</span>
                                <span className="font-semibold text-slate-900">{toArabicNumeral(String(tier.unitPrice), language)} {t('currency')}</span>
                              </div>
                            </div>
                            <button onClick={() => handleEditTier(tier)} className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-100 transition-colors">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteTier(tier.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="border border-slate-200 rounded-lg p-4">
                      <h4 className="text-xs font-semibold text-slate-600 mb-3">
                        {editingTierId ? t('editTier') : t('addTier')}
                      </h4>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">{t('minQty')}</label>
                          <input type="number" min="0" value={tierForm.minQty}
                            onChange={(e) => setTierForm({ ...tierForm, minQty: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">{t('maxQty')}</label>
                          <input type="number" min="0" placeholder="∞"
                            value={tierForm.maxQty ?? ''}
                            onChange={(e) => setTierForm({ ...tierForm, maxQty: e.target.value ? parseInt(e.target.value) : null })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">{t('unitPrice')} ({t('currency')})</label>
                          <input type="number" min="0" step="0.01" value={tierForm.unitPrice || ''}
                            onChange={(e) => setTierForm({ ...tierForm, unitPrice: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        {editingTierId && (
                          <button onClick={() => { setTierForm(emptyTierForm); setEditingTierId(null); }}
                            className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                            {t('cancel')}
                          </button>
                        )}
                        <button onClick={handleSaveTier}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors">
                          <Save className="w-3 h-3" />
                          {editingTierId ? t('update') : t('add')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border border-red-200 rounded-xl p-4">
            
                <button onClick={() => openDelete(detailProduct)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <Trash2 className="w-4 h-4" />
                  {t('removeFromCatalog')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───── Delete Confirmation ───── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30" onClick={closeAll}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">{t('removeFromCatalog')}</h2>
              <p className="text-sm text-slate-500 mb-6">
                {t('deleteConfirm')} &quot;{deleteTarget.productName}&quot;?
              </p>
              <div className="flex gap-2 justify-center">
                <button onClick={closeAll} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">{t('cancel')}</button>
                <button onClick={handleDelete} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">{t('delete')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
