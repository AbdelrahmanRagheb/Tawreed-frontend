import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Globe, Shield, Bell, CreditCard, Palette, Users, MapPin, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import { useLanguage, toArabicNumeral } from '../../i18n';
import { adminService } from '../../services/admin.service';

const ALL_REGION_TYPES = [
  "Governorate", "Markaz", "Qism", "Madina", "Hayy",
  "PoliceDepartment", "Region", "City", "Village", "Kafr", "Ezba",
  "Shiyakha", "Manshaat", "Zone", "CustomsZone", "QismSection",
];

const sections = [
  { icon: Globe, label: 'generalSettings' },
  { icon: Shield, label: 'security' },
  { icon: Bell, label: 'notificationPrefs' },
  { icon: CreditCard, label: 'paymentGateway' },
  { icon: Palette, label: 'appearance' },
  { icon: Users, label: 'registration' },
];

const sectionDesc: Record<string, { en: string; ar: string }> = {
  generalSettings: { en: 'Platform name, description, and default language', ar: 'اسم المنصة والوصف واللغة الافتراضية' },
  security: { en: 'Password policy, 2FA, and session management', ar: 'سياسة كلمة المرور والمصادقة الثنائية وإدارة الجلسات' },
  notificationPrefs: { en: 'Email and push notification preferences', ar: 'تفضيلات الإشعارات عبر البريد الإلكتروني والدفع' },
  paymentGateway: { en: 'Configure payment methods and commission rates', ar: 'تكوين طرق الدفع ونسب العمولة' },
  appearance: { en: 'Brand colors, logo, and theme settings', ar: 'ألوان العلامة التجارية والشعار وإعدادات المظهر' },
  registration: { en: 'User registration rules and approval workflow', ar: 'قواعد تسجيل المستخدمين وسير عمل الموافقة' },
};

const TYPE_LABELS: Record<string, { en: string; ar: string }> = {
  Country: { en: 'Country', ar: 'الدولة' },
  Governorate: { en: 'Governorate', ar: 'محافظة' },
  Markaz: { en: 'Markaz', ar: 'مركز' },
  Qism: { en: 'Qism', ar: 'قسم' },
  Madina: { en: 'Madina', ar: 'مدينة' },
  Hayy: { en: 'Hayy', ar: 'حي' },
  PoliceDepartment: { en: 'Police Department', ar: 'قسم شرطة' },
  Region: { en: 'Region', ar: 'منطقة' },
  City: { en: 'City', ar: 'مدينة' },
  Village: { en: 'Village', ar: 'قرية' },
  Kafr: { en: 'Kafr', ar: 'كفر' },
  Ezba: { en: 'Ezba', ar: 'عزبة' },
  Shiyakha: { en: 'Shiyakha', ar: 'شياخة' },
  Manshaat: { en: 'Manshaat', ar: 'منشأة' },
  Zone: { en: 'Zone', ar: 'منطقة' },
  CustomsZone: { en: 'Customs Zone', ar: 'منطقة جمركية' },
  QismSection: { en: 'Qism Section', ar: 'قسم' },
};

