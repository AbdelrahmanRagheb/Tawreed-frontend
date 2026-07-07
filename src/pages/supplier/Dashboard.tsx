import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign, ShoppingCart, Truck, Package, Clock, AlertTriangle,
  TrendingUp, Activity, AlertCircle, MapPin, Users, Calendar,
} from 'lucide-react';
import { useLanguage, toArabicNumeral } from '../../i18n';
import { supplierService, type SupplierDashboardResponse } from '../../services/supplier.service';

export function SupplierDashboard() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [data, setData] = useState<SupplierDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    supplierService.getDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef3f9] p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-14 w-72 bg-slate-200/70 rounded-[2rem] animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-slate-200/70 rounded-[2rem] animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-slate-200/70 rounded-[2rem] animate-pulse" />
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

  if (!data) return null;

  const { kpi, activeGroupOrders, deliveryOverview, recentActivity, pendingOrders } = data;

  return (
    <div className="min-h-screen bg-[#eef3f9] p-4 md:p-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="blob-1 absolute -top-24 left-10 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="blob-2 absolute -bottom-16 right-40 h-[420px] w-[420px] rounded-full bg-indigo-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-6 fade-up">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{t('supplierDashboard')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('whatShouldIDoToday')}</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-[2rem] border border-white/70 bg-white/90 shadow-xl shadow-slate-200/60 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-slate-900">{toArabicNumeral(kpi.totalRevenue.toLocaleString(), language)} {t('currency')}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{t('revenue')}</p>
          </div>
          <button onClick={() => navigate('/supplier/orders')} className="text-start rounded-[2rem] border border-white/70 bg-white/90 shadow-xl shadow-slate-200/60 p-5 hover:-translate-y-0.5 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-slate-900">{toArabicNumeral(String(kpi.activeOrders), language)}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{t('activeOrders')}</p>
          </button>
          <div className="rounded-[2rem] border border-white/70 bg-white/90 shadow-xl shadow-slate-200/60 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
                <Truck className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-slate-900">{toArabicNumeral(String(kpi.pendingDeliveries), language)}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{t('pendingDeliveries')}</p>
          </div>
          <div className="rounded-[2rem] border border-white/70 bg-white/90 shadow-xl shadow-slate-200/60 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-slate-900">{toArabicNumeral(String(kpi.totalProducts), language)}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{t('products')}</p>
          </div>
        </div>

        {/* Orders Requiring Action */}
        <div className="rounded-[2rem] border border-white/70 bg-white/90 shadow-xl shadow-slate-200/60 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100/70 flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              {t('ordersRequiringAction')}
            </h2>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">{toArabicNumeral(String(pendingOrders.length), language)}</span>
          </div>
          {pendingOrders.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-slate-500">{t('noOrdersRequiringAction')}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100/70 bg-slate-50/50">
                    <th className="text-start px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('order')}</th>
                    <th className="text-start px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('participantsCount')}</th>
                    <th className="text-start px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('value')}</th>
                    <th className="text-end px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-slate-900">{order.title}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">{toArabicNumeral(String(order.participants), language)}</td>
                      <td className="px-5 py-4 text-sm font-extrabold text-slate-900">{toArabicNumeral(order.totalAmount.toLocaleString(), language)} {t('currency')}</td>
                      <td className="px-5 py-4 text-end">
                        <button
                          onClick={() => navigate('/supplier/orders')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-[#1e3a8a] bg-[#1e3a8a]/10 rounded-xl hover:bg-[#1e3a8a]/20 transition-colors"
                        >
                          {t('reviewOrder')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Active Group Orders + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-[2rem] border border-white/70 bg-white/90 shadow-xl shadow-slate-200/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100/70">
              <h2 className="text-sm font-extrabold text-slate-900">{t('activeGroupOrders')}</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {activeGroupOrders.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-slate-500">{t('noActiveOrders')}</div>
              ) : (
                activeGroupOrders.map((order) => (
                  <div key={order.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/50">
                    <p className="text-sm font-bold text-slate-900">{order.title}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-500">{toArabicNumeral(String(order.participants), language)} {t('participants')}</span>
                      <span className="text-[11px] text-slate-500">{toArabicNumeral(order.totalValue.toLocaleString(), language)} {t('currency')}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/90 shadow-xl shadow-slate-200/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100/70">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#1e3a8a]" />
                {t('recentActivity')}
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {recentActivity.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-slate-500">{t('noRecentActivity')}</div>
              ) : (
                recentActivity.map((item, idx) => (
                  <div key={idx} className="px-5 py-3 hover:bg-slate-50/50">
                    <p className="text-xs text-slate-700 leading-relaxed">{language === 'ar' ? item.actionAr : item.actionEn}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(item.time).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Delivery Overview */}
        <div className="rounded-[2rem] border border-white/70 bg-white/90 shadow-xl shadow-slate-200/60 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100/70">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#1e3a8a]" />
              {t('deliveries')}
            </h2>
          </div>
          <div className="p-5 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: t('pending'), count: deliveryOverview.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: t('preparing'), count: deliveryOverview.preparing, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: t('shipped'), count: deliveryOverview.shipped, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: t('delivered'), count: deliveryOverview.delivered, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: t('failed'), count: deliveryOverview.failed, color: 'text-red-600', bg: 'bg-red-50' },
            ].map((item) => (
              <div key={item.label} className={`rounded-2xl p-4 ${item.bg} border border-white/50`}>
                <p className={`text-lg font-extrabold ${item.color}`}>{toArabicNumeral(String(item.count), language)}</p>
                <p className="text-[11px] text-slate-600 mt-0.5 font-semibold">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
