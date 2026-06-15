import { useState, useMemo } from 'react';
import { Search, Users, Eye, Ban, CheckCircle, X, ShoppingCart, TrendingUp, Clock, Activity, MapPin, Briefcase, Calendar, AlertTriangle, Phone, Mail, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { mockUserEntries, mockOrders } from '../../data';
import type { UserEntry } from '../../types';

type StatusFilter = 'all' | 'active' | 'suspended';

export function AdminUsers() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [users, setUsers] = useState<UserEntry[]>(mockUserEntries);
  const [selectedUser, setSelectedUser] = useState<UserEntry | null>(null);

  const buyers = useMemo(() => users.filter((u) => u.role.en === 'Buyer'), [users]);

  const regions = useMemo(() => {
    const r = new Set(buyers.filter((b) => b.region).map((b) => b.region!));
    return ['all', ...Array.from(r)];
  }, [buyers]);

  const filtered = buyers.filter((u) => {
    const term = search.toLowerCase();
    const matchesSearch = !search ||
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.phone || '').includes(term) ||
      (u.businessName?.[language] || '').toLowerCase().includes(term);
    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (regionFilter !== 'all' && u.region !== regionFilter) return false;
    return true;
  });

  const toggleStatus = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
    if (selectedUser?.id === id) {
      setSelectedUser((prev) => prev ? { ...prev, status: prev.status === 'active' ? 'suspended' : 'active' } : null);
    }
  };

  const activeCount = buyers.filter((b) => b.status === 'active').length;
  const suspendedCount = buyers.filter((b) => b.status === 'suspended').length;
  const newThisMonth = buyers.filter((b) => {
    const d = new Date(b.joinedDate);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length || 3;

  const userOrders = useMemo(() => {
    if (!selectedUser) return [];
    return mockOrders.slice(0, Math.min(3, mockOrders.length));
  }, [selectedUser]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('buyersManagement')}</h1>
          <p className="text-sm text-slate-500 mt-1">{buyers.length} {t('buyers')}</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            Export CSV
          </button>
          <button className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
            + {t('addUser')}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center mb-2">
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{buyers.length.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('totalBuyers')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center mb-2">
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{activeCount.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('activeBuyers')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center mb-2">
            <Users className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{suspendedCount.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('suspendedBuyers')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center mb-2">
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{newThisMonth}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('newThisMonth')}</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchBuyer')}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">{t('allStatus')}</option>
          <option value="active">{t('active')}</option>
          <option value="suspended">{t('suspended')}</option>
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
      </div>

      {/* Buyers Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('buyer')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('businessName')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('region')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('ordersJoined')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('status')}</th>
                <th className="text-end px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedUser(user)}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-indigo-600">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{user.name}</p>
                        <p className="text-[11px] text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">{user.businessName?.[language] || '-'}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{user.region || '-'}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-slate-900">{(user.ordersJoined || 0) + (user.ordersCreated || 0)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className={`text-xs font-medium ${user.status === 'active' ? 'text-emerald-700' : 'text-red-700'}`}>
                        {user.status === 'active' ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'موقوف' : 'Suspended')}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-end">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title={t('viewDetails')}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          user.status === 'active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {user.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-slate-500">{t('noBuyersFound')}</div>
        )}
      </div>

      {/* Buyer Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-lg font-bold text-slate-900">{t('buyerDetails')}</h2>
              <button onClick={() => setSelectedUser(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="bg-slate-50 rounded-xl p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <span className="text-lg font-bold text-indigo-600">{selectedUser.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedUser.name}</h3>
                    <p className="text-sm text-slate-500">{selectedUser.businessName?.[language]}</p>
                  </div>
                  <div className="ml-auto">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      selectedUser.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${selectedUser.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {selectedUser.status === 'active' ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'موقوف' : 'Suspended')}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{selectedUser.email}</span>
                  </div>
                  {selectedUser.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{selectedUser.phone}</span>
                    </div>
                  )}
                  {selectedUser.region && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{selectedUser.region}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{t('joined')} {selectedUser.joinedDate}</span>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('statistics')}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: t('ordersCreated'), value: selectedUser.ordersCreated || 0, color: 'text-indigo-600', bg: 'bg-indigo-100' },
                    { label: t('ordersJoined'), value: selectedUser.ordersJoined || 0, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                    { label: t('completedOrders'), value: selectedUser.completedOrders || 0, color: 'text-blue-600', bg: 'bg-blue-100' },
                    { label: t('cancelledOrders'), value: selectedUser.cancelledOrders || 0, color: 'text-red-600', bg: 'bg-red-100' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white border border-slate-200 rounded-lg p-3">
                      <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Participation Analytics */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">{t('participationAnalytics')}</h4>
                </div>
                <p className="text-2xl font-black text-amber-700">{selectedUser.totalSavings?.toLocaleString()} EGP</p>
                <p className="text-[11px] text-amber-600 mt-0.5">{t('totalSavingsAchieved')}</p>
              </div>

              {/* Activity History */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('activityHistory')}</h4>
                <div className="space-y-2">
                  {(selectedUser.activityHistory || []).map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white border border-slate-200 rounded-lg p-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Activity className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700">{activity.action[language]}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suspension Reason */}
              {selectedUser.status === 'suspended' && selectedUser.suspensionReason && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider">{t('suspensionReason')}</h4>
                  </div>
                  <p className="text-sm text-red-700">{selectedUser.suspensionReason}</p>
                </div>
              )}

              {/* Quick Actions */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('quickActions')}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => toggleStatus(selectedUser.id)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                      selectedUser.status === 'active'
                        ? 'text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100'
                        : 'text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
                    }`}
                  >
                    {selectedUser.status === 'active' ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    {selectedUser.status === 'active' ? (language === 'ar' ? 'إيقاف' : 'Suspend') : (language === 'ar' ? 'تفعيل' : 'Activate')}
                  </button>
                  <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                    <Clock className="w-3.5 h-3.5" />
                    {t('resetPassword')}
                  </button>
                </div>
              </div>

              {/* Buyer Orders */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('buyerOrders')}</h4>
                <div className="space-y-2">
                  {userOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-medium text-slate-700">{order.orderNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold capitalize ${
                          order.status === 'delivered' ? 'text-emerald-600' : order.status === 'cancelled' ? 'text-red-600' : 'text-indigo-600'
                        }`}>{order.status}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-2 py-2 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  {t('viewAllOrders')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
