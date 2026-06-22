import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck, AlertCircle, Calendar } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { supplierService, type SupplierOrderListItem } from '../../services/supplier.service';

const statusConfig: Record<string, { icon: typeof Package; color: string; bg: string }> = {
  Open: { icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  Closed: { icon: Clock, color: 'text-slate-600', bg: 'bg-slate-200' },
  Completed: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  Cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
};

export function SupplierOrders() {
  const { language, t } = useLanguage();
  const [orders, setOrders] = useState<SupplierOrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    supplierService.listOrders({ status: statusFilter || undefined, page: 1, limit: 50 })
      .then((res) => setOrders(res.data.items))
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, [statusFilter]);

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
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('incomingOrders')}</h1>
          <p className="text-sm text-slate-500 mt-1">{orders.length} {t('ordersReceived')}</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">{t('filter')}: All</option>
          <option value="Open">{t('activeOrders')}</option>
          <option value="Closed">{t('closed')}</option>
          <option value="Completed">{t('completedOrders')}</option>
          <option value="Cancelled">{t('cancelledOrders')}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {orders.map((order) => {
          const cfg = statusConfig[order.status] || { icon: Package, color: 'text-slate-600', bg: 'bg-slate-100' };
          const StatusIcon = cfg.icon;

          return (
            <div key={order.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col">
              <div className="px-4 pt-4 pb-3 border-b border-slate-100">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{order.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{new Date(order.receivedAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${cfg.bg} ${cfg.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {order.status}
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
                      <p className="text-xs font-medium text-slate-900 truncate">{item.productName}</p>
                      <p className="text-[11px] text-slate-500">×{item.quantity} — EGP {item.lineTotal.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-3 border-t border-slate-100">
                <p className="text-xs text-slate-600">
                  {t('buyer')}: {order.creatorName} • {order.buyerCompany}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{t('region')}: {order.region}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  <Calendar className="w-3 h-3 inline mr-1" />{t('deadline')}: {new Date(order.deadline).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                </p>
              </div>

              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">{order.items.length} {t('items')}</span>
                <span className="text-lg font-black text-slate-900">EGP {order.totalAmount.toLocaleString()}</span>
              </div>

              {order.status === 'PendingApproval' && (
                <div className="flex border-t border-slate-100">
                  <button
                    onClick={() => supplierService.acceptOrder(order.id)}
                    className="flex-1 py-2.5 text-[11px] font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors rounded-bl-xl"
                  >
                    {t('accept')}
                  </button>
                  <div className="w-px bg-slate-100" />
                  <button
                    onClick={() => supplierService.declineOrder(order.id)}
                    className="flex-1 py-2.5 text-[11px] font-semibold text-red-600 hover:bg-red-50 transition-colors rounded-br-xl"
                  >
                    {t('decline')}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">{t('noOrdersFound')}</p>
        </div>
      )}
    </div>
  );
}
