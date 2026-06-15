import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin, CreditCard, Hash, Calendar } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { mockOrders, mockProducts } from '../../data';

const statusConfig: Record<string, { icon: typeof Package; color: string; bg: string; label: string }> = {
  pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Pending' },
  confirmed: { icon: Package, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Confirmed' },
  shipped: { icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' },
};

const progressMap: Record<string, number> = {
  pending: 15,
  confirmed: 35,
  shipped: 60,
  delivered: 100,
  cancelled: 100,
};

const progressColor: Record<string, string> = {
  pending: 'bg-amber-500',
  confirmed: 'bg-blue-500',
  shipped: 'bg-indigo-500',
  delivered: 'bg-emerald-500',
  cancelled: 'bg-red-500',
};

function getProductImage(productId: string): string {
  return mockProducts.find((p) => p.id === productId)?.imageUrl || '';
}

export function Orders() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('myOrders')}</h1>
          <p className="text-sm text-slate-500 mt-1">{mockOrders.length} {t('ordersPlaced')}</p>
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>{t('filter')}: All</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockOrders.map((order) => {
          const sCfg = statusConfig[order.status];
          const StatusIcon = sCfg.icon;
          const progress = progressMap[order.status];
          const pColor = progressColor[order.status];

          return (
            <div key={order.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col">
              {/* Header */}
              <div className="px-4 pt-4 pb-3 border-b border-slate-100">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{order.orderNumber}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{order.createdAt}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${sCfg.bg} ${sCfg.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {sCfg.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${pColor}`} style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* Products */}
              <div className="px-4 py-3 space-y-2 flex-1">
                {order.items.map((item, idx) => {
                  const img = getProductImage(item.productId);
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                        {img ? (
                          <img src={img} alt={item.productName[language]} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-4 h-4 text-slate-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-900 truncate">{item.productName[language]}</p>
                        <p className="text-[11px] text-slate-500">×{item.quantity} — SAR {item.totalPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Meta */}
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 space-y-1.5">
                {order.shippingAddress && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{order.shippingAddress[language]}</span>
                  </div>
                )}
                {order.paymentMethod && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <CreditCard className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{order.paymentMethod}</span>
                  </div>
                )}
                {order.trackingNumber && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <Hash className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{order.trackingNumber}</span>
                  </div>
                )}
                {order.estimatedDelivery && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{t('estDelivery')}: {order.estimatedDelivery}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">{order.items.length} {t('items')}</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-slate-900">SAR {order.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex border-t border-slate-100">
                <button
                  onClick={() => navigate(`/buyer/orders/${order.id}`)}
                  className="flex-1 py-2.5 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors rounded-bl-xl"
                >
                  {t('viewDetails')}
                </button>
                <div className="w-px bg-slate-100" />
                <button className="flex-1 py-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors rounded-br-xl">
                  Track
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
