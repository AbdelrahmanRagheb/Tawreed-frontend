import { useEffect, useState } from "react";
import { Truck, Package, Clock, CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import { useLanguage } from "../../i18n";
import { useAuth } from "../../contexts/AuthContext";
import { buyerService, type BuyerDeliveryDto } from "../../services/buyer.service";

const statusConfig: Record<string, { icon: typeof Package; color: string; bg: string; label: string }> = {
  Pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-100", label: "Pending" },
  Preparing: { icon: Package, color: "text-blue-600", bg: "bg-blue-100", label: "Preparing" },
  Shipped: { icon: Truck, color: "text-indigo-600", bg: "bg-indigo-100", label: "Shipped" },
  Delivered: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100", label: "Delivered" },
  Failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-100", label: "Failed" },
};

export function BuyerDeliveries() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<BuyerDeliveryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    buyerService.getMyDeliveries()
      .then((res) => setDeliveries(res.data))
      .catch((err) => setError(err?.response?.data?.message || err?.message || "Failed to load deliveries"))
      .finally(() => setLoading(false));
  }, [user?.id]);

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
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t("myDeliveries")}</h1>
        <p className="text-sm text-slate-500 mt-1">{deliveries.length} {t("deliveries")}</p>
      </div>

      {deliveries.length === 0 && (
        <div className="text-center py-16">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">{t("noDeliveries")}</p>
        </div>
      )}

      <div className="space-y-4">
        {deliveries.map((delivery) => {
          const cfg = statusConfig[delivery.status] || { icon: Info, color: "text-slate-600", bg: "bg-slate-100", label: delivery.status };
          const StatusIcon = cfg.icon;

          return (
            <div key={delivery.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{delivery.orderTitle}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{delivery.shippingAddress}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${cfg.bg} ${cfg.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {cfg.label}
                </span>
              </div>

              <div className="px-5 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{t("scheduledDate")}</span>
                  <span className="text-xs font-semibold text-slate-900">
                    {delivery.scheduledAt
                      ? new Date(delivery.scheduledAt).toLocaleString(language === "ar" ? "ar-SA" : "en-US")
                      : "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{t("deliveryPerson")}</span>
                  <span className="text-xs font-semibold text-slate-900">
                    {delivery.deliveryPersonName || "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{t("verificationCode")}</span>
                  <span className="text-sm font-bold text-indigo-600 tracking-widest">
                    {delivery.verificationCode}
                  </span>
                </div>
              </div>

              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-slate-600 mb-2">{t("items")}</p>
                <div className="space-y-1.5">
                  {delivery.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-700">{item.productName}</span>
                      <span className="font-medium text-slate-900">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}