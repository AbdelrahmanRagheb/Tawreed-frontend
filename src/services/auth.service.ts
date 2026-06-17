import http from '../lib/http';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterBuyerRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  businessName: string;
  businessType: string;
  regionId: string;
  address: string;
}

export interface RegisterSupplierRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  companyName: string;
  taxId: string;
  regionId: string;
  categoryIds: string[];
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'Buyer' | 'Supplier' | 'Admin';
    avatar: string | null;
  };
}

export const authService = {
  login: (data: LoginRequest) =>
    http.post<AuthResponse>('/auth/login', data),

  registerBuyer: (data: RegisterBuyerRequest) =>
    http.post<AuthResponse>('/auth/register/buyer', data),

  registerSupplier: (data: RegisterSupplierRequest) =>
    http.post<AuthResponse>('/auth/register/supplier', data),

  refresh: (refreshToken: string) =>
    http.post<AuthResponse>('/auth/refresh', { refreshToken }),

  logout: () =>
    http.post('/auth/logout'),

  changePassword: (currentPassword: string, newPassword: string) =>
    http.put('/auth/password', { currentPassword, newPassword }),

  getMe: () =>
    http.get<AuthResponse['user']>('/auth/me'),
};
