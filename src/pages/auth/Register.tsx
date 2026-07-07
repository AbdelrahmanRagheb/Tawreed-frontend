import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';
import { publicService, type PublicCategory, type PublicBusinessType } from '../../services/public.service';
import { useLanguage } from '../../i18n';
import { ShoppingCart, Truck, Bike, User, Mail, Phone, Lock, Loader2 } from 'lucide-react';
import { RegionCascader } from '../../components/RegionCascader';
import { RegionTagSelector } from '../../components/RegionTagSelector';

type Role = 'Buyer' | 'Supplier' | 'DeliveryPerson';

const roleMeta: { role: Role; icon: typeof ShoppingCart; descKey: string }[] = [
  { role: 'Buyer', icon: ShoppingCart, descKey: 'buyerDesc' },
  { role: 'Supplier', icon: Truck, descKey: 'supplierDesc' },
  { role: 'DeliveryPerson', icon: Bike, descKey: 'deliveryDesc' },
];

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const isRTL = language === 'ar';

  const [role, setRole] = useState<Role>('Buyer');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [businessTypes, setBusinessTypes] = useState<PublicBusinessType[]>([]);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [regionId, setRegionId] = useState('');

  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [buyerTaxId, setBuyerTaxId] = useState('');
  const [buyerCommercialRegNo, setBuyerCommercialRegNo] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [supplierCommercialRegNo, setSupplierCommercialRegNo] = useState('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);

  const [vehicleType, setVehicleType] = useState('');
  const [baseDeliveryFee, setBaseDeliveryFee] = useState(0);
  const [coverageRegionId, setCoverageRegionId] = useState('');

  useEffect(() => {
    publicService.listBusinessTypes().then((b) => setBusinessTypes(b.data)).catch(() => {});
    publicService.listCategories().then((c) => setCategories(c.data)).catch(() => {});
  }, []);

  const toggleCategory = (id: string) => {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim() || !email.trim() || !password.trim() || !regionId) {
      setError(t('fillRequired'));
      return;
    }
    setSubmitting(true);
    try {
      if (role === 'Buyer') {
        const res = await authService.registerBuyer({
          fullName: fullName.trim(), email: email.trim(), phone, password,
          businessName, businessType, regionId,
          taxId: buyerTaxId || undefined,
          commercialRegistrationNo: buyerCommercialRegNo || undefined,
        });
        const { token, refreshToken, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        await login(email.trim(), password);
      } else if (role === 'DeliveryPerson') {
        const res = await authService.registerDeliveryPerson({
          fullName: fullName.trim(), email: email.trim(), phone, password,
          vehicleType, baseDeliveryFee, coverageRegionId,
        });
        const { token, refreshToken, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        await login(email.trim(), password);
      } else {
        const res = await authService.registerSupplier({
          fullName: fullName.trim(), email: email.trim(), phone, password,
          companyName, taxId, commercialRegistrationNo: supplierCommercialRegNo || undefined,
          regionId, categoryIds,
        });
        const { token, refreshToken, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        await login(email.trim(), password);
      }
      navigate(role === 'DeliveryPerson' ? '/delivery' : `/${role.toLowerCase()}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || t('registerFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = `w-full bg-transparent py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none ${isRTL ? 'pr-11 pl-3 text-right' : 'pl-11 pr-3'}`;
  const inputGroupClass = `group relative flex items-center rounded-xl border border-slate-300 bg-white transition focus-within:border-[#1e3a8a] focus-within:ring-4 focus-within:ring-[#1e3a8a]/10`;
  const iconWrap = (pos: 'left' | 'right') => `pointer-events-none absolute inset-y-0 flex items-center px-3.5 text-slate-400 ${pos === 'left' ? (isRTL ? 'right-0' : 'left-0') : (isRTL ? 'left-0' : 'right-0')}`;
  const selectClass = `w-full bg-white py-3 px-4 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 transition focus:outline-none focus:border-[#1e3a8a] focus:ring-4 focus:ring-[#1e3a8a]/10`;

  return (
    <div className={`relative min-h-screen w-full overflow-hidden bg-slate-50 ${isRTL ? 'font-ar' : ''}`}>
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob-1 absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-blue-200/40 blur-3xl" />
        <div className="blob-2 absolute -bottom-40 -right-32 h-[480px] w-[480px] rounded-full bg-indigo-300/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-100/40 blur-3xl" />
      </div>

      {/* Floating language toggle */}
      <button
        onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
        className="absolute top-6 right-6 z-20 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:border-[#1e3a8a] hover:text-[#1e3a8a] hover:shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span>{isRTL ? 'EN' : 'عربي'}</span>
      </button>

      {/* Main */}
      <main className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 px-6 pb-12 pt-4 lg:grid-cols-2 lg:gap-16 lg:pt-8">
        {/* Brand side (hidden on mobile) */}
        <section className="hidden flex-col items-center text-center lg:flex fade-up sticky top-8">
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 blur-2xl" />
            <Link to="/">
              <img src="/tawreed-logo.png" alt="Tawreed" className="h-72 w-auto" />
            </Link>
          </div>
          <p className="mt-2 max-w-md text-base font-medium text-slate-600">
            {t('tagline')}
          </p>
          <ul className="mt-8 grid w-full max-w-md gap-3 text-start">
            {[t('feature1'), t('feature2'), t('feature3')].map((f, i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white/60 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1e3a8a]/10 text-[#1e3a8a]">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Form side */}
        <section className="flex justify-center fade-up">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <Link to="/" className="mb-6 flex justify-center lg:hidden">
              <img src="/tawreed-logo.png" alt="Tawreed" className="h-24 w-auto" />
            </Link>

            <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/60 backdrop-blur sm:p-10">
              <div className="mb-6 text-center">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  {t('createAccount')}
                </h1>
                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                  {t('joinTawreed')}
                </p>
              </div>

              {/* Role selector */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {roleMeta.map(({ role: r, icon: Icon, descKey }) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${
                      role === r
                        ? 'border-[#1e3a8a] bg-[#1e3a8a]/5 text-[#1e3a8a] shadow-sm'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${role === r ? 'text-[#1e3a8a]' : 'text-slate-400'}`} />
                    <span className="text-[11px] font-extrabold leading-tight">{t(r.toLowerCase() as any)}</span>
                    <span className="text-[9px] opacity-70 leading-tight text-center">{t(descKey as any)}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {/* Full name */}
                <div>
                  <div className={inputGroupClass}>
                    <span className={iconWrap('left')}>
                      <User className="h-5 w-5" />
                    </span>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                      placeholder={t('fullName')} className={inputClass} />
                  </div>
                </div>

                {/* Email + Phone grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={inputGroupClass}>
                    <span className={iconWrap('left')}>
                      <Mail className="h-5 w-5" />
                    </span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('emailAddress')} className={inputClass} dir="ltr" />
                  </div>
                  <div className={inputGroupClass}>
                    <span className={iconWrap('left')}>
                      <Phone className="h-5 w-5" />
                    </span>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('phone')} className={inputClass} />
                  </div>
                </div>

                {/* Password */}
                <div className={inputGroupClass}>
                  <span className={iconWrap('left')}>
                    <Lock className="h-5 w-5" />
                  </span>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('password')} className={inputClass} />
                </div>

                {/* Region */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t('region')} *</label>
                  <RegionCascader value={regionId} onChange={setRegionId} />
                </div>

                {/* Buyer fields */}
                {role === 'Buyer' && (
                  <>
                    <div className={inputGroupClass}>
                      <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                        placeholder={t('businessName')}
                        className="w-full bg-transparent py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none" />
                    </div>
                    <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className={selectClass}>
                      <option value="">{t('selectBusinessType')}</option>
                      {businessTypes.map((bt) => (
                        <option key={bt.id} value={bt.nameEn}>{language === 'ar' ? bt.nameAr : bt.nameEn}</option>
                      ))}
                    </select>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className={inputGroupClass}>
                        <input type="text" value={buyerTaxId} onChange={(e) => setBuyerTaxId(e.target.value)}
                          placeholder={t('taxId')}
                          className="w-full bg-transparent py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none" />
                      </div>
                      <div className={inputGroupClass}>
                        <input type="text" value={buyerCommercialRegNo} onChange={(e) => setBuyerCommercialRegNo(e.target.value)}
                          placeholder={t('commercialRegistrationNo')}
                          className="w-full bg-transparent py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none" />
                      </div>
                    </div>
                  </>
                )}

                {/* Supplier fields */}
                {role === 'Supplier' && (
                  <>
                    <div className={inputGroupClass}>
                      <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                        placeholder={t('companyName')}
                        className="w-full bg-transparent py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none" />
                    </div>
                    <div className={inputGroupClass}>
                      <input type="text" value={taxId} onChange={(e) => setTaxId(e.target.value)}
                        placeholder={t('taxId')}
                        className="w-full bg-transparent py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none" />
                    </div>
                    <div className={inputGroupClass}>
                      <input type="text" value={supplierCommercialRegNo} onChange={(e) => setSupplierCommercialRegNo(e.target.value)}
                        placeholder={t('commercialRegistrationNo')}
                        className="w-full bg-transparent py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">{t('categories')}</label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((c) => (
                          <button
                            key={c.id} type="button" onClick={() => toggleCategory(c.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              categoryIds.includes(c.id)
                                ? 'bg-[#1e3a8a] text-white border-[#1e3a8a]'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {c.nameEn}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Delivery Person fields */}
                {role === 'DeliveryPerson' && (
                  <>
                    <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className={selectClass}>
                      <option value="">{t('selectVehicleType')}</option>
                      <option value="Car">Car</option>
                      <option value="Motorcycle">Motorcycle</option>
                      <option value="Van">Van</option>
                      <option value="Truck">Truck</option>
                      <option value="Bicycle">Bicycle</option>
                    </select>
                    <div className={inputGroupClass}>
                      <input type="number" value={baseDeliveryFee || ''} onChange={(e) => setBaseDeliveryFee(parseFloat(e.target.value) || 0)}
                        placeholder={t('baseDeliveryFee')}
                        className="w-full bg-transparent py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t('coverageRegion')} *</label>
                      <RegionTagSelector value={coverageRegionId} onChange={setCoverageRegionId} />
                    </div>
                  </>
                )}

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit" disabled={submitting}
                  className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-80"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {t('creatingAccount')}
                      </>
                    ) : (
                      <>
                        {t('createAccount')}
                        <svg className={`h-5 w-5 transition group-hover:translate-x-0.5 ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-slate-600">
                {t('hasAccount')}{' '}
                <Link to="/auth/login" className="font-bold text-[#1e3a8a] transition hover:text-[#172554] hover:underline">
                  {t('signIn')}
                </Link>
              </p>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              &copy; {new Date().getFullYear()} {isRTL ? 'توريد' : 'Tawreed'}. {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
