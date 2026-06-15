import { useState } from 'react';
import { Search, Users as UsersIcon, MoreHorizontal } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { mockUserEntries } from '../../data';

export function AdminUsers() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');

  const filtered = mockUserEntries.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('usersManagement')}</h1>
          <p className="text-sm text-slate-500 mt-1">{mockUserEntries.length} {t('registeredUsers')}</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchUsers')}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">{t('user')}</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">{t('role')}</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">{t('status')}</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">{t('joined')}</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">{t('lastActive')}</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <UsersIcon className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.role[language] === 'Admin' || user.role[language] === 'مشرف' ? 'bg-red-100 text-red-700' :
                      user.role[language] === 'Supplier' || user.role[language] === 'مورد' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {user.role[language]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status === 'active' ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'موقوف' : 'Suspended')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{user.joinedDate}</td>
                  <td className="px-4 py-3 text-slate-600">{user.lastActive}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
