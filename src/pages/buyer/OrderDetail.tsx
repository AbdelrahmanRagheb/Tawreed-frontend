import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Package,
  DollarSign,
  Clock,
  Truck,
  CheckCircle,
  ChevronRight,
  Bell,
  MapPin,
  Calendar,
  TrendingDown,
  UserPlus,
  Edit3,
  LogOut,
  Activity,
} from 'lucide-react';
import { useLanguage } from '../../i18n';
import { mockGroupOrderDetails } from '../../data';
import type { GroupOrderStatus } from '../../types';

const statusConfig: Record<GroupOrderStatus, { icon: string; color: string; bg: string; text: string }> = {
  open: { icon: '🟢', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', text: 'Open' },
  closing_soon: { icon: '🟡', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', text: 'Closing Soon' },
  supplier_confirmed: { icon: '🔵', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', text: 'Supplier Confirmed' },
  in_transit: { icon: '🚚', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200', text: 'In Transit' },
  delivered: { icon: '✅', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', text: 'Delivered' },
};

const timelineSteps = [
  { key: 'created', label: { en: 'Order Created', ar: 'تم إنشاء الطلب' } },
  { key: 'open', label: { en: 'Open For Participation', ar: 'مفتوح للمشاركة' } },
  { key: 'deadline', label: { en: 'Deadline', ar: 'الموعد النهائي' } },
  { key: 'confirmed', label: { en: 'Supplier Confirmation', ar: 'تأكيد المورد' } },
  { key: 'delivery', label: { en: 'Delivery', ar: 'التسليم' } },
];

const progressSteps: Record<GroupOrderStatus, number> = {
  open: 1,
  closing_soon: 2,
  supplier_confirmed: 3,
  in_transit: 4,
  delivered: 5,
};

function StatusBadge({ status }: { status: GroupOrderStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.color}`}>
      <span>{cfg.icon}</span>
      {cfg.text}
    </span>
  );
}

function SummaryCard({ icon: Icon, label, value, sub }: { icon: typeof Users; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
        {sub && <p className="text-[11px] text-slate-400">{sub}</p>}
      </div>
    </div>
  );
}

function ProgressBar({ current, target, color }: { current: number; target: number; color: string }) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-slate-600 w-10 text-right">{pct}%</span>
    </div>
  );
}

function Timeline({ status }: { status: GroupOrderStatus }) {
  const currentStep = progressSteps[status];
  const { t } = useLanguage();
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-sm font-bold text-slate-900 mb-4">{t('orderTimeline')}</h3>
      <div className="relative">
        {timelineSteps.map((step, idx) => {
          const isComplete = idx < currentStep;
          const isCurrent = idx === currentStep;
          return (
            <div key={step.key} className="flex items-start gap-3 pb-4 last:pb-0">
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full border-2 shrink-0 ${
                    isComplete
                      ? 'bg-indigo-600 border-indigo-600'
                      : isCurrent
                      ? 'bg-indigo-100 border-indigo-600'
                      : 'bg-white border-slate-300'
                  }`}
                />
                {idx < timelineSteps.length - 1 && (
                  <div className={`w-0.5 h-8 ${isComplete ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                )}
              </div>
              <p
                className={`text-xs font-medium ${
                  isCurrent ? 'text-indigo-600 font-bold' : isComplete ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {step.label.en}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const order = id ? mockGroupOrderDetails[id] : undefined;

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

  const statusCfg = statusConfig[order.status];
  const totalParticipants = order.participants.length;
  const uniqueProducts = order.products.length;
  const timeRemaining = order.status === 'open' || order.status === 'closing_soon' ? '3 Days' : order.status === 'delivered' ? 'Completed' : '—';
  const currentUser = 'Ahmed Café';
  const userParticipation = order.participants.find((p) => p.name === currentUser);
  const userItems = userParticipation?.items || [];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/buyer/orders')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('backToOrders')}
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{order.title[language]}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
              <span className="font-medium text-slate-700">{t('createdBy')}: {order.createdBy}</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {t('region')}: {order.region}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {t('createdOn')}: {order.createdAt}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {t('deadline')}: {order.deadline}
              </span>
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <SummaryCard icon={Users} label={t('participants')} value={`${totalParticipants}`} sub={t('businesses')} />
        <SummaryCard icon={Package} label={t('products')} value={`${uniqueProducts}`} sub={t('items')} />
        <SummaryCard icon={DollarSign} label={t('estimatedTotal')} value={`${order.projectedFinalCost.toLocaleString()} EGP`} />
        <SummaryCard icon={Clock} label={t('timeRemaining')} value={timeRemaining} />
      </div>

      {/* Main content: two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Left column: Products table */}
        <div className="lg:col-span-2 space-y-4">
          {/* Product Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">{t('products')}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('product')}</th>
                    <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('currentQty')}</th>
                    <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('unit')}</th>
                    <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('price')}</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product) => (
                    <tr key={product.productId} className="border-b border-slate-50 last:border-0">
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-900">{product.productName[language]}</p>
                        {product.discountAchieved && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5">
                            <TrendingDown className="w-3 h-3" />
                            {t('discountAchieved')}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">{product.currentQuantity}</td>
                      <td className="px-5 py-4 text-sm text-slate-700">{product.unit}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-400 line-through">{product.originalPrice} EGP</span>
                          <span className="text-sm font-bold text-slate-900">{product.currentPrice} EGP</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Progress per product */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">{t('orderProgress')}</h3>
            <div className="space-y-4">
              {order.products.map((product) => {
                const pct = Math.min(100, Math.round((product.currentQuantity / product.targetQuantity) * 100));
                const color = pct >= 100 ? 'bg-emerald-500' : pct >= 50 ? 'bg-indigo-500' : 'bg-amber-500';
                return (
                  <div key={product.productId}>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-medium text-slate-700">{product.productName[language]}</p>
                      <p className="text-[11px] text-slate-500">
                        {product.currentQuantity} / {product.targetQuantity} {product.unit}
                      </p>
                    </div>
                    <ProgressBar current={product.currentQuantity} target={product.targetQuantity} color={color} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Savings Section */}
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-50/30 rounded-xl border border-emerald-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3">{t('savings')}</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-[11px] text-slate-500 font-medium">{t('totalOrderValue')}</p>
                <p className="text-lg font-bold text-slate-900">{order.totalOrderValue.toLocaleString()} EGP</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">{t('currentDiscount')}</p>
                <p className="text-lg font-bold text-emerald-600">-{order.currentDiscount.toLocaleString()} EGP</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">{t('projectedFinalCost')}</p>
                <p className="text-lg font-bold text-slate-900">{order.projectedFinalCost.toLocaleString()} EGP</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <Timeline status={order.status} />
        </div>

        {/* Right column: Sidebar */}
        <div className="space-y-4">
          {/* Participation Panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3">{t('yourParticipation')}</h3>
            {userItems.length > 0 ? (
              <>
                <div className="space-y-2 mb-4">
                  {userItems.map((item) => {
                    const product = order.products.find((p) => p.productId === item.productId);
                    return (
                      <div key={item.productId} className="flex items-center justify-between text-xs">
                        <span className="text-slate-700">{product?.productName[language] || item.productId}</span>
                        <span className="font-semibold text-slate-900">
                          {item.quantity} {product?.unit || ''}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-col gap-2">
                  <button className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                    {t('editQuantities')}
                  </button>
                  <button className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                    <LogOut className="w-3.5 h-3.5" />
                    {t('leaveOrder')}
                  </button>
                </div>
              </>
            ) : (
              <button className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
                <UserPlus className="w-3.5 h-3.5" />
                {t('joinOrder')}
              </button>
            )}
          </div>

          {/* Participants */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              {t('participants')} ({totalParticipants})
            </h3>
            <div className="space-y-2">
              {order.participants.slice(0, 8).map((p) => (
                <div key={p.id} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 shrink-0">
                    {p.name.charAt(0)}
                  </div>
                  <span className="text-xs text-slate-700">{p.name}</span>
                </div>
              ))}
              {order.participants.length > 8 && (
                <p className="text-[11px] text-indigo-600 font-semibold mt-1">
                  +{order.participants.length - 8} {t('more')}
                </p>
              )}
            </div>
          </div>

          {/* Activity Feed */}
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
                    <p className="text-xs text-slate-700">{act.message[language]}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{act.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Truck className="w-4 h-4 text-indigo-600" />
          {t('deliveryInfo')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-[11px] text-slate-500 font-medium">{t('supplier')}</p>
            <p className="text-sm font-medium text-slate-900 mt-0.5">{order.supplier.name}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">{t('deliveryRegion')}</p>
            <p className="text-sm font-medium text-slate-900 mt-0.5">{order.supplier.deliveryRegion}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">{t('expectedDelivery')}</p>
            <p className="text-sm font-medium text-slate-900 mt-0.5">{order.supplier.expectedDelivery}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
