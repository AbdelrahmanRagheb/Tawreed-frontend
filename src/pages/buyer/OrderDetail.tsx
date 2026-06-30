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
  CheckSquare,
  Square,
  Minus,
} from "lucide-react";
import { useLanguage, getUnitDisplay, toArabicNumeral } from "../../i18n";
import { useAuth } from "../../contexts/AuthContext";
import {
  buyerService,
  type OrderDetailResponse,
  type EligibleSupplier,
  type EligibleProduct,
  type AssignSupplierRequest,
  type SupplierPublicProfile,
  type SupplierPublicProduct,
} from "../../services/buyer.service";
import {
  publicService,
  type PublicProduct,
  type PublicCategory,
} from "../../services/public.service";

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
                </div>
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
                {toArabicNumeral(String(profile.products.length), language)}{" "}
                Catalog items
              </span>

              {requiredProducts.length > 0 && (
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80 flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {toArabicNumeral(String(requiredProducts.length), language)}{" "}
                  Match your order
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
                  {toArabicNumeral(String(otherProducts.length), language)}{" "}
                  items
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
  const { language, t } = useLanguage();
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
              {toArabicNumeral(displayPrice.toLocaleString(), language)}{" "}
              {t("currency")}/{getUnitDisplay(product.unit, language)}
            </span>
            <span
              className={`text-xs font-semibold flex items-center gap-1 ${stockColor}`}
            >
              <Boxes className="w-3 h-3" />
              {toArabicNumeral(
                product.availableStock.toLocaleString(),
                language,
              )}{" "}
              in stock
            </span>
            {isRequired && product.orderRequestedQty != null && (
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5">
                Order needs:{" "}
                {toArabicNumeral(String(product.orderRequestedQty), language)}{" "}
                {getUnitDisplay(product.unit, language)}
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
                    {toArabicNumeral(String(tier.minQty), language)}
                    {tier.maxQty != null
                      ? ` – ${toArabicNumeral(String(tier.maxQty), language)}`
                      : "+"}{" "}
                    {getUnitDisplay(product.unit, language)}
                  </span>
                </div>
                <span
                  className={`text-sm font-bold ${tier.isCurrentTier ? "text-white" : "text-indigo-700"}`}
                >
                  {toArabicNumeral(tier.unitPrice.toLocaleString(), language)}{" "}
                  {t("currency")}/{getUnitDisplay(product.unit, language)}
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
   Manage Products Modal (Creator) — combines edit qty + add products
───────────────────────────────────────────── */
function ManageProductsModal({
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
    order.products
      .map((p) => {
        const otherQty = p.currentQuantity;
        const myQty = Math.max(0, p.targetQuantity - otherQty);
        return {
          productId: p.productId,
          productName: p.productName,
          categoryId: p.categoryId,
          myQuantity: myQty,
          othersQuantity: otherQty,
        };
      })
      .filter((p) => p.myQuantity > 0),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Catalog state for adding new products
  const [catalogProducts, setCatalogProducts] = useState<PublicProduct[]>([]);
  const [catalogCategories, setCatalogCategories] = useState<PublicCategory[]>(
    [],
  );
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState("");

  const existingProductIds = new Set(editItems.map((p) => p.productId));

  useEffect(() => {
    Promise.all([publicService.listProducts(), publicService.listCategories()])
      .then(([prodRes, catRes]) => {
        setCatalogProducts(prodRes.data);
        setCatalogCategories(catRes.data);
      })
      .catch(() => {});
  }, []);

  // Catalog filtered by search + category (NO category constraint for creator)
  const filteredCatalog = catalogProducts.filter((p) => {
    const q = catalogSearch.toLowerCase();
    if (catalogCategoryFilter && p.categoryName !== catalogCategoryFilter)
      return false;
    return p.name.toLowerCase().includes(q);
  });

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

  const addCatalogProduct = (product: PublicProduct) => {
    // If already in editItems, just increment quantity
    setEditItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, myQuantity: i.myQuantity + 1 }
            : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          categoryId: product.categoryId,
          myQuantity: 1,
          othersQuantity: 0,
        },
      ];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      // Build items list: include creator's edited items + other participants' items unchanged
      const myItems = editItems
        .filter((i) => i.myQuantity > 0)
        .map((i) => ({
          productId: i.productId,
          targetQuantity: i.myQuantity + i.othersQuantity,
        }));
      const otherItems = order.products
        .filter((p) => {
          const myQty = Math.max(0, p.targetQuantity - p.currentQuantity);
          return myQty === 0; // Only include products the creator didn't add
        })
        .map((p) => ({
          productId: p.productId,
          targetQuantity: p.targetQuantity,
        }));
      const items = [...myItems, ...otherItems];
      await buyerService.updateOrderItems(order.id, items);
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <h2 className="text-lg font-bold text-slate-900">
            {t("editQuantities" as any)}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Body — side-by-side */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* ── Left: Your Products ── */}
            <div className="md:w-1/2 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {t("yourProducts" as any)}
              </h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {editItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 bg-slate-50 rounded-xl p-3.5"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {item.productName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {item.othersQuantity > 0 && (
                          <span className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                            {t("others")}{" "}
                            {toArabicNumeral(
                              String(item.othersQuantity),
                              language,
                            )}
                          </span>
                        )}
                        <span className="text-[11px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full font-semibold shrink-0">
                          {t("me")}{" "}
                          {toArabicNumeral(String(item.myQuantity), language)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="number"
                        min={0}
                        value={item.myQuantity}
                        onChange={(e) =>
                          setMyQty(
                            item.productId,
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-20 text-center py-1.5 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-1.5 hover:bg-red-100 rounded-lg text-red-300 hover:text-red-500 transition-colors"
                        title={t("remove" as any)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {editItems.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">
                    {t("noProductsFound" as any)}
                  </p>
                )}
              </div>
            </div>

            {/* ── Right: Add Products ── */}
            <div className="md:w-1/2 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {t("addProduct" as any)}
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder={t("searchProducts" as any)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {catalogCategories.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={catalogCategoryFilter}
                    onChange={(e) => setCatalogCategoryFilter(e.target.value)}
                    className="px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">{t("allCategories" as any)}</option>
                    {catalogCategories.map((cat) => (
                      <option
                        key={cat.id}
                        value={language === "ar" ? cat.nameAr : cat.nameEn}
                      >
                        {language === "ar" ? cat.nameAr : cat.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="max-h-60 overflow-y-auto space-y-1.5">
                {filteredCatalog.map((product) => {
                  const existingItem = editItems.find(
                    (i) => i.productId === product.id,
                  );
                  const inOrder = !!existingItem;
                  const myQty = existingItem?.myQuantity ?? 0;
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {product.marketPrice
                            ? `${toArabicNumeral(String(product.marketPrice), language)} ${t("currency")}`
                            : "-"}
                        </p>
                      </div>
                      {inOrder ? (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              if (myQty <= 1) {
                                removeItem(product.id);
                              } else {
                                setMyQty(product.id, myQty - 1);
                              }
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-slate-900">
                            {toArabicNumeral(String(myQty), language)}
                          </span>
                          <button
                            onClick={() => setMyQty(product.id, myQty + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addCatalogProduct(product)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-semibold hover:bg-indigo-100 transition-colors shrink-0"
                        >
                          <Plus className="w-3 h-3" />
                          {t("add" as any)}
                        </button>
                      )}
                    </div>
                  );
                })}
                {filteredCatalog.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">
                    {t("noProductsFound" as any)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
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
            {t("cancel" as any)}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Saving..." : t("save" as any)}
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
  const [showManageModal, setShowManageModal] = useState(false);

  const [assignTarget, setAssignTarget] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState("");

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
    if (id && order && isCreator) {
      setLoadingSuppliers(true);
      buyerService
        .getEligibleSuppliers(id)
        .then((res) => setEligibleSuppliers(res.data))
        .catch((err) => console.error("Failed to load eligible suppliers", err))
        .finally(() => setLoadingSuppliers(false));
    }
  }, [id, order, isCreator]);

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

  const [selectedItemIds, setSelectedItemIds] = useState<
    Record<string, string[]>
  >({});

  const toggleItem = (supplierId: string, itemId: string) => {
    setSelectedItemIds((prev) => {
      const current = prev[supplierId] ?? [];
      const exists = current.includes(itemId);
      return {
        ...prev,
        [supplierId]: exists
          ? current.filter((id) => id !== itemId)
          : [...current, itemId],
      };
    });
  };

  const selectAllUnassigned = (supplierId: string, productIds: string[]) => {
    setSelectedItemIds((prev) => ({
      ...prev,
      [supplierId]: productIds,
    }));
  };

  const handleAssign = async (supplierId: string) => {
    if (!id) return;
    const itemIds = selectedItemIds[supplierId];
    if (!itemIds || itemIds.length === 0) {
      setAssignError("Please select at least one item to assign.");
      return;
    }
    setAssigning(true);
    setAssignError("");
    try {
      const request: AssignSupplierRequest = { supplierId, itemIds };
      await buyerService.assignSupplier(id, request);
      setAssignTarget(null);
      setSelectedItemIds((prev) => ({ ...prev, [supplierId]: [] }));
      fetchOrder();
    } catch (err: any) {
      setAssignError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to assign supplier",
      );
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
    if (product?.marketPrice ?? product?.unitPrice != null) {
      myEstTotal +=
        (product.marketPrice ?? product.unitPrice ?? 0) * item.quantity;
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
      {showManageModal && order && (
        <ManageProductsModal
          order={order}
          onClose={() => setShowManageModal(false)}
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
                    const label =
                      diffH >= 24
                        ? `${toArabicNumeral(String(Math.floor(diffH / 24)), language)}d ${toArabicNumeral(String(diffH % 24), language)}h`
                        : `${toArabicNumeral(String(diffH), language)}h ${toArabicNumeral(String(diffM), language)}m`;
                    return (
                      <span
                        className={`ml-2 inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${
                          diffH < 1
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : diffH < 24
                              ? "bg-amber-100 text-amber-700 border border-amber-200"
                              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {language === "ar"
                          ? `تنتهي بعد ${label}`
                          : `Closes in ${label}`}
                      </span>
                    );
                  })()}
                </span>
                {(() => {
                  const assignedCount = order.products.filter(
                    (p) => p.itemStatus !== "Unassigned",
                  ).length;
                  if (assignedCount > 0) {
                    return (
                      <span className="flex items-center gap-1">
                        <Truck className="w-3 h-3 text-indigo-500" />
                        <span className="font-medium text-slate-700">
                          {toArabicNumeral(String(assignedCount), language)} /{" "}
                          {toArabicNumeral(
                            String(order.products.length),
                            language,
                          )}{" "}
                          items assigned
                        </span>
                      </span>
                    );
                  }
                  if (order.status === "Open" && isCreator) {
                    return (
                      <span className="flex items-center gap-1 text-amber-600 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        {t("selectSupplierBelow" as any)}
                      </span>
                    );
                  }
                  return null;
                })()}
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
                  {toArabicNumeral(String(order.products.length), language)}
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
                  {toArabicNumeral(
                    order.totalOrderValue.toLocaleString(),
                    language,
                  )}{" "}
                  {t("currency")}
                </p>
                {hasJoined && myEstTotal > 0 && (
                  <p className="text-[11px] font-semibold text-emerald-600 mt-1.5">
                    Your share:{" "}
                    {toArabicNumeral(myEstTotal.toLocaleString(), language)}{" "}
                    {t("currency")}
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
                  {t("participants" as any)} (
                  {toArabicNumeral(String(order.participants.length), language)}
                  )
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

        {/* ── Creator Manage Products Button ── */}
        {isCreator &&
          !deadlinePassed &&
          (order.status === "Open" || order.status === "Draft") && (
            <div className="mb-4">
              <button
                onClick={() => setShowManageModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors"
              >
                <Package className="w-4 h-4" />
                {t("manageProducts" as any)}
              </button>
            </div>
          )}

        {/* ── Active Order Action buttons ── */}
        {order.status === "Open" &&
          !deadlinePassed &&
          !isCreator &&
          !hasJoined && (
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
                        {t("marketPrice" as any)}
                      </th>
                      <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        {t("total" as any)}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((product) => {
                      const unitPrice =
                        product.marketPrice ?? product.unitPrice ?? 0;
                      const totalCost = unitPrice * product.targetQuantity;
                      // Debug to see what prices come from API
                      console.log(
                        "[OrderDetail] Product:",
                        product.productName,
                        "marketPrice:",
                        product.marketPrice,
                        "unitPrice:",
                        product.unitPrice,
                        "targetQty:",
                        product.targetQuantity,
                      );

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
                            {toArabicNumeral(
                              product.targetQuantity.toLocaleString(),
                              language,
                            )}{" "}
                            <span className="text-[11px] text-slate-400 font-normal">
                              {getUnitDisplay(
                                product.unit || "units",
                                language,
                              )}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-600 font-medium">
                            {unitPrice > 0
                              ? `${toArabicNumeral(unitPrice.toLocaleString(), language)} ${t("currency")}`
                              : "—"}
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm font-bold text-indigo-600">
                              {totalCost > 0
                                ? `${toArabicNumeral(totalCost.toLocaleString(), language)} ${t("currency")}`
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
                      <p className="text-xs text-slate-700">
                        {language === "ar" ? act.notesAr : act.notesEn}
                      </p>
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

        {/* ── Per-Product Assignment Status ── */}
        <div className="mt-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-indigo-600" />
              {t("products" as any)} (
              {toArabicNumeral(String(order.products.length), language)})
              {(order.totalProductCount != null ||
                order.assignedProductCount != null) && (
                <span className="text-xs font-medium text-slate-500 ml-2">
                  {toArabicNumeral(
                    String(order.assignedProductCount ?? 0),
                    language,
                  )}{" "}
                  /{" "}
                  {toArabicNumeral(
                    String(order.totalProductCount ?? order.products.length),
                    language,
                  )}{" "}
                  assigned
                </span>
              )}
            </h2>
            <div className="space-y-3">
              {order.products.map((product) => {
                const statusColor =
                  product.itemStatus === "Accepted"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : product.itemStatus === "Pending"
                      ? "bg-amber-100 text-amber-700 border-amber-200"
                      : product.itemStatus === "Declined"
                        ? "bg-red-100 text-red-700 border-red-200"
                        : "bg-slate-100 text-slate-500 border-slate-200";
                return (
                  <div
                    key={product.groupOrderItemId}
                    className="flex items-center justify-between bg-slate-50 rounded-xl p-3.5"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                        {product.productName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {product.productName}
                        </p>
                        <p className="text-xs text-slate-500">
                          Qty:{" "}
                          {toArabicNumeral(
                            String(product.targetQuantity),
                            language,
                          )}{" "}
                          {getUnitDisplay(product.unit, language)}
                          {(product.marketPrice ?? product.unitPrice) != null &&
                            ` — ${toArabicNumeral((product.marketPrice ?? product.unitPrice)?.toLocaleString(), language)} ${t("currency")}/${getUnitDisplay(product.unit, language)}`}
                        </p>
                        {product.supplierName && (
                          <p className="text-xs font-medium text-indigo-600 mt-0.5">
                            {product.supplierName}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-1 rounded-full border shrink-0 ${statusColor}`}
                    >
                      {product.itemStatus}
                    </span>
                  </div>
                );
              })}
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
              <div className="space-y-4">
                {eligibleSuppliers.map((supplier) => {
                  const unassignedItems = supplier.coveredProducts.filter(
                    (cp) => {
                      const product = order.products.find(
                        (p) => p.groupOrderItemId === cp.groupOrderItemId,
                      );
                      return product?.itemStatus === "Unassigned";
                    },
                  );
                  const selectedCount = (
                    selectedItemIds[supplier.supplierId] ?? []
                  ).length;
                  return (
                    <div
                      key={supplier.supplierId}
                      className="border border-slate-200 rounded-xl overflow-hidden hover:border-indigo-400 transition-all"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handleSupplierClick(supplier.supplierId)
                            }
                            className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm shrink-0 hover:opacity-90 transition-opacity"
                          >
                            {supplier.supplierName.charAt(0)}
                          </button>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm">
                              {supplier.supplierName}
                            </h3>
                            <p className="text-[11px] text-slate-500">
                              {toArabicNumeral(
                                String(supplier.coveredProductCount),
                                language,
                              )}{" "}
                              product
                              {supplier.coveredProductCount !== 1
                                ? "s"
                                : ""}{" "}
                              covered — est.{" "}
                              {toArabicNumeral(
                                supplier.totalEstimatedCost.toLocaleString(),
                                language,
                              )}{" "}
                              {t("currency")}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleSupplierClick(supplier.supplierId)
                          }
                          className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                        >
                          {t("clickToViewProfile" as any)} →
                        </button>
                      </div>

                      {/* Product checklist */}
                      <div className="divide-y divide-slate-100">
                        {supplier.coveredProducts.map((cp) => {
                          const product = order.products.find(
                            (p) => p.groupOrderItemId === cp.groupOrderItemId,
                          );
                          if (!product) return null;
                          const isUnassigned =
                            product.itemStatus === "Unassigned";
                          const isChecked = (
                            selectedItemIds[supplier.supplierId] ?? []
                          ).includes(cp.groupOrderItemId);
                          const currentTier =
                            cp.pricingTiers.length > 0
                              ? cp.pricingTiers.find(
                                  (t) =>
                                    product.targetQuantity >= t.minQty &&
                                    (t.maxQty == null ||
                                      product.targetQuantity <= t.maxQty),
                                )
                              : null;
                          const displayPrice =
                            currentTier?.unitPrice ?? cp.unitPrice;
                          return (
                            <div
                              key={cp.groupOrderItemId}
                              className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                {isUnassigned ? (
                                  <button
                                    onClick={() =>
                                      toggleItem(
                                        supplier.supplierId,
                                        cp.groupOrderItemId,
                                      )
                                    }
                                    className="shrink-0"
                                  >
                                    {isChecked ? (
                                      <CheckSquare className="w-5 h-5 text-indigo-600" />
                                    ) : (
                                      <Square className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                                    )}
                                  </button>
                                ) : (
                                  <div className="w-5 h-5 shrink-0" />
                                )}
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-slate-900 truncate">
                                    {product.productName}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    Need:{" "}
                                    {toArabicNumeral(
                                      String(product.targetQuantity),
                                      language,
                                    )}{" "}
                                    {getUnitDisplay(product.unit, language)}
                                    {cp.availableStock <
                                      product.targetQuantity && (
                                      <span className="text-red-500 ml-1">
                                        (Stock:{" "}
                                        {toArabicNumeral(
                                          String(cp.availableStock),
                                          language,
                                        )}
                                        )
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right shrink-0 ml-3">
                                <p className="text-sm font-bold text-indigo-700">
                                  {toArabicNumeral(
                                    displayPrice.toLocaleString(),
                                    language,
                                  )}{" "}
                                  {t("currency")}/
                                  {getUnitDisplay(product.unit, language)}
                                </p>
                                {currentTier && (
                                  <p className="text-[10px] text-slate-400">
                                    {currentTier.maxQty
                                      ? `${toArabicNumeral(String(currentTier.minQty), language)}-${toArabicNumeral(String(currentTier.maxQty), language)}`
                                      : `${toArabicNumeral(String(currentTier.minQty), language)}+`}{" "}
                                    {getUnitDisplay(product.unit, language)}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Actions */}
                      {deadlinePassed && unassignedItems.length > 0 && (
                        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-100">
                          <button
                            onClick={() =>
                              selectAllUnassigned(
                                supplier.supplierId,
                                unassignedItems.map((u) => u.groupOrderItemId),
                              )
                            }
                            className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                          >
                            {t("selectAll" as any)} (
                            {toArabicNumeral(
                              String(unassignedItems.length),
                              language,
                            )}
                            )
                          </button>
                          <button
                            onClick={() => {
                              if (selectedCount === 0) {
                                setAssignError(
                                  "Please select items to assign.",
                                );
                                return;
                              }
                              setAssignTarget(supplier.supplierId);
                            }}
                            disabled={assigning}
                            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                          >
                            {assigning && (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            )}
                            {t("assign" as any)} (
                            {toArabicNumeral(String(selectedCount), language)})
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {assignError && (
              <p className="text-xs text-red-600 mt-3 text-center">
                {assignError}
              </p>
            )}
          </div>
        )}

        {/* ── Supplier Assignment Status (Creator Only) ── */}
        {(order.status === "PendingApproval" || order.status === "Locked") &&
          isCreator && (
            <div
              className={`bg-white rounded-xl border p-6 mt-4 ${order.status === "Locked" ? "border-emerald-200" : "border-amber-200"}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${order.status === "Locked" ? "bg-emerald-100" : "bg-amber-100"}`}
                >
                  {order.status === "Locked" ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900">
                    {order.status === "Locked"
                      ? t("supplierAccepted" as any)
                      : t("pendingApproval" as any)}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {toArabicNumeral(
                      String(order.assignedProductCount ?? 0),
                      language,
                    )}{" "}
                    /{" "}
                    {toArabicNumeral(
                      String(order.totalProductCount ?? order.products.length),
                      language,
                    )}{" "}
                    items assigned
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* ── Assign Confirmation Dialog ── */}
        {assignTarget &&
          (() => {
            const supplier = eligibleSuppliers.find(
              (s) => s.supplierId === assignTarget,
            );
            const itemIds = selectedItemIds[assignTarget] ?? [];
            const itemNames = itemIds
              .map(
                (id) =>
                  order.products.find((p) => p.groupOrderItemId === id)
                    ?.productName,
              )
              .filter(Boolean);
            return (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setAssignTarget(null);
                }}
              >
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
                  <h3 className="text-sm font-bold text-slate-900">
                    {t("assignSupplierConfirmTitle" as any)}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {t("assignSupplierConfirmDesc" as any)}{" "}
                    <span className="font-bold text-indigo-600">
                      {supplier?.supplierName}
                    </span>
                  </p>
                  {itemNames.length > 0 && (
                    <div className="mt-3 bg-slate-50 rounded-xl p-3">
                      <p className="text-xs font-semibold text-slate-600 mb-1.5">
                        Items (
                        {toArabicNumeral(String(itemNames.length), language)}):
                      </p>
                      <ul className="space-y-1">
                        {itemNames.map((name, i) => (
                          <li
                            key={i}
                            className="text-xs text-slate-700 flex items-center gap-1.5"
                          >
                            <CheckCircle className="w-3 h-3 text-indigo-500 shrink-0" />
                            {name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

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
                      {assigning && (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      )}
                      {assigning
                        ? t("assigning" as any)
                        : `Assign ${toArabicNumeral(String(itemNames.length), language)} item${itemNames.length !== 1 ? "s" : ""}`}
                    </button>
                  </div>
                  {assignError && (
                    <p className="text-xs text-red-600 mt-3 text-center">
                      {assignError}
                    </p>
                  )}
                </div>
              </div>
            );
          })()}
      </div>
    </>
  );
}
