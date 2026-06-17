import { useEffect, useState } from 'react';
import {
  DollarSign, ShoppingCart, Truck, Package, Clock, AlertTriangle,
  TrendingUp, Activity, AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../../i18n';
import { supplierService, type SupplierDashboardResponse } from '../../services/supplier.service';

export function SupplierDashboard() {
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

  if (!data) return null;

  const { kpi, activeGroupOrders, deliveryOverview, recentActivity, pendingOrders } = data;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('supplierDashboard')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('whatShouldIDoToday')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900">{kpi.totalRevenue.toLocaleString()} EGP</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('revenue')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900">{kpi.activeOrders}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('activeOrders')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Truck className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900">{kpi.pendingDeliveries}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('pendingDeliveries')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900">{kpi.totalProducts}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('products')}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            {t('ordersRequiringAction')}
          </h2>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">{pendingOrders.length}</span>
        </div>
        {pendingOrders.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-slate-500">{t('noOrdersRequiringAction')}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('order')}</th>
                  <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('participantsCount')}</th>
                  <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('value')}</th>
                  <th className="text-end px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('action')}</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map((order: any) => (
                  <tr key={order.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-900">{order.title || order.orderNumber}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">{order.participants || order.items?.length || 0}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-900">{(order.totalValue || order.totalAmount || 0).toLocaleString()} EGP</td>
                    <td className="px-5 py-4 text-end">
                      <button className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">{t('activeGroupOrders')}</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {activeGroupOrders.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-slate-500">{t('noActiveOrders')}</div>
            ) : (
              activeGroupOrders.map((order) => (
                <div key={order.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/50">
                  <p className="text-sm font-medium text-slate-900">{order.title}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500">{order.participants} participants</span>
                    <span className="text-[11px] text-slate-500">{order.totalValue.toLocaleString()} EGP</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              {t('recentActivity')}
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {recentActivity.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-slate-500">{t('noRecentActivity')}</div>
            ) : (
              recentActivity.map((item, idx) => (
                <div key={idx} className="px-5 py-3 hover:bg-slate-50/50">
                  <p className="text-xs text-slate-700 leading-relaxed">{item.action}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{new Date(item.time).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-indigo-600" />
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
            <div key={item.label} className={`rounded-xl p-3 ${item.bg}`}>
              <p className={`text-lg font-bold ${item.color}`}>{item.count}</p>
              <p className="text-[11px] text-slate-600 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
