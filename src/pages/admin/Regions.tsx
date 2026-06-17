import { useState, useEffect } from 'react';
import { MapPin, Search, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { adminService, type AdminRegion } from '../../services/admin.service';

export function AdminRegions() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [regions, setRegions] = useState<AdminRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService.listRegions()
      .then((res) => setRegions(res.data))
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load regions'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = regions.filter((r) =>
    (language === 'ar' ? r.nameAr : r.nameEn).toLowerCase().includes(search.toLowerCase())
  );

  const toggleActive = async (id: string) => {
    try {
      await adminService.toggleRegion(id);
      setRegions((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
      );
    } catch (err: any) {
      console.error('Failed to toggle region', err);
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('regions')}</h1>
          <p className="text-sm text-slate-500 mt-1">{regions.length} {t('regionsConfigured')}</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchRegions')}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-2">
        {filtered.map((region) => (
          <div key={region.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">{language === 'ar' ? region.nameAr : region.nameEn}</h3>
                  <span className="text-xs text-slate-400">({language === 'en' ? region.nameAr : region.nameEn})</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => toggleActive(region.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                region.isActive
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {region.isActive ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
              {region.isActive ? t('active') : t('inactive')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
