import { Truck, MapPin, Calendar, Hash, User, Box } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { mockDeliveries } from '../../data';
import type { Package } from 'lucide-react';

const statusConfig: Record<string, { icon: typeof Truck; color: string; bg: string; key: string }> = {
  preparing: { icon: Box, color: 'text-amber-600', bg: 'bg-amber-100', key: 'preparing' },
  'in-transit': { icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-100', key: 'inTransit' },
  delivered: { icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-100', key: 'delivered' },
  delayed: { icon: Truck, color: 'text-red-600', bg: 'bg-red-100', key: 'delayed' },
};

const progressMap: Record<string, { pct: number; color: string }> = {
  preparing: { pct: 20, color: 'bg-amber-500' },
  'in-transit': { pct: 60, color: 'bg-indigo-500' },
  delivered: { pct: 100, color: 'bg-emerald-500' },
  delayed: { pct: 40, color: 'bg-red-500' },
};

export function SupplierDeliveries() {
  const { language, t } = useLanguage();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('deliveriesManagement')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('trackDeliveries')}</p>
        </div>
        <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option>{t('filter')}: All</option>
          <option>Preparing</option>
          <option>In Transit</option>
          <option>Delivered</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockDeliveries.map((delivery) => {
          const status = statusConfig[delivery.status];
          const StatusIcon = status.icon;
          const prog = progressMap[delivery.status];
          return (
            <div key={delivery.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col">
              <div className="px-4 pt-4 pb-3 border-b border-slate-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${status.bg} flex items-center justify-center`}>
                      <StatusIcon className={`w-4 h-4 ${status.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{delivery.orderNumber}</p>
                      <p className="text-[11px] text-slate-500">{delivery.carrier}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${status.bg} ${status.color}`}>
                    {t(status.key as any)}
                  </span>
                </div>
              </div>

              <div className="px-4 py-3 space-y-2 flex-1">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{delivery.address[language]}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>Est. {delivery.estimatedDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <Hash className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{delivery.trackingNumber}</span>
                </div>
              </div>

              <div className="px-4 py-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${prog.color}`} style={{ width: `${prog.pct}%` }} />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">{prog.pct}%</span>
                </div>
              </div>

              <div className="flex border-t border-slate-100">
                <button className="flex-1 py-2.5 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors rounded-bl-xl">
                  Track
                </button>
                <div className="w-px bg-slate-100" />
                <button className="flex-1 py-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors rounded-br-xl">
                  Contact
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
