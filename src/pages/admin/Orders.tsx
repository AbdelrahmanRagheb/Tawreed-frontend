import { useState, useMemo } from 'react';
import { ShoppingCart, Clock, CheckCircle, XCircle, Truck, AlertTriangle, Eye, X, ChevronDown, ChevronRight, MapPin, Users, Store, DollarSign, AlertCircle, TrendingUp, Package, Ban, Activity } from 'lucide-react';
import { useLanguage } from '../../i18n';

const statusConfig: Record<string, { icon: typeof Clock; label: string; color: string; bg: string }> = {
  collecting: { icon: Clock, label: 'Collecting Participants', color: 'text-amber-600', bg: 'bg-amber-100' },
  confirmed: { icon: CheckCircle, label: 'Confirmed by Supplier', color: 'text-blue-600', bg: 'bg-blue-100' },
  preparing: { icon: Package, label: 'Preparing', color: 'text-indigo-600', bg: 'bg-indigo-100' },
  'in-transit': { icon: Truck, label: 'In Transit', color: 'text-indigo-600', bg: 'bg-indigo-100' },
  delivered: { icon: CheckCircle, label: 'Delivered', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  closed: { icon: CheckCircle, label: 'Closed', color: 'text-slate-600', bg: 'bg-slate-100' },
  cancelled: { icon: XCircle, label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-100' },
};

const riskConfig: Record<string, { color: string; bg: string }> = {
  low: { color: 'text-emerald-600', bg: 'bg-emerald-100' },
  medium: { color: 'text-amber-600', bg: 'bg-amber-100' },
  high: { color: 'text-red-600', bg: 'bg-red-100' },
};

interface AdminOrder {
  id: string;
  orderNumber: string;
  createdBy: string;
  supplier: string;
  region: string;
  status: string;
  participants: number;
  suppliers: number;
  totalValue: number;
  discountSaved: number;
  finalValue: number;
  risk: string;
  createdAt: string;
  items: { name: string; quantity: number; price: number }[];
  timeline: { stage: string; date: string; completed: boolean }[];
}

const mockAdminOrders: AdminOrder[] = [
  {
    id: 'ao1', orderNumber: 'ORD-002',
    createdBy: 'Omar Market', supplier: 'Fresh Foods Co.', region: 'Mansoura',
    status: 'delivered', participants: 12, suppliers: 1,
    totalValue: 9525, discountSaved: 1200, finalValue: 8325,
    risk: 'low', createdAt: '2024-11-20',
    items: [
      { name: 'Premium Medjool Dates (5kg)', quantity: 30, price: 220 },
      { name: 'Pure Natural Honey (3kg)', quantity: 15, price: 195 },
    ],
    timeline: [
      { stage: 'Collecting Participants', date: '2024-11-20', completed: true },
      { stage: 'Confirmed by Supplier', date: '2024-11-22', completed: true },
      { stage: 'Preparing', date: '2024-11-25', completed: true },
      { stage: 'In Transit', date: '2024-11-28', completed: true },
      { stage: 'Delivered', date: '2024-12-01', completed: true },
    ],
  },
  {
    id: 'ao2', orderNumber: 'ORD-003',
    createdBy: 'Elite Café', supplier: 'Arabian Coffee Roasters', region: 'Cairo',
    status: 'confirmed', participants: 8, suppliers: 1,
    totalValue: 5900, discountSaved: 450, finalValue: 5450,
    risk: 'low', createdAt: '2024-12-01',
    items: [
      { name: 'Arabic Coffee - Premium Blend', quantity: 50, price: 85 },
      { name: 'Premium Basmati Rice (25kg)', quantity: 10, price: 165 },
    ],
    timeline: [
      { stage: 'Collecting Participants', date: '2024-12-01', completed: true },
      { stage: 'Confirmed by Supplier', date: '2024-12-03', completed: true },
      { stage: 'Preparing', date: '', completed: false },
      { stage: 'In Transit', date: '', completed: false },
      { stage: 'Delivered', date: '', completed: false },
    ],
  },
  {
    id: 'ao3', orderNumber: 'ORD-004',
    createdBy: 'Grocery Plus', supplier: 'Al-Madina Dairy', region: 'Alexandria',
    status: 'collecting', participants: 5, suppliers: 0,
    totalValue: 3625, discountSaved: 0, finalValue: 3625,
    risk: 'medium', createdAt: '2024-12-10',
    items: [
      { name: 'Extra Virgin Olive Oil (5L)', quantity: 25, price: 145 },
    ],
    timeline: [
      { stage: 'Collecting Participants', date: '2024-12-10', completed: true },
      { stage: 'Confirmed by Supplier', date: '', completed: false },
      { stage: 'Preparing', date: '', completed: false },
      { stage: 'In Transit', date: '', completed: false },
      { stage: 'Delivered', date: '', completed: false },
    ],
  },
  {
    id: 'ao4', orderNumber: 'ORD-005',
    createdBy: 'Hassan Supermarket', supplier: 'Al-Madina Dairy', region: 'Mansoura',
    status: 'in-transit', participants: 20, suppliers: 1,
    totalValue: 18300, discountSaved: 2800, finalValue: 15500,
    risk: 'medium', createdAt: '2024-11-25',
    items: [
      { name: 'Fresh Milk (1L)', quantity: 200, price: 7.5 },
      { name: 'Cheddar Cheese (1KG)', quantity: 50, price: 18 },
      { name: 'Labneh (500g)', quantity: 80, price: 12 },
    ],
    timeline: [
      { stage: 'Collecting Participants', date: '2024-11-25', completed: true },
      { stage: 'Confirmed by Supplier', date: '2024-11-27', completed: true },
      { stage: 'Preparing', date: '2024-11-30', completed: true },
      { stage: 'In Transit', date: '2024-12-03', completed: true },
      { stage: 'Delivered', date: '', completed: false },
    ],
  },
  {
    id: 'ao5', orderNumber: 'ORD-006',
    createdBy: 'Lailas Bakery', supplier: 'Premium Olive Oil Estates', region: 'Jeddah',
    status: 'cancelled', participants: 3, suppliers: 0,
    totalValue: 2100, discountSaved: 0, finalValue: 2100,
    risk: 'high', createdAt: '2024-12-05',
    items: [
      { name: 'Organic Olive Oil (1L)', quantity: 20, price: 105 },
    ],
    timeline: [
      { stage: 'Collecting Participants', date: '2024-12-05', completed: true },
      { stage: 'Confirmed by Supplier', date: '', completed: false },
      { stage: 'Preparing', date: '', completed: false },
      { stage: 'In Transit', date: '', completed: false },
      { stage: 'Delivered', date: '', completed: false },
    ],
  },
  {
    id: 'ao6', orderNumber: 'ORD-007',
    createdBy: 'Desert Rose Restaurant', supplier: 'Farms Co.', region: 'Riyadh',
    status: 'preparing', participants: 10, suppliers: 1,
    totalValue: 8400, discountSaved: 900, finalValue: 7500,
    risk: 'high', createdAt: '2024-12-08',
    items: [
      { name: 'Fresh Potatoes (1KG)', quantity: 300, price: 3 },
      { name: 'Organic Tomatoes (1KG)', quantity: 100, price: 8 },
    ],
    timeline: [
      { stage: 'Collecting Participants', date: '2024-12-08', completed: true },
      { stage: 'Confirmed by Supplier', date: '2024-12-09', completed: true },
      { stage: 'Preparing', date: '2024-12-11', completed: true },
      { stage: 'In Transit', date: '', completed: false },
      { stage: 'Delivered', date: '', completed: false },
    ],
  },
];

export function AdminOrders() {
  const { language, t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const regions = useMemo(() => {
    const r = new Set(mockAdminOrders.map((o) => o.region));
    return ['all', ...Array.from(r)];
  }, []);

  const filtered = mockAdminOrders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (regionFilter !== 'all' && o.region !== regionFilter) return false;
    if (riskFilter !== 'all' && o.risk !== riskFilter) return false;
    return true;
  });

  const active = mockAdminOrders.filter((o) => ['collecting', 'confirmed', 'preparing', 'in-transit'].includes(o.status)).length;
  const completed = mockAdminOrders.filter((o) => o.status === 'delivered' || o.status === 'closed').length;
  const cancelled = mockAdminOrders.filter((o) => o.status === 'cancelled').length;
  const delayed = mockAdminOrders.filter((o) => o.risk === 'high' && o.status !== 'cancelled').length;

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => prev === id ? null : id);
  };

  const getTimelineProgress = (timeline: AdminOrder['timeline']) => {
    const completedCount = timeline.filter((s) => s.completed).length;
    return (completedCount / timeline.length) * 100;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('orders')}</h1>
          <p className="text-sm text-slate-500 mt-1">{mockAdminOrders.length} {t('totalOrders')}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center mb-2">
            <ShoppingCart className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{mockAdminOrders.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('totalOrders')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center mb-2">
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{active}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('activeOrders')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center mb-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{completed}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('delivered')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{delayed + cancelled}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('issues')}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">{t('allStatus')}</option>
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">{t('allRegions')}</option>
          {regions.filter((r) => r !== 'all').map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">{t('allRisk')}</option>
          <option value="low">Low Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="high">High Risk</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="w-8 px-2 py-3" />
                <th className="text-start px-3 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('order')}</th>
                <th className="text-start px-3 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('createdBy')}</th>
                <th className="text-start px-3 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('supplier')}</th>
                <th className="text-start px-3 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('region')}</th>
                <th className="text-start px-3 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('status')}</th>
                <th className="text-start px-3 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('participants')}</th>
                <th className="text-end px-3 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('value')}</th>
                <th className="text-end px-3 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((order) => {
                const sCfg = statusConfig[order.status] || statusConfig.collecting;
                const StatusIcon = sCfg.icon;
                const rCfg = riskConfig[order.risk] || riskConfig.low;
                const isExpanded = expandedId === order.id;
                return (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td colSpan={9} className="p-0">
                      <div>
                        {/* Main Row */}
                        <div
                          className="flex items-center w-full px-2 py-3 cursor-pointer"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <div className="w-8 flex items-center justify-center">
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                          </div>
                          <div className="flex-1 grid grid-cols-8 gap-2 items-center px-1">
                            <div className="text-sm font-semibold text-slate-900">{order.orderNumber}</div>
                            <div className="text-sm text-slate-700 truncate">{order.createdBy}</div>
                            <div className="text-sm text-slate-700 truncate">{order.supplier}</div>
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{order.region}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${sCfg.bg} ${sCfg.color}`}>
                                <StatusIcon className="w-3 h-3" />
                                {sCfg.label}
                              </span>
                            </div>
                            <div className="text-sm font-semibold text-slate-900">{order.participants}</div>
                            <div className="text-end text-sm font-bold text-slate-900">SAR {order.finalValue.toLocaleString()}</div>
                            <div className="text-end flex items-center justify-end gap-1">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${rCfg.bg} ${rCfg.color}`}>
                                {order.risk === 'high' && <AlertTriangle className="w-2.5 h-2.5" />}
                                {order.risk.charAt(0).toUpperCase() + order.risk.slice(1)}
                              </span>
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                                className="p-1 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Row: Timeline */}
                        {isExpanded && (
                          <div className="bg-slate-50 border-t border-slate-100 px-12 py-4">
                            <div className="flex items-center gap-1 mb-3">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('orderTimeline')}</span>
                            </div>
                            {/* Progress bar */}
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-4">
                              <div
                                className="h-full rounded-full bg-indigo-500 transition-all"
                                style={{ width: `${getTimelineProgress(order.timeline)}%` }}
                              />
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                              {order.timeline.map((step, idx) => (
                                <div key={idx} className="text-center">
                                  <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center mb-1 ${
                                    step.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'
                                  }`}>
                                    {step.completed ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                  </div>
                                  <p className={`text-[10px] font-medium ${step.completed ? 'text-slate-700' : 'text-slate-400'}`}>{step.stage}</p>
                                  <p className={`text-[9px] ${step.completed ? 'text-slate-500' : 'text-slate-300'}`}>{step.date || '—'}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-slate-500">No orders found</div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selectedOrder.orderNumber}</h2>
                <p className="text-[11px] text-slate-500">{t('createdOn')} {selectedOrder.createdAt}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status + Risk */}
              <div className="flex items-center gap-3">
                {(() => {
                  const sCfg = statusConfig[selectedOrder.status] || statusConfig.collecting;
                  const StatusIcon = sCfg.icon;
                  const rCfg = riskConfig[selectedOrder.risk] || riskConfig.low;
                  return (
                    <>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${sCfg.bg} ${sCfg.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" /> {sCfg.label}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${rCfg.bg} ${rCfg.color}`}>
                        {selectedOrder.risk === 'high' && <AlertTriangle className="w-3.5 h-3.5" />}
                        {selectedOrder.risk.charAt(0).toUpperCase() + selectedOrder.risk.slice(1)} Risk
                      </span>
                    </>
                  );
                })()}
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">{t('createdBy')}</p>
                  <div className="flex items-center gap-1.5 text-sm text-slate-800 font-medium">
                    <Users className="w-4 h-4 text-slate-400" /> {selectedOrder.createdBy}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">{t('supplier')}</p>
                  <div className="flex items-center gap-1.5 text-sm text-slate-800 font-medium">
                    <Store className="w-4 h-4 text-slate-400" /> {selectedOrder.supplier}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">{t('region')}</p>
                  <div className="flex items-center gap-1.5 text-sm text-slate-800 font-medium">
                    <MapPin className="w-4 h-4 text-slate-400" /> {selectedOrder.region}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">{t('participants')}</p>
                  <div className="flex items-center gap-1.5 text-sm text-slate-800 font-medium">
                    <Users className="w-4 h-4 text-slate-400" /> {selectedOrder.participants} buyers • {selectedOrder.suppliers > 0 ? `${selectedOrder.suppliers} supplier` : 'No supplier yet'}
                  </div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('financialBreakdown')}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{t('totalValue')}</span>
                    <span className="font-semibold text-slate-900">SAR {selectedOrder.totalValue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{t('discountSaved')}</span>
                    <span className="font-semibold text-emerald-600">- SAR {selectedOrder.discountSaved.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">{t('finalValue')}</span>
                    <span className="text-lg font-black text-slate-900">SAR {selectedOrder.finalValue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('items')}</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-medium text-slate-700">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-slate-500">×{item.quantity}</span>
                        <span className="font-semibold text-slate-900">SAR {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('orderTimeline')}</h3>
                <div className="relative pl-5 space-y-3">
                  {selectedOrder.timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      {idx < selectedOrder.timeline.length - 1 && (
                        <div className={`absolute left-[-7px] top-4 w-0.5 h-6 ${step.completed ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                      )}
                      <div className="flex items-start gap-3">
                        <div className={`w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 ${
                          step.completed ? 'bg-emerald-400 ring-2 ring-emerald-100' : 'bg-slate-300'
                        }`} />
                        <div>
                          <p className={`text-xs font-semibold ${step.completed ? 'text-slate-800' : 'text-slate-400'}`}>{step.stage}</p>
                          <p className={`text-[10px] ${step.completed ? 'text-slate-500' : 'text-slate-300'}`}>{step.date || 'Pending'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Alert */}
              {selectedOrder.risk === 'high' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider">{t('riskAlert')}</h4>
                  </div>
                  <p className="text-sm text-red-700">
                    {selectedOrder.status === 'cancelled' ? 'This order was cancelled by the buyer.' : 'This order requires attention — low participation or supplier delay detected.'}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('actions')}</h3>
                <div className="flex flex-wrap gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors">
                    <Activity className="w-3.5 h-3.5" /> {t('monitor')}
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">
                    <XCircle className="w-3.5 h-3.5" /> {t('forceClose')}
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">
                    <Store className="w-3.5 h-3.5" /> {t('contactSupplier')}
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">
                    <Eye className="w-3.5 h-3.5" /> {t('viewActivityLog')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
