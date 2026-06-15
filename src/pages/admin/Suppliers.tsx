import { useState } from 'react';
import { Search, Store, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { mockSupplierEntries } from '../../data';

export function AdminSuppliers() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');

  const filtered = mockSupplierEntries.filter((s) =>
    s.companyName[language].toLowerCase().includes(search.toLowerCase()) ||
    s.contactName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('suppliersApproval')}</h1>
          <p className="text-sm text-slate-500 mt-1">{mockSupplierEntries.length} {t('suppliersRegistered')}</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchSuppliers')}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Store className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{supplier.companyName[language]}</h3>
                  <p className="text-xs text-slate-500">{supplier.contactName} • {supplier.email}</p>
                </div>
              </div>
              <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                supplier.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                supplier.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {supplier.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                {supplier.status === 'pending' && <Clock className="w-3 h-3" />}
                {supplier.status === 'rejected' && <XCircle className="w-3 h-3" />}
                {supplier.status === 'approved' ? (language === 'ar' ? 'معتمد' : 'Approved') :
                 supplier.status === 'pending' ? (language === 'ar' ? 'قيد الانتظار' : 'Pending') :
                 (language === 'ar' ? 'مرفوض' : 'Rejected')}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500">{t('phone')}</p>
                <p className="font-medium text-slate-900">{supplier.phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">{t('category')}</p>
                <p className="font-medium text-slate-900">{supplier.category}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">{t('products')}</p>
                <p className="font-medium text-slate-900">{supplier.totalProducts}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">{t('joined')}</p>
                <p className="font-medium text-slate-900">{supplier.joinedDate}</p>
              </div>
            </div>

            {supplier.status === 'pending' && (
              <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                <button className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {t('approve')}
                </button>
                <button className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">
                  <XCircle className="w-3.5 h-3.5" />
                  {t('reject')}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
