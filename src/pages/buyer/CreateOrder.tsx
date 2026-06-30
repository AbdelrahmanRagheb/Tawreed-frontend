import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Plus,
  Minus,
  X,
  ShoppingCart,
  Package,
  MapPin,
  Users,
  Eye,
  TrendingDown,
  CheckCircle,
  Save,
  Send,
  FileText,
  Filter,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { useLanguage, getUnitDisplay, toArabicNumeral } from "../../i18n";
import {
  publicService,
  type PublicProduct,
  type PublicCategory,
  type PublicRegion,
} from "../../services/public.service";
import {
  buyerService,
  type CreateOrderRequest,
  type BuyerOrderListItem,
} from "../../services/buyer.service";
import type { SavedOrderDraft } from "../../types";

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
  const resumeDraft = (location.state as { resumeDraft?: BuyerOrderListItem })
    ?.resumeDraft;
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [groupRegionId, setGroupRegionId] = useState("");
  const [groupRegionNameAr, setGroupRegionNameAr] = useState("");
  const [groupRegionNameEn, setGroupRegionNameEn] = useState("");
  const [regionChildren, setRegionChildren] = useState<PublicRegion[]>([]);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [orderName, setOrderName] = useState("");
  const [orderDescription, setOrderDescription] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [modalProduct, setModalProduct] = useState<SelectedProduct | null>(
    null,
  );
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

        // Debug: log the full profile response to inspect group region fields
        console.log("[CreateOrder] Buyer profile response:", profileRes.data);
        console.log(
          "[CreateOrder] groupRegionId:",
          profileRes.data.groupRegionId,
        );
        console.log(
          "[CreateOrder] groupRegionNameAr:",
          profileRes.data.groupRegionNameAr,
        );
        console.log(
          "[CreateOrder] groupRegionNameEn:",
          profileRes.data.groupRegionNameEn,
        );
        console.log("[CreateOrder] regionId (raw):", profileRes.data.regionId);
        console.log(
          "[CreateOrder] regionName (raw):",
          profileRes.data.regionName,
        );

        // Fallback allowed types (must match admin GroupRegionTypes setting)
        // API returns type as enum integer: 0=Country, 1=Governorate, 2=Markaz, 3=Qism,
        // 4=Madina, 5=Hayy, 6=PoliceDepartment, 7=Region, ...
        const allowedGroupTypeValues = new Set([1, 2, 3, 6, 7]); // Governorate, Markaz, Qism, PoliceDepartment, Region

        // Use the group region resolved by the backend if available
        if (profileRes.data.groupRegionId) {
          setGroupRegionId(profileRes.data.groupRegionId);
          setGroupRegionNameAr(profileRes.data.groupRegionNameAr);
          setGroupRegionNameEn(profileRes.data.groupRegionNameEn);
        } else {
          // Backend didn't resolve — walk up on the frontend
          (async () => {
            let curId: string | null = profileRes.data.regionId;
            const maxDepth = 10;
            let depth = 0;
            // First, skip the buyer's own region by going to parent
            try {
              const selfReg = (await publicService.getRegion(curId)).data;
              curId = selfReg.parentId;
            } catch {
              return;
            }
            // Now walk up until we find a matching type
            while (curId && depth < maxDepth) {
              try {
                const reg = (await publicService.getRegion(curId)).data;
                const typeVal =
                  typeof reg.type === "number"
                    ? reg.type
                    : reg.type
                      ? parseInt(reg.type, 10)
                      : NaN;
                console.log(
                  `[CreateOrder] Walking up: id=${reg.id}, nameAr=${reg.nameAr}, nameEn=${reg.nameEn}, type=${reg.type} (${typeVal})`,
                );
                if (!isNaN(typeVal) && allowedGroupTypeValues.has(typeVal)) {
                  setGroupRegionId(reg.id);
                  setGroupRegionNameAr(reg.nameAr);
                  setGroupRegionNameEn(reg.nameEn);
                  console.log(
                    `[CreateOrder] Found group region: ${reg.nameAr} / ${reg.nameEn} (type=${reg.type})`,
                  );
                  return;
                }
                curId = reg.parentId;
                depth++;
              } catch {
                break;
              }
            }
            // Fallback: show raw region name
            setGroupRegionNameAr(profileRes.data.regionName);
            setGroupRegionNameEn(profileRes.data.regionName);
          })();
        }

        if (resumeDraft) {
          buyerService
            .getOrderDetail(resumeDraft.id)
            .then((detailRes) => {
              const detail = detailRes.data;
              setOrderName(detail.title);
              setOrderDescription(detail.description || "");
              const items: CartItem[] = detail.products.map((p) => {
                const product = prodRes.data.find((x) => x.id === p.productId);
                return {
                  productId: p.productId,
                  name: p.productName,
                  category: product?.categoryName || "",
                  quantity: p.targetQuantity,
                  price: p.unitPrice || 0,
                  unit: p.unit,
                  stock: product?.stock || 0,
                };
              });
              setCart(items);
            })
            .catch(() => {});
        }
      })
      .catch((err) =>
        setError(
          err?.response?.data?.message || err?.message || "Failed to load data",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(search.toLowerCase());
    const catMatch = !categoryFilter || p.categoryName === categoryFilter;
    return nameMatch && catMatch;
  });

  const addToCart = (
    productId: string,
    name: string,
    category: string,
    price: number,
    quantity: number,
    stock: number,
  ) => {
    if (quantity < 1) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [
        ...prev,
        { productId, name, category, quantity, price, unit: "UNIT", stock },
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
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const isValid = orderName.trim() && cart.length > 0;

  const groupRegionName =
    language === "ar" ? groupRegionNameAr : groupRegionNameEn;

  const handleRegionClick = async () => {
    if (!groupRegionId) return;
    setShowRegionModal(true);
    if (regionChildren.length === 0) {
      setLoadingChildren(true);
      try {
        const res = await publicService.getRegionChildren(groupRegionId);
        setRegionChildren(res.data);
      } catch {
        // No children available
      } finally {
        setLoadingChildren(false);
      }
    }
  };

  const handlePublish = async () => {
    if (!isValid) return;
    setPublishing(true);
    try {
      const data: CreateOrderRequest = {
        title: orderName,
        description: orderDescription || undefined,
        isUrgent,
        items: cart.map((item) => ({
          productId: item.productId,
          targetQuantity: item.quantity,
        })),
      };
      await buyerService.createOrder(data);
      navigate("/buyer/orders");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create order",
      );
    } finally {
      setPublishing(false);
    }
  };

  const saveAsDraft = async () => {
    try {
      const data: CreateOrderRequest = {
        title: orderName || "Untitled Draft",
        description: orderDescription || undefined,
        isUrgent,
        items: cart.map((item) => ({
          productId: item.productId,
          targetQuantity: item.quantity,
        })),
      };
      await buyerService.saveDraft(data);
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 3000);
    } catch (err: any) {
      console.error("Failed to save draft", err);
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
          <h1 className="text-2xl font-bold text-slate-900">
            {t("createGroupOrder" as any)}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t("createGroupOrderDesc" as any)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={saveAsDraft}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            {t("saveDraft" as any)}
          </button>
          <button
            onClick={handlePublish}
            disabled={!isValid || publishing}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
            {publishing ? t("publishing" as any) : t("publishOrder" as any)}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 py-5 px-5 mb-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600" />
          {t("orderInformation" as any)}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t("orderName" as any)} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={orderName}
              onChange={(e) => setOrderName(e.target.value)}
              placeholder={t("orderNamePlaceholder" as any)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t("deliveryRegion" as any)}
            </label>
            <button
              type="button"
              onClick={handleRegionClick}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-colors text-left"
            >
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="text-slate-700 font-medium truncate">
                  {groupRegionName || t("loading" as any)}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
            </button>
            <p className="text-[10px] text-slate-400 mt-1">
              {language === "ar"
                ? "اضغط لعرض المناطق المشمولة"
                : "Click to view included areas"}
            </p>
          </div>
        </div>

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t("description" as any)}
            </label>
            <input
              type="text"
              value={orderDescription}
              onChange={(e) => setOrderDescription(e.target.value)}
              placeholder={t("descriptionPlaceholder" as any)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0 pb-px">
            <span className="text-[11px] font-medium text-slate-500">
              {language === "ar" ? "الأولوية:" : "Priority:"}
            </span>
            <div className="flex rounded-lg border border-slate-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setIsUrgent(false)}
                className={`px-2.5 py-1.5 text-xs font-semibold transition-all ${
                  !isUrgent
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setIsUrgent(true)}
                className={`px-2.5 py-1.5 text-xs font-semibold transition-all ${
                  isUrgent
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                Urgent
              </button>
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
              placeholder={t("searchProducts" as any)}
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
              <option value="">{t("allCategories" as any)}</option>
              {categories.map((cat) => (
                <option
                  key={cat.id}
                  value={language === "ar" ? cat.nameAr : cat.nameEn}
                >
                  {language === "ar" ? cat.nameAr : cat.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="h-32 overflow-hidden bg-slate-100">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3.5">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span>
                        {t("category" as any)}: {product.categoryName}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-lg font-bold text-slate-900">
                        {product.marketPrice
                          ? `${toArabicNumeral(String(product.marketPrice), language)} EGP`
                          : "-"}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {getUnitDisplay(product.unit, language)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3.5 pt-0">
                  <button
                    onClick={() => {
                      setModalProduct({
                        productId: product.id,
                        name: product.name,
                        category: product.categoryName,
                        price: product.marketPrice ?? 0,
                        unit: product.unit || "UNIT",
                        stock: product.stock,
                        image: product.imageUrl,
                        supplier: product.categoryName,
                      });
                      setModalQty(1);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {t("addProduct" as any)}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">
                {t("noProductsFound" as any)}
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="space-y-4 sticky top-8">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-indigo-600" />
                  {t("groupOrderSummary" as any)}
                </h2>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
                  {toArabicNumeral(String(cart.length), language)} {t("productsAdded" as any)}
                </span>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">
                    {t("cartEmpty" as any)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {t("addProducts" as any)}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="bg-slate-50 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-medium text-slate-900 truncate flex-1">
                          {item.name}
                        </p>
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
                          <span className="w-8 text-center text-xs font-semibold text-slate-900">
                            {toArabicNumeral(String(item.quantity), language)}
                          </span>
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
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                {t("orderStatistics" as any)}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] text-slate-500">
                    {t("products" as any)}
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {toArabicNumeral(String(cart.length), language)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">
                    {t("totalQuantity" as any)}
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {toArabicNumeral(String(totalQuantity), language)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                {t("reviewChecklist" as any)}
              </h3>
              <div className="space-y-2">
                {[
                  { label: t("orderName" as any), valid: !!orderName.trim() },
                  { label: t("region" as any), valid: !!groupRegionName },
                  { label: t("productsAdded" as any), valid: cart.length > 0 },
                  {
                    label: t("quantitiesValid" as any),
                    valid: cart.every((item) => item.quantity > 0),
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <CheckCircle
                      className={`w-4 h-4 ${item.valid ? "text-emerald-500" : "text-slate-300"}`}
                    />
                    <span
                      className={`text-xs ${item.valid ? "text-slate-700" : "text-slate-400"}`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {draftSaved && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2 animate-pulse">
          <CheckCircle className="w-4 h-4" />
          {t("draftSaved" as any)}
        </div>
      )}

      {modalProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setModalProduct(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-sm mx-4 overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-40 overflow-hidden bg-slate-100">
              <img
                src={modalProduct.image}
                alt={modalProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-slate-900">
                {modalProduct.name}
              </h3>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                <span>
                  {t("category" as any)}: {modalProduct.category}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  {t("desiredQuantity" as any)}
                </label>
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
                    onChange={(e) =>
                      setModalQty(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-20 text-center py-2 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => setModalQty(modalQty + 1)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-500">
                    {getUnitDisplay(modalProduct.unit, language)}
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  addToCart(
                    modalProduct.productId,
                    modalProduct.name,
                    modalProduct.category,
                    modalProduct.price,
                    modalQty,
                    modalProduct.stock,
                  )
                }
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {t("addToOrder" as any)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Region Children Modal */}
      {showRegionModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowRegionModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  {groupRegionName}
                </h2>
              </div>
              <button
                onClick={() => setShowRegionModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                {language === "ar" ? "المناطق المشمولة" : "Areas Included"}
              </p>

              {loadingChildren ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : regionChildren.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {regionChildren.map((child) => (
                    <span
                      key={child.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                    >
                      <MapPin className="w-3 h-3" />
                      {language === "ar" ? child.nameAr : child.nameEn}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-8">
                  {language === "ar"
                    ? "لا توجد مناطق فرعية"
                    : "No sub-areas found"}
                </p>
              )}

              <p className="text-[11px] text-slate-400 mt-4">
                {language === "ar"
                  ? "جميع المناطق المذكورة أعلاه مشمولة في هذا الطلب الجماعي"
                  : "All areas listed above are included in this group order"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
