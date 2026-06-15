import {
  DollarSign, ShoppingCart, Truck, Package, Clock, AlertTriangle,
  TrendingUp, Eye, CheckCircle, XCircle, ArrowRight, Activity,
} from 'lucide-react';
import { useLanguage } from '../../i18n';
import { mockOrders, mockDeliveries, mockProductList } from '../../data';

const orderActionStatuses = ['pending', 'confirmed'] as const;

const deliveryStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
  preparing: { label: 'Preparing', color: 'text-amber-700', bg: 'bg-amber-100' },
  'in-transit': { label: 'In Transit', color: 'text-indigo-700', bg: 'bg-indigo-100' },
  delivered: { label: 'Delivered', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  delayed: { label: 'Delayed', color: 'text-red-700', bg: 'bg-red-100' },
};

const groupOrderStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: 'Open', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  preparing: { label: 'Preparing', color: 'text-amber-700', bg: 'bg-amber-100' },
  in_transit: { label: 'In Transit', color: 'text-indigo-700', bg: 'bg-indigo-100' },
  delivered: { label: 'Delivered', color: 'text-emerald-700', bg: 'bg-emerald-100' },
};

export function SupplierDashboard() {
  const { language, t } = useLanguage();

  const pendingOrders = mockOrders.filter((o) => orderActionStatuses.includes(o.status as any));
  const pendingDeliveries = mockDeliveries.filter((d) => d.status !== 'delivered');
  const lowStockProducts = mockProductList.filter((p) => p.stock < 100);

  const deliveryCounts = {
    pending: mockDeliveries.filter((d) => d.status === 'preparing').length,
    preparing: mockDeliveries.filter((d) => d.status === 'preparing').length,
    inTransit: mockDeliveries.filter((d) => d.status === 'in-transit').length,
    delivered: mockDeliveries.filter((d) => d.status === 'delivered').length,
  };

  const demandData = [
    { product: 'Fresh Full Cream Milk (1L)', orders: 25 },
    { product: 'Arabic Coffee - Premium Blend', orders: 19 },
    { product: 'Premium Basmati Rice (25kg)', orders: 15 },
    { product: 'Premium Mixed Cheese Platter', orders: 11 },
    { product: 'Extra Virgin Olive Oil (5L)', orders: 8 },
  ];

  const recentActivity = [
    { text: { en: 'Weekly Café Supplies reached deadline', ar: 'وصلت مستلزمات المقهى الأسبوعية إلى الموعد النهائي' }, time: '2 hours ago' },
    { text: { en: 'Restaurant Essentials order accepted', ar: 'تم قبول طلب مستلزمات المطعم' }, time: '4 hours ago' },
    { text: { en: 'Delivery #ORD-2024-002 marked In Transit', ar: 'تم تحديث حالة التوصيل #ORD-2024-002 إلى قيد النقل' }, time: '6 hours ago' },
    { text: { en: 'Coffee inventory updated — new shipment arrived', ar: 'تم تحديث مخزون القهوة — وصلت شحنة جديدة' }, time: '1 day ago' },
    { text: { en: 'Milk stock below threshold — 20 L remaining', ar: 'مخزون الحليب أقل من الحد الأدنى — 20 لتر متبقي' }, time: '2 days ago' },
    { text: { en: 'New group order available for bidding', ar: 'طلب جماعي جديد متاح للمناقصة' }, time: '2 days ago' },
  ];

  const activeGroupOrders = [
    { name: { en: 'Weekly Café Supplies', ar: 'مستلزمات المقهى الأسبوعية' }, status: 'preparing' as const, deliveryDate: 'Jun 18' },
    { name: { en: 'Restaurant Essentials', ar: 'مستلزمات المطعم الأساسية' }, status: 'in_transit' as const, deliveryDate: 'Jun 16' },
    { name: { en: 'Grocery Supplies', ar: 'مستلزمات البقالة' }, status: 'delivered' as const, deliveryDate: 'Jun 14' },
    { name: { en: 'Café Daily Order', ar: 'الطلب اليومي للمقهى' }, status: 'open' as const, deliveryDate: 'Jun 22' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('supplierDashboard')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('whatShouldIDoToday')}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{t('thisMonth')}</span>
          </div>
          <p className="text-xl font-bold text-slate-900">45,000 EGP</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('revenue')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900">{pendingOrders.length + activeGroupOrders.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('activeOrders')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Truck className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900">{pendingDeliveries.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('pendingDeliveries')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900">{mockProductList.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('products')}</p>
        </div>
      </div>

      {/* Orders Requiring Action */}
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
                {pendingOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-900">{order.orderNumber}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">{order.items.length}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-900">{order.totalAmount.toLocaleString()} EGP</td>
                    <td className="px-5 py-4 text-end">
                      <button className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                        {t('reviewOrder')}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Two-column: Active Group Orders + Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Active Group Orders */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">{t('activeGroupOrders')}</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {activeGroupOrders.map((order, idx) => {
              const cfg = groupOrderStatusConfig[order.status];
              return (
                <div key={idx} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/50">
                  <p className="text-sm font-medium text-slate-900">{order.name[language]}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500">{order.deliveryDate}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-red-500" />
              {t('lowStockProducts')}
            </h2>
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">{lowStockProducts.length}</span>
          </div>
          {lowStockProducts.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-slate-500">{t('noLowStock')}</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/50">
                  <p className="text-sm font-medium text-slate-900">{product.name[language]}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${
                      product.stock < 50 ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {product.stock} {t('remaining')}
                    </span>
                    {product.stock < 50 && (
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Two-column: Demand Insights + Delivery Overview + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demand Insights */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              {t('mostRequestedProducts')}
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {demandData.map((item, idx) => (
              <div key={idx} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50/50">
                <p className="text-sm text-slate-700">{item.product}</p>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${(item.orders / demandData[0].orders) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 w-6 text-end">{item.orders}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Overview */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600" />
              {t('deliveries')}
            </h2>
          </div>
          <div className="p-5 grid grid-cols-2 gap-3">
            {[
              { label: t('pending'), count: deliveryCounts.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: t('preparing'), count: deliveryCounts.preparing, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: t('inTransit'), count: deliveryCounts.inTransit, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: t('delivered'), count: deliveryCounts.delivered, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl p-3 ${item.bg}`}>
                <p className={`text-lg font-bold ${item.color}`}>{item.count}</p>
                <p className="text-[11px] text-slate-600 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              {t('recentActivity')}
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="px-5 py-3 hover:bg-slate-50/50">
                <p className="text-xs text-slate-700 leading-relaxed">{item.text[language]}</p>
                <p className="text-[10px] text-slate-400 mt-1">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
