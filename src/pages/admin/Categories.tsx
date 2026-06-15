import { useState } from 'react';
import { Tags, Plus, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { mockCategoryEntries } from '../../data';

export function AdminCategories() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState(mockCategoryEntries);

  const filtered = categories.filter((c) =>
    c.name[language].toLowerCase().includes(search.toLowerCase())
  );

  const toggleActive = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('categories')}</h1>
          <p className="text-sm text-slate-500 mt-1">{categories.length} {t('categoriesConfigured')}</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
          <Plus className="w-4 h-4" />
          {t('addCategory')}
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchCategories')}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="space-y-2">
        {filtered.map((category) => (
          <div key={category.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <Tags className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">{category.name[language]}</h3>
                  <span className="text-xs text-slate-400">({category.name[language === 'en' ? 'ar' : 'en']})</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {category.productCount} {t('products')} • {category.supplierCount} {t('suppliers')}
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleActive(category.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                category.active
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {category.active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
              {category.active ? t('active') : t('inactive')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
