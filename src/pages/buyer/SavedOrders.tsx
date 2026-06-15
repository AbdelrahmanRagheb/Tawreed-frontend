import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Clock, CheckCircle, Trash2, Play, Copy,
  MapPin, Package, Calendar, DollarSign, Bookmark,
} from 'lucide-react';
import { useLanguage } from '../../i18n';
import { mockDrafts, mockSavedTemplates } from '../../data';
import type { SavedOrderDraft } from '../../types';

const STORAGE_KEY = 'tawreed_drafts';

function loadDrafts(): SavedOrderDraft[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveDrafts(drafts: SavedOrderDraft[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export function SavedOrders() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'drafts' | 'templates'>('drafts');
  const [userDrafts, setUserDrafts] = useState<SavedOrderDraft[]>([]);

  useEffect(() => {
    setUserDrafts(loadDrafts());
  }, []);

  const allDrafts = [...mockDrafts, ...userDrafts];
  const allTemplates = mockSavedTemplates;

  const deleteDraft = (id: string) => {
    const updated = userDrafts.filter((d) => d.id !== id);
    setUserDrafts(updated);
    saveDrafts(updated);
  };

  const resumeDraft = (draft: SavedOrderDraft) => {
    navigate('/buyer/create', { state: { resumeDraft: draft } });
  };

  const useTemplate = (tmpl: SavedOrderDraft) => {
    navigate('/buyer/create', { state: { resumeDraft: tmpl } });
  };

  const TabButton = ({ value, label, count }: { value: 'drafts' | 'templates'; label: string; count: number }) => (
    <button
      onClick={() => setTab(value)}
      className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
        tab === value
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {label} ({count})
    </button>
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('savedOrders')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('savedOrdersDesc')}</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <TabButton value="drafts" label={t('drafts')} count={allDrafts.length} />
        <TabButton value="templates" label={t('savedTemplates')} count={allTemplates.length} />
        <button
          onClick={() => navigate('/buyer/create')}
          className="ml-auto px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          + {t('createGroupOrder')}
        </button>
      </div>

      {tab === 'drafts' && (
        allDrafts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500">{t('noDrafts')}</p>
            <p className="text-xs text-slate-400 mt-1">{t('noDraftsDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {allDrafts.map((draft) => {
              const daysLeft = draft.deadlineDate
                ? Math.ceil((new Date(draft.deadlineDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                : null;
              return (
                <div key={draft.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col">
                  <div className="p-4 flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                          <Clock className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{draft.name}</p>
                          <p className="text-[11px] text-slate-500">{t('savedOn')} {new Date(draft.savedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteDraft(draft.id)}
                        className="p-1 hover:bg-red-50 rounded text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {draft.description && (
                      <p className="text-xs text-slate-500 mb-3 line-clamp-1">{draft.description}</p>
                    )}

                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {draft.items.length} {t('items')}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {draft.totalCost.toLocaleString()} EGP
                      </span>
                      {draft.region && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {draft.region}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {draft.items.slice(0, 3).map((item) => (
                        <span key={item.productId} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full truncate max-w-[140px]">
                          {item.name}
                        </span>
                      ))}
                      {draft.items.length > 3 && (
                        <span className="text-[10px] text-slate-400">+{draft.items.length - 3}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex border-t border-slate-100">
                    <button
                      onClick={() => resumeDraft(draft)}
                      className="flex items-center justify-center gap-1.5 flex-1 py-2.5 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors rounded-bl-xl"
                    >
                      <Play className="w-3.5 h-3.5" />
                      {t('continue')}
                    </button>
                    <div className="w-px bg-slate-100" />
                    <button
                      onClick={() => { const c = { ...draft, id: crypto.randomUUID(), savedAt: new Date().toISOString(), type: 'template' as const }; saveDrafts([...userDrafts, c]); }}
                      className="flex items-center justify-center gap-1.5 flex-1 py-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors rounded-br-xl"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      {t('saveAsTemplate')}
                    </button>
                  </div>

                  {daysLeft !== null && (
                    <div className={`px-4 py-1.5 text-[10px] font-semibold flex items-center gap-1 ${
                      daysLeft <= 2 ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      <Calendar className="w-3 h-3" />
                      {daysLeft > 0
                        ? `${daysLeft} ${t('daysLeft')}`
                        : t('deadlinePassed')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}

      {tab === 'templates' && (
        allTemplates.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500">{t('noTemplates')}</p>
            <p className="text-xs text-slate-400 mt-1">{t('noTemplatesDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {allTemplates.map((tmpl) => (
              <div key={tmpl.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col">
                <div className="p-4 flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                      <Bookmark className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{tmpl.name}</p>
                      <p className="text-[11px] text-slate-500">{t('savedOn')} {new Date(tmpl.savedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {tmpl.description && (
                    <p className="text-xs text-slate-500 mb-3 line-clamp-1">{tmpl.description}</p>
                  )}

                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {tmpl.items.length} {t('items')}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {tmpl.totalCost.toLocaleString()} EGP
                    </span>
                    {tmpl.region && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {tmpl.region}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {tmpl.items.map((item) => (
                      <span key={item.productId} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full truncate max-w-[140px]">
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => useTemplate(tmpl)}
                  className="flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors border-t border-slate-100"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {t('useTemplate')}
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
