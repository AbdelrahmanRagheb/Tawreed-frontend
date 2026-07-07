import { useEffect, useState } from 'react';
import { BarChart3, Users, ShoppingCart, TrendingUp, Package, MapPin, Truck, DollarSign, AlertTriangle } from 'lucide-react';
import { useLanguage, toArabicNumeral } from '../../i18n';
import { adminService, type AdminReportsResponse } from '../../services/admin.service';

type BarItem = { label: string; value: number; color: string };

function BarChart({ items, maxValue, unit }: { items: BarItem[]; maxValue?: number; unit?: string }) {
  const max = maxValue ?? Math.max(...items.map(i => i.value), 1);
  return (
    <div className="space-y-2">
      {items.map(item => (
        <div key={item.label}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-600 truncate">{item.label}</span>
            <span className="font-semibold text-slate-900 ml-2">
              {unit === 'currency' ? `${toArabicNumeral(item.value.toLocaleString(), useLanguage().language)} ج.م` : toArabicNumeral(String(item.value), useLanguage().language)}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${item.color}`} style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniBarChart({ data, bars, height = 'h-20' }: { data: { month: string; values: number[] }[]; bars: { key: string; color: string }[]; height?: string }) {
  const maxVal = Math.max(...data.flatMap(d => d.values), 1);
  return (
    <div className="flex items-end gap-1" style={{ minHeight: '5rem' }}>
      {data.map(d => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-0.5" style={{ height: '5rem' }}>
          {d.values.map((v, i) => (
            <div
              key={i}
              className={`w-full rounded-t ${bars[i]?.color ?? 'bg-indigo-500'}`}
              style={{ height: `${(v / maxVal) * 100}%`, minHeight: v > 0 ? '4px' : '0' }}
              title={`${d.month}: ${v}`}
            />
          ))}
          <span className="text-[10px] text-slate-400 mt-0.5">{d.month.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

export function AdminReports() {
  const { language, t } = useLanguage();
  const [data, setData] = useState<AdminReportsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService.getReports()
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

  const totalUsers = data.usersTrend.reduce((s, m) => s + m.buyers + m.suppliers + m.delivery, 0);
  const totalOrders = data.ordersTrend.reduce((s, m) => s + m.total, 0);
  const totalRevenue = data.revenueTrend.reduce((s, m) => s + m.total, 0);
  const totalDeliveries = data.deliveryPerformance.total;

  const statusColors: Record<string, string> = { Open: 'bg-blue-500', Closed: 'bg-amber-500', Completed: 'bg-emerald-500', Cancelled: 'bg-red-500', Draft: 'bg-slate-400', PendingApproval: 'bg-purple-500', Locked: 'bg-cyan-500' };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('reports')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('analytics')}</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors">
          <BarChart3 className="w-3.5 h-3.5" />
          {t('downloadReport')}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center mb-2">
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{toArabicNumeral(String(totalUsers), language)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('users')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-2">
            <ShoppingCart className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{toArabicNumeral(String(totalOrders), language)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('orders')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-2">
            <DollarSign className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{toArabicNumeral(totalRevenue.toLocaleString(), language)} {t('currency')}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('revenue')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-2">
            <Truck className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{toArabicNumeral(String(totalDeliveries), language)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('deliveryStats')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 lg:col-span-2">
          <h2 className="text-sm font-bold text-slate-900 mb-3">{language === 'ar' ? 'اتجاهات المستخدمين' : 'Users Trend'} (12 {language === 'ar' ? 'شهراً' : 'months'})</h2>
          <div className="flex items-end gap-1.5" style={{ minHeight: '7rem' }}>
            {data.usersTrend.map(m => {
              const max = Math.max(...data.usersTrend.flatMap(x => [x.buyers, x.suppliers, x.delivery]), 1);
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-0.5" style={{ height: '7rem' }}>
                  <div className="flex flex-col-reverse items-center w-full" style={{ height: '6rem' }}>
                    <div className="w-full bg-emerald-200 rounded-t" style={{ height: `${(m.delivery / max) * 100}%`, minHeight: m.delivery > 0 ? '3px' : '0' }} title={`Delivery: ${m.delivery}`} />
                    <div className="w-full bg-amber-200 rounded-t" style={{ height: `${(m.suppliers / max) * 100}%`, minHeight: m.suppliers > 0 ? '3px' : '0' }} title={`Suppliers: ${m.suppliers}`} />
                    <div className="w-full bg-indigo-300 rounded-t" style={{ height: `${(m.buyers / max) * 100}%`, minHeight: m.buyers > 0 ? '3px' : '0' }} title={`Buyers: ${m.buyers}`} />
                  </div>
                  <span className="text-[10px] text-slate-400">{m.month.slice(5)}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-indigo-300" />{t('buyers')}</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-200" />{t('suppliers')}</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-200" />{language === 'ar' ? 'مندوبي التوصيل' : 'Delivery'}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="text-sm font-bold text-slate-900 mb-3">{t('deliveryStats')}</h2>
          <BarChart
            items={[
              { label: t('statusCompleted'), value: data.deliveryPerformance.delivered, color: 'bg-emerald-500' },
              { label: language === 'ar' ? 'قيد التوصيل' : 'Out for Delivery', value: data.deliveryPerformance.outForDelivery, color: 'bg-blue-500' },
              { label: language === 'ar' ? 'تم الشحن' : 'Shipped', value: data.deliveryPerformance.shipped, color: 'bg-indigo-500' },
              { label: language === 'ar' ? 'قيد التحضير' : 'Preparing', value: data.deliveryPerformance.preparing, color: 'bg-amber-500' },
              { label: language === 'ar' ? 'معلق' : 'Pending', value: data.deliveryPerformance.pending, color: 'bg-slate-400' },
              { label: language === 'ar' ? 'فاشل' : 'Failed', value: data.deliveryPerformance.failed, color: 'bg-red-500' },
            ]}
            maxValue={data.deliveryPerformance.total}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="text-sm font-bold text-slate-900 mb-3">{t('monthlyOrdersLabel')}</h2>
          <div className="flex items-end gap-1.5" style={{ minHeight: '8rem' }}>
            {data.ordersTrend.map(m => {
              const statusList = [
                { key: 'cancelled', val: m.cancelled, color: 'bg-red-400' },
                { key: 'closed', val: m.closed, color: 'bg-amber-400' },
                { key: 'open', val: m.open, color: 'bg-blue-400' },
                { key: 'completed', val: m.completed, color: 'bg-emerald-400' },
              ];
              const max = Math.max(...data.ordersTrend.flatMap(x => [x.total]), 1);
              let cumulative = 0;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-0.5" style={{ height: '7rem' }}>
                  <div className="flex flex-col-reverse items-center w-full" style={{ height: '6rem' }}>
                    {statusList.map(s => {
                      const segHeight = m.total > 0 ? (s.val / max) * 100 : 0;
                      if (segHeight === 0) return null;
                      cumulative += segHeight;
                      return <div key={s.key} className={`w-full ${s.color} rounded-t`} style={{ height: `${segHeight}%`, minHeight: s.val > 0 ? '3px' : '0' }} title={`${s.key}: ${s.val}`} />;
                    })}
                  </div>
                  <span className="text-[10px] text-slate-400">{m.month.slice(5)}</span>
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
            {data.revenueTrend.map(m => {
              const maxRev = Math.max(...data.revenueTrend.map(x => x.total), 1);
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-0.5" style={{ height: '7rem' }}>
                  <div className="w-full bg-gradient-to-t from-emerald-400 to-emerald-300 rounded-t" style={{ height: `${(m.total / maxRev) * 100}%`, minHeight: m.total > 0 ? '3px' : '0' }} title={`${m.month}: ${m.total}`} />
                  <span className="text-[10px] text-slate-400">{m.month.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="text-sm font-bold text-slate-900 mb-3">{language === 'ar' ? 'أفضل التصنيفات' : 'Top Categories'}</h2>
          <BarChart
            items={data.topCategories.map((c, i) => ({
              label: c.categoryName,
              value: c.orderCount,
              color: ['bg-indigo-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-cyan-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500', 'bg-red-500'][i % 10]
            }))}
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="text-sm font-bold text-slate-900 mb-3">{language === 'ar' ? 'التوزيع حسب المنطقة' : 'Regional Distribution'}</h2>
          <BarChart
            items={data.regionalDistribution.map((r, i) => ({
              label: language === 'ar' ? r.regionNameAr : r.regionNameEn,
              value: r.orderCount,
              color: ['bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-pink-500', 'bg-rose-500', 'bg-orange-500'][i % 10]
            }))}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <h2 className="text-sm font-bold text-slate-900 mb-3">{language === 'ar' ? 'توزيع حالات الطلبات' : 'Order Status Distribution'}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {data.orderStatusDistribution.map(s => (
            <div key={s.status} className="text-center p-3 rounded-lg bg-slate-50">
              <div className={`w-3 h-3 rounded-full mx-auto mb-1.5 ${statusColors[s.status] ?? 'bg-slate-400'}`} />
              <p className="text-lg font-bold text-slate-900">{toArabicNumeral(String(s.count), language)}</p>
              <p className="text-[11px] text-slate-500">{s.status === 'Open' ? t('statusOpen') : s.status === 'Closed' ? t('statusClosed') : s.status === 'Completed' ? t('statusCompleted') : s.status === 'Cancelled' ? t('statusCancelled') : s.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
