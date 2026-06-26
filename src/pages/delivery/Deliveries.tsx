import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, MapPin, Calendar, Eye } from 'lucide-react';
import { deliveryPersonService, DeliveryPersonDeliveryDto } from '../../services/deliveryPerson.service';
import { useLanguage } from '../../i18n';
import { cn } from '../../lib/utils';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Assigned: 'bg-blue-100 text-blue-700',
  PickedUp: 'bg-indigo-100 text-indigo-700',
  OutForDelivery: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export function DeliveryPersonDeliveries() {
  const { t } = useLanguage();
  const T = (key: string) => t(key as any);
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState<DeliveryPersonDeliveryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    deliveryPersonService.getDeliveries({ status: statusFilter || undefined, page: 1, limit: 50 })
      .then((res) => setDeliveries(res.data.items))
      .catch((err) => setError(err?.response?.data?.error || T('failedToLoad')))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  if (loading) return <div className="p-6 text-slate-500">{T('loading')}</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-8 h-8 text-emerald-600" />
          <h1 className="text-2xl font-bold text-slate-800">{T('deliveries')}</h1>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="">{T('allStatuses')}</option>
          <option value="Pending">{T('pending')}</option>
          <option value="Assigned">{T('assigned')}</option>
          <option value="PickedUp">{T('pickedUp')}</option>
          <option value="OutForDelivery">{T('outForDelivery')}</option>
          <option value="Delivered">{T('delivered')}</option>
        </select>
      </div>

      {deliveries.length === 0 ? (
        <div className="text-center py-12 text-slate-400">{T('noDeliveries')}</div>
      ) : (
        <div className="grid gap-4">
          {deliveries.map((d) => (
            <div key={d.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800">{d.orderTitle}</h3>
                <span className={cn("px-3 py-1 rounded-full text-xs font-medium", statusColors[d.status] || 'bg-slate-100 text-slate-600')}>
                  {T(d.status.toLowerCase()) || d.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {d.shippingRegion}
                </span>
                {d.scheduledAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {new Date(d.scheduledAt).toLocaleDateString()}
                  </span>
                )}
                <span>{d.participants?.length || 0} {T('participants')}</span>
              </div>
              <button
                onClick={() => navigate(`/delivery/deliveries/${d.id}`)}
                className="mt-3 flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                <Eye className="w-4 h-4" /> {T('viewDetails')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}