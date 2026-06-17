import { useState, useEffect, useMemo } from 'react';
import { Search, Users, Eye, Ban, CheckCircle, X, TrendingUp, Clock, Activity, MapPin, Calendar, AlertTriangle, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { adminService, type AdminUser } from '../../services/admin.service';

type StatusFilter = 'all' | 'Active' | 'Suspended';

export function AdminUsers() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

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

  const toggleStatus = async (userId: string, currentStatus: string) => {
    try {
      if (currentStatus === 'Active') {
        await adminService.suspendUser(userId, 'Suspended by admin');
      } else {
        await adminService.reactivateUser(userId);
      }
      setUsers((prev) => prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
      ));
    } catch (err: any) {
      console.error('Failed to toggle user status', err);
    }
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
          <p className="text-sm text-slate-500 mt-1">{buyers.length} {t('buyers')}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
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
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('role')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('status')}</th>
                <th className="text-end px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedUserId(user.id)}>
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
                  <td className="px-5 py-3.5 text-sm text-slate-600">{user.role}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className={`text-xs font-medium ${user.status === 'Active' ? 'text-emerald-700' : 'text-red-700'}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-end">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedUserId(user.id); }}
                        className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleStatus(user.id, user.status); }}
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
    </div>
  );
}
