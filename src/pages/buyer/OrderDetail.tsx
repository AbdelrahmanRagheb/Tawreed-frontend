import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Users, Package, DollarSign, Clock, Truck,
  MapPin, Calendar, UserPlus, Edit3, LogOut, Activity, AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../../i18n';
import { buyerService, type OrderDetailResponse } from '../../services/buyer.service';

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    buyerService.getOrderDetail(id)
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-sm text-red-600">{error}</p>
        <button onClick={() => navigate('/buyer/orders')} className="mt-4 text-indigo-600 text-sm font-semibold">
          ← {t('backToOrders')}
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center">
        <p className="text-slate-500">{t('orderNotFound')}</p>
        <button onClick={() => navigate('/buyer/orders')} className="mt-4 text-indigo-600 text-sm font-semibold">
          ← {t('backToOrders')}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <button
        onClick={() => navigate('/buyer/orders')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('backToOrders')}
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{order.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
              <span className="font-medium text-slate-700">{t('createdBy')}: {order.creatorName}</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />{t('region')}: {order.region}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />{t('deadline')}: {new Date(order.deadline).toLocaleDateString()}
              </span>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
            order.status === 'Open' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
            order.status === 'PendingApproval' ? 'bg-amber-50 border-amber-200 text-amber-700' :
            order.status === 'Locked' ? 'bg-blue-50 border-blue-200 text-blue-700' :
            order.status === 'Completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
            'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          { icon: Users, label: t('participants'), value: `${order.participants.length}` },
          { icon: Package, label: t('products'), value: `${order.products.length}` },
          { icon: DollarSign, label: t('estimatedTotal'), value: `${order.totalOrderValue.toLocaleString()} EGP` },
          { icon: Truck, label: t('supplier'), value: order.supplierName },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <item.icon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{item.label}</p>
              <p className="text-xl font-bold text-slate-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">{t('products')}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('product')}</th>
                    <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('quantity')}</th>
                    <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('unit')}</th>
                    <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('price')}</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product) => (
                    <tr key={product.productId} className="border-b border-slate-50 last:border-0">
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-900">{product.productName}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">{product.currentQuantity}/{product.targetQuantity}</td>
                      <td className="px-5 py-4 text-sm text-slate-700">{product.unit}</td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-slate-900">{product.unitPrice ? `${product.unitPrice} EGP` : '-'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {order.products.map((product) => {
            const pct = Math.min(100, Math.round((product.currentQuantity / product.targetQuantity) * 100));
            const color = pct >= 100 ? 'bg-emerald-500' : pct >= 50 ? 'bg-indigo-500' : 'bg-amber-500';
            return (
              <div key={product.productId} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-medium text-slate-700">{product.productName}</p>
                  <p className="text-[11px] text-slate-500">{product.currentQuantity} / {product.targetQuantity} {product.unit}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 w-10 text-right">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              {t('participants')} ({order.participants.length})
            </h3>
            <div className="space-y-2">
              {order.participants.map((p) => (
                <div key={p.id} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 shrink-0">
                    {p.name.charAt(0)}
                  </div>
                  <span className="text-xs text-slate-700">{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              {t('recentActivity')}
            </h3>
            <div className="space-y-3">
              {order.activities.slice(-6).reverse().map((act) => (
                <div key={act.id} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-700">{act.notes}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{new Date(act.createdAt).toLocaleDateString()}</p>
                    <p className="text-[10px] text-slate-400">{act.createdBy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
