import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin, Calendar, AlertCircle, UserPlus, UserCheck, Crown } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { buyerService, type BuyerOrderListItem } from '../../services/buyer.service';

const statusIconMap: Record<string, typeof Clock> = {
  Draft: Clock,
  Open: Package,
  Closed: Clock,
  Completed: CheckCircle,
  Cancelled: XCircle,
};

const statusColorMap: Record<string, string> = {
  Draft: 'text-slate-600',
  Open: 'text-emerald-600',
  Closed: 'text-slate-600',
  Completed: 'text-emerald-600',
  Cancelled: 'text-red-600',
};

const statusBgMap: Record<string, string> = {
  Draft: 'bg-slate-100',
  Open: 'bg-emerald-100',
  Closed: 'bg-slate-200',
  Completed: 'bg-emerald-100',
  Cancelled: 'bg-red-100',
};

type Tab = 'all' | 'mine' | 'joined' | 'nearby';

export function Orders() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<BuyerOrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tab, setTab] = useState<Tab>('all');

  useEffect(() => {
    setLoading(true);
    buyerService.listOrders({ status: statusFilter || undefined, page: 1, limit: 50 })
      .then((res) => {
        const all = res.data.items;
        if (statusFilter) {
          setOrders(all);
        } else {
          setOrders(all);
        }
      })
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const filteredOrders = orders.filter((o) => {
    if (tab === 'all') return true;
    if (tab === 'mine') return o.isCreator;
    if (tab === 'joined') return !o.isCreator && o.isParticipant;
    if (tab === 'nearby') return !o.isCreator && !o.isParticipant;
    return true;
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: 'all', label: t('allOrders') },
    { key: 'mine', label: t('myOrder') },
    { key: 'joined', label: t('joinedBadge') },
    { key: 'nearby', label: t('ordersNearYou') },
  ];

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('myOrders')}</h1>
          <p className="text-sm text-slate-500 mt-1">{filteredOrders.length} {t('ordersPlaced')}</p>
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

      <div className="flex items-center gap-1 mb-6 border-b border-slate-200">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.key}
            onClick={() => setTab(tabItem.key)}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              tab === tabItem.key
                ? 'text-indigo-600 border-indigo-600'
                : 'text-slate-500 border-transparent hover:text-slate-700'
            }`}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredOrders.map((order) => {
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
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate">{order.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {order.isCreator ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                          <Crown className="w-3 h-3" />
                          {t('myOrder')}
                        </span>
                      ) : order.isParticipant ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                          <UserCheck className="w-3 h-3" />
                          {t('joinedBadge')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">
                          <UserPlus className="w-3 h-3" />
                          {t('joinOrder')}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${bg} ${color}`}>
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
                    <Calendar className="w-3 h-3" /> {new Date(order.deadline).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
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
