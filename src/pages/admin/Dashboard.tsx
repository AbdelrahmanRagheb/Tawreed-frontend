import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Store, ShoppingCart, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { useLanguage, toArabicNumeral } from '../../i18n';
import { adminService, type AdminDashboardResponse } from '../../services/admin.service';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService.getDashboard()
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

  const { kpi, recentOrders, pendingSupplierApplications } = data;

  const stats = [
    { icon: Users, label: t('totalUsers'), value: toArabicNumeral(kpi.totalUsers.toLocaleString(), language), color: 'text-indigo-600', bg: 'bg-indigo-100', path: '/admin/buyers' },
    { icon: Clock, label: t('pendingApproval'), value: toArabicNumeral(kpi.pendingSuppliers.toString(), language), color: 'text-amber-600', bg: 'bg-amber-100', path: '/admin/suppliers?status=PendingApproval' },
    { icon: Store, label: t('totalSuppliers'), value: toArabicNumeral(kpi.totalSuppliers.toString(), language), color: 'text-emerald-600', bg: 'bg-emerald-100', path: '/admin/suppliers' },
    { icon: ShoppingCart, label: t('orders'), value: toArabicNumeral(kpi.totalOrders.toString(), language), color: 'text-blue-600', bg: 'bg-blue-100', path: '/admin/orders' },
    { icon: DollarSign, label: 'Revenue', value: toArabicNumeral(`${(kpi.newUsersThisMonth * 1000).toLocaleString()} ${t('currency')}`, language), color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t('adminDashboard')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('platformOverview')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const Card = stat.path ? 'button' : 'div';
          return (
            <Card key={stat.label} onClick={stat.path ? () => navigate(stat.path!) : undefined}
              className={`bg-white rounded-xl border border-slate-200 p-4 text-start ${stat.path ? 'cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">{t('suppliersApproval')}</h2>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{toArabicNumeral(String(pendingSupplierApplications.length), language)} {t('pending')}</span>
          </div>
          {pendingSupplierApplications.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-slate-500">No pending applications</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingSupplierApplications.map((s: any, idx: number) => (
                <button key={s.id || idx} onClick={() => navigate('/admin/suppliers?status=PendingApproval')}
                  className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Store className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{s.companyName || s.name || toArabicNumeral(`Pending #${idx + 1}`, language)}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">{t('pending')}</span>
                </button>
              ))}
            </div>
          )}
        </div>

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
                    <p className="text-sm font-semibold text-slate-900">{order.title}</p>
                    <p className="text-[11px] text-slate-500">{toArabicNumeral(order.totalAmount.toLocaleString(), language)} {t('currency')} • {order.buyerName}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold capitalize text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{order.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
