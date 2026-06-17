import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { buyerService, type BuyerOrderListItem } from '../../services/buyer.service';

const statusIconMap: Record<string, typeof Clock> = {
  Draft: Clock,
  PendingApproval: Clock,
  Open: Package,
  Locked: Truck,
  Completed: CheckCircle,
  Cancelled: XCircle,
  Declined: XCircle,
};

const statusColorMap: Record<string, string> = {
  Draft: 'text-slate-600',
  PendingApproval: 'text-amber-600',
  Open: 'text-emerald-600',
  Locked: 'text-blue-600',
  Completed: 'text-emerald-600',
  Cancelled: 'text-red-600',
  Declined: 'text-red-600',
};

const statusBgMap: Record<string, string> = {
  Draft: 'bg-slate-100',
  PendingApproval: 'bg-amber-100',
  Open: 'bg-emerald-100',
  Locked: 'bg-blue-100',
  Completed: 'bg-emerald-100',
  Cancelled: 'bg-red-100',
  Declined: 'bg-red-100',
};

export function Orders() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<BuyerOrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    buyerService.listOrders({ status: statusFilter || undefined, page: 1, limit: 50 })
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
          <h1 className="text-2xl font-bold text-slate-900">{t('myOrders')}</h1>
          <p className="text-sm text-slate-500 mt-1">{orders.length} {t('ordersPlaced')}</p>
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">{t('filter')}: All</option>
            <option value="Open">Open</option>
            <option value="PendingApproval">Pending Approval</option>
            <option value="Locked">Locked</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {orders.map((order) => {
          const StatusIcon = statusIconMap[order.status] || Clock;
          const color = statusColorMap[order.status] || 'text-slate-600';
          const bg = statusBgMap[order.status] || 'bg-slate-100';

          return (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer"
              onClick={() => navigate(`/buyer/orders/${order.id}`)}
            >
              <div className="px-4 pt-4 pb-3 border-b border-slate-100">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{order.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${bg} ${color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="px-4 py-3 flex-1">
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {order.region}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(order.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-600">
                  {t('supplier')}: {order.supplierName}
                </div>
              </div>

              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">{order.participantCount} {t('participants')}</span>
                <span className="text-lg font-black text-slate-900">EGP {order.totalOrderValue.toLocaleString()}</span>
              </div>
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
