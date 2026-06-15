import { Bell, Package, MessageSquare, Info, CheckCheck } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { mockNotifications } from '../../data';

const typeConfig = {
  order: { icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  message: { icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  system: { icon: Info, color: 'text-amber-600', bg: 'bg-amber-100' },
};

export function Notifications() {
  const { language, t } = useLanguage();
  const unread = mockNotifications.filter((n) => !n.read).length;

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('notifications')}</h1>
          <p className="text-sm text-slate-500 mt-1">{unread} {t('unread')}</p>
        </div>
        {unread > 0 && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
            <CheckCheck className="w-3.5 h-3.5" />
            {t('markAllRead')}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {mockNotifications.map((notification) => {
          const TypeIcon = typeConfig[notification.type].icon;
          const typeColors = typeConfig[notification.type];
          return (
            <div
              key={notification.id}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer hover:bg-slate-50 ${
                notification.read ? 'bg-white border-slate-200' : 'bg-indigo-50/50 border-indigo-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl ${typeColors.bg} flex items-center justify-center shrink-0`}>
                <TypeIcon className={`w-5 h-5 ${typeColors.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`text-sm ${notification.read ? 'font-medium' : 'font-semibold'} text-slate-900`}>
                    {notification.title[language]}
                  </h3>
                  {!notification.read && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />}
                </div>
                <p className="text-sm text-slate-600 mt-0.5">{notification.message[language]}</p>
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
      </div>
    </div>
  );
}
