import { useEffect, useState } from 'react';
import { DollarSign, ShoppingCart, TrendingUp, TrendingDown, Package, Download, AlertTriangle } from 'lucide-react';
import { useLanguage, toArabicNumeral } from '../../i18n';
import { supplierService, type SupplierReportsResponse } from '../../services/supplier.service';

const MONTH_NAMES_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_NAMES_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

function monthLabel(month: string, lang: string): string {
  const m = parseInt(month.slice(5), 10);
  return lang === 'ar' ? MONTH_NAMES_AR[m - 1] || month : MONTH_NAMES_EN[m - 1] || month;
}

export function SupplierReports() {
  const { language, t } = useLanguage();
  const [data, setData] = useState<SupplierReportsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    supplierService.getReports()
      .then(res => setData(res.data))
      .catch(err => setError(err?.response?.data?.message || err?.message || 'Failed to load reports'))
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

  const totalOrders = data.ordersTrend.reduce((s, m) => s + m.total, 0);
  const totalRevenue = data.revenueTrend.reduce((s, m) => s + m.total, 0);
  const totalProducts = data.topProducts.length;
  const totalDeliveries = Object.values(data.deliveryOverview).reduce((s: number, v) => s + (v as number), 0);
  const mc = data.monthlyComparison;

  const maxTrend = Math.max(...data.revenueTrend.map(m => m.total), 1);
  const maxOrders = Math.max(...data.ordersTrend.map(m => m.total), 1);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('reports')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('reportsDesc')}</p>
        </div>
       
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{toArabicNumeral(totalRevenue.toLocaleString(), language)} {t('currency')}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('revenue')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center mb-2">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{toArabicNumeral(String(totalOrders), language)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('orders')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-2">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{toArabicNumeral(String(totalProducts), language)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('topProducts')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{toArabicNumeral(String(totalDeliveries), language)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('deliveryStats')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="text-sm font-bold text-slate-900 mb-3">{t('monthlyOrdersLabel')}</h2>
          <div className="flex items-end gap-1.5" style={{ minHeight: '7rem' }}>
            {data.ordersTrend.map(m => {
              const statusList = [
                { key: 'cancelled', val: m.cancelled, color: 'bg-red-400' },
                { key: 'closed', val: m.closed, color: 'bg-amber-400' },
                { key: 'open', val: m.open, color: 'bg-blue-400' },
                { key: 'completed', val: m.completed, color: 'bg-emerald-400' },
              ];
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-0.5" style={{ height: '7rem' }}>
                  <div className="flex flex-col-reverse items-center w-full" style={{ height: '6rem' }}>
                    {statusList.map(s => {
                      const segHeight = maxOrders > 0 ? (s.val / maxOrders) * 100 : 0;
                      if (segHeight === 0) return null;
                      return <div key={s.key} className={`w-full ${s.color} rounded-t`} style={{ height: `${segHeight}%`, minHeight: s.val > 0 ? '3px' : '0' }} title={`${s.key}: ${s.val}`} />;
                    })}
                  </div>
                  <span className="text-[10px] text-slate-400">{monthLabel(m.month, language)}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 flex-wrap">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-400" />{t('statusCompleted')}</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-400" />{t('statusOpen')}</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-400" />{t('statusClosed')}</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-400" />{t('statusCancelled')}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="text-sm font-bold text-slate-900 mb-3">{t('revenueGenerated')}</h2>
          <div className="flex items-end gap-1.5" style={{ minHeight: '7rem' }}>
            {data.revenueTrend.map(m => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-0.5" style={{ height: '7rem' }}>
                <div className="w-full bg-gradient-to-t from-emerald-400 to-emerald-300 rounded-t" style={{ height: `${maxTrend > 0 ? (m.total / maxTrend) * 100 : 0}%`, minHeight: m.total > 0 ? '3px' : '0' }} title={`${m.month}: ${m.total}`} />
                <span className="text-[10px] text-slate-400">{monthLabel(m.month, language)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="text-sm font-bold text-slate-900 mb-3">{language === 'ar' ? 'مقارنة الشهر الحالي والسابق' : 'Monthly Comparison'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-[11px] text-slate-500 mb-1">{t('revenue')}</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-slate-900">{toArabicNumeral(mc.currentMonthRevenue.toLocaleString(), language)} {t('currency')}</p>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${mc.revenueChangePercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {mc.revenueChangePercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {toArabicNumeral(`${mc.revenueChangePercent >= 0 ? '+' : ''}${mc.revenueChangePercent}%`, language)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{language === 'ar' ? 'الشهر الماضي' : 'Last month'}: {toArabicNumeral(mc.previousMonthRevenue.toLocaleString(), language)} {t('currency')}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-[11px] text-slate-500 mb-1">{t('orders')}</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-slate-900">{toArabicNumeral(String(mc.currentMonthOrders), language)}</p>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${mc.ordersChangePercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {mc.ordersChangePercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {toArabicNumeral(`${mc.ordersChangePercent >= 0 ? '+' : ''}${mc.ordersChangePercent}%`, language)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{language === 'ar' ? 'الشهر الماضي' : 'Last month'}: {toArabicNumeral(String(mc.previousMonthOrders), language)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="text-sm font-bold text-slate-900 mb-3">{t('deliveryStats')}</h2>
          <div className="space-y-3">
            {[
              { label: language === 'ar' ? 'معلق' : 'Pending', value: data.deliveryOverview.pending, color: 'bg-slate-400' },
              { label: language === 'ar' ? 'قيد التحضير' : 'Preparing', value: data.deliveryOverview.preparing, color: 'bg-amber-500' },
              { label: language === 'ar' ? 'تم الشحن' : 'Shipped', value: data.deliveryOverview.shipped, color: 'bg-indigo-500' },
              { label: t('statusCompleted'), value: data.deliveryOverview.delivered, color: 'bg-emerald-500' },
              { label: language === 'ar' ? 'فاشل' : 'Failed', value: data.deliveryOverview.failed, color: 'bg-red-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">{item.label}</span>
                  <span className="text-xs font-semibold text-slate-900">{toArabicNumeral(String(item.value), language)}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${totalDeliveries > 0 ? (item.value / totalDeliveries) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <h2 className="text-sm font-bold text-slate-900 mb-3">{t('topProducts')}</h2>
        {data.topProducts.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">{language === 'ar' ? 'لا توجد منتجات مبيعة بعد' : 'No products sold yet'}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 px-2 text-[11px] text-slate-500 font-medium">{t('productName')}</th>
                  <th className="text-right py-2 px-2 text-[11px] text-slate-500 font-medium">{language === 'ar' ? 'الكمية المبيعة' : 'Qty Sold'}</th>
                  <th className="text-right py-2 px-2 text-[11px] text-slate-500 font-medium">{t('revenue')}</th>
                </tr>
              </thead>
              <tbody>
                {data.topProducts.map((p, i) => (
                  <tr key={p.productName} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-2.5 px-2">
                      <span className="text-slate-800 text-xs">{i + 1}. {p.productName}</span>
                    </td>
                    <td className="py-2.5 px-2 text-right text-xs font-semibold text-slate-900">{toArabicNumeral(String(p.quantitySold), language)}</td>
                    <td className="py-2.5 px-2 text-right text-xs font-semibold text-slate-900">{toArabicNumeral(p.revenue.toLocaleString(), language)} {t('currency')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
