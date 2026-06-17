import { useEffect, useState } from 'react';
import { Truck, MapPin, Calendar, Box, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { supplierService, type DeliveryListItem } from '../../services/supplier.service';

const statusConfig: Record<string, { color: string; bg: string; key: string }> = {
  pending: { color: 'text-amber-600', bg: 'bg-amber-100', key: 'pending' },
  preparing: { color: 'text-amber-600', bg: 'bg-amber-100', key: 'preparing' },
  shipped: { color: 'text-indigo-600', bg: 'bg-indigo-100', key: 'shipped' },
  delivered: { color: 'text-emerald-600', bg: 'bg-emerald-100', key: 'delivered' },
  failed: { color: 'text-red-600', bg: 'bg-red-100', key: 'failed' },
};

const progressMap: Record<string, { pct: number; color: string }> = {
  pending: { pct: 10, color: 'bg-slate-500' },
  preparing: { pct: 30, color: 'bg-amber-500' },
  shipped: { pct: 65, color: 'bg-indigo-500' },
  delivered: { pct: 100, color: 'bg-emerald-500' },
  failed: { pct: 40, color: 'bg-red-500' },
};

export function SupplierDeliveries() {
  const { language, t } = useLanguage();
  const [deliveries, setDeliveries] = useState<DeliveryListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadDeliveries = async () => {
    setLoading(true);
    try {
      const params: any = { page: 1, limit: 100 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await supplierService.listDeliveries(params);
      setDeliveries(res.data.items);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
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
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('deliveriesManagement')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('trackDeliveries')}</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">{t('filter')}: All</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {deliveries.map((delivery) => {
          const status = statusConfig[delivery.status] || statusConfig.pending;
          const prog = progressMap[delivery.status] || progressMap.pending;
          return (
            <div key={delivery.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col">
              <div className="px-4 pt-4 pb-3 border-b border-slate-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${status.bg} flex items-center justify-center`}>
                      <Truck className={`w-4 h-4 ${status.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{delivery.orderId?.slice(0, 8) || delivery.id?.slice(0, 8)}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${status.bg} ${status.color}`}>
                    {t(status.key as any) || delivery.status}
                  </span>
                </div>
              </div>

              <div className="px-4 py-3 space-y-2 flex-1">
                {delivery.scheduledAt && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Est. {new Date(delivery.scheduledAt).toLocaleDateString()}</span>
                  </div>
                )}
                {delivery.trackingNotes && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <span className="truncate">{delivery.trackingNotes}</span>
                  </div>
                )}
              </div>

              <div className="px-4 py-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${prog.color}`} style={{ width: `${prog.pct}%` }} />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">{prog.pct}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {deliveries.length === 0 && (
        <div className="text-center py-16">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">{t('noDeliveries')}</p>
        </div>
      )}
    </div>
  );
}
