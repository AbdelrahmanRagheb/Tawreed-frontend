import { Package, ChevronRight, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { mockOrders } from '../../data';

const statusConfig: Record<string, { icon: typeof Package; color: string; bg: string }> = {
  pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
  confirmed: { icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
  shipped: { icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  delivered: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
};

export function SupplierOrders() {
  const { language, t } = useLanguage();

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('incomingOrders')}</h1>
          <p className="text-sm text-slate-500 mt-1">{mockOrders.length} {t('ordersReceived')}</p>
        </div>
      </div>

      <div className="space-y-4">
        {mockOrders.map((order) => {
          const StatusIcon = statusConfig[order.status].icon;
          const statusColors = statusConfig[order.status];
          return (
            <div key={order.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{order.orderNumber}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{order.createdAt} • {order.items.length} {t('items')}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors.bg} ${statusColors.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{item.productName[language]} × {item.quantity}</span>
                      <span className="text-slate-900 font-medium">SAR {item.totalPrice.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      {t('accept')}
                    </button>
                    <button className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                      {t('decline')}
                    </button>
                  </div>
                  <span className="text-lg font-bold text-slate-900">SAR {order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
