import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, CheckCircle, XCircle, User, Phone, Package } from 'lucide-react';
import { deliveryPersonService, DeliveryPersonDeliveryDetailDto } from '../../services/deliveryPerson.service';
import { useLanguage } from '../../i18n';
import { cn } from '../../lib/utils';

export function DeliveryPersonDeliveryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const T = (key: string) => t(key as any);
  const [delivery, setDelivery] = useState<DeliveryPersonDeliveryDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [codeInputs, setCodeInputs] = useState<Record<string, string>>({});
  const [verifyMsg, setVerifyMsg] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;
    deliveryPersonService.getDeliveryDetail(id)
      .then((res) => setDelivery(res.data))
      .catch((err) => setError(err?.response?.data?.error || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async (status: string) => {
    if (!id) return;
    setStatusUpdating(true);
    try {
      await deliveryPersonService.updateDeliveryStatus(id, { status });
      setDelivery((prev) => prev ? { ...prev, status } : prev);
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to update');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleVerify = async (invoiceId: string) => {
    if (!id) return;
    const code = codeInputs[invoiceId];
    if (!code) return;
    try {
      await deliveryPersonService.verifyDelivery(id, invoiceId, { verificationCode: code });
      setVerifyMsg((prev) => ({ ...prev, [invoiceId]: 'verified' }));
    } catch (err: any) {
      setVerifyMsg((prev) => ({ ...prev, [invoiceId]: err?.response?.data?.error || 'Invalid code' }));
    }
  };

  if (loading) return <div className="p-6 text-slate-500">{T('loading')}</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!delivery) return null;

  const canUpdate = ['Pending', 'Assigned', 'PickedUp'].includes(delivery.status);
  const canDeliver = delivery.status === 'OutForDelivery';

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
      <button onClick={() => navigate('/delivery/deliveries')} className="flex items-center gap-2 text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" /> {T('back')}
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{delivery.orderTitle}</h1>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {delivery.shippingRegion}</span>
            {delivery.scheduledAt && (
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(delivery.scheduledAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>
        <span className={cn(
          "px-3 py-1 rounded-full text-sm font-medium",
          delivery.status === 'Delivered' ? 'bg-green-100 text-green-700' :
          delivery.status === 'OutForDelivery' ? 'bg-purple-100 text-purple-700' :
          delivery.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-700'
        )}>
          {T(delivery.status.toLowerCase())}
        </span>
      </div>

      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <h2 className="font-semibold text-slate-800 mb-3">{T('updateStatus')}</h2>
        <div className="flex flex-wrap gap-2">
          {canUpdate && (
            <button onClick={() => handleStatusUpdate('PickedUp')} disabled={statusUpdating}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium">
              {T('markPickedUp')}
            </button>
          )}
          {canUpdate && (
            <button onClick={() => handleStatusUpdate('OutForDelivery')} disabled={statusUpdating}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm font-medium">
              {T('markOutForDelivery')}
            </button>
          )}
          {canDeliver && (
            <button onClick={() => handleStatusUpdate('Delivered')} disabled={statusUpdating}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium">
              {T('markDelivered')}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-slate-800 text-lg">{T('participants')} ({delivery.participantDetails?.length || 0})</h2>
        {delivery.participantDetails?.map((p) => (
          <div key={p.invoiceId} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-slate-400" />
                <span className="font-semibold text-slate-800">{p.participantName}</span>
              </div>
              {p.verificationCode && verifyMsg[p.invoiceId] === 'verified' ? (
                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" /> {T('verified')}
                </span>
              ) : (
                <span className="text-sm text-slate-400">{T('pending')}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-500 mb-3">
              <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {p.phone}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {p.address}</span>
            </div>

            {p.items && p.items.length > 0 && (
              <div className="border-t border-slate-100 pt-3 mt-2">
                <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                  <Package className="w-4 h-4" /> {T('items')}
                </h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b">
                      <th className="text-left py-1 font-medium">{T('item')}</th>
                      <th className="text-right py-1 font-medium">{T('qty')}</th>
                      <th className="text-right py-1 font-medium">{T('total')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-50">
                        <td className="py-1">{item.name}</td>
                        <td className="text-right py-1">{item.quantity}</td>
                        <td className="text-right py-1 font-semibold">{item.totalPrice.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {p.verificationCode && verifyMsg[p.invoiceId] !== 'verified' && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                <input
                  type="text"
                  placeholder={T('enterVerificationCode')}
                  value={codeInputs[p.invoiceId] || ''}
                  onChange={(e) => setCodeInputs((prev) => ({ ...prev, [p.invoiceId]: e.target.value }))}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm flex-1"
                />
                <button
                  onClick={() => handleVerify(p.invoiceId)}
                  className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
                >
                  {T('verify')}
                </button>
                {verifyMsg[p.invoiceId] && verifyMsg[p.invoiceId] !== 'verified' && (
                  <span className="text-red-500 text-sm flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> {verifyMsg[p.invoiceId]}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}