import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';

export type Role = 'guest' | 'buyer' | 'supplier' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string | null;
  preferredLang: string;
}

interface AuthContextType {
  user: User | null;
  role: Role;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const langOverride = localStorage.getItem('preferredLang');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User;
        if (langOverride && langOverride !== parsed.preferredLang) {
          parsed.preferredLang = langOverride;
          localStorage.setItem('user', JSON.stringify(parsed));
        }
        setUser(parsed);
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login({ email, password });
    const { token, refreshToken, user: apiUser } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    const mappedUser: User = {
      id: apiUser.id,
      name: apiUser.name,
      email: apiUser.email,
      role: apiUser.role.toLowerCase() as Role,
      avatar: apiUser.avatar,
      preferredLang: apiUser.preferredLang || 'en',
    };
    localStorage.setItem('user', JSON.stringify(mappedUser));
    localStorage.setItem('preferredLang', mappedUser.preferredLang);
    setUser(mappedUser);
  }, []);

  const logout = useCallback(() => {
    authService.logout().catch(() => {});
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, role: user?.role || 'guest', login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
