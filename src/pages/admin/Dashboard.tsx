import { Users, Store, ShoppingCart, DollarSign, Clock } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { mockAdminStats, mockUserEntries, mockSupplierEntries } from '../../data';

export function AdminDashboard() {
  const { language, t } = useLanguage();

  const stats = [
    { icon: Users, label: t('totalUsers'), value: mockAdminStats.totalUsers.toLocaleString(), change: '+12.5%', color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { icon: Store, label: t('totalSuppliers'), value: mockAdminStats.totalSuppliers.toString(), change: '+3', color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { icon: ShoppingCart, label: t('totalOrders'), value: mockAdminStats.totalOrders.toString(), change: '+8.3%', color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: DollarSign, label: 'Total Revenue', value: `SAR ${(mockAdminStats.totalRevenue / 1000).toFixed(0)}K`, change: '+15.5%', color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const pendingSuppliers = mockSupplierEntries.filter((s) => s.status === 'pending');
  const recentUsers = [...mockUserEntries].slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t('adminDashboard')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('platformOverview')}</p>
      </div>

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
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-4 md:px-6 py-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">{t('recentOrders')}</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {recentUsers.map((user) => (
              <div key={user.id} className="px-4 md:px-6 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Users className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-4 md:px-6 py-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">{t('suppliersApproval')}</h2>
          </div>
          {pendingSuppliers.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">No pending approvals</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingSuppliers.map((supplier) => (
                <div key={supplier.id} className="px-4 md:px-6 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{supplier.companyName[language]}</p>
                      <p className="text-xs text-slate-500">{supplier.contactName} • {supplier.category}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
