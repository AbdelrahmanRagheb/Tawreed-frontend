import { User, Mail, Phone, Building, MapPin, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../i18n';
import { mockUserProfiles } from '../../data';

export function BuyerProfile() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const profile = mockUserProfiles.buyer;

  const details = [
    { icon: Mail, label: 'Email', value: profile.email },
    { icon: Phone, label: t('phone'), value: profile.phone },
    { icon: Building, label: 'Company', value: profile.company[language] },
    { icon: Shield, label: t('role'), value: profile.role[language] },
    { icon: MapPin, label: 'Address', value: profile.address[language] },
    { icon: Calendar, label: t('memberSince'), value: profile.joinedDate },
  ];

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">{t('profile')}</h1>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-sm text-indigo-200">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {details.map((detail) => {
              const Icon = detail.icon;
              return (
                <div key={detail.label} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                  <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">{detail.label}</p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">{detail.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">{t('accountSettings')}</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                {t('editProfile')}
              </button>
              <button className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                {t('changePassword')}
              </button>
              <button className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                {t('notificationPrefs')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
