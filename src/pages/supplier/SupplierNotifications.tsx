import { useEffect, useState } from 'react';
import { Bell, Package, MessageSquare, Info, CheckCheck, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { useAuth } from '../../contexts/AuthContext';
import { publicService, type NotificationItem } from '../../services/public.service';

const typeConfig: Record<string, { icon: typeof Package; color: string; bg: string }> = {
  order: { icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  message: { icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  system: { icon: Info, color: 'text-amber-600', bg: 'bg-amber-100' },
  SupplierAssignedOrder: { icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-100' },
};

export function SupplierNotifications() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotifications = async () => {
    if (!user?.id) return;
    try {
      const res = await publicService.getUnreadNotifications(user.id);
      console.log('[Notifications] API response:', res.data);
      setNotifications(res.data);
    } catch (err: any) {
      console.error('[Notifications] API error:', err?.response?.data || err?.message || err);
      setError(err?.response?.data?.message || err?.message || 'Failed to load notifications');
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
      console.error('Failed to mark all as read', err);
    }
  };

  const unread = notifications.filter((n) => !n.isRead).length;

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
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('notifications')}</h1>
          <p className="text-sm text-slate-500 mt-1">{unread} {t('unread')}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllAsRead} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
            <CheckCheck className="w-3.5 h-3.5" />
            {t('markAllRead')}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((notification) => {
          const cfg = typeConfig[notification.type] || typeConfig.system;
          const TypeIcon = cfg.icon;
          return (
            <div
              key={notification.id}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer hover:bg-slate-50 ${
                notification.isRead ? 'bg-white border-slate-200' : 'bg-indigo-50/50 border-indigo-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                <TypeIcon className={`w-5 h-5 ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`text-sm ${notification.isRead ? 'font-medium' : 'font-semibold'} text-slate-900`}>
                    {language === 'ar' ? notification.titleAr : notification.titleEn}
                  </h3>
                  {!notification.isRead && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />}
                </div>
                {(language === 'ar' ? notification.bodyAr : notification.bodyEn) && (
                  <p className="text-xs text-slate-600 mt-1">
                    {language === 'ar' ? notification.bodyAr : notification.bodyEn}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-1.5">
                  {new Date(notification.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })}
        {notifications.length === 0 && (
          <div className="text-center py-20">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500">{t('noNotifications')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
