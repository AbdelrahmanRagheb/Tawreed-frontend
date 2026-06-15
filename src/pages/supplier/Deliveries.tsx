import { Truck, Package, MapPin, Calendar, Hash } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { mockDeliveries } from '../../data';

const statusConfig: Record<string, { color: string; bg: string; key: string }> = {
  preparing: { color: 'text-amber-600', bg: 'bg-amber-100', key: 'preparing' },
  'in-transit': { color: 'text-indigo-600', bg: 'bg-indigo-100', key: 'inTransit' },
  delivered: { color: 'text-emerald-600', bg: 'bg-emerald-100', key: 'delivered' },
  delayed: { color: 'text-red-600', bg: 'bg-red-100', key: 'delayed' },
};

export function SupplierDeliveries() {
  const { language, t } = useLanguage();

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('deliveriesManagement')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('trackDeliveries')}</p>
      </div>

      <div className="space-y-4">
        {mockDeliveries.map((delivery) => {
          const status = statusConfig[delivery.status];
          return (
            <div key={delivery.id} className="bg-white rounded-xl border border-slate-200 p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${status.bg} flex items-center justify-center`}>
                    <Truck className={`w-5 h-5 ${status.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{delivery.orderNumber}</p>
                    <p className="text-xs text-slate-500">{delivery.carrier}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
                  {t(status.key as any)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-slate-600 truncate">{delivery.address[language]}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-slate-600">Est. {delivery.estimatedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-slate-600">{delivery.trackingNumber}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        delivery.status === 'delivered' ? 'w-full bg-emerald-500' :
                        delivery.status === 'in-transit' ? 'w-3/5 bg-indigo-500' :
                        delivery.status === 'preparing' ? 'w-1/5 bg-amber-500' :
                        'w-2/5 bg-red-500'
                      }`}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    {delivery.status === 'delivered' ? '100%' :
                     delivery.status === 'in-transit' ? '60%' :
                     delivery.status === 'preparing' ? '20%' : '40%'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
