import { useEffect, useState } from 'react';
import { BarChart3, Download, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useLanguage, toArabicNumeral } from '../../i18n';
import { adminService, type AdminDashboardResponse } from '../../services/admin.service';

export function AdminReports() {
  const { language, t } = useLanguage();
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService.getDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load reports'))
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
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const { kpi } = data;

  const reports = [
    { id: '1', title: language === 'ar' ? 'تقرير المستخدمين' : 'Users Report', type: language === 'ar' ? 'مالي' : 'Financial', period: 'Monthly', total: kpi.totalUsers, growth: kpi.newUsersThisMonth > 0 ? 12 : -5, generatedAt: new Date().toLocaleDateString() },
    { id: '2', title: language === 'ar' ? 'تقرير الطلبات' : 'Orders Report', type: language === 'ar' ? 'تشغيلي' : 'Operational', period: 'Monthly', total: kpi.totalOrders, growth: 8, generatedAt: new Date().toLocaleDateString() },
    { id: '3', title: language === 'ar' ? 'تقرير الموردين' : 'Suppliers Report', type: language === 'ar' ? 'مالي' : 'Financial', period: 'Quarterly', total: kpi.totalSuppliers, growth: kpi.pendingSuppliers > 0 ? 5 : 0, generatedAt: new Date().toLocaleDateString() },
    { id: '4', title: language === 'ar' ? 'تقرير الفئات' : 'Categories Report', type: language === 'ar' ? 'تشغيلي' : 'Operational', period: 'Monthly', total: kpi.activeCategories, growth: 3, generatedAt: new Date().toLocaleDateString() },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('reports')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('analytics')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{report.title}</h3>
                  <p className="text-xs text-slate-500">{report.type} • {report.period}</p>
                </div>
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold ${
                report.growth >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {report.growth >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {toArabicNumeral(`${report.growth >= 0 ? '+' : ''}${report.growth}%`, language)}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-2xl font-bold text-slate-900">
                    {toArabicNumeral(report.type === 'Financial' || report.type === 'مالي'
                      ? `${(report.total / 1000).toFixed(1)}K`
                      : report.total.toLocaleString(), language)}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{t('download')} {toArabicNumeral(report.generatedAt, language)}</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <Download className="w-3.5 h-3.5" />
                {t('download')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
