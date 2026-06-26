import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Package,
  DollarSign,
  Clock,
  Truck,
  MapPin,
  Calendar,
  UserPlus,
  LogOut,
  Activity,
  AlertCircle,
  CheckCircle,
  X,
  Star,
  Tag,
  ChevronRight,
  Boxes,
  ShoppingCart,
  Layers,
  Plus,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import { useLanguage } from "../../i18n";
import { useAuth } from "../../contexts/AuthContext";
import type { BuyerAvailableDeliveryPerson } from "../../services/buyer.service";
import {
  buyerService,
  type OrderDetailResponse,
  type EligibleSupplier,
  type SupplierPublicProfile,
  type SupplierPublicProduct,
} from "../../services/buyer.service";
import { publicService, type PublicProduct, type PublicCategory } from "../../services/public.service";

/* ─────────────────────────────────────────────
   Supplier Profile Modal
───────────────────────────────────────────── */
function SupplierProfileModal({
  profile,
  onClose,
}: {
  profile: SupplierPublicProfile;
  onClose: () => void;
}) {
  const requiredProducts = profile.products.filter((p) => p.isRequiredByOrder);
  const otherProducts = profile.products.filter((p) => !p.isRequiredByOrder);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-3xl max-h-[85vh] bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden">
        {/* ── Header (Horizontal & Structured) ── */}
        <div className="flex-shrink-0 border-b border-slate-100 p-6 bg-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold text-lg flex items-center justify-center shadow-sm flex-shrink-0">
                {profile.supplierName.charAt(0)}
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-bold text-slate-900">
                    {profile.supplierName}
                  </h2>

                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/80 text-xs font-semibold px-2 py-0.5 rounded-md">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    {profile.rating.toFixed(1)}
                  </span>
                </div>

                {profile.address && (
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{profile.address}</span>
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub-bar: Categories & Quick Stats */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {profile.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600"
                >
                  {cat}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium px-2.5 py-1 bg-slate-50 rounded-md border border-slate-200/60">
                {profile.products.length} Catalog items
              </span>

              {requiredProducts.length > 0 && (
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80 flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {requiredProducts.length} Match your order
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {requiredProducts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <ShoppingCart className="w-3.5 h-3.5 text-emerald-600" />
                  Required for your order
                </h3>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/60 px-2.5 py-0.5 rounded-full">
                  Priority
                </span>
              </div>

              <div className="space-y-2.5">
                {requiredProducts.map((product) => (
                  <ProductCard
                    key={product.supplierProductId}
                    product={product}
                    isRequired={true}
                  />
                ))}
              </div>
            </div>
          )}

          {otherProducts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" />
                  Other available products
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {otherProducts.length} items
                </span>
              </div>

              <div className="space-y-2.5">
                {otherProducts.map((product) => (
                  <ProductCard
                    key={product.supplierProductId}
                    product={product}
                    isRequired={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Product Card
───────────────────────────────────────────── */
function ProductCard({
  product,
  isRequired,
}: {
  product: SupplierPublicProduct;
  isRequired: boolean;
}) {
  const [expanded, setExpanded] = useState(isRequired);

  const stockColor =
    product.availableStock === 0
      ? "text-red-600"
      : product.orderRequestedQty &&
          product.availableStock < product.orderRequestedQty
        ? "text-amber-600"
        : "text-emerald-600";

  const hasTiers = product.pricingTiers.length > 0;
  const activeTier = product.pricingTiers.find((t) => t.isCurrentTier);
  const displayPrice = activeTier ? activeTier.unitPrice : product.basePrice;

  return (
    <div
      className={`rounded-xl border transition-all ${
        isRequired
          ? "border-emerald-200 bg-emerald-50/40 shadow-sm"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3 p-3.5">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
            isRequired
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            product.productName.charAt(0)
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {product.productName}
            </p>
            {isRequired && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                <CheckCircle className="w-2.5 h-2.5" /> Required
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {product.categoryName}
          </p>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="text-sm font-bold text-indigo-700">
              {displayPrice.toLocaleString()} EGP/{product.unit}
            </span>
            <span
              className={`text-xs font-semibold flex items-center gap-1 ${stockColor}`}
            >
              <Boxes className="w-3 h-3" />
              {product.availableStock.toLocaleString()} in stock
            </span>
            {isRequired && product.orderRequestedQty != null && (
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5">
                Order needs: {product.orderRequestedQty} {product.unit}
              </span>
            )}
          </div>
        </div>

        {hasTiers && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
            />
          </button>
        )}
      </div>

      {hasTiers && expanded && (
        <div className="border-t border-slate-100 px-3.5 pb-3.5 pt-2.5">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Pricing Tiers
          </p>
          <div className="space-y-1.5">
            {product.pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between rounded-lg px-3 py-2 transition-all ${
                  tier.isCurrentTier
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "bg-slate-50 text-slate-700 border border-slate-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  {tier.isCurrentTier && (
                    <span className="text-[10px] font-bold bg-white/20 rounded px-1.5 py-0.5 text-white">
                      YOUR TIER
                    </span>
                  )}
                  <span
                    className={`text-xs font-medium ${tier.isCurrentTier ? "text-indigo-100" : "text-slate-600"}`}
                  >
                    {tier.minQty}
                    {tier.maxQty != null ? ` – ${tier.maxQty}` : "+"}{" "}
                    {product.unit}
                  </span>
                </div>
                <span
                  className={`text-sm font-bold ${tier.isCurrentTier ? "text-white" : "text-indigo-700"}`}
                >
                  {tier.unitPrice.toLocaleString()} EGP/{product.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Edit Products Modal (Creator)
───────────────────────────────────────────── */
function EditProductsModal({
  order,
  onClose,
  onSaved,
}: {
  order: OrderDetailResponse;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { language, t } = useLanguage();
  const [editItems, setEditItems] = useState(
    order.products.map((p) => {
      const otherQty = p.currentQuantity;
      const myQty = Math.max(0, p.targetQuantity - otherQty);
      return {
        productId: p.productId,
        productName: p.productName,
        categoryId: p.categoryId,
        myQuantity: myQty,
        othersQuantity: otherQty,
      };
    }),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const setMyQty = (productId: string, qty: number) => {
    setEditItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, myQuantity: Math.max(0, qty) }
          : item,
      ),
    );
  };

  const removeItem = (productId: string) => {
    setEditItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const items = editItems
        .filter((i) => i.myQuantity > 0)
        .map((i) => ({
          productId: i.productId,
          targetQuantity: i.myQuantity + i.othersQuantity,
        }));
      await buyerService.updateOrderItems(order.id, items);
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <h2 className="text-lg font-bold text-slate-900">{t('editQuantities' as any)}</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Current items list */}
          <div className="space-y-2">
            {editItems.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{item.productName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {item.othersQuantity > 0 && (
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                        {t('others')} {item.othersQuantity}
                      </span>
                    )}
                    <span className="text-[11px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full font-semibold shrink-0">
                      {t('me')} {item.myQuantity}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    min={0}
                    value={item.myQuantity}
                    onChange={(e) => setMyQty(item.productId, parseInt(e.target.value) || 0)}
                    className="w-20 text-center py-1.5 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-1.5 hover:bg-red-100 rounded-lg text-red-300 hover:text-red-500 transition-colors"
                    title={t('remove' as any)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {editItems.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">{t('noProductsFound' as any)}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {t('cancel' as any)}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : t('save' as any)}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Add Product Modal (Creator)
───────────────────────────────────────────── */
function AddProductModal({
  order,
  onClose,
  onSaved,
}: {
  order: OrderDetailResponse;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { language, t } = useLanguage();
  const [catalogProducts, setCatalogProducts] = useState<PublicProduct[]>([]);
  const [catalogCategories, setCatalogCategories] = useState<PublicCategory[]>([]);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const allowedCategoryIds = new Set(order.products.map((p) => p.categoryId));
  const orderCategories = catalogCategories.filter((cat) => allowedCategoryIds.has(cat.id));
  const existingProductIds = new Set(order.products.map((p) => p.productId));

  useEffect(() => {
    Promise.all([
      publicService.listProducts(),
      publicService.listCategories(),
    ])
      .then(([prodRes, catRes]) => {
        setCatalogProducts(prodRes.data);
        setCatalogCategories(catRes.data);
      })
      .catch(() => {});
  }, []);

  const filteredCatalog = catalogProducts.filter((p) => {
    if (!allowedCategoryIds.has(p.categoryId)) return false;
    const q = catalogSearch.toLowerCase();
    if (catalogCategoryFilter && p.categoryName !== catalogCategoryFilter) return false;
    return p.name.toLowerCase().includes(q);
  });

  const addProduct = async (productId: string) => {
    if (existingProductIds.has(productId) || saving) return;
    setSaving(true);
    setError('');
    try {
      await buyerService.updateOrderItems(order.id, [
        ...order.products.map((p) => ({
          productId: p.productId,
          targetQuantity: p.targetQuantity,
        })),
        { productId, targetQuantity: 1 },
      ]);
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Failed to add product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg max-h-[90vh] bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <h2 className="text-lg font-bold text-slate-900">{t('addProduct' as any)}</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder={t('searchProducts' as any)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {orderCategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={catalogCategoryFilter}
                onChange={(e) => setCatalogCategoryFilter(e.target.value)}
                className="px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {orderCategories.map((cat) => (
                  <option key={cat.id} value={language === 'ar' ? cat.nameAr : cat.nameEn}>
                    {language === 'ar' ? cat.nameAr : cat.nameEn}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="max-h-60 overflow-y-auto space-y-1.5">
            {filteredCatalog.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-900 truncate">{product.name}</p>
                    <p className="text-[10px] text-slate-400">{product.price} EGP</p>
                  </div>
                </div>
                {existingProductIds.has(product.id) ? (
                  <span className="text-[10px] text-emerald-600 font-semibold shrink-0">{t('inOrder' as any)}</span>
                ) : (
                  <button
                    onClick={() => addProduct(product.id)}
                    disabled={saving}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-semibold hover:bg-indigo-100 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3 h-3" />
                    {t('add' as any)}
                  </button>
                )}
              </div>
            ))}
            {filteredCatalog.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">{t('noProductsFound' as any)}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {t('cancel' as any)}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [eligibleSuppliers, setEligibleSuppliers] = useState<
    EligibleSupplier[]
  >([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);

  const [selectedProfile, setSelectedProfile] =
    useState<SupplierPublicProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const [assignTarget, setAssignTarget] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState("");

  // Delivery preference inside assign modal
  const [modalDeliveryPref, setModalDeliveryPref] = useState('None');
  const [modalSelectedPerson, setModalSelectedPerson] = useState('');
  const [modalDeliveryPersons, setModalDeliveryPersons] = useState<BuyerAvailableDeliveryPerson[]>([]);
  const [loadingModalPersons, setLoadingModalPersons] = useState(false);

  // Delivery preference state
  const [deliveryPreference, setDeliveryPreference] = useState('');
  const [settingPreference, setSettingPreference] = useState(false);
  const [preferredDeliveryPersonId, setPreferredDeliveryPersonId] = useState('');
  const [availableDeliveryPersons, setAvailableDeliveryPersons] = useState<any[]>([]);
  const [loadingDeliveryPersons, setLoadingDeliveryPersons] = useState(false);
  const [approvingFee, setApprovingFee] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const isCreator = user?.id === order?.creatorUserId;
  const deadlinePassed = order ? new Date(order.deadline) <= new Date() : false;
  const hasJoined = order?.isParticipant ?? false;

  const fetchOrder = () => {
    if (!id) return;
    setLoading(true);
    setError("");
    buyerService
      .getOrderDetail(id)
      .then((res) => setOrder(res.data))
      .catch((err) =>
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load order",
        ),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (order?.deliveryPreference) setDeliveryPreference(order.deliveryPreference);
  }, [order]);

  useEffect(() => {
    if (id && order && isCreator) {
      setLoadingSuppliers(true);
      buyerService
        .getEligibleSuppliers(id)
        .then((res) => setEligibleSuppliers(res.data))
        .catch((err) => console.error("Failed to load eligible suppliers", err))
        .finally(() => setLoadingSuppliers(false));
    }
  }, [id, order, isCreator]);

  // Reset modal state when assign modal opens/closes
  useEffect(() => {
    if (assignTarget) {
      setModalDeliveryPref('None');
      setModalSelectedPerson('');
      setModalDeliveryPersons([]);
    }
  }, [assignTarget]);

  // Fetch available delivery persons when "SystemDelivery" is selected in modal
  useEffect(() => {
    if (assignTarget && modalDeliveryPref === 'SystemDelivery') {
      setLoadingModalPersons(true);
      buyerService.getAvailableDeliveryPersons(id!)
        .then(res => setModalDeliveryPersons(res.data))
        .catch(() => setModalDeliveryPersons([]))
        .finally(() => setLoadingModalPersons(false));
    } else {
      setModalDeliveryPersons([]);
      setModalSelectedPerson('');
    }
  }, [modalDeliveryPref, assignTarget]);

  const handleSupplierClick = async (supplierId: string) => {
    if (!id || loadingProfile) return;
    setLoadingProfile(true);
    try {
      const res = await buyerService.getSupplierProfile(id, supplierId);
      setSelectedProfile(res.data);
    } catch (err) {
      console.error("Failed to load supplier profile", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleAssign = async (supplierId: string) => {
    if (!id) return;
    if (modalDeliveryPref === 'SystemDelivery' && !modalSelectedPerson) {
      setAssignError(t("pleaseSelectDeliveryPerson" as any));
      return;
    }
    setAssigning(true);
    setAssignError("");
    try {
      await buyerService.assignSupplier(id, supplierId);
      if (modalDeliveryPref !== 'None') {
        const isSpecific = modalDeliveryPref === 'SystemDelivery' && !!modalSelectedPerson;
        await buyerService.setDeliveryPreference(id, {
          preference: isSpecific ? 'SpecificPerson' : modalDeliveryPref,
          preferredDeliveryPersonId: isSpecific ? modalSelectedPerson : undefined,
        });
      }
      setAssignTarget(null);
      fetchOrder();
    } catch (err: any) {
      setAssignError(err?.response?.data?.message || err?.message || "Failed to assign supplier");
    } finally {
      setAssigning(false);
    }
  };

  const handleJoin = async () => {
    if (!id || joining) return;
    setJoining(true);
    setError("");
    try {
      await buyerService.joinOrder(id, { items: [] });
      navigate(`/buyer/orders/${id}/join`, { state: { joined: true } });
    } catch (err: any) {
      setError(
        err?.response?.data?.error || err?.message || "Failed to join order",
      );
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!id) return;
    try {
      await buyerService.leaveOrder(id);
      fetchOrder();
    } catch (err: any) {
      setError(
        err?.response?.data?.error || err?.message || "Failed to leave order",
      );
    }
  };

  // Delivery preference
  const handleSetPreference = async () => {
    if (!id) return;
    setSettingPreference(true);
    try {
      await buyerService.setDeliveryPreference(id, {
        preference: deliveryPreference,
        preferredDeliveryPersonId: deliveryPreference === 'SpecificPerson' ? preferredDeliveryPersonId || undefined : undefined,
      });
      fetchOrder();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to set preference");
    } finally {
      setSettingPreference(false);
    }
  };

  const handleBrowseDeliveryPersons = async () => {
    if (!id) return;
    setLoadingDeliveryPersons(true);
    try {
      const res = await buyerService.getAvailableDeliveryPersons(id);
      setAvailableDeliveryPersons(res.data);
    } catch (err: any) {
      setAvailableDeliveryPersons([]);
    } finally {
      setLoadingDeliveryPersons(false);
    }
  };

  const handleApproveFee = async () => {
    if (!id) return;
    setApprovingFee(true);
    try {
      await buyerService.approveDeliveryFee(id, { isApproved: true });
      fetchOrder();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to approve");
    } finally {
      setApprovingFee(false);
    }
  };

  const handleRejectFee = async () => {
    if (!id) return;
    setApprovingFee(true);
    try {
      await buyerService.approveDeliveryFee(id, { isApproved: false, reason: rejectReason || undefined });
      fetchOrder();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to reject");
    } finally {
      setApprovingFee(false);
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
      <div className="p-8 max-w-7xl mx-auto text-center">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={() => navigate("/buyer/orders")}
          className="mt-4 text-indigo-600 text-sm font-semibold"
        >
          ← {t("backToOrders" as any)}
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center">
        <p className="text-slate-500">{t("orderNotFound" as any)}</p>
        <button
          onClick={() => navigate("/buyer/orders")}
          className="mt-4 text-indigo-600 text-sm font-semibold"
        >
          ← {t("backToOrders" as any)}
        </button>
      </div>
    );
  }

  const myParticipant = order.participants.find((p) => p.userId === user?.id);
  const myItems = myParticipant?.items ?? [];
  let myEstTotal = 0;
  myItems.forEach((item) => {
    const product = order.products.find(
      (p) => p.groupOrderItemId === item.groupOrderItemId,
    );
    if (product?.unitPrice != null) {
      myEstTotal += product.unitPrice * item.quantity;
    }
  });

  return (
    <>
      {selectedProfile && (
        <SupplierProfileModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
      {showAddProductModal && order && (
        <AddProductModal
          order={order}
          onClose={() => setShowAddProductModal(false)}
          onSaved={() => fetchOrder()}
        />
      )}
      {showEditModal && order && (
        <EditProductsModal
          order={order}
          onClose={() => setShowEditModal(false)}
          onSaved={() => fetchOrder()}
        />
      )}

      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/buyer/orders")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToOrders" as any)}
        </button>

        {/* ── Order Header Panel ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                {order.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                <span className="font-medium text-slate-700">
                  {t("createdBy" as any)}: {order.creatorName}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {t("region" as any)}: {order.region}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {t("deadline" as any)}:{" "}
                  {new Date(order.deadline).toLocaleString(
                    language === "ar" ? "ar-SA" : "en-US",
                  )}
                  {(() => {
                    const now = new Date();
                    const deadline = new Date(order.deadline);
                    const diffMs = deadline.getTime() - now.getTime();
                    const passed = diffMs <= 0;
                    if (passed) {
                      return (
                        <span className="ml-2 inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-700 border border-red-200">
                          {t("deadlinePassed" as any)}
                        </span>
                      );
                    }
                    const diffH = Math.floor(diffMs / 3600000);
                    const diffM = Math.floor((diffMs % 3600000) / 60000);
                    const label = diffH >= 24
                      ? `${Math.floor(diffH / 24)}d ${diffH % 24}h`
                      : `${diffH}h ${diffM}m`;
                    return (
                      <span className={`ml-2 inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${
                        diffH < 1 ? 'bg-red-100 text-red-700 border border-red-200' : diffH < 24 ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}>
                        {language === "ar"
                          ? `تنتهي بعد ${label}`
                          : `Closes in ${label}`}
                      </span>
                    );
                  })()}
                </span>
                {order.supplierName ? (
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3 text-indigo-500" />
                    <span className="font-medium text-slate-700">
                      {order.status === "PendingApproval" ? "Assigned" : order.status === "Locked" ? "Supplier" : "Suggested Supplier"}:{" "}
                      <span className="text-indigo-600 font-bold">{order.supplierName}</span>
                    </span>
                  </span>
                ) : (
                  order.status === "Open" && isCreator && (
                    <span className="flex items-center gap-1 text-amber-600 font-medium">
                      <AlertCircle className="w-3 h-3" />
                      {t("selectSupplierBelow" as any)}
                    </span>
                  )
                )}
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shrink-0 self-start md:self-auto ${
                order.status === "Open"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : order.status === "PendingApproval"
                    ? "bg-amber-50 border-amber-200 text-amber-700"
                    : order.status === "Locked"
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                      : order.status === "Closed"
                        ? "bg-slate-100 border-slate-300 text-slate-600"
                        : order.status === "Completed"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>

        {/* ── Consolidated KPI Cards & Participants Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Left panel: Compact metrics block */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Metric: Products */}
            <div className="bg-white rounded-xl border border-slate-200 p-4.5 flex items-center gap-4 hover:shadow-xs transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-center shrink-0">
                <Package className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  {t("products" as any)}
                </p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">
                  {order.products.length}
                </p>
              </div>
            </div>

            {/* Metric: Estimated Total Cost */}
            <div className="bg-white rounded-xl border border-slate-200 p-4.5 flex items-center gap-4 hover:shadow-xs transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50/80 border border-emerald-100 flex items-center justify-center shrink-0">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  {t("estimatedTotal" as any)}
                </p>
                <p className="text-xl font-bold text-slate-900 mt-0.5 leading-none">
                  {order.totalOrderValue.toLocaleString()} EGP
                </p>
                {hasJoined && myEstTotal > 0 && (
                  <p className="text-[11px] font-semibold text-emerald-600 mt-1.5">
                    Your share: {myEstTotal.toLocaleString()} EGP
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right panel: Live Participants list sitting natively beside the stats */}
          <div className="bg-white rounded-xl border border-slate-200 p-4.5 flex flex-col justify-between hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  {t("participants" as any)} ({order.participants.length})
                </h3>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-y-auto pr-1">
              {order.participants.map((p) => (
                <div
                  key={p.id}
                  className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 rounded-full pr-2.5 pl-1 py-1 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[9px] font-bold text-indigo-700 shrink-0">
                    {p.name.charAt(0)}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 truncate max-w-[90px]">
                    {p.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Creator Edit Products Button ── */}
        {isCreator && !deadlinePassed && (order.status === "Open" || order.status === "Draft") && (
          <div className="mb-4 flex items-center gap-3">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm font-bold hover:bg-amber-100 transition-colors"
            >
              <Package className="w-4 h-4" />
              {t("editQuantities" as any)}
            </button>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t("addProduct" as any)}
            </button>
          </div>
        )}

        {/* ── Active Order Action buttons ── */}
        {order.status === "Open" && !deadlinePassed && !isCreator && !hasJoined && (
          <div className="mb-4">
            <button
              onClick={handleJoin}
              disabled={joining}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              {joining ? t("joining" as any) + "..." : t("joinOrder" as any)}
            </button>
          </div>
        )}

        {order.status === "Open" && !deadlinePassed && hasJoined && (
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700">
              <CheckCircle className="w-3.5 h-3.5" />
              {t("participants" as any)}
            </span>
            <button
              onClick={() => navigate(`/buyer/orders/${id}/join`)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
            >
              <Package className="w-3.5 h-3.5" />
              {t("addYourProducts" as any)}
            </button>
            <button
              onClick={handleLeave}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              {t("leaveOrder" as any)}
            </button>
          </div>
        )}

        {/* ── Core Products & Activity Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">
                  {t("products" as any)}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        {t("product" as any)}
                      </th>
                      <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        {t("quantity" as any)}
                      </th>
                      <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        {t("unitPrice" as any)}
                      </th>
                      <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        {t("total" as any)}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((product) => {
                      const unitPrice = product.unitPrice || 0;
                      const totalCost = unitPrice * product.targetQuantity;

                      return (
                        <tr
                          key={product.productId}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-slate-900">
                              {product.productName}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-600 font-medium">
                            {product.targetQuantity.toLocaleString()}{" "}
                            <span className="text-[11px] text-slate-400 font-normal">
                              {product.unit || "units"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-600 font-medium">
                            {unitPrice > 0
                              ? `${unitPrice.toLocaleString()} EGP`
                              : "—"}
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm font-bold text-indigo-600">
                              {totalCost > 0
                                ? `${totalCost.toLocaleString()} EGP`
                                : "—"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Activity column */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                {t("recentActivity" as any)}
              </h3>
              <div className="space-y-3">
                {order.activities.slice(0, 6).map((act) => (
                    <div key={act.id} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-700">{language === 'ar' ? act.notesAr : act.notesEn}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(act.createdAt).toLocaleString(
                            language === "ar" ? "ar-SA" : "en-US",
                          )}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {act.createdBy}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Available Suppliers Block (Creator Only) ── */}
        {isCreator && order.status === "Open" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" />
                {t("availableSuppliers" as any)}
              </h2>
              {loadingProfile && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  {t("loading" as any)}
                </span>
              )}
            </div>
            {loadingSuppliers ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : eligibleSuppliers.length === 0 ? (
              <div className="text-center py-8">
                <Truck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">
                  {t("noEligibleSuppliers" as any)}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {t("tryModifyOrder" as any)}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {eligibleSuppliers.map((supplier) => (
                  <div
                    key={supplier.supplierId}
                    className="border border-slate-200 rounded-xl flex flex-col overflow-hidden hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-50 transition-all"
                  >
                    <button
                      onClick={() => handleSupplierClick(supplier.supplierId)}
                      disabled={loadingProfile}
                      className="text-left p-4 flex flex-col flex-1 disabled:opacity-60 disabled:cursor-wait cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {supplier.supplierName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm leading-tight">
                              {supplier.supplierName}
                            </h3>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span className="text-[11px] font-semibold text-amber-700">
                                {supplier.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 mt-0.5" />
                      </div>

                      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {t("estTotal" as any)}:
                        </span>
                        <span className="text-sm font-bold text-indigo-700">
                          {supplier.totalEstimatedCost.toLocaleString()} EGP
                        </span>
                      </div>

                      <p className="text-[11px] text-indigo-500 mt-2 font-medium">
                        {t("clickToViewProfile" as any)}
                      </p>
                    </button>

                    {deadlinePassed && (
                      <div className="border-t border-slate-100 p-3">
                        <button
                          onClick={() => setAssignTarget(supplier.supplierId)}
                          disabled={assigning}
                          className="w-full py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                          {t("assign" as any)}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {assignError && (
              <p className="text-xs text-red-600 mt-3 text-center">{assignError}</p>
            )}
          </div>
        )}

        {/* ── Supplier Assignment Status (Creator Only) ── */}
        {isCreator && order.status === "PendingApproval" && (
          <div className="bg-white rounded-xl border border-amber-200 p-6 mt-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">{t("pendingApproval" as any)}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t("supplierAssigned" as any)}</p>
                {(order.deliveryPreference === 'SpecificPerson' || order.deliveryPreference === 'SystemDelivery') && (
                  <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    <Truck className="w-3 h-3" />
                    {order.preferredDeliveryPersonName
                      ? `${t('systemDelivery' as any)}: ${order.preferredDeliveryPersonName}`
                      : t('systemDelivery' as any)}
                  </span>
                )}
                {order.deliveryPreference === 'OwnDelivery' && (
                  <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    <Truck className="w-3 h-3" />
                    {t('ownDelivery' as any)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {isCreator && order.status === "Locked" && (
          <div className="bg-white rounded-xl border border-emerald-200 p-6 mt-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">{t("supplierAccepted" as any)}</p>
                <p className="text-xs text-slate-500 mt-0.5">{order.supplierName} — {t("locked" as any)}</p>
                {(order.deliveryPreference === 'SpecificPerson' || order.deliveryPreference === 'SystemDelivery') && (
                  <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    <Truck className="w-3 h-3" />
                    {order.preferredDeliveryPersonName
                      ? `${t('systemDelivery' as any)}: ${order.preferredDeliveryPersonName}`
                      : t('systemDelivery' as any)}
                  </span>
                )}
                {order.deliveryPreference === 'OwnDelivery' && (
                  <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    <Truck className="w-3 h-3" />
                    {t('ownDelivery' as any)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Delivery Fee Approve/Reject ── */}
        {isCreator && order.deliveryApprovalStatus === "Pending" && (
          <div className="bg-white rounded-xl border border-amber-200 p-6 mt-4">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-600" />
              {t("deliveryFeeProposal" as any)}
            </h3>
            <div className="space-y-3">
              <div className="bg-amber-50 rounded-lg p-4">
                <p className="text-lg font-black text-slate-900">EGP {order.proposedDeliveryFee?.toLocaleString()}</p>
                <p className="text-xs text-slate-500">{t("totalFee" as any)} — EGP {(order.proposedDeliveryFee! / Math.max(1, (order.participants?.length || 0) + 1)).toFixed(2)} {t("perParticipant" as any)}</p>
              </div>
              {order.assignedDeliveryPersonName && (
                <p className="text-xs text-slate-600"><Truck className="w-3 h-3 inline mr-1" />{order.assignedDeliveryPersonName}</p>
              )}
              <div className="flex items-center gap-3">
                <button onClick={handleApproveFee} disabled={approvingFee}
                  className="flex-1 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                  {approvingFee ? '...' : t("approve" as any)}
                </button>
                <button onClick={handleRejectFee} disabled={approvingFee}
                  className="flex-1 py-2.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 disabled:opacity-50">
                  {approvingFee ? '...' : t("reject" as any)}
                </button>
              </div>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg resize-none" rows={2}
                placeholder={t("reason" as any)} />
            </div>
          </div>
        )}

        {/* ── Assign Confirmation Dialog ── */}
        {assignTarget && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setAssignTarget(null); }}
          >
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900">{t("assignSupplierConfirmTitle" as any)}</h3>
              <p className="text-xs text-slate-500 mt-2">{t("assignSupplierConfirmDesc" as any)}</p>

              {/* ── Delivery Preference ── */}
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-slate-700">{t("deliveryPreference" as any)}</p>
                <label className="flex items-start gap-2 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input type="radio" name="modalDeliveryPref" value="None" checked={modalDeliveryPref === 'None'}
                    onChange={(e) => setModalDeliveryPref(e.target.value)} className="mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-slate-800">{t("prefLetSupplierDecide" as any)}</p>
                    <p className="text-[11px] text-slate-500">{t("prefLetSupplierDecideDesc" as any)}</p>
                  </div>
                </label>
                <label className="flex items-start gap-2 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input type="radio" name="modalDeliveryPref" value="SystemDelivery" checked={modalDeliveryPref === 'SystemDelivery'}
                    onChange={(e) => setModalDeliveryPref(e.target.value)} className="mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-slate-800">{t("prefSystemDelivery" as any)}</p>
                    <p className="text-[11px] text-slate-500">{t("prefSystemDeliveryDesc" as any)}</p>
                  </div>
                </label>
                {modalDeliveryPref === 'SystemDelivery' && (
                  <div className="ml-5 pl-2 border-l-2 border-indigo-200 space-y-1 max-h-40 overflow-y-auto">
                    {loadingModalPersons ? (
                      <div className="flex items-center gap-2 py-2">
                        <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />
                        <span className="text-[11px] text-slate-500">{t("loadingDeliveryPersons" as any)}</span>
                      </div>
                    ) : modalDeliveryPersons.length === 0 ? (
                      <p className="text-[11px] text-slate-400 py-1">{t("noDeliveryPersonsAvailable" as any)}</p>
                    ) : (
                      modalDeliveryPersons.map((p) => (
                        <label key={p.id} className="flex items-center gap-2 py-1.5 cursor-pointer">
                          <input type="radio" name="modalSelectedPerson" value={p.id}
                            checked={modalSelectedPerson === p.id}
                            onChange={(e) => setModalSelectedPerson(e.target.value)} />
                          <div>
                            <p className="text-[11px] font-medium text-slate-800">{p.fullName}</p>
                            <p className="text-[10px] text-slate-500">
                              {t("deliveryFee" as any)}: {p.baseDeliveryFee} {p.vehicleType ? `· ${p.vehicleType}` : ''}
                            </p>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                )}
                <label className="flex items-start gap-2 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input type="radio" name="modalDeliveryPref" value="OwnDelivery" checked={modalDeliveryPref === 'OwnDelivery'}
                    onChange={(e) => setModalDeliveryPref(e.target.value)} className="mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-slate-800">{t("prefOwnDelivery" as any)}</p>
                    <p className="text-[11px] text-slate-500">{t("prefOwnDeliveryDesc" as any)}</p>
                  </div>
                </label>
              </div>

              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={() => setAssignTarget(null)}
                  disabled={assigning}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  {t("cancel" as any)}
                </button>
                <button
                  onClick={() => handleAssign(assignTarget)}
                  disabled={assigning}
                  className="flex-1 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {assigning && <Loader2 className="w-3 h-3 animate-spin" />}
                  {assigning ? t("assigning" as any) : t("assign" as any)}
                </button>
              </div>
              {assignError && (
                <p className="text-xs text-red-600 mt-3 text-center">{assignError}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
