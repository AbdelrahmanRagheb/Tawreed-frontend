import { useEffect, useState } from 'react';
import { DollarSign, ShoppingCart, TrendingUp, Package, Download, AlertTriangle } from 'lucide-react';
import { useLanguage, toArabicNumeral } from '../../i18n';
import { supplierService, type SupplierDashboardResponse } from '../../services/supplier.service';

export function SupplierReports() {
  const { language, t } = useLanguage();
  const [data, setData] = useState<SupplierDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    supplierService.getDashboard()
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

  const kpi: SupplierDashboardResponse['kpi'] = data.kpi;
  const deliveryOverview: SupplierDashboardResponse['deliveryOverview'] = data.deliveryOverview;

  const totalDeliveries = Object.values(deliveryOverview).reduce((s: number, v) => s + (v as number), 0);

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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{toArabicNumeral(kpi.totalRevenue.toLocaleString(), language)} {t('currency')}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('totalRevenue')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center mb-2">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{toArabicNumeral(String(kpi.totalOrders), language)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('totalOrders')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-2">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{toArabicNumeral(String(kpi.totalProducts), language)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('activeProducts')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{toArabicNumeral(String(deliveryOverview.delivered), language)}/{toArabicNumeral(String(kpi.totalOrders), language)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('completedOrders')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">{t('deliveryStats')}</h2>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: t('totalDeliveries'), value: totalDeliveries, pct: 100, color: 'bg-indigo-500' },
              { label: t('delivered'), value: deliveryOverview.delivered, pct: totalDeliveries > 0 ? Math.round(((deliveryOverview.delivered as number) / totalDeliveries) * 100) : 0, color: 'bg-emerald-500' },
              { label: t('shipped'), value: deliveryOverview.shipped, pct: totalDeliveries > 0 ? Math.round(((deliveryOverview.shipped as number) / totalDeliveries) * 100) : 0, color: 'bg-indigo-500' },
              { label: t('preparing'), value: deliveryOverview.preparing, pct: totalDeliveries > 0 ? Math.round(((deliveryOverview.preparing as number) / totalDeliveries) * 100) : 0, color: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">{item.label}</span>
                  <span className="text-xs font-semibold text-slate-900">{toArabicNumeral(String(item.value), language)}</span>
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
