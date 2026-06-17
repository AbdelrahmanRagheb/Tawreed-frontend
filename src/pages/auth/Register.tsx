import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';
import { publicService, type PublicRegion, type PublicCategory } from '../../services/public.service';
import { ChevronDown, UserPlus } from 'lucide-react';

type Role = 'Buyer' | 'Supplier';

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<Role>('Buyer');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [regions, setRegions] = useState<PublicRegion[]>([]);
  const [categories, setCategories] = useState<PublicCategory[]>([]);

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
    publicService.listRegions().then((r) => setRegions(r.data)).catch(() => {});
    publicService.listCategories().then((c) => setCategories(c.data)).catch(() => {});
  }, []);

  const toggleCategory = (id: string) => {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setError('');
    if (!fullName.trim() || !email.trim() || !password.trim() || !regionId) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      if (role === 'Buyer') {
        const res = await authService.registerBuyer({
          fullName: fullName.trim(),
          email: email.trim(),
          phone,
          password,
          businessName,
          businessType,
          regionId,
          address,
        });
        const { token, refreshToken, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        await login(email.trim(), password);
      } else {
        const res = await authService.registerSupplier({
          fullName: fullName.trim(),
          email: email.trim(),
          phone,
          password,
          companyName,
          taxId,
          regionId,
          categoryIds,
        });
        const { token, refreshToken, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        await login(email.trim(), password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-sm text-slate-500 mt-1">Join Tawreed as a buyer or supplier</p>
        </div>

        <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
          {(['Buyer', 'Supplier'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
                role === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              {r === 'Buyer' ? 'Buyer' : 'Supplier'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Password *</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Region *</label>
              <div className="relative">
                <select value={regionId} onChange={(e) => setRegionId(e.target.value)}
                  className="w-full appearance-none px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select region</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>{r.nameEn}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {role === 'Buyer' && (
              <>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Business Name</label>
                  <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Business Type</label>
                  <input type="text" value={businessType} onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </>
            )}

            {role === 'Supplier' && (
              <>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Company Name *</label>
                  <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Tax ID</label>
                  <input type="text" value={taxId} onChange={(e) => setTaxId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => toggleCategory(c.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
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

          {error && <p className="text-xs text-red-600 text-center">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already have an account?{' '}
          <a href="/auth/login" className="text-indigo-600 font-semibold hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}
