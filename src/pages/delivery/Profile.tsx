import { useState, useEffect } from 'react';
import { User, Truck, DollarSign, MapPin, Save } from 'lucide-react';
import { deliveryPersonService, DeliveryPersonProfile as ProfileType, UpdateDeliveryPersonProfileRequest } from '../../services/deliveryPerson.service';
import { useLanguage } from '../../i18n';
import { RegionTagSelector } from '../../components/RegionTagSelector';

export function DeliveryPersonProfile() {
  const { t } = useLanguage();
  const T = (key: string) => t(key as any);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<UpdateDeliveryPersonProfileRequest>({});
  const [msg, setMsg] = useState('');

  useEffect(() => {
    deliveryPersonService.getProfile()
      .then((profileRes) => {
        setProfile(profileRes.data);
        setForm({
          vehicleType: profileRes.data.vehicleType,
          baseDeliveryFee: profileRes.data.baseDeliveryFee,
          coverageRegionId: profileRes.data.coverageRegionId ?? undefined,
        });
      })
      .catch((err) => setError(err?.response?.data?.error || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      await deliveryPersonService.updateProfile(form);
      setMsg(T('saved'));
    } catch (err: any) {
      setMsg(err?.response?.data?.error || T('saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-slate-500">{T('loading')}</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!profile) return null;

  const vehicleOptions = ['Car', 'Motorcycle', 'Van', 'Truck', 'Bicycle'];

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <User className="w-8 h-8 text-emerald-600" />
        <h1 className="text-2xl font-bold text-slate-800">{T('profile')}</h1>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{T('fullName')}</label>
            <p className="text-slate-900 font-medium">{profile.fullName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{T('email')}</label>
            <p className="text-slate-900">{profile.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{T('phone')}</label>
            <p className="text-slate-900">{profile.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{T('rating')}</label>
            <p className="text-slate-900">{profile.rating.toFixed(1)} / 5.0 ({profile.totalDeliveries} {T('deliveries').toLowerCase()})</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-semibold text-slate-800">{T('editProfile')}</h2>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
            <Truck className="w-4 h-4" /> {T('vehicleType')}
          </label>
          <select
            value={form.vehicleType || ''}
            onChange={(e) => setForm((f) => ({ ...f, vehicleType: e.target.value }))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            {vehicleOptions.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
            <DollarSign className="w-4 h-4" /> {T('baseDeliveryFee')}
          </label>
          <input
            type="number"
            value={form.baseDeliveryFee || ''}
            onChange={(e) => setForm((f) => ({ ...f, baseDeliveryFee: parseFloat(e.target.value) || 0 }))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
            <MapPin className="w-4 h-4" /> {T('coverageRegion')}
          </label>
          <RegionTagSelector
            value={form.coverageRegionId || ''}
            onChange={(regionId) => setForm((f) => ({ ...f, coverageRegionId: regionId || undefined }))}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-medium"
        >
          <Save className="w-4 h-4" /> {saving ? T('saving') : T('save')}
        </button>

        {msg && <p className="text-sm text-emerald-600">{msg}</p>}
      </div>
    </div>
  );
}