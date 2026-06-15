import { Users, Store, ShoppingCart, DollarSign, AlertTriangle, Info, XCircle, Clock } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { mockAdminStats, mockUserEntries, mockSupplierEntries, mockCategoryEntries, mockRegionEntries, mockSystemAlerts, mockOrders } from '../../data';

export function AdminDashboard() {
  const { language, t } = useLanguage();

  const stats = [
    { icon: Users, label: t('totalUsers'), value: (mockAdminStats.totalUsers - 35).toLocaleString(), change: '+12.5%', color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { icon: Store, label: t('totalSuppliers'), value: mockAdminStats.totalSuppliers.toString(), change: '+3', color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { icon: ShoppingCart, label: t('orders'), value: mockAdminStats.totalOrders.toString(), change: '+8.3%', color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: DollarSign, label: 'Revenue', value: `EGP ${(mockAdminStats.totalRevenue / 1000).toFixed(0)}K`, change: '+15.5%', color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const pendingSuppliers = mockSupplierEntries.filter((s) => s.status === 'pending').slice(0, 3);
  const recentOrders = mockOrders.slice(-3).reverse();
  const topRegions = [...mockRegionEntries].sort((a, b) => b.supplierCount - a.supplierCount).slice(0, 4);
  const topCategories = [...mockCategoryEntries].sort((a, b) => b.productCount - a.productCount).slice(0, 4);

  const alertIcon = { warning: AlertTriangle, info: Info, error: XCircle };
  const alertColor = { warning: 'text-amber-600 bg-amber-50', info: 'text-blue-600 bg-blue-50', error: 'text-red-600 bg-red-50' };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t('adminDashboard')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('platformOverview')}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Supplier Applications */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">{t('suppliersApproval')}</h2>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{pendingSuppliers.length} {t('pending')}</span>
          </div>
          {pendingSuppliers.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-slate-500">No pending applications</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingSuppliers.map((s) => (
                <div key={s.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{s.companyName[language]}</p>
                      <p className="text-[11px] text-slate-500">{s.contactName} • {s.category}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">{t('pending')}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">{t('recentOrders')}</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{order.orderNumber}</p>
                    <p className="text-[11px] text-slate-500">SAR {order.totalAmount.toLocaleString()} • {order.items.length} {t('items')}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold capitalize text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{order.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">{t('systemAlerts')}</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {mockSystemAlerts.map((alert) => {
              const Icon = alertIcon[alert.type as keyof typeof alertIcon];
              const colors = alertColor[alert.type as keyof typeof alertColor];
              return (
                <div key={alert.id} className="px-5 py-3 flex items-start gap-3 hover:bg-slate-50">
                  <div className={`w-8 h-8 rounded-lg ${colors} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700">{alert.message[language]}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{alert.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Regions + Top Categories combined */}
        <div className="grid grid-cols-1 gap-6">
          {/* Top Regions */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">{t('topRegions')}</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {topRegions.map((r) => (
                <div key={r.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50">
                  <span className="text-sm text-slate-700">{r.name[language]}</span>
                  <span className="text-xs font-semibold text-slate-500">{r.supplierCount} {t('suppliers')} • {r.buyerCount} {t('users')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">{t('topCategories')}</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {topCategories.map((c) => (
                <div key={c.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50">
                  <span className="text-sm text-slate-700">{c.name[language]}</span>
                  <span className="text-xs font-semibold text-slate-500">{c.productCount} {t('products')} • {c.supplierCount} {t('suppliers')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
