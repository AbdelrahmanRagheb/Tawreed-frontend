import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, Role } from '../../contexts/AuthContext';
import { ChevronDown } from 'lucide-react';

const roles: { value: Role; label: string }[] = [
  { value: 'buyer', label: 'Buyer' },
  { value: 'supplier', label: 'Supplier' },
  { value: 'admin', label: 'Admin' },
];

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role>('buyer');

  const handleLogin = () => {
    login(selectedRole);
    navigate(`/${selectedRole}`);
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
        <p className="text-sm text-slate-500">Sign in to continue to Tawreed</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
          <input type="email" value="demo@tawreed.com" readOnly className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
          <input type="password" value="********" readOnly className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500" />
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-slate-200">
        <div className="relative mb-4">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as Role)}
            className="w-full appearance-none px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        <button onClick={handleLogin} className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors">
          Login
        </button>
      </div>
    </div>
  );
}
