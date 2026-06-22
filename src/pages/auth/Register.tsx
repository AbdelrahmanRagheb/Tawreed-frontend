import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';
import { publicService, type PublicCategory, type PublicBusinessType } from '../../services/public.service';
import { useLanguage } from '../../i18n';
import { UserPlus, Loader2, ShoppingCart, Truck, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { RegionCascader } from '../../components/RegionCascader';

type Role = 'Buyer' | 'Supplier';

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
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
  const [address, setAddress] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);

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
          businessName, businessType, regionId, address,
        });
        const { token, refreshToken, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        await login(email.trim(), password);
      } else {
        const res = await authService.registerSupplier({
          fullName: fullName.trim(), email: email.trim(), phone, password,
          companyName, taxId, regionId, categoryIds,
        });
        const { token, refreshToken, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        await login(email.trim(), password);
      }
      navigate(`/${role.toLowerCase()}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || t('registerFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">{t('createAccount')}</h1>
        <p className="text-sm text-slate-500">{t('joinTawreed')}</p>
      </div>

      {/* Role selector */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {([
          { role: 'Buyer' as Role, icon: ShoppingCart, descKey: 'buyerDesc' },
          { role: 'Supplier' as Role, icon: Truck, descKey: 'supplierDesc' },
        ]).map(({ role: r, icon: Icon, descKey }) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all ${
              role === r
                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm'
                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
            }`}
          >
            <Icon className={`w-6 h-6 ${role === r ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span className="text-xs font-extrabold">{t(r.toLowerCase() as any)}</span>
            <span className="text-[10px] opacity-70">{t(descKey as any)}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 relative">
            <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
              placeholder={t('fullName')}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
          </div>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailAddress')}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
          </div>
          <div className="relative">
            <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder={t('phone')}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
          </div>
          <div className="sm:col-span-2 relative">
            <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder={t('password')}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('region')} *</label>
            <RegionCascader value={regionId} onChange={setRegionId} />
          </div>

          {/* Buyer fields */}
          {role === 'Buyer' && (
            <>
              <div className="sm:col-span-2 relative">
                <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                  placeholder={t('businessName')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              </div>
              <div>
                <select value={businessType} onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                  <option value="">{t('selectBusinessType')}</option>
                  {businessTypes.map((bt) => (
                    <option key={bt.id} value={bt.nameEn}>{bt.nameEn}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                  placeholder={t('address')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              </div>
            </>
          )}

          {/* Supplier fields */}
          {role === 'Supplier' && (
            <>
              <div className="sm:col-span-2 relative">
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={t('companyName')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              </div>
              <div className="sm:col-span-2 relative">
                <input type="text" value={taxId} onChange={(e) => setTaxId(e.target.value)}
                  placeholder={t('taxId')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t('categories')}</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCategory(c.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        categoryIds.includes(c.id)
                          ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
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
        </div>

        {error && (
          <p className="text-xs font-medium text-red-600 text-center bg-red-50 py-2.5 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 disabled:opacity-60 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('creatingAccount')}
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              {t('createAccount')}
              <ArrowRight className="w-4 h-4 ml-1 opacity-50" />
            </>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-slate-500 mt-6">
        {t('hasAccount')}{' '}
        <Link to="/auth/login" className="text-indigo-600 font-bold hover:underline">
          {t('signIn')}
        </Link>
      </p>
    </form>
  );
}
