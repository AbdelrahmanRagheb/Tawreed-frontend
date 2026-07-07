import { useEffect, useState, useRef } from "react";
import { Truck, Package, Clock, CheckCircle, XCircle, AlertCircle, User, Calendar } from "lucide-react";
import { useLanguage, toArabicNumeral } from "../../i18n";
import { useAuth } from "../../contexts/AuthContext";
import { buyerService, type BuyerDeliveryDto } from "../../services/buyer.service";

const STEPS = ["Pending", "PickedUp", "OutForDelivery", "Delivered"] as const;

const statusLabels: Record<string, { en: string; ar: string }> = {
  Pending: { en: "Pending", ar: "قيد الانتظار" },
  PickedUp: { en: "Picked Up", ar: "تم الاستلام" },
  OutForDelivery: { en: "Out for Delivery", ar: "قيد التوصيل" },
  Delivered: { en: "Delivered", ar: "تم التسليم" },
  Cancelled: { en: "Cancelled", ar: "ملغي" },
};

export function BuyerDeliveries() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<BuyerDeliveryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDeliveries = async (silent = false) => {
    if (!user?.id) return;
    if (!silent) setLoading(true);
    try {
      const res = await buyerService.getMyDeliveries();
      setDeliveries(res.data);
    } catch (err: any) {
      if (!silent) setError(err?.response?.data?.message || err?.message || "Failed to load deliveries");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    const interval = setInterval(() => fetchDeliveries(true), 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const getStepIndex = (status: string) => {
    const idx = STEPS.indexOf(status as typeof STEPS[number]);
    return idx >= 0 ? idx : -1;
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
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t("myDeliveries")}</h1>
        <p className="text-sm text-slate-500 mt-1">{toArabicNumeral(String(deliveries.length), language)} {t("deliveries")}</p>
      </div>

      {deliveries.length === 0 && (
        <div className="text-center py-16">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">{t("noDeliveries")}</p>
        </div>
      )}

      <div className="space-y-4">
        {deliveries.map((delivery) => {
          const currentStep = getStepIndex(delivery.status);
          const isCancelled = delivery.status === "Cancelled";

          return (
            <div key={delivery.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{delivery.orderTitle}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{delivery.shippingRegion}</p>
                </div>
                {isCancelled ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                    <XCircle className="w-3 h-3" />
                    {t("cancelled" as any)}
                  </span>
                ) : currentStep >= 0 && (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    currentStep === 3 ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"
                  }`}>
                    <Package className="w-3 h-3" />
                    {statusLabels[delivery.status]?.[language === "ar" ? "ar" : "en"] || delivery.status}
                  </span>
                )}
              </div>

              {/* Tracking Timeline */}
              {!isCancelled && (
                <div className="px-5 py-5">
                  <div className="flex items-center">
                    {STEPS.map((step, idx) => {
                      const isCompleted = idx < currentStep;
                      const isCurrent = idx === currentStep;
                      const isFuture = idx > currentStep;

                      return (
                        <div
                          key={step}
                          className="flex-1 flex flex-col items-center relative"
                        >
                          {/* Connector line - Adjusted for LTR/RTL layout direction */}
                          {idx > 0 && (
                            <div
                              className={`absolute top-3.5 w-full h-0.5 -translate-y-1/2 ${
                                language === "ar" ? "left-1/2" : "right-1/2"
                              } ${
                                isCompleted
                                  ? "bg-emerald-500"
                                  : isCurrent
                                    ? "bg-amber-400"
                                    : "bg-slate-200"
                              }`}
                            />
                          )}

                          {/* Dot */}
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center z-10 ${
                              isCompleted
                                ? "bg-emerald-500 text-white"
                                : isCurrent
                                  ? "bg-amber-400 text-white ring-4 ring-amber-100 animate-pulse"
                                  : "bg-slate-200 text-slate-400"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <div
                                className={`w-2.5 h-2.5 rounded-full ${isCurrent ? "bg-white" : "bg-slate-400"}`}
                              />
                            )}
                          </div>

                          {/* Label - Added whitespace-nowrap to prevent text wrapping */}
                          <p
                            className={`text-[10px] mt-1.5 text-center leading-tight whitespace-nowrap ${
                              isCompleted
                                ? "text-emerald-700 font-semibold"
                                : isCurrent
                                  ? "text-amber-700 font-semibold"
                                  : "text-slate-400"
                            }`}
                          >
                            {language === "ar"
                              ? step === "Pending"
                                ? "قيد الانتظار"
                                : step === "PickedUp"
                                  ? "تم الاستلام"
                                  : step === "OutForDelivery"
                                    ? "قيد التوصيل"
                                    : "تم التسليم"
                              : step === "Pending"
                                ? "Pending"
                                : step === "PickedUp"
                                  ? "Picked Up"
                                  : step === "OutForDelivery"
                                    ? "On Route"
                                    : "Delivered"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="px-5 py-4 space-y-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {t("scheduledDate")}
                  </span>
                  <span className="text-xs font-semibold text-slate-900">
                    {delivery.scheduledAt
                      ? new Date(delivery.scheduledAt).toLocaleString(language === "ar" ? "ar-SA" : "en-US")
                      : "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> {t("deliveryPerson")}
                  </span>
                  <span className="text-xs font-semibold text-slate-900">
                    {delivery.deliveryPersonName || "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{t("verificationCode")}</span>
                  <span className="text-sm font-bold text-indigo-600 tracking-widest">
                    {toArabicNumeral(delivery.verificationCode, language)}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-slate-600 mb-2">{t("items")}</p>
                <div className="space-y-1.5">
                  {delivery.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-700">{item.productName}</span>
                      <span className="font-medium text-slate-900">×{toArabicNumeral(String(item.quantity), language)}</span>
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
