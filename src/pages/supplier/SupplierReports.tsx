import { DollarSign, ShoppingCart, TrendingUp, Package, Download } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { mockOrders, mockProductList, mockDeliveries } from '../../data';

export function SupplierReports() {
  const { language, t } = useLanguage();

  const totalRevenue = mockOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = mockOrders.length;
  const deliveredOrders = mockOrders.filter((o) => o.status === 'delivered').length;
  const totalProducts = mockProductList.length;
  const deliveredDeliveries = mockDeliveries.filter((d) => d.status === 'delivered').length;

  const topProducts = mockProductList
    .map((p) => ({
      name: p.name[language],
      revenue: p.price * p.stock,
      orders: mockOrders.filter((o) => o.items.some((i) => i.productId === p.id.replace('sp', 'p'))).length,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('reports')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('reportsDesc')}</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors">
          <Download className="w-3.5 h-3.5" />
          {t('downloadReport')}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{totalRevenue.toLocaleString()} EGP</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('totalRevenue')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center mb-2">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{totalOrders}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('totalOrders')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-2">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{totalProducts}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('activeProducts')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{deliveredOrders}/{totalOrders}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('completedOrders')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">{t('topProducts')}</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {topProducts.map((product, idx) => (
              <div key={idx} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}</span>
                  <p className="text-sm text-slate-700">{product.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{product.revenue.toLocaleString()} EGP</p>
                  <p className="text-[10px] text-slate-400">{product.orders} {t('orders')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Stats */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">{t('deliveryStats')}</h2>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: t('totalDeliveries'), value: mockDeliveries.length, pct: 100, color: 'bg-indigo-500' },
              { label: t('delivered'), value: deliveredDeliveries, pct: Math.round((deliveredDeliveries / mockDeliveries.length) * 100), color: 'bg-emerald-500' },
              { label: t('inTransit'), value: mockDeliveries.filter((d) => d.status === 'in-transit').length, pct: Math.round((mockDeliveries.filter((d) => d.status === 'in-transit').length / mockDeliveries.length) * 100), color: 'bg-indigo-500' },
              { label: t('preparing'), value: mockDeliveries.filter((d) => d.status === 'preparing').length, pct: Math.round((mockDeliveries.filter((d) => d.status === 'preparing').length / mockDeliveries.length) * 100), color: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">{item.label}</span>
                  <span className="text-xs font-semibold text-slate-900">{item.value}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
