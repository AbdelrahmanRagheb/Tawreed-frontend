import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingCart, Clock, CheckCircle, XCircle, Package, AlertTriangle, Eye, X, MapPin, Users, Store, DollarSign, Activity, Calendar, FileText } from 'lucide-react';
import { useLanguage, toArabicNumeral } from '../../i18n';
import { adminService, type AdminOrderListItem, type AdminOrderDetailResponse } from '../../services/admin.service';

const statusConfig: Record<string, { icon: typeof Clock; labelKey: string; color: string; bg: string }> = {
  Open: { icon: Clock, labelKey: 'statusOpen', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  Closed: { icon: Clock, labelKey: 'statusClosed', color: 'text-slate-600', bg: 'bg-slate-200' },
  Completed: { icon: CheckCircle, labelKey: 'statusCompleted', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  Cancelled: { icon: XCircle, labelKey: 'statusCancelled', color: 'text-red-600', bg: 'bg-red-100' },
};

export function AdminOrders() {
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<AdminOrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderListItem | null>(null);
  const [orderDetail, setOrderDetail] = useState<AdminOrderDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  useEffect(() => {
    setLoading(true);
    adminService.listOrders({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      page: 1,
      limit: 100,
    })
      .then((res) => setOrders(res.data.items))
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => {
    const detailId = searchParams.get('detail');
    if (detailId && orders.length > 0) {
      const order = orders.find(o => o.id === detailId);
      if (order) handleViewOrder(order);
    }
  }, [searchParams, orders]);

  const handleViewOrder = async (order: AdminOrderListItem) => {
    setSelectedOrder(order);
    setDetailLoading(true);
    setDetailError('');
    setOrderDetail(null);
    try {
      const res = await adminService.getOrderDetail(order.id);
      setOrderDetail(res.data);
    } catch (err: any) {
      setDetailError(err?.response?.data?.error || err?.message || 'Failed to load details');
    } finally {
      setDetailLoading(false);
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
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  const active = orders.filter((o) => o.status === 'Open' || o.status === 'PendingApproval').length;
  const completed = orders.filter((o) => o.status === 'Completed').length;
  const cancelled = orders.filter((o) => o.status === 'Cancelled' || o.status === 'Declined').length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('orders')}</h1>
          <p className="text-sm text-slate-500 mt-1">{toArabicNumeral(String(orders.length), language)} {t('totalOrders')}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center mb-2">
            <ShoppingCart className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{toArabicNumeral(String(orders.length), language)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('totalOrders')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center mb-2">
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{toArabicNumeral(String(active), language)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('activeOrders')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{toArabicNumeral(String(cancelled), language)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('issues')}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">{t('allStatus')}</option>
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <option key={key} value={key}>{t(cfg.labelKey as any)}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('order')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('buyer')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('supplier')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('region')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('status')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('participants')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('deadline')}</th>
                <th className="text-end px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('value')}</th>
                <th className="text-end px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => {
                const sCfg = statusConfig[order.status] || { icon: Clock, labelKey: 'statusOpen', color: 'text-slate-600', bg: 'bg-slate-100' };
                const StatusIcon = sCfg.icon;
                return (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => handleViewOrder(order)}>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-slate-900">{order.title}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-700">{order.buyerName}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-700">{order.supplierName}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{language === 'ar' ? order.regionAr : order.regionEn}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${sCfg.bg} ${sCfg.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {t(sCfg.labelKey as any)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{toArabicNumeral(String(order.participants), language)}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="text-[11px]">{new Date(order.deadline).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-end text-sm font-bold text-slate-900">{toArabicNumeral(order.totalAmount.toLocaleString(), language)} {t('currency')}</td>
                    <td className="px-5 py-3.5 text-end">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleViewOrder(order); }}
                        className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-slate-500">{t('noOrdersFound')}</div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto" onClick={() => { setSelectedOrder(null); setOrderDetail(null); }}>
          <div className="fixed inset-0 bg-black/30" />
          <div className="min-h-full flex items-center justify-center p-4 pb-16 md:pb-4">
            <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selectedOrder.title}</h2>
              </div>
              <button onClick={() => { setSelectedOrder(null); setOrderDetail(null); }} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Status & basic info */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${statusConfig[selectedOrder.status]?.bg || 'bg-slate-100'} ${statusConfig[selectedOrder.status]?.color || 'text-slate-600'}`}>
                  {t((statusConfig[selectedOrder.status]?.labelKey || 'statusOpen') as any)}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">{t('createdBy')}</p>
                  <p className="text-sm text-slate-800 font-medium">{orderDetail?.buyer?.name || selectedOrder.buyerName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">{t('supplier')}</p>
                  <p className="text-sm text-slate-800 font-medium">{orderDetail?.supplier?.companyName || selectedOrder.supplierName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">{t('region')}</p>
                  <p className="text-sm text-slate-800 font-medium">
                    <MapPin className="w-3 h-3 inline text-slate-400 mr-1" />
                    {language === 'ar' ? (orderDetail?.regionAr || selectedOrder.regionAr) : (orderDetail?.regionEn || selectedOrder.regionEn)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">{t('participants')}</p>
                  <p className="text-sm text-slate-800 font-medium">
                    <Users className="w-3 h-3 inline text-slate-400 mr-1" />
                    {toArabicNumeral(String(orderDetail?.participants?.length || selectedOrder.participants), language)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">{t('deadline')}</p>
                  <p className="text-sm text-slate-800 font-medium">
                    <Calendar className="w-3 h-3 inline text-slate-400 mr-1" />
                    {new Date(orderDetail?.deadline || selectedOrder.deadline).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                  </p>
                </div>
              </div>

              {/* Total value */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{t('totalOrderValue')}</span>
                  <span className="text-lg font-black text-slate-900">
                    {toArabicNumeral(orderDetail?.items
                      ? orderDetail.items.reduce((sum, i) => sum + (i.marketPrice ?? 0) * i.targetQuantity, 0).toLocaleString()
                      : selectedOrder.totalAmount.toLocaleString(), language)} {t('currency')}
                  </span>
                </div>
              </div>

              {/* Loading / Error */}
              {detailLoading && (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {detailError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">{detailError}</div>
              )}

              {/* Products table */}
              {orderDetail?.items && orderDetail.items.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4 text-indigo-600" />
                    {t('products')}
                  </h3>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="text-start px-4 py-2.5 font-semibold text-slate-500">{t('productName')}</th>
                          <th className="text-center px-4 py-2.5 font-semibold text-slate-500">{t('quantity')}</th>
                          <th className="text-center px-4 py-2.5 font-semibold text-slate-500">{t('target')}</th>
                          <th className="text-center px-4 py-2.5 font-semibold text-slate-500">{t('marketPrice')}</th>
                          <th className="text-end px-4 py-2.5 font-semibold text-slate-500">{t('totalPrice')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orderDetail.items.map((item) => (
                          <tr key={item.productId} className="hover:bg-slate-50">
                            <td className="px-4 py-2.5 font-medium text-slate-800">{item.productName}</td>
                            <td className="px-4 py-2.5 text-center text-slate-700">{toArabicNumeral(String(item.quantity), language)}</td>
                            <td className="px-4 py-2.5 text-center text-slate-700">{toArabicNumeral(String(item.targetQuantity), language)}</td>
                            <td className="px-4 py-2.5 text-center text-slate-700">{item.marketPrice ? toArabicNumeral(item.marketPrice.toLocaleString(), language) : '-'}</td>
                            <td className="px-4 py-2.5 text-end font-semibold text-slate-900">{item.marketPrice ? toArabicNumeral((item.marketPrice * item.targetQuantity).toLocaleString(), language) : '-'} {t('currency')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Participants & their items */}
              {orderDetail?.participants && orderDetail.participants.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    {t('participants')}
                  </h3>
                  <div className="space-y-2">
                    {orderDetail.participants.map((p) => (
                      <div key={p.id} className="bg-slate-50 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-semibold text-slate-800">{p.name}</span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(p.joinedAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                          </span>
                        </div>
                        {p.items && p.items.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {p.items.map((pi, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-indigo-50 text-indigo-700">
                                {pi.productId?.slice(0, 8)}: {toArabicNumeral(String(pi.quantity), language)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              {orderDetail?.timeline && orderDetail.timeline.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    {t('timeline')}
                  </h3>
                  <div className="space-y-2">
                    {orderDetail.timeline.map((evt, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-slate-50 rounded-xl p-3">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800">{language === 'ar' ? evt.notesAr : evt.notesEn}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                            <span>{evt.actorName}</span>
                            <span>·</span>
                            <span>{new Date(evt.createdAt).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => adminService.forceCloseOrder(selectedOrder.id, 'Closed by admin')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" /> {t('forceClose')}
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
