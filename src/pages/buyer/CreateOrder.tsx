import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search, Plus, Minus, X, ShoppingCart, Package, MapPin,
  Calendar, Clock, Users, Eye, TrendingDown, CheckCircle,
  Save, Send, FileText, Filter, ChevronDown, AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '../../i18n';
import { publicService, type PublicProduct, type PublicCategory } from '../../services/public.service';
import { buyerService, type CreateOrderRequest, type BuyerOrderListItem } from '../../services/buyer.service';
import type { SavedOrderDraft } from '../../types';

interface CartItem {
  productId: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  unit: string;
  stock: number;
}

interface SelectedProduct {
  productId: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  image: string;
  supplier: string;
}

export function CreateOrder() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const resumeDraft = (location.state as { resumeDraft?: BuyerOrderListItem })?.resumeDraft;
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [buyerRegionName, setBuyerRegionName] = useState('');
  const [buyerRegionId, setBuyerRegionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [orderName, setOrderName] = useState('');
  const [orderDescription, setOrderDescription] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [notes, setNotes] = useState('');
  const [publishing, setPublishing] = useState(false);

  const [modalProduct, setModalProduct] = useState<SelectedProduct | null>(null);
  const [modalQty, setModalQty] = useState(1);

  const [draftSaved, setDraftSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      publicService.listProducts(),
      publicService.listCategories(),
      buyerService.getProfile(),
    ])
      .then(([prodRes, catRes, profileRes]) => {
        setProducts(prodRes.data);
        setCategories(catRes.data);
        setBuyerRegionName(profileRes.data.regionName);
        setBuyerRegionId(profileRes.data.regionId);

        if (resumeDraft) {
          buyerService.getOrderDetail(resumeDraft.id).then((detailRes) => {
            const detail = detailRes.data;
            setOrderName(detail.title);
            setOrderDescription(detail.description || '');
            if (detail.deadline) {
              const d = new Date(detail.deadline);
              setDeadlineDate(d.toISOString().split('T')[0]);
              setDeadlineTime(d.toTimeString().slice(0, 5));
            }
            const items: CartItem[] = detail.products.map((p) => {
              const product = prodRes.data.find((x) => x.id === p.productId);
              return {
                productId: p.productId,
                name: p.productName,
                category: product?.categoryName || '',
                quantity: p.targetQuantity,
                price: p.unitPrice || 0,
                unit: p.unit,
                stock: product?.stock || 0,
              };
            });
            setCart(items);
          }).catch(() => {});
        }
      })
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(search.toLowerCase());
    const catMatch = !categoryFilter || p.categoryName === categoryFilter;
    return nameMatch && catMatch;
  });

  const addToCart = (productId: string, name: string, category: string, price: number, quantity: number, stock: number) => {
    if (quantity < 1) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        { productId, name, category, quantity, price, unit: 'UNIT', stock },
      ];
    });
    setModalProduct(null);
    setModalQty(1);
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const estimatedSavings = Math.round(totalCost * 0.15);
  const potentialSavings = Math.round(totalCost * 0.25);

  const isValid = orderName.trim() && deadlineDate && cart.length > 0;

  const handlePublish = async () => {
    if (!isValid) return;
    setPublishing(true);
    try {
      const data: CreateOrderRequest = {
        title: orderName,
        description: orderDescription || undefined,
        deadline: `${deadlineDate}T${deadlineTime || '23:59'}:00`,
        items: cart.map((item) => ({
          productId: item.productId,
          targetQuantity: item.quantity,
        })),
      };
      await buyerService.createOrder(data);
      navigate('/buyer/orders');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to create order');
    } finally {
      setPublishing(false);
    }
  };

  const saveAsDraft = async () => {
    try {
      const data: CreateOrderRequest = {
        title: orderName || 'Untitled Draft',
        description: orderDescription || undefined,
        deadline: `${deadlineDate}T${deadlineTime || '23:59'}:00`,
        items: cart.map((item) => ({
          productId: item.productId,
          targetQuantity: item.quantity,
        })),
      };
      await buyerService.saveDraft(data);
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 3000);
    } catch (err: any) {
      console.error('Failed to save draft', err);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('createGroupOrder')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('createGroupOrderDesc')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={saveAsDraft} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Save className="w-3.5 h-3.5" />
            {t('saveDraft')}
          </button>
          <button onClick={handlePublish} disabled={!isValid || publishing} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <Send className="w-3.5 h-3.5" />
            {publishing ? t('publishing') : t('publishOrder')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600" />
          {t('orderInformation')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('orderName')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={orderName}
              onChange={(e) => setOrderName(e.target.value)}
              placeholder={t('orderNamePlaceholder')}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('deliveryRegion')}
            </label>
            <div className="flex items-center gap-2 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              {buyerRegionName ? (language === 'ar' ? buyerRegionName : buyerRegionName) : t('loading')}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('description')}
            </label>
            <input
              type="text"
              value={orderDescription}
              onChange={(e) => setOrderDescription(e.target.value)}
              placeholder={t('descriptionPlaceholder')}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('participationDeadline')} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="time"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('visibility')}
            </label>
            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === 'public'}
                  onChange={() => setVisibility('public')}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="text-sm text-slate-700">{t('public')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === 'private'}
                  onChange={() => setVisibility('private')}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="text-sm text-slate-700">{t('private')}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchProducts')}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">{t('allCategories')}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={language === 'ar' ? cat.nameAr : cat.nameEn}>
                  {language === 'ar' ? cat.nameAr : cat.nameEn}
                </option>
              ))}
            </select>
            <span className="text-xs text-slate-400">{t('availability')}: {t('inStock')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-32 overflow-hidden bg-slate-100">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3.5">
                  <h3 className="text-sm font-semibold text-slate-900 truncate">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span>{t('category')}: {product.categoryName}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-lg font-bold text-slate-900">{product.price} EGP</p>
                      <p className="text-[11px] text-slate-500">{language === 'en' ? '/ unit' : '/ وحدة'}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {product.stock > 0 ? t('inStock') : t('outOfStock')}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setModalProduct({
                        productId: product.id,
                        name: product.name,
                        category: product.categoryName,
                        price: product.price,
                        unit: product.unit || 'UNIT',
                        stock: product.stock,
                        image: product.imageUrl,
                        supplier: product.categoryName,
                      });
                      setModalQty(1);
                    }}
                    className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {t('addProduct')}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">{t('noProductsFound')}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="space-y-4 sticky top-8">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-indigo-600" />
                  {t('groupOrderSummary')}
                </h2>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
                  {cart.length} {t('productsAdded')}
                </span>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">{t('cartEmpty')}</p>
                  <p className="text-xs text-slate-400 mt-1">{t('addProducts')}</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.productId} className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-medium text-slate-900 truncate flex-1">{item.name}</p>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-0.5 hover:bg-red-100 rounded text-red-400 hover:text-red-600 transition-colors shrink-0 ml-2"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQty(item.productId, -1)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-500 hover:border-slate-300 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-slate-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.productId, 1)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-500 hover:border-slate-300 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold text-slate-900">{item.price * item.quantity} EGP</span>
                          <p className="text-[10px] text-slate-400">{item.price} EGP × {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('orderStatistics')}</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[11px] text-slate-500">{t('products')}</p>
                  <p className="text-lg font-bold text-slate-900">{cart.length}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">{t('totalQuantity')}</p>
                  <p className="text-lg font-bold text-slate-900">{totalQuantity}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">{t('estimatedCost')}</p>
                  <p className="text-lg font-bold text-slate-900">{totalCost.toLocaleString()} EGP</p>
                </div>
              </div>
            </div>

            {cart.length > 0 && (
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-50/30 rounded-xl border border-emerald-200 p-5">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                  {t('estimatedSavings')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-slate-500">{t('currentSavings')}</p>
                    <p className="text-lg font-bold text-emerald-600">{estimatedSavings.toLocaleString()} EGP</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500">{t('potentialSavings')}</p>
                    <p className="text-lg font-bold text-emerald-700">{potentialSavings.toLocaleString()} EGP</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('additionalNotes')}</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('notesPlaceholder')}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('reviewChecklist')}</h3>
              <div className="space-y-2">
                {[
                  { label: t('orderName'), valid: !!orderName.trim() },
                  { label: t('region'), valid: !!buyerRegionName },
                  { label: t('deadline'), valid: !!deadlineDate },
                  { label: t('productsAdded'), valid: cart.length > 0 },
                  { label: t('quantitiesValid'), valid: cart.every((item) => item.quantity > 0) },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <CheckCircle className={`w-4 h-4 ${item.valid ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <span className={`text-xs ${item.valid ? 'text-slate-700' : 'text-slate-400'}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <button
                onClick={handlePublish}
                disabled={!isValid || publishing}
                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
                {publishing ? t('publishing') : t('publishGroupOrder')}
              </button>
              <div className="flex gap-2 mt-2">
                <button onClick={saveAsDraft} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
                  <Save className="w-3.5 h-3.5" />
                  {t('saveDraft')}
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                  {t('preview')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {draftSaved && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2 animate-pulse">
          <CheckCircle className="w-4 h-4" />
          {t('draftSaved')}
        </div>
      )}

      {modalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setModalProduct(null)}>
          <div
            className="bg-white rounded-xl w-full max-w-sm mx-4 overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-40 overflow-hidden bg-slate-100">
              <img src={modalProduct.image} alt={modalProduct.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-slate-900">{modalProduct.name}</h3>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                <span>{t('category')}: {modalProduct.category}</span>
                {modalProduct.supplier && <span>{t('supplier')}: {modalProduct.supplier}</span>}
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-sm text-slate-500">{t('currentPrice')}: <span className="font-bold text-slate-900">{modalProduct.price} EGP</span></p>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">{t('inStock')}</span>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-2">{t('desiredQuantity')}</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={modalQty}
                    onChange={(e) => setModalQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center py-2 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => setModalQty(modalQty + 1)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-500">{modalProduct.unit}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {t('subtotal')}: <span className="font-bold text-slate-700">{modalProduct.price * modalQty} EGP</span>
                </p>
              </div>

              <button
                onClick={() => addToCart(modalProduct.productId, modalProduct.name, modalProduct.category, modalProduct.price, modalQty, modalProduct.stock)}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {t('addToOrder')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
