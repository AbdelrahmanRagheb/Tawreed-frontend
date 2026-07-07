import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  MapPin,
  Users,
  Calendar,
  Bell,
  DollarSign,
  Percent,
  ArrowRight,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useLanguage, toArabicNumeral } from "../../i18n";
import {
  buyerService,
  type BuyerDashboardResponse,
} from "../../services/buyer.service";

export function BuyerDashboard() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [data, setData] = useState<BuyerDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    buyerService
      .getDashboard()
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load dashboard",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef3f9] p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-14 w-72 bg-slate-200/70 rounded-[2rem] animate-pulse" />
          <div className="h-32 bg-slate-200/70 rounded-[2rem] animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-64 bg-slate-200/70 rounded-[2rem] animate-pulse" />
            <div className="h-64 bg-slate-200/70 rounded-[2rem] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#eef3f9] flex items-center justify-center p-4">
        <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-200/60 max-w-sm text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const {
    activeOrders,
    nearbyOrders,
    notifications,
    trendingProducts,
    totalSavings,
    unreadNotificationCount,
  } = data;

  return (
    <div className="min-h-screen bg-[#eef3f9] p-4 md:p-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="blob-1 absolute -top-24 left-10 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="blob-2 absolute -bottom-16 right-40 h-[420px] w-[420px] rounded-full bg-indigo-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-6 fade-up">
        {/* Savings card */}
        <div className="relative overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-500 to-teal-600 p-5 md:p-6 text-white shadow-lg shadow-emerald-900/20">
          <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">
                {t("totalSavings")}
              </p>
              <p className="text-3xl md:text-4xl font-black mt-1">
                {toArabicNumeral(totalSavings.toLocaleString(), language)}{" "}
                {t("currency")}
              </p>
              <p className="text-emerald-200 text-xs mt-1.5 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5" />
                {t("saveUpTo")} 20%{" "}
                {language === "en" ? "on bulk orders" : "على الطلبات بالجملة"}
              </p>
            </div>
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Orders Near You + My Active Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Orders Near You */}
          <div className="rounded-[2rem] border border-white/70 bg-white/90 shadow-xl shadow-slate-200/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1e3a8a]" />
                <h2 className="text-sm font-extrabold text-slate-900">
                  {t("ordersNearYou")}
                </h2>
              </div>
              <button
                onClick={() => navigate("/buyer/orders")}
                className="text-xs font-bold text-[#1e3a8a] hover:text-[#2563eb] transition-colors"
              >
                {t("viewAll")} →
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {nearbyOrders.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-slate-500">
                  {t("noNearbyOrders")}
                </div>
              ) : (
                nearbyOrders.map((order) => (
                  <div
                    key={order.id}
                    className="px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => navigate("/buyer/orders/" + order.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {order.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {order.productName} x
                          {toArabicNumeral(String(order.quantity), language)} ·{" "}
                          {t("host")}: {order.creatorName}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {order.region}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />{" "}
                            {toArabicNumeral(
                              String(order.currentParticipants),
                              language,
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />{" "}
                            {new Date(order.deadline).toLocaleString(
                              language === "ar" ? "ar-SA" : "en-US",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* My Active Orders */}
          <div className="rounded-[2rem] border border-white/70 bg-white/90 shadow-xl shadow-slate-200/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1e3a8a]" />
                <h2 className="text-sm font-extrabold text-slate-900">
                  {t("myActiveOrders")}
                </h2>
              </div>
              <span className="text-xs bg-[#1e3a8a]/10 text-[#1e3a8a] px-2 py-0.5 rounded-full font-bold">
                {toArabicNumeral(String(activeOrders.length), language)}
              </span>
            </div>
            {activeOrders.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                {t("noNotifications")}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {activeOrders.map((order) => (
                  <div
                    key={order.id}
                    className="px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => navigate("/buyer/orders/" + order.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900">
                          {order.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {toArabicNumeral(
                            String(order.productCount),
                            language,
                          )}{" "}
                          {t("items")}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />{" "}
                            {new Date(order.deadline).toLocaleString(
                              language === "ar" ? "ar-SA" : "en-US",
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />{" "}
                            {toArabicNumeral(
                              order.totalValue.toLocaleString(),
                              language,
                            )}{" "}
                            {t("currency")}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            order.status === "Open"
                              ? "bg-emerald-100 text-emerald-700"
                              : order.status === "Closed"
                                ? "bg-slate-200 text-slate-600"
                                : order.status === "Completed"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : order.status === "Cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => navigate("/buyer/orders")}
              className="w-full py-3 text-xs font-bold text-[#1e3a8a] hover:bg-slate-50 transition-colors border-t border-slate-100"
            >
              {t("viewAll")} {t("orders")} →
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-[2rem] border border-white/70 bg-white/90 shadow-xl shadow-slate-200/60 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-extrabold text-slate-900">
                {t("notifications")}
              </h2>
              {unreadNotificationCount > 0 && (
                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">
                  {toArabicNumeral(String(unreadNotificationCount), language)}
                </span>
              )}
            </div>
            <button
              onClick={() => navigate("/buyer/notifications")}
              className="text-xs font-bold text-[#1e3a8a] hover:text-[#2563eb] transition-colors"
            >
              {t("viewAll")} →
            </button>
          </div>
          {notifications.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-slate-500">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              {t("noNotifications")}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="px-5 py-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900">
                      {language === "ar" ? n.titleAr : n.titleEn}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-2" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trending Products */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#1e3a8a]" />
              <h2 className="text-sm font-extrabold text-slate-900">
                {t("trendingProducts")}
              </h2>
            </div>
            <button
              onClick={() => navigate("/buyer/orders")}
              className="text-xs font-bold text-[#1e3a8a] hover:text-[#2563eb] transition-colors"
            >
              {t("viewAll")} →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {trendingProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-[1.75rem] border border-white/70 bg-white/90 shadow-lg shadow-slate-200/50 overflow-hidden transition hover:-translate-y-0.5 hover:shadow-xl group"
              >
                <div className="aspect-square overflow-hidden bg-slate-100">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {product.name}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-sm font-black text-[#1e3a8a]">
                      {toArabicNumeral(product.price.toFixed(2), language)}{" "}
                      {t("currency")}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {product.categoryName}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
