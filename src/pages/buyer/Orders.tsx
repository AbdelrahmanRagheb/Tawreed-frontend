import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  MapPin,
  Calendar,
  AlertCircle,
  UserPlus,
  UserCheck,
  Crown,
} from "lucide-react";
import { useLanguage } from "../../i18n";
import {
  buyerService,
  type BuyerOrderListItem,
} from "../../services/buyer.service";

const statusIconMap: Record<string, typeof Clock> = {
  Draft: Clock,
  Open: Package,
  Closed: Clock,
  Completed: CheckCircle,
  Cancelled: XCircle,
};

const statusColorMap: Record<string, string> = {
  Draft: "text-slate-600",
  Open: "text-emerald-600",
  Closed: "text-slate-600",
  Completed: "text-emerald-600",
  Cancelled: "text-red-600",
};

const statusBgMap: Record<string, string> = {
  Draft: "bg-slate-100",
  Open: "bg-emerald-100",
  Closed: "bg-slate-200",
  Completed: "bg-emerald-100",
  Cancelled: "bg-red-100",
};

type Tab = "all" | "mine" | "joined" | "nearby";

export function Orders() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<BuyerOrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tab, setTab] = useState<Tab>("all");

  useEffect(() => {
    setLoading(true);
    buyerService
      .listOrders({ status: statusFilter || undefined, page: 1, limit: 50 })
      .then((res) => {
        const all = res.data.items;
        if (statusFilter) {
          setOrders(all);
        } else {
          setOrders(all);
        }
      })
      .catch((err) =>
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load orders",
        ),
      )
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const filteredOrders = orders.filter((o) => {
    if (tab === "all") return true;
    if (tab === "mine") return o.isCreator;
    if (tab === "joined") return !o.isCreator && o.isParticipant;
    if (tab === "nearby") return !o.isCreator && !o.isParticipant;
    return true;
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: t("allOrders") },
    { key: "mine", label: t("myOrder") },
    { key: "joined", label: t("joinedBadge") },
    { key: "nearby", label: t("ordersNearYou") },
  ];

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
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("myOrders")}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {filteredOrders.length} {t("ordersPlaced")}
          </p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">{t("filter")}: All</option>
          <option value="Open">{t("activeOrders")}</option>
          <option value="Closed">{t("closed")}</option>
          <option value="Completed">{t("completedOrders")}</option>
          <option value="Cancelled">{t("cancelledOrders")}</option>
        </select>
      </div>

      <div className="flex items-center gap-1 mb-6 border-b border-slate-200">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.key}
            onClick={() => setTab(tabItem.key)}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              tab === tabItem.key
                ? "text-indigo-600 border-indigo-600"
                : "text-slate-500 border-transparent hover:text-slate-700"
            }`}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredOrders.map((order) => {
          const StatusIcon = statusIconMap[order.status] || Clock;
          const color = statusColorMap[order.status] || "text-slate-600";
          const bg = statusBgMap[order.status] || "bg-slate-100";

          return (
            <div
              key={order.id}
              className="group bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer overflow-hidden"
              onClick={() => navigate(`/buyer/orders/${order.id}`)}
            >
              {/* ── Header Segment ── */}
              <div className="px-5 pt-5 pb-3.5 border-b border-slate-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                      {order.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {order.isCreator ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 border border-amber-200/60 text-amber-800">
                          <Crown className="w-3 h-3 text-amber-500" />
                          {t("myOrder" as any)}
                        </span>
                      ) : order.isParticipant ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 border border-emerald-200/60 text-emerald-800">
                          <UserCheck className="w-3 h-3 text-emerald-500" />
                          {t("joinedBadge" as any)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-50 border border-slate-200/60 text-slate-700">
                          <UserPlus className="w-3 h-3 text-slate-400" />
                          {t("joinOrder" as any)}
                        </span>
                      )}

                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(order.createdAt).toLocaleDateString(
                          language === "ar" ? "ar-EG" : "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${bg} ${color}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {order.status}
                  </span>
                </div>
              </div>

              {/* ── Body Segment ── */}
              <div className="px-5 py-4 flex-1 flex flex-col justify-between gap-3 bg-white">
                {/* Product Categories (with safe fallbacks) */}
                {(order as any).categories &&
                (order as any).categories.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {(order as any).categories
                      .slice(0, 3)
                      .map((cat: string) => (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200/40"
                        >
                          <span className="truncate max-w-[85px]">{cat}</span>
                        </span>
                      ))}
                    {(order as any).categories.length > 3 && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200/40">
                        +{(order as any).categories.length - 3}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-50 text-slate-500 border border-slate-200/40">
                      General Product
                    </span>
                  </div>
                )}

                {/* Structured Stats Grid */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-1 border-t border-slate-150/50 pt-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{order.region}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 justify-end">
                    <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {(order as any).productCount ||
                        (order as any).productsCount ||
                        (order as any).products?.length ||
                        0}{" "}
                      {t("products" as any)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 col-span-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {new Date(order.deadline).toLocaleString(
                        language === "ar" ? "ar-SA" : "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Footer Segment ── */}
              <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {order.participantCount} {t("participants" as any)}
                </span>
                <span className="text-base font-extrabold text-indigo-750 tracking-tight">
                  {order.totalOrderValue.toLocaleString()} EGP
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">{t("noOrdersFound")}</p>
        </div>
      )}
    </div>
  );
}
