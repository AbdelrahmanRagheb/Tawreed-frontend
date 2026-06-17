import { useState, useEffect, useMemo } from 'react';
import { Search, Store, CheckCircle, XCircle, Clock, Eye, Ban, X, Briefcase, MapPin, Package, ShoppingCart, TrendingUp, Activity, FileText } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { adminService, type AdminSupplier, type AdminSupplierDetail } from '../../services/admin.service';

export function AdminSuppliers() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [suppliers, setSuppliers] = useState<AdminSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<AdminSupplierDetail | null>(null);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const params: any = { page: 1, limit: 100 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await adminService.listSuppliers(params);
      setSuppliers(res.data.items);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, [statusFilter]);

  const filtered = suppliers.filter((s) => {
    const q = search.toLowerCase();
    return !search ||
      s.companyName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.contactName.toLowerCase().includes(q);
  });

  const regions = useMemo(() => {
    const r = new Set(suppliers.filter((s) => s.region).map((s) => s.region));
    return ['all', ...Array.from(r)];
  }, [suppliers]);

  const updateStatus = async (id: string, action: 'approve' | 'reject' | 'suspend' | 'reactivate') => {
    try {
      if (action === 'approve') await adminService.approveSupplier(id);
      else if (action === 'reject') await adminService.rejectSupplier(id, 'Rejected by admin');
      else if (action === 'suspend') await adminService.suspendSupplier(id, 'Suspended by admin');
      else await adminService.reactivateSupplier(id);
      await loadSuppliers();
      if (selectedSupplier?.id === id) {
        const detail = await adminService.getSupplierDetail(id);
        setSelectedSupplier(detail.data);
      }
    } catch (err: any) {
      console.error('Failed to update supplier', err);
    }
  };

  const openDetail = async (supplier: AdminSupplier) => {
    try {
      const res = await adminService.getSupplierDetail(supplier.id);
      setSelectedSupplier(res.data);
    } catch {
      setSelectedSupplier(null);
    }
  };

  const totalCount = suppliers.length;
  const pendingCount = suppliers.filter((s) => s.status === 'Pending').length;
  const approvedCount = suppliers.filter((s) => s.status === 'Approved').length;
  const suspendedCount = suppliers.filter((s) => s.status === 'Suspended').length;

  if (loading && suppliers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('suppliers')}</h1>
          <p className="text-sm text-slate-500 mt-1">{totalCount} {t('suppliersRegistered')}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center mb-2">
            <Store className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{totalCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('totalSuppliers')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center mb-2">
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{pendingCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('pendingApproval')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{approvedCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('active')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center mb-2">
            <Ban className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">{suspendedCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('suspended')}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchSupplier')}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">{t('allStatus')}</option>
          <option value="Pending">{t('pending')}</option>
          <option value="Approved">{t('approved')}</option>
          <option value="Suspended">{t('suspended')}</option>
          <option value="Rejected">{t('rejected')}</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('supplier')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('region')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('products')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('rating')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('status')}</th>
                <th className="text-end px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => openDetail(supplier)}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        supplier.status === 'Approved' ? 'bg-emerald-100' : supplier.status === 'Pending' ? 'bg-amber-100' : 'bg-red-100'
                      }`}>
                        <Store className={`w-4 h-4 ${
                          supplier.status === 'Approved' ? 'text-emerald-600' : supplier.status === 'Pending' ? 'text-amber-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{supplier.companyName}</p>
                        <p className="text-[11px] text-slate-500">{supplier.contactName} • {supplier.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{supplier.region || '-'}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{supplier.totalProducts}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{supplier.ratingAvg ? `${supplier.ratingAvg.toFixed(1)} ★` : 'N/A'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      supplier.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                      supplier.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      supplier.status === 'Suspended' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {supplier.status === 'Approved' && <CheckCircle className="w-3 h-3" />}
                      {supplier.status === 'Pending' && <Clock className="w-3 h-3" />}
                      {supplier.status === 'Suspended' && <Ban className="w-3 h-3" />}
                      {supplier.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-end">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={(e) => { e.stopPropagation(); openDetail(supplier); }} className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      {supplier.status === 'Pending' && (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); updateStatus(supplier.id, 'approve'); }} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); updateStatus(supplier.id, 'reject'); }} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {(supplier.status === 'Approved' || supplier.status === 'Suspended') && (
                        <button
                          onClick={(e) => { e.stopPropagation(); updateStatus(supplier.id, supplier.status === 'Approved' ? 'suspend' : 'reactivate'); }}
                          className={`p-1.5 rounded-lg transition-colors ${supplier.status === 'Approved' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                        >
                          {supplier.status === 'Approved' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-slate-500">{t('noSuppliersFound')}</div>
        )}
      </div>

      {selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedSupplier(null)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedSupplier.status === 'Approved' ? 'bg-emerald-100' : selectedSupplier.status === 'Pending' ? 'bg-amber-100' : 'bg-red-100'
                }`}>
                  <Store className={`w-5 h-5 ${
                    selectedSupplier.status === 'Approved' ? 'text-emerald-600' : selectedSupplier.status === 'Pending' ? 'text-amber-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedSupplier.companyName}</h2>
                  <p className="text-xs text-slate-500">{selectedSupplier.contactName} • {selectedSupplier.category}</p>
                </div>
              </div>
              <button onClick={() => setSelectedSupplier(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-slate-50 rounded-xl p-5">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('companyInformation')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{selectedSupplier.companyName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{selectedSupplier.region || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{selectedSupplier.contactName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{t('joined')} {new Date(selectedSupplier.joinedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-slate-600">{selectedSupplier.email} • {selectedSupplier.phone}</div>
                {selectedSupplier.address && (
                  <div className="mt-2 text-sm text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{selectedSupplier.address}</span>
                  </div>
                )}
              </div>

              {selectedSupplier.status === 'Pending' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                  <h3 className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-3">{t('approvalInfo')}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-800">{t('pendingApproval')}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(selectedSupplier.id, 'approve')} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors">
                      <CheckCircle className="w-3.5 h-3.5" /> {t('approve')}
                    </button>
                    <button onClick={() => updateStatus(selectedSupplier.id, 'reject')} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">
                      <XCircle className="w-3.5 h-3.5" /> {t('reject')}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('supplierStatistics')}</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: Package, label: t('products'), value: selectedSupplier.totalProducts, color: 'text-indigo-600', bg: 'bg-indigo-100' },
                    { icon: ShoppingCart, label: t('ordersFulfilled'), value: '-', color: 'text-emerald-600', bg: 'bg-emerald-100' },
                    { icon: TrendingUp, label: t('activeOrders'), value: '-', color: 'text-blue-600', bg: 'bg-blue-100' },
                    { icon: CheckCircle, label: t('rating'), value: selectedSupplier.ratingAvg ? `${selectedSupplier.ratingAvg.toFixed(1)}` : '-', color: 'text-amber-600', bg: 'bg-amber-100' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className={`w-6 h-6 rounded ${stat.bg} flex items-center justify-center`}>
                          <stat.icon className={`w-3 h-3 ${stat.color}`} />
                        </div>
                      </div>
                      <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedSupplier.products && selectedSupplier.products.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('productOverview')}</h3>
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="text-start px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase">{t('product')}</th>
                          <th className="text-start px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase">{t('category')}</th>
                          <th className="text-end px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase">{t('stock')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedSupplier.products.map((p, i) => (
                          <tr key={i}>
                            <td className="px-4 py-2.5 text-xs text-slate-700">{p.name}</td>
                            <td className="px-4 py-2.5 text-xs text-slate-500">{p.categoryName}</td>
                            <td className="px-4 py-2.5 text-xs text-slate-700 text-end font-medium">{p.stock} {p.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="bg-slate-50 rounded-xl p-5">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('accountStatus')}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-2 h-2 rounded-full ${selectedSupplier.status === 'Approved' ? 'bg-emerald-500' : selectedSupplier.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'}`} />
                  <span className="text-sm font-semibold text-slate-900 capitalize">{selectedSupplier.status}</span>
                </div>
                <div className="flex gap-2">
                  {selectedSupplier.status === 'Pending' && (
                    <>
                      <button onClick={() => updateStatus(selectedSupplier.id, 'approve')} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors">
                        <CheckCircle className="w-3.5 h-3.5" /> {t('approve')}
                      </button>
                      <button onClick={() => updateStatus(selectedSupplier.id, 'reject')} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">
                        <XCircle className="w-3.5 h-3.5" /> {t('reject')}
                      </button>
                    </>
                  )}
                  {selectedSupplier.status === 'Approved' && (
                    <button onClick={() => updateStatus(selectedSupplier.id, 'suspend')} className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors">
                      <Ban className="w-3.5 h-3.5" /> {t('suspendSupplier')}
                    </button>
                  )}
                  {selectedSupplier.status === 'Suspended' && (
                    <button onClick={() => updateStatus(selectedSupplier.id, 'reactivate')} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors">
                      <CheckCircle className="w-3.5 h-3.5" /> {t('activateSupplier')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