export function AdminSettings() {
  const { language, t } = useLanguage();
  const [enableRegistration, setEnableRegistration] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deadlineDays, setDeadlineDays] = useState(3);
  const [deadlineDaysLoading, setDeadlineDaysLoading] = useState(true);
  const [deadlineDaysSaving, setDeadlineDaysSaving] = useState(false);
  const [deadlineDaysSaved, setDeadlineDaysSaved] = useState(false);
  const [urgentHours, setUrgentHours] = useState(6);
  const [urgentHoursLoading, setUrgentHoursLoading] = useState(true);
  const [urgentHoursSaving, setUrgentHoursSaving] = useState(false);
  const [urgentHoursSaved, setUrgentHoursSaved] = useState(false);

  useEffect(() => {
    adminService.getGroupRegionTypes().then((res) => {
      setSelectedTypes(new Set(res.data));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    adminService.getDefaultDeadlineDays().then((res) => {
      setDeadlineDays(res.data.days);
      setDeadlineDaysLoading(false);
    }).catch(() => setDeadlineDaysLoading(false));
  }, []);

  useEffect(() => {
    adminService.getUrgentDeadlineHours().then((res) => {
      setUrgentHours(res.data.hours);
      setUrgentHoursLoading(false);
    }).catch(() => setUrgentHoursLoading(false));
  }, []);

  const toggleType = (type: string) => {
    setSaved(false);
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const saveGroupRegionTypes = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await adminService.setGroupRegionTypes([...selectedTypes]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('settings')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('manageConfig')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button key={section.label} className="text-left bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{t(section.label as any)}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{sectionDesc[section.label][language]}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Group Region Types */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-900">{t('groupRegionTypes')}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{t('configureGroupRegions')}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {ALL_REGION_TYPES.map((type) => {
                const label = TYPE_LABELS[type]?.[language] ?? type;
                const isSelected = selectedTypes.has(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-slate-300'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                {toArabicNumeral(String(selectedTypes.size), language)} / {toArabicNumeral(String(ALL_REGION_TYPES.length), language)} {language === 'ar' ? 'محدد' : 'selected'}
              </p>
              <div className="flex items-center gap-3">
                {saved && (
                  <span className="text-xs text-emerald-600 font-semibold">
                    {language === 'ar' ? 'تم الحفظ' : 'Saved'}
                  </span>
                )}
                <button
                  onClick={saveGroupRegionTypes}
                  disabled={saving}
                  className="px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {saving
                    ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                    : (language === 'ar' ? 'حفظ' : 'Save')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Default Deadline Days */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-900">Default Order Deadline</h2>
            <p className="text-sm text-slate-500 mt-0.5">Number of days before new orders close automatically</p>
          </div>
        </div>

        {deadlineDaysLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
          </div>
        ) : (
          <>
            <div className="mt-4 flex items-center gap-4">
              <input
                type="number"
                min={1}
                max={365}
                value={deadlineDays}
                onChange={(e) => { setDeadlineDays(parseInt(e.target.value) || 1); setDeadlineDaysSaved(false); }}
                className="w-24 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center font-bold"
              />
              <span className="text-sm text-slate-600">{language === 'ar' ? 'أيام' : 'days'}</span>
            </div>

            <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                New orders will have a deadline of <strong>{toArabicNumeral(String(deadlineDays), language)}</strong> {deadlineDays === 1 ? 'day' : 'days'} from creation
              </p>
              <div className="flex items-center gap-3">
                {deadlineDaysSaved && (
                  <span className="text-xs text-emerald-600 font-semibold">
                    {language === 'ar' ? 'تم الحفظ' : 'Saved'}
                  </span>
                )}
                <button
                  onClick={async () => {
                    setDeadlineDaysSaving(true);
                    try {
                      await adminService.setDefaultDeadlineDays(deadlineDays);
                      setDeadlineDaysSaved(true);
                      setTimeout(() => setDeadlineDaysSaved(false), 2000);
                    } finally {
                      setDeadlineDaysSaving(false);
                    }
                  }}
                  disabled={deadlineDaysSaving}
                  className="px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {deadlineDaysSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {deadlineDaysSaving
                    ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                    : (language === 'ar' ? 'حفظ' : 'Save')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Urgent Deadline Hours */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-900">Urgent Order Deadline</h2>
            <p className="text-sm text-slate-500 mt-0.5">Number of hours before urgent orders close automatically</p>
          </div>
        </div>

        {urgentHoursLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
          </div>
        ) : (
          <>
            <div className="mt-4 flex items-center gap-4">
              <input
                type="number"
                min={1}
                max={168}
                value={urgentHours}
                onChange={(e) => { setUrgentHours(parseInt(e.target.value) || 1); setUrgentHoursSaved(false); }}
                className="w-24 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center font-bold"
              />
              <span className="text-sm text-slate-600">{language === 'ar' ? 'ساعة' : 'hours'}</span>
            </div>

            <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                Urgent orders will have a deadline of <strong>{toArabicNumeral(String(urgentHours), language)}</strong> {urgentHours === 1 ? 'hour' : 'hours'} from creation
              </p>
              <div className="flex items-center gap-3">
                {urgentHoursSaved && (
                  <span className="text-xs text-emerald-600 font-semibold">
                    {language === 'ar' ? 'تم الحفظ' : 'Saved'}
                  </span>
                )}
                <button
                  onClick={async () => {
                    setUrgentHoursSaving(true);
                    try {
                      await adminService.setUrgentDeadlineHours(urgentHours);
                      setUrgentHoursSaved(true);
                      setTimeout(() => setUrgentHoursSaved(false), 2000);
                    } finally {
                      setUrgentHoursSaving(false);
                    }
                  }}
                  disabled={urgentHoursSaving}
                  className="px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {urgentHoursSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {urgentHoursSaving
                    ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                    : (language === 'ar' ? 'حفظ' : 'Save')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">{t('quickToggles')}</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{t('enableRegistration')}</p>
              <p className="text-xs text-slate-500 mt-0.5">Allow new users to sign up</p>
            </div>
            <button
              onClick={() => setEnableRegistration(!enableRegistration)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                enableRegistration ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                enableRegistration ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-900">{t('requireApproval')}</p>
              <p className="text-xs text-slate-500 mt-0.5">Admins must approve new supplier registrations</p>
            </div>
            <button
              onClick={() => setRequireApproval(!requireApproval)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                requireApproval ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                requireApproval ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
