import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Clock, CheckCircle, Trash2, Play, Copy,
  MapPin, Package, Calendar, DollarSign, Bookmark, AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '../../i18n';
import { buyerService, type BuyerOrderListItem } from '../../services/buyer.service';

export function SavedOrders() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'drafts' | 'templates'>('drafts');
  const [drafts, setDrafts] = useState<BuyerOrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDrafts = async () => {
    setLoading(true);
    try {
      const res = await buyerService.getDrafts({ page: 1, limit: 100 });
      setDrafts(res.data.items);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load drafts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  const deleteDraft = async (id: string) => {
    try {
      await buyerService.deleteDraft(id);
      setDrafts((prev) => prev.filter((d) => d.id !== id));
    } catch (err: any) {
      console.error('Failed to delete draft', err);
    }
  };

  const resumeDraft = (draft: BuyerOrderListItem) => {
    navigate('/buyer/create', { state: { resumeDraft: draft } });
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('savedOrders')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('savedOrdersDesc')}</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <TabButton value="drafts" label={t('drafts')} count={drafts.length} />
        <TabButton value="templates" label={t('savedTemplates')} count={0} />
        <button
          onClick={() => navigate('/buyer/create')}
          className="ml-auto px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          + {t('createGroupOrder')}
        </button>
      </div>

      {tab === 'drafts' && (
        drafts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500">{t('noDrafts')}</p>
            <p className="text-xs text-slate-400 mt-1">{t('noDraftsDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {drafts.map((draft) => (
              <div key={draft.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col">
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{draft.title}</p>
                        <p className="text-[11px] text-slate-500">{t('savedOn')} {new Date(draft.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteDraft(draft.id)}
                      className="p-1 hover:bg-red-50 rounded text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {draft.productCount} {t('items')}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {draft.totalOrderValue.toLocaleString()} EGP
                    </span>
                    {draft.region && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {draft.region}
                      </span>
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
                    onClick={() => navigate('/buyer/create', { state: { resumeDraft: draft } })}
                    className="flex items-center justify-center gap-1.5 flex-1 py-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors rounded-br-xl"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {t('useTemplate')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'templates' && (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500">{t('noTemplates')}</p>
          <p className="text-xs text-slate-400 mt-1">{t('noTemplatesDesc')}</p>
        </div>
      )}
    </div>
  );
}
