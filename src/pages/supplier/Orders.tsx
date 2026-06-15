import { Package, Clock, CheckCircle, XCircle, Truck, MapPin, Building, Hash } from 'lucide-react';
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('incomingOrders')}</h1>
          <p className="text-sm text-slate-500 mt-1">{mockOrders.length} {t('ordersReceived')}</p>
        </div>
        <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option>{t('filter')}: All</option>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Shipped</option>
          <option>Delivered</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockOrders.map((order) => {
          const StatusIcon = statusConfig[order.status].icon;
          const statusColors = statusConfig[order.status];
          return (
            <div key={order.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col">
              <div className="px-4 pt-4 pb-3 border-b border-slate-100">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{order.orderNumber}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{order.createdAt}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${statusColors.bg} ${statusColors.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="px-4 py-3 space-y-2 flex-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-900 truncate">{item.productName[language]}</p>
                      <p className="text-[11px] text-slate-500">×{item.quantity} — SAR {item.totalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-3 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <Building className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{order.shippingAddress?.[language] || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <Hash className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{order.paymentMethod || 'N/A'}</span>
                </div>
              </div>

              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">{order.items.length} {t('items')}</span>
                <span className="text-lg font-black text-slate-900">SAR {order.totalAmount.toLocaleString()}</span>
              </div>

              <div className="flex border-t border-slate-100">
                <button className="flex-1 py-2.5 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors rounded-bl-xl">
                  {t('accept')}
                </button>
                <div className="w-px bg-slate-100" />
                <button className="flex-1 py-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors rounded-br-xl">
                  {t('decline')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
