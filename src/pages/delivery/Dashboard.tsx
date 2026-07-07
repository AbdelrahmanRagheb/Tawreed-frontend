import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Star, DollarSign, Clock, Truck, Check, X, AlertCircle } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef3f9] p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-14 w-72 bg-slate-200/70 rounded-[2rem] animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200/70 rounded-[2rem] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#eef3f9] flex items-center justify-center p-4">
        <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-200/60 max-w-sm text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const stats = data ? [
    { label: T('activeDeliveries'), value: toArabicNumeral(String(data.activeDeliveries), language), icon: Package, color: 'bg-blue-500' },
    { label: T('completedToday'), value: toArabicNumeral(String(data.completedToday), language), icon: Clock, color: 'bg-green-500' },
    { label: T('rating'), value: toArabicNumeral(data.rating.toFixed(1), language), icon: Star, color: 'bg-yellow-500' },
    { label: T('earningsToday'), value: `${toArabicNumeral(data.earningsToday.toFixed(2), language)} ${T('currency')}`, icon: DollarSign, color: 'bg-indigo-500' },
  ] : [];

  return (
    <div className="min-h-screen bg-[#eef3f9] p-4 md:p-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="blob-1 absolute -top-24 left-10 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="blob-2 absolute -bottom-16 right-40 h-[420px] w-[420px] rounded-full bg-indigo-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-6 fade-up">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
            <Truck className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">{T('myDeliveries')}</h1>
        </div>

        {/* Stats Cards */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-[2rem] border border-white/70 bg-white/90 shadow-xl shadow-slate-200/60 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-slate-500">{s.label}</span>
                  <div className={`w-10 h-10 ${s.color} rounded-2xl flex items-center justify-center`}>
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Pending Requests */}
        {requests.length > 0 && (
          <div className="rounded-[2rem] border border-amber-200/70 bg-amber-50/80 shadow-xl shadow-slate-200/60 p-6">
            <h2 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              {T('pendingRequests')} ({toArabicNumeral(String(requests.length), language)})
            </h2>
            <div className="space-y-3">
              {requests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-4 rounded-2xl border border-white/70 bg-white/90 shadow-sm">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">{req.orderTitle}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{req.supplierName} · {req.region}</p>
                    {req.proposedFee && (
                      <p className="text-xs text-[#1e3a8a] mt-1 font-bold">{T('proposedFee')}: {toArabicNumeral(String(req.proposedFee), language)} {T('currency')}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleAccept(req.id)}
                      disabled={responding === req.id}
                      className="p-3 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 disabled:opacity-50 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDecline(req.id)}
                      disabled={responding === req.id}
                      className="p-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 disabled:opacity-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/delivery/deliveries')}
            className="px-6 py-3 bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] text-white rounded-2xl font-extrabold shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 transition-all"
          >
            {T('viewDeliveries')}
          </button>
          <button
            onClick={() => navigate('/delivery/profile')}
            className="px-6 py-3 rounded-2xl border border-white/70 bg-white/85 backdrop-blur-xl text-slate-700 font-bold shadow-xl shadow-slate-200/60 hover:-translate-y-0.5 transition-all"
          >
            {T('viewProfile')}
          </button>
        </div>
      </div>
    </div>
  );
}
