import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Package,
  Users,
  Truck,
  ShieldCheck,
  ShieldX,
  UserCheck,
  UserX,
  Info,
  CheckCheck,
  AlertTriangle,
} from "lucide-react";
import { useLanguage } from "../../i18n";
import { useAuth } from "../../contexts/AuthContext";
import {
  publicService,
  type NotificationItem,
} from "../../services/public.service";

// Maps backend notification types to icons and colors
const typeConfig: Record<
  string,
  { icon: typeof Package; color: string; bg: string; border: string }
> = {
  // Buyer-facing order notifications
  NewGroupOrder: {
    icon: Package,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50/80",
    border: "border-blue-100",
  },
  BuyerJoinedOrder: {
    icon: UserCheck,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50/80",
    border: "border-emerald-100",
  },
  BuyerLeftOrder: {
    icon: UserX,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50/80",
    border: "border-orange-100",
  },
  OrderQuantityUpdated: {
    icon: Users,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50/80",
    border: "border-violet-100",
  },
  // Supplier-facing order notifications
  SupplierAcceptedOrder: {
    icon: ShieldCheck,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50/80",
    border: "border-emerald-100",
  },
  SupplierDeclinedOrder: {
    icon: ShieldX,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50/80",
    border: "border-red-100",
  },
  // Delivery notifications
  DeliveryStatusUpdated: {
    icon: Truck,
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50/80",
    border: "border-sky-100",
  },
  // Admin notifications
  SupplierStatusChanged: {
    icon: ShieldCheck,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50/80",
    border: "border-indigo-100",
  },
  OrderForceClosed: {
    icon: ShieldX,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50/80",
    border: "border-red-100",
  },
  // Fallback
  system: {
    icon: Info,
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100/80",
    border: "border-slate-200/60",
  },
};

export function Notifications() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    if (!user?.id) return;
    try {
      const res = await publicService.getUnreadNotifications(user.id);
      setNotifications(res.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load notifications",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user?.id]);

  const markAllAsRead = async () => {
    if (!user?.id) return;
    try {
      await publicService.markAllAsRead(user.id);
      setNotifications([]);
    } catch (err: any) {
      console.error("Failed to mark all as read", err);
    }
  };

  const unread = notifications.filter((n) => !n.isRead).length;

  // Modern Skeleton Loader replaces the standard raw loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between h-12">
            <div className="space-y-2">
              <div className="h-6 w-36 bg-slate-200 rounded-md animate-pulse" />
              <div className="h-4 w-20 bg-slate-100 rounded-md animate-pulse" />
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200/60 animate-pulse"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">
            An error occurred
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* ── Header Area ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {t("notifications")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-2">
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-200/60 text-slate-800">
                {unread}
              </span>
              {t("unread")}
            </p>
          </div>

          {unread > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 transition-all shadow-xs shrink-0"
            >
              <CheckCheck className="w-4 h-4 text-slate-500" />
              {t("markAllRead")}
            </button>
          )}
        </div>

        {/* ── Notification Stack ── */}
        <div className="space-y-2.5">
          {notifications.map((notification) => {
            const cfg = typeConfig[notification.type] || typeConfig.system;
            const TypeIcon = cfg.icon;

            const title =
              language === "ar" ? notification.titleAr : notification.titleEn;
            const description =
              language === "ar" ? notification.bodyAr : notification.bodyEn;

            const handleClick = async () => {
              if (!notification.isRead) {
                await publicService.markAsRead(notification.id);
                setNotifications((prev) =>
                  prev.map((n) =>
                    n.id === notification.id ? { ...n, isRead: true } : n
                  )
                );
              }
              if (notification.relatedOrderId) {
                navigate(`/buyer/orders/${notification.relatedOrderId}`);
              }
            };

            return (
              <div
                key={notification.id}
                onClick={handleClick}
                className={`group relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 hover:border-slate-300 hover:shadow-xs cursor-pointer ${
                  notification.isRead
                    ? "bg-white border-slate-200/80"
                    : "bg-white border-slate-200 shadow-[2px_0_0_0_inset_#4f46e5] rtl:shadow-[-2px_0_0_0_inset_#4f46e5]"
                }`}
              >
                {/* Visual Icon Container */}
                <div
                  className={`w-10 h-10 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0`}
                >
                  <TypeIcon className={`w-5 h-5 ${cfg.color}`} />
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      className={`text-sm leading-snug ${notification.isRead ? "font-medium text-slate-700" : "font-semibold text-slate-900"}`}
                    >
                      {title}
                    </h3>

                    {/* Unread Glowing Dot Indicator */}
                    {!notification.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
                    )}
                  </div>

                  {/* Optional message/description rendering */}
                  {description && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-2xl break-words">
                      {description}
                    </p>
                  )}

                  {/* Crisp Timestamp rendering */}
                  <p className="text-[11px] font-medium text-slate-400 mt-2">
                    {new Date(notification.createdAt).toLocaleDateString(
                      language === "ar" ? "ar-SA" : "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>
              </div>
            );
          })}

          {/* ── Empty State ── */}
          {notifications.length === 0 && (
            <div className="text-center py-20 bg-white border border-slate-200/60 rounded-2xl shadow-xs">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {t("noNotifications")}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                We will let you know when something shifts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
