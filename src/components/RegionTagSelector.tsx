import { useState, useEffect, useMemo } from 'react';
import { publicService, type PublicRegion } from '../services/public.service';
import { useLanguage } from '../i18n';
import { Search, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface RegionTagSelectorProps {
  value: string;
  onChange: (regionId: string) => void;
}

export function RegionTagSelector({ value, onChange }: RegionTagSelectorProps) {
  const { language } = useLanguage();
  const [regions, setRegions] = useState<PublicRegion[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicService.getDeliveryCoverageRegions()
      .then((res) => setRegions(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return regions;
    const q = search.toLowerCase();
    return regions.filter((r) =>
      r.nameEn.toLowerCase().includes(q) || r.nameAr.includes(q)
    );
  }, [regions, search]);

  const selected = regions.find((r) => r.id === value);

  const t = (ar: string, en: string) => language === 'ar' ? ar : en;

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('ابحث عن منطقة...', 'Search for a region...')}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Selected tag */}
      {selected && !search && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onChange('')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 border border-indigo-300 hover:bg-indigo-200 transition-colors"
          >
            {t(selected.nameAr, selected.nameEn)}
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tag list */}
      {loading ? (
        <div className="text-sm text-slate-400 py-2">{t('جاري التحميل...', 'Loading...')}</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-slate-400 py-2">{t('لا توجد نتائج', 'No results found')}</div>
      ) : (
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
          {filtered.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                onChange(r.id);
                setSearch('');
              }}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
                r.id === value
                  ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              )}
            >
              {t(r.nameAr, r.nameEn)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}