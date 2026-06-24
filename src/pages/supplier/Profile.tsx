import { useEffect, useState } from 'react';
import {
  User, Mail, Phone, Building2, MapPin, Calendar, Shield,
  AlertTriangle, Edit3, Save, X, Briefcase,
  BadgePercent, CheckCircle, ArrowLeft, Star,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../i18n';
import { supplierService, type SupplierProfile } from '../../services/supplier.service';
import { publicService, type PublicRegion } from '../../services/public.service';
import { RegionCascader } from '../../components/RegionCascader';
import { useNavigate } from 'react-router-dom';

export function SupplierProfile() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<SupplierProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [regions, setRegions] = useState<PublicRegion[]>([]);
  const [form, setForm] = useState({
    fullName: '', phone: '', companyName: '',
    address: '', regionId: '',
  });

  useEffect(() => {
    publicService.listRegions().then((r) => setRegions(r.data)).catch(() => {});
    supplierService.getProfile()
      .then((profileRes) => {
        const p = profileRes.data;
        setProfile(p);
        setForm({
          fullName: p.name,
          phone: p.phone,
          companyName: p.companyName,
          address: p.address || '',
          regionId: p.regionId,
        });
      })
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg('');
    try {
      await supplierService.updateProfile({
        fullName: form.fullName || undefined,
        phone: form.phone || undefined,
        businessName: form.companyName || undefined,
        address: form.address || undefined,
        regionId: form.regionId || undefined,
      });
      setSuccessMsg(t('profileUpdated'));
      setEditing(false);
      const refresh = await supplierService.getProfile();
      setProfile(refresh.data);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!profile) return;
    setForm({
      fullName: profile.name,
      phone: profile.phone,
      companyName: profile.companyName,
      address: profile.address || '',
      regionId: profile.regionId,
    });
    setEditing(false);
    setError('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-sm text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  const regionName = regions.find((r) => r.id === form.regionId)
    ?.[language === 'en' ? 'nameEn' : 'nameAr'] || profile?.regionName || '';

  const initials = (profile?.name || user?.name || '').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/supplier/products')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToProducts')}
          </button>

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all"
            >
              <Edit3 className="w-4 h-4" />
              {t('editProfile')}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
              >
                <X className="w-4 h-4" />
                {t('cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-50 shadow-sm shadow-emerald-200 transition-all"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : t('save')}
              </button>
            </div>
          )}
        </div>

        {successMsg && (
          <div className="mb-6 flex items-center gap-2.5 px-5 py-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-700">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            {successMsg}
          </div>
        )}

        {error && editing && (
          <div className="mb-6 flex items-center gap-2.5 px-5 py-3.5 bg-red-50 border border-red-200 rounded-xl text-sm font-medium text-red-600">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 pt-8 mb-8">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center shrink-0">
                <span className="text-2xl sm:text-3xl font-bold text-indigo-600">{initials}</span>
              </div>
              <div className="sm:pb-1.5">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{profile?.name || user?.name}</h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                  <span className="text-sm text-slate-500">{profile?.email || user?.email}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    <Shield className="w-3 h-3" />
                    {user?.role || '-'}
                  </span>
                  {profile?.ratingAvg ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                      <Star className="w-3 h-3 text-amber-500" />
                      {profile.ratingAvg.toFixed(1)}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            {editing ? (
              <div className="space-y-8">
                <Section title={t('personalInfo')} icon={User}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label={t('name')} value={form.fullName} onChange={(v) => setForm((f) => ({ ...f, fullName: v }))} />
                    <Field label={t('phone')} value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
                    <Field label="Email" value={profile?.email || ''} disabled />
                  </div>
                </Section>

                <Section title={t('businessInfo')} icon={Briefcase}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label={t('companyName')} value={form.companyName} onChange={(v) => setForm((f) => ({ ...f, companyName: v }))} />
                    <Field label={t('taxId')} value={profile?.taxId || ''} disabled />
                  </div>
                </Section>

                <Section title={t('location')} icon={MapPin}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('region')}</label>
                      <RegionCascader
                        value={form.regionId}
                        onChange={(id) => setForm((f) => ({ ...f, regionId: id }))}
                      />
                    </div>
                    <Field label={t('address')} value={form.address} onChange={(v) => setForm((f) => ({ ...f, address: v }))} />
                  </div>
                </Section>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InfoCard title={t('personalInfo')} icon={User}>
                  <InfoRow icon={Mail} label="Email" value={profile?.email} />
                  <InfoRow icon={Phone} label={t('phone')} value={profile?.phone} />
                  <InfoRow icon={Calendar} label={t('memberSince')} value={profile?.joinedDate ? new Date(profile.joinedDate).toLocaleDateString() : '-'} />
                </InfoCard>

                <InfoCard title={t('businessInfo')} icon={Briefcase}>
                  <InfoRow icon={Building2} label={t('companyName')} value={profile?.companyName} />
                  <InfoRow icon={BadgePercent} label={t('taxId')} value={profile?.taxId} />
                </InfoCard>

                <InfoCard title={t('location')} icon={MapPin}>
                  <InfoRow icon={MapPin} label={t('region')} value={regionName} />
                  <InfoRow icon={MapPin} label={t('address')} value={profile?.address} />
                </InfoCard>

                <InfoCard title={t('accountSettings')} icon={Shield}>
                  <InfoRow icon={Shield} label={t('role')} value={user?.role || '-'} />
                  <InfoRow icon={Calendar} label={t('memberSince')} value={profile?.joinedDate ? new Date(profile.joinedDate).toLocaleDateString() : '-'} />
                </InfoCard>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200/70 p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
          <Icon className="w-4 h-4 text-indigo-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="space-y-3.5">{children}</div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-slate-400 shrink-0" />
      <div className="flex items-baseline gap-2 min-w-0">
        <span className="text-xs text-slate-500 shrink-0">{label}</span>
        <span className="text-sm font-medium text-slate-800 truncate">{value || '-'}</span>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
          <Icon className="w-4 h-4 text-indigo-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, disabled }: {
  label: string; value: string; onChange?: (v: string) => void; disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className="w-full h-11 px-4 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:bg-slate-100 disabled:text-slate-500 transition-shadow"
      />
    </div>
  );
}
