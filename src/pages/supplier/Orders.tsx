import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, AlertCircle, Calendar, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { useLanguage, toArabicNumeral } from '../../i18n';
import { supplierService, type SupplierOrderListItem } from '../../services/supplier.service';

const itemStatusBadge: Record<string, { bg: string; text: string; label: string }> = {
  Pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
  Accepted: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Accepted' },
  Declined: { bg: 'bg-red-100', text: 'text-red-700', label: 'Declined' },
  Unassigned: { bg: 'bg-slate-100', text: 'text-slate-500', label: 'Unassigned' },
};

const statusConfig: Record<string, { icon: typeof Package; color: string; bg: string }> = {
  Open: { icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  PendingApproval: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
  Locked: { icon: CheckCircle, color: 'text-indigo-600', bg: 'bg-indigo-100' },
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
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [acceptTarget, setAcceptTarget] = useState<string | null>(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [acceptNotes, setAcceptNotes] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [acceptError, setAcceptError] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    supplierService.listOrders({ status: statusFilter || undefined, page: 1, limit: 50 })
      .then((res) => setOrders(res.data.items))
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleAcceptClick = (orderId: string) => {
    setAcceptTarget(orderId);
    setDeliveryDate('');
    setAcceptNotes('');
    setDeliveryNotes('');
    setAcceptError('');
  };

  const handleAcceptConfirm = async () => {
    if (!acceptTarget || !deliveryDate) {
      setAcceptError('Please select a delivery date.');
      return;
    }
    setProcessing((prev) => ({ ...prev, [acceptTarget]: true }));
    try {
      const offset = -new Date().getTimezoneOffset();
      const sign = offset >= 0 ? '+' : '-';
      const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, '0');
      const timezoneOffset = `${sign}${pad(offset / 60)}:${pad(offset % 60)}`;
      await supplierService.acceptOrder(acceptTarget, {
        scheduledDeliveryAt: new Date(`${deliveryDate}${timezoneOffset}`).toISOString(),
        notes: acceptNotes || undefined,
        deliveryNotes: deliveryNotes || undefined,
      });
      setAcceptTarget(null);
      fetchOrders();
    } catch (err: any) {
      setAcceptError(err?.response?.data?.message || err?.message || 'Failed to accept order');
    } finally {
      setProcessing((prev) => ({ ...prev, [acceptTarget]: false }));
    }
  };

  const handleDecline = async (orderId: string) => {
    setProcessing((prev) => ({ ...prev, [orderId]: true }));
    try {
      await supplierService.declineOrder(orderId);
      fetchOrders();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Failed to decline order');
    } finally {
      setProcessing((prev) => ({ ...prev, [orderId]: false }));
    }
  };

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
          <p className="text-sm text-slate-500 mt-1">{toArabicNumeral(String(orders.length), language)} {t('ordersReceived')}</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">{t('filter')}: All</option>
          <option value="PendingApproval">{t('pendingApproval')}</option>
          <option value="Locked">{t('locked')}</option>
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
                {order.items.map((item, idx) => {
                  const badge = itemStatusBadge[item.itemStatus] || itemStatusBadge.Unassigned;
                  return (
                    <div key={idx} className={`flex items-center gap-3 rounded-lg p-2 ${item.itemStatus === 'Pending' ? 'bg-amber-50/50 border border-amber-100' : ''}`}>
                      <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-900 truncate">{item.productName}</p>
                        <p className="text-[11px] text-slate-500">×{toArabicNumeral(String(item.quantity), language)} — {toArabicNumeral(item.lineTotal.toLocaleString(), language)} {t('currency')}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    </div>
                  );
                })}
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
                <span className="text-xs text-slate-500">{toArabicNumeral(String(order.items.length), language)} {t('items')}</span>
                <span className="text-lg font-black text-slate-900">{toArabicNumeral(order.totalAmount.toLocaleString(), language)} {t('currency')}</span>
              </div>

              {(() => {
                const pendingItems = order.items.filter(i => i.itemStatus === 'Pending');
                const hasPending = pendingItems.length > 0;
                const allResolved = order.items.every(i => i.itemStatus === 'Accepted' || i.itemStatus === 'Declined');
                if (hasPending) {
                  return (
                    <div className="flex border-t border-slate-100">
                      <button
                        onClick={() => handleAcceptClick(order.id)}
                        disabled={processing[order.id]}
                        className="flex-1 py-2.5 text-[11px] font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors rounded-bl-xl disabled:opacity-50"
                      >
                        {processing[order.id] ? '...' : `${t('accept')} (${toArabicNumeral(String(pendingItems.length), language)})`}
                      </button>
                      <div className="w-px bg-slate-100" />
                      <button
                        onClick={() => handleDecline(order.id)}
                        disabled={processing[order.id]}
                        className="flex-1 py-2.5 text-[11px] font-semibold text-red-600 hover:bg-red-50 transition-colors rounded-br-xl disabled:opacity-50"
                      >
                        {processing[order.id] ? '...' : `${t('decline')} (${toArabicNumeral(String(pendingItems.length), language)})`}
                      </button>
                    </div>
                  );
                }
                if (allResolved) {
                  return (
                    <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                      <span className="text-[11px] font-semibold text-emerald-600">All items resolved</span>
                    </div>
                  );
                }
                return null;
              })()}


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

      {acceptTarget && (() => {
        const targetOrder = orders.find(o => o.id === acceptTarget);
        const pendingItems = targetOrder?.items.filter(i => i.itemStatus === 'Pending') ?? [];
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setAcceptTarget(null); }}
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-slate-900 mb-1">{t('acceptOrder')}</h3>
              <p className="text-xs text-slate-500 mb-4">{toArabicNumeral(String(pendingItems.length), language)} item{pendingItems.length !== 1 ? 's' : ''} to accept</p>

              {/* Items to be accepted */}
              {pendingItems.length > 0 && (
                <div className="bg-amber-50 rounded-xl p-3 mb-4 space-y-1.5">
                  {pendingItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800">{item.productName}</span>
                      <span className="text-slate-600">×{toArabicNumeral(String(item.quantity), language)} — {toArabicNumeral(item.lineTotal.toLocaleString(), language)} {t('currency')}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('deliveryDate')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={deliveryDate}
                    onChange={(e) => { setDeliveryDate(e.target.value); setAcceptError(''); }}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('notes')}
                  </label>
                  <textarea
                    value={acceptNotes}
                    onChange={(e) => setAcceptNotes(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    placeholder={t('optionalNotes')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('deliveryNotes')}
                  </label>
                  <textarea
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    placeholder={t('optionalDeliveryNotes')}
                  />
                </div>

                {acceptError && (
                  <p className="text-xs text-red-600">{acceptError}</p>
                )}
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setAcceptTarget(null)}
                  disabled={processing[acceptTarget]}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleAcceptConfirm}
                  disabled={processing[acceptTarget] || !deliveryDate}
                  className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {processing[acceptTarget] && <Loader2 className="w-3 h-3 animate-spin" />}
                  {processing[acceptTarget] ? '...' : `Accept ${toArabicNumeral(String(pendingItems.length), language)} item${pendingItems.length !== 1 ? 's' : ''}`}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
