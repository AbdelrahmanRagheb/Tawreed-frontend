import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Search, Plus, Minus, X, ShoppingCart, Package, Package2, CheckCircle, Check,
  MapPin, Calendar, Filter, AlertTriangle,
  ArrowLeft, UserPlus,
} from 'lucide-react';
import { useLanguage, getUnitDisplay, toArabicNumeral } from '../../i18n';
import { useAuth } from '../../contexts/AuthContext';
import { publicService, type PublicProduct, type PublicCategory } from '../../services/public.service';
import { buyerService, type OrderDetailResponse, type Participant, type ParticipantItem } from '../../services/buyer.service';

interface CartItem {
  productId: string;
  name: string;
  category: string;
  quantity: number;
}

export function JoinOrder() {
  const { id } = useParams<{ id: string }>();
  const { state: locationState } = useLocation();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalProduct, setModalProduct] = useState<PublicProduct | null>(null);

  const justJoined = (locationState as { joined?: boolean })?.joined === true;
  const [modalQty, setModalQty] = useState(1);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      buyerService.getOrderDetail(id),
      publicService.listProducts(),
      publicService.listCategories(),
    ])
      .then(([orderRes, prodRes, catRes]) => {
        const order = orderRes.data;
        setOrder(order);
        setProducts(prodRes.data);
        setCategories(catRes.data);
        // Initialize cart from current user's existing items
        if (order.participants && user) {
          const myParticipant = order.participants.find((p: Participant) => p.userId === user.id);
          if (myParticipant?.items.length) {
            const existingCart: CartItem[] = myParticipant.items
              .map((item: ParticipantItem) => {
                const prod = order.products.find((op) => op.groupOrderItemId === item.groupOrderItemId);
                if (!prod) return null; // skip items whose groupOrderItem can't be resolved to a product
                return {
                  productId: prod.productId,
                  name: item.productName,
                  category: '',
                  quantity: item.quantity,
                } as CartItem;
              })
              .filter((item): item is CartItem => item !== null);
            setCart(existingCart);
          }
        }
      })
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  }, [id, user]);

  const allowedCategoryIds = new Set(order?.products.map((op) => op.categoryId) ?? []);
  const orderCategories = categories.filter((cat) => allowedCategoryIds.has(cat.id));

  const filteredProducts = products.filter((p) => {
    if (!allowedCategoryIds.has(p.categoryId)) return false;
    const q = search.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(q);
    const catMatch = !categoryFilter || p.categoryName === categoryFilter;
    return nameMatch && catMatch;
  });

  const addToCart = (productId: string, name: string, category: string, quantity: number) => {
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
      return [...prev, { productId, name, category, quantity }];
    });
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

  const setCartQty = (productId: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, qty || 0) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmit = async () => {
    if (!id || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const items = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
      await buyerService.joinOrder(id, { items });
      setCart([]);
      navigate(`/buyer/orders/${id}`);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Failed to add items');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-sm text-red-600">{error}</p>
        <button onClick={() => navigate('/buyer/orders')} className="mt-4 text-indigo-600 text-sm font-semibold">
          ← {t('backToOrders')}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <button
        onClick={() => navigate(`/buyer/orders/${id}`)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('backToOrders')}
      </button>

      {order && (
        <>
          {justJoined && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-6 text-sm font-semibold text-emerald-700">
              <CheckCircle className="w-5 h-5 shrink-0" />
              {t('joinedSuccess')}
            </div>
          )}
          <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t('orderName')}</span>
                <p className="text-sm font-bold text-slate-900 mt-1">{order.title}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t('deliveryRegion')}</span>
                <p className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {order.region}
                </p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t('description')}</span>
                <p className="text-sm font-medium text-slate-700 mt-1">{order.description || '-'}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t('participationDeadline')}</span>
                <p className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(order.deadline).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                </p>
              </div>
            </div>
          </div>

        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{t('addYourProducts')}</h3>
            <p className="text-sm text-slate-500 mb-4">{t('addYourProductsDesc')}</p>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-800">
            {t('categoryRestriction')}
          </div>
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
              {orderCategories.map((cat) => (
                <option key={cat.id} value={language === 'ar' ? cat.nameAr : cat.nameEn}>
                  {language === 'ar' ? cat.nameAr : cat.nameEn}
                </option>
              ))}
            </select>
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
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-lg font-bold text-slate-900">{toArabicNumeral(String(product.marketPrice ?? 0), language)} {t('currency')}</p>
                    {order?.products.some((op) => op.productId === product.id) && (
                      <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-semibold">
                        {t('inOrder')}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setModalProduct(product);
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
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              {submitting ? t('joining') + '...' : t('updateItems')}
            </button>

            {order && (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 to-white border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Package2 className="w-4 h-4 text-indigo-600" />
                    {t('orderProducts')}
                  </h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {order.products.map((product) => {
                    const myParticipant = order.participants?.find((p) => p.userId === user?.id);
                    const myOriginalQty = myParticipant?.items.find(
                      (item) => item.groupOrderItemId === product.groupOrderItemId
                    )?.quantity ?? 0;
                    const otherQty = product.currentQuantity - myOriginalQty;
                    const myQty = cart.find((c) => c.productId === product.productId)?.quantity ?? 0;
                    return (
                      <div key={product.productId} className="group flex items-center gap-2 px-5 py-3 hover:bg-slate-50 transition-colors border-l-[3px] border-l-transparent hover:border-l-indigo-400">
                        <div className="min-w-0 flex-1 flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-900 truncate">{product.productName}</p>
                          {otherQty > 0 && (
                            <span className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                              {t('others')} {toArabicNumeral(String(otherQty), language)}
                            </span>
                          )}
                          {myQty > 0 && (
                            <span className="text-[11px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full font-semibold shrink-0">
                              {t('me')} {toArabicNumeral(String(myQty), language)}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-medium text-slate-400 shrink-0">{toArabicNumeral(String(product.targetQuantity), language)} {getUnitDisplay(product.unit, language)}</span>
                        {myQty > 0 ? (
                          <span className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-500 shrink-0">
                            <Check className="w-4 h-4" />
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              const matchingProduct = products.find((p) => p.id === product.productId);
                              if (matchingProduct) {
                                setModalProduct(matchingProduct);
                                setModalQty(1);
                              }
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hover:bg-emerald-600"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-indigo-600" />
                  {t('yourItems')}
                </h2>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
                  {toArabicNumeral(String(cart.length), language)} {t('productsAdded')}
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
                          <input
                            type="number"
                            min={0}
                            value={item.quantity}
                            onChange={(e) => setCartQty(item.productId, parseInt(e.target.value) || 0)}
                            className="w-14 text-center py-1 border border-slate-200 rounded text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <button
                            onClick={() => updateQty(item.productId, 1)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-500 hover:border-slate-300 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('yourSummary')}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] text-slate-500">{t('products')}</p>
                  <p className="text-lg font-bold text-slate-900">{toArabicNumeral(String(cart.length), language)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">{t('totalQuantity')}</p>
                  <p className="text-lg font-bold text-slate-900">{toArabicNumeral(String(totalQuantity), language)}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {modalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setModalProduct(null)}>
          <div
            className="bg-white rounded-xl w-full max-w-sm mx-4 overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-40 overflow-hidden bg-slate-100">
              <img src={modalProduct.imageUrl} alt={modalProduct.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-slate-900">{modalProduct.name}</h3>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                <span>{t('category')}: {modalProduct.categoryName}</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-sm text-slate-500">{t('currentPrice')}: <span className="font-bold text-slate-900">{toArabicNumeral(String(modalProduct.marketPrice ?? 0), language)} {t('currency')}</span></p>
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
                  <span className="text-xs text-slate-500">{getUnitDisplay(modalProduct.unit || 'UNIT', language)}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {t('subtotal')}: <span className="font-bold text-slate-700">{toArabicNumeral(String((modalProduct.marketPrice ?? 0) * modalQty), language)} {t('currency')}</span>
                </p>
              </div>

              <button
                  onClick={() => {
                    addToCart(modalProduct.id, modalProduct.name, modalProduct.categoryName, modalQty);
                  setModalProduct(null);
                }}
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
