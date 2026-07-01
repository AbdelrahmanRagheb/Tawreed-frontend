import { useState, useEffect } from 'react';
import {
  Search, Users, Eye, Ban, CheckCircle, X, TrendingUp, Clock, Activity,
  MapPin, Calendar, AlertTriangle, Phone, Mail, Briefcase, Star, Shield,
  ShoppingCart, CheckSquare, FileText, Loader2
} from 'lucide-react';
import { useLanguage, toArabicNumeral } from '../../i18n';
import { adminService, type AdminUser, type AdminUserDetail } from '../../services/admin.service';

type StatusFilter = 'all' | 'Active' | 'Suspended';

export function AdminUsers() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBuyer, setSelectedBuyer] = useState<AdminUserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; name: string; action: 'suspend' | 'reactivate' } | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    adminService.listUsers({ page: 1, limit: 100 })
      .then((res) => setUsers(res.data.items))
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const term = search.toLowerCase();
    const matchesSearch = !search ||
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.phone || '').includes(term) ||
      (u.businessName || '').toLowerCase().includes(term);
    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    return true;
  });

  const openDetail = async (userId: string) => {
    setDetailLoading(true);
    try {
      const res = await adminService.getUserDetail(userId);
      setSelectedBuyer(res.data);
    } catch {
      setSelectedBuyer(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const toggleStatus = async (userId: string, action: 'suspend' | 'reactivate') => {
    setConfirmLoading(true);
    try {
      if (action === 'suspend') {
        await adminService.suspendUser(userId, suspendReason || 'Suspended by admin');
      } else {
        await adminService.reactivateUser(userId);
      }
      setUsers((prev) => prev.map((u) =>
        u.id === userId ? { ...u, status: action === 'suspend' ? 'Suspended' : 'Active' } : u
      ));
      setConfirmTarget(null);
      setSuspendReason('');
      setSelectedBuyer((prev) => prev && prev.id === userId
        ? { ...prev, status: action === 'suspend' ? 'Suspended' : 'Active' }
        : prev
      );
    } catch (err: any) {
      console.error('Failed to toggle user status', err);
    } finally {
      setConfirmLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const formatCurrency = (val: number) => {
    return toArabicNumeral(val.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US', {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    }), language);
  };

  const statusBadge = (status: string) => {
    const isActive = status === 'Active';
    return (
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
        <span className={`text-xs font-medium ${isActive ? 'text-emerald-700' : 'text-red-700'}`}>{status}</span>
      </div>
    );
  };

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

  const buyers = users.filter((u) => u.role === 'Buyer');
  const activeCount = buyers.filter((b) => b.status === 'Active').length;
  const suspendedCount = buyers.filter((b) => b.status === 'Suspended').length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('buyersManagement')}</h1>
          <p className="text-sm text-slate-500 mt-1">{toArabicNumeral(String(buyers.length), language)} {t('buyers')}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center mb-2">
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{toArabicNumeral(buyers.length.toLocaleString(), language)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('totalBuyers')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center mb-2">
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{toArabicNumeral(activeCount.toLocaleString(), language)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('activeBuyers')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center mb-2">
            <Users className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{toArabicNumeral(suspendedCount.toLocaleString(), language)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('suspendedBuyers')}</p>
        </div>
      </div>

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
          <option value="Active">{t('active')}</option>
          <option value="Suspended">{t('suspended')}</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('buyer')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('businessName')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('region')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('status')}</th>
                <th className="text-end px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => openDetail(user.id)}>
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
                  <td className="px-5 py-3.5 text-sm text-slate-700">{user.businessName || '-'}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{user.region || '-'}</td>
                  <td className="px-5 py-3.5">{statusBadge(user.status)}</td>
                  <td className="px-5 py-3.5 text-end">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); openDetail(user.id); }}
                        className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmTarget({ id: user.id, name: user.name, action: user.status === 'Active' ? 'suspend' : 'reactivate' });
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          user.status === 'Active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {user.status === 'Active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
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

      {(selectedBuyer || detailLoading) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => { setSelectedBuyer(null); setDetailLoading(false); }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {detailLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : selectedBuyer && (
              <>
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      selectedBuyer.status === 'Active' ? 'bg-emerald-100' : 'bg-red-100'
                    }`}>
                      <Users className={`w-5 h-5 ${
                        selectedBuyer.status === 'Active' ? 'text-emerald-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{selectedBuyer.name}</h2>
                      <p className="text-xs text-slate-500">{selectedBuyer.email}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedBuyer(null)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div className="bg-slate-50 rounded-xl p-5">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('personalInfo')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{toArabicNumeral(selectedBuyer.phone || '-', language)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{t('joined')} {formatDate(selectedBuyer.joinedDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{t('lastLogin')} {formatDate(selectedBuyer.lastLoginAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        {selectedBuyer.emailVerified ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <span>{t('emailVerified')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        {selectedBuyer.phoneVerified ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <span>{t('phoneVerified')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-5">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('businessInfo')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{selectedBuyer.businessName || '-'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{selectedBuyer.businessType || '-'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{t('taxId')}: {selectedBuyer.taxId || '-'}</span>
                      </div>

                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-5">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('accountStatus')}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      {statusBadge(selectedBuyer.status)}
                    </div>
                    {selectedBuyer.status === 'Suspended' && selectedBuyer.suspensionReason && (
                      <div className="flex items-start gap-2 text-sm text-slate-600 bg-red-50 rounded-lg p-3">
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{t('suspensionReason')}: {selectedBuyer.suspensionReason}</span>
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      {selectedBuyer.status === 'Active' && (
                        <button onClick={() => setConfirmTarget({ id: selectedBuyer.id, name: selectedBuyer.name, action: 'suspend' })}
                          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors"
                        >
                          <Ban className="w-3.5 h-3.5" /> {t('suspendAction')}
                        </button>
                      )}
                      {selectedBuyer.status === 'Suspended' && (
                        <button onClick={() => setConfirmTarget({ id: selectedBuyer.id, name: selectedBuyer.name, action: 'reactivate' })}
                          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> {t('reactivateAction')}
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('statistics')}</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { icon: ShoppingCart, label: t('ordersCreated'), value: selectedBuyer.ordersCreated, color: 'text-indigo-600', bg: 'bg-indigo-100' },
                        { icon: Users, label: t('ordersJoined'), value: selectedBuyer.ordersJoined, color: 'text-blue-600', bg: 'bg-blue-100' },
                        { icon: CheckSquare, label: t('completedOrders'), value: selectedBuyer.completedOrders, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                        { icon: X, label: t('cancelledOrders'), value: selectedBuyer.cancelledOrders, color: 'text-red-600', bg: 'bg-red-100' },
                      ].map((stat) => (
                        <div key={stat.label} className="bg-white border border-slate-200 rounded-lg p-3">
                          <div className={`w-6 h-6 rounded ${stat.bg} flex items-center justify-center mb-1`}>
                            <stat.icon className={`w-3 h-3 ${stat.color}`} />
                          </div>
                          <p className="text-lg font-bold text-slate-900">{toArabicNumeral(String(stat.value), language)}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedBuyer.recentOrders.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('recentOrders')}</h3>
                      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="text-start px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase">{t('orderName')}</th>
                              <th className="text-start px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase">{t('status')}</th>
                              <th className="text-end px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase">{t('value')}</th>
                              <th className="text-end px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase">{t('participants')}</th>
                              <th className="text-end px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase">{t('createdOn')}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {selectedBuyer.recentOrders.map((order) => (
                              <tr key={order.id}>
                                <td className="px-4 py-2.5 text-xs font-medium text-slate-700">{order.title}</td>
                                <td className="px-4 py-2.5">{statusBadge(order.status)}</td>
                                <td className="px-4 py-2.5 text-xs text-slate-700 text-end font-medium">{formatCurrency(order.estimatedTotal)}</td>
                                <td className="px-4 py-2.5 text-xs text-slate-700 text-end">{toArabicNumeral(String(order.participantsCount), language)}</td>
                                <td className="px-4 py-2.5 text-xs text-slate-500 text-end">{formatDate(order.createdAt)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {confirmTarget && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={() => { setConfirmTarget(null); setSuspendReason(''); }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                confirmTarget.action === 'suspend' ? 'bg-amber-100' : 'bg-emerald-100'
              }`}>
                {confirmTarget.action === 'suspend'
                  ? <Ban className="w-5 h-5 text-amber-600" />
                  : <CheckCircle className="w-5 h-5 text-emerald-600" />
                }
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {confirmTarget.action === 'suspend' ? t('suspendBuyerConfirm') : t('reactivateBuyerConfirm')}
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">{confirmTarget.name}</p>
              </div>
            </div>

            {confirmTarget.action === 'suspend' && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-600 mb-1.5">{t('reasonOptional')}</label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder={t('reasonPlaceholder')}
                />
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setConfirmTarget(null); setSuspendReason(''); }}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => toggleStatus(confirmTarget.id, confirmTarget.action)}
                disabled={confirmLoading}
                className={`flex items-center gap-1.5 px-4 py-2 text-white rounded-lg text-sm font-semibold transition-colors ${
                  confirmTarget.action === 'suspend'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                } disabled:opacity-50`}
              >
                {confirmLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {confirmTarget.action === 'suspend' ? t('confirmSuspend') : t('confirmReactivate')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
