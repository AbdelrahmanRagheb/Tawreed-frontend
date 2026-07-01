import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Star, DollarSign, Clock, Truck, Check, X } from 'lucide-react';
import { deliveryPersonService, DeliveryPersonDashboardData, PendingDeliveryRequest } from '../../services/deliveryPerson.service';
import { useLanguage, toArabicNumeral } from '../../i18n';

export function DeliveryPersonDashboard() {
  const { language, t } = useLanguage();
  const T = (key: string) => t(key as any);
  const navigate = useNavigate();
  const [data, setData] = useState<DeliveryPersonDashboardData | null>(null);
  const [requests, setRequests] = useState<PendingDeliveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [responding, setResponding] = useState<string | null>(null);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      deliveryPersonService.getDashboard(),
      deliveryPersonService.getPendingRequests(),
    ])
      .then(([dash, reqs]) => {
        setData(dash.data);
        setRequests(reqs.data);
      })
      .catch((err) => setError(err?.response?.data?.error || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAccept = async (requestId: string) => {
    setResponding(requestId);
    try {
      await deliveryPersonService.acceptRequest(requestId);
      fetchAll();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to accept');
    } finally {
      setResponding(null);
    }
  };

  const handleDecline = async (requestId: string) => {
    setResponding(requestId);
    try {
      const reason = prompt(T('declineReason') || 'Reason (optional):');
      await deliveryPersonService.declineRequest(requestId, reason || undefined);
      fetchAll();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to decline');
    } finally {
      setResponding(null);
    }
  };

  if (loading) return <div className="p-6 text-slate-500">{T('loading')}</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const stats = data ? [
    { label: T('activeDeliveries'), value: toArabicNumeral(String(data.activeDeliveries), language), icon: Package, color: 'bg-blue-500' },
    { label: T('completedToday'), value: toArabicNumeral(String(data.completedToday), language), icon: Clock, color: 'bg-green-500' },
    { label: T('rating'), value: toArabicNumeral(data.rating.toFixed(1), language), icon: Star, color: 'bg-yellow-500' },
    { label: T('earningsToday'), value: `${toArabicNumeral(data.earningsToday.toFixed(2), language)} ${T('currency')}`, icon: DollarSign, color: 'bg-indigo-500' },
  ] : [];

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Truck className="w-8 h-8 text-emerald-600" />
        <h1 className="text-2xl font-bold text-slate-800">{T('myDeliveries')}</h1>
      </div>

      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-500">{s.label}</span>
                <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Pending Requests ── */}
      {requests.length > 0 && (
        <div className="bg-white rounded-xl border border-amber-200 p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            {T('pendingRequests')} ({toArabicNumeral(String(requests.length), language)})
          </h2>
          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">{req.orderTitle}</p>
                  <p className="text-xs text-slate-500">{req.supplierName} · {req.region}</p>
                  {req.proposedFee && (
                    <p className="text-xs text-indigo-600 mt-1">{T('proposedFee')}: {toArabicNumeral(String(req.proposedFee), language)} {T('currency')}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleAccept(req.id)}
                    disabled={responding === req.id}
                    className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDecline(req.id)}
                    disabled={responding === req.id}
                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => navigate('/delivery/deliveries')}
          className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          {T('viewDeliveries')}
        </button>
        <button
          onClick={() => navigate('/delivery/profile')}
          className="px-6 py-2.5 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          {T('viewProfile')}
        </button>
      </div>
    </div>
  );
}