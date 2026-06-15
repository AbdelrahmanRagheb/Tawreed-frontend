import { useState } from 'react';
import { Settings as SettingsIcon, Globe, Shield, Bell, CreditCard, Palette, Users } from 'lucide-react';
import { useLanguage } from '../../i18n';

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

export function AdminSettings() {
  const { language, t } = useLanguage();
  const [enableRegistration, setEnableRegistration] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);

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
