import http from '../lib/http';
import type { PaginatedResponse } from './buyer.service';

export interface AdminKpi {
  totalUsers: number;
  totalSuppliers: number;
  totalBuyers: number;
  totalOrders: number;
  pendingSuppliers: number;
  activeCategories: number;
  newUsersThisMonth: number;
}

export interface RecentAdminOrder {
  id: string;
  title: string;
  buyerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface AdminDashboardResponse {
  kpi: AdminKpi;
  pendingSupplierApplications: any[];
  recentOrders: RecentAdminOrder[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  businessName: string;
  region: string;
  joinedDate: string;
  lastLoginAt: string | null;
}

export interface AdminUserDetail extends AdminUser {
  businessType: string | null;
  taxId: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  suspensionReason: string | null;
  ordersCreated: number;
  ordersJoined: number;
  completedOrders: number;
  cancelledOrders: number;
  recentOrders: BuyerOrderItem[];
}

export interface BuyerOrderItem {
  id: string;
  title: string;
  status: string;
  estimatedTotal: number;
  participantsCount: number;
  createdAt: string;
}

export interface AdminSupplier {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  category: string;
  status: string;
  region: string;
  joinedDate: string;
  totalProducts: number;
  isApproved: boolean;
}

export interface AdminSupplierDetail extends AdminSupplier {
  categoryNames: string[];
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginAt: string | null;
  suspensionReason: string | null;
  totalOrders: number;
  activeOrders: number;
  approvalLogs: any[];
  products: AdminSupplierProductItem[];
  recentOrders: SupplierOrderItem[];
}

export interface AdminSupplierProductItem {
  name: string;
  categoryName: string;
  stock: number;
  unit: string;
  price: number;
  pricingTiers: PricingTierItem[];
}

export interface PricingTierItem {
  minQty: number;
  maxQty: number | null;
  unitPrice: number;
}

export interface SupplierOrderItem {
  id: string;
  title: string;
  buyerName: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export interface AdminOrderListItem {
  id: string;
  title: string;
  buyerName: string;
  buyerCompany: string;
  supplierName: string;
  totalAmount: number;
  status: string;
  regionEn: string;
  regionAr: string;
  createdAt: string;
  deadline: string;
  participants: number;
}

export interface AdminOrderItem {
  productId: string;
  productName: string;
  marketPrice: number | null;
  quantity: number;
  targetQuantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface AdminOrderParticipantItem {
  productId: string;
  quantity: number;
}

export interface AdminOrderParticipant {
  id: string;
  name: string;
  joinedAt: string;
  items: AdminOrderParticipantItem[];
}

export interface AdminOrderTimelineEvent {
  eventType: string;
  notesEn: string;
  notesAr: string;
  actorName: string;
  createdAt: string;
}

export interface AdminOrderDetailResponse {
  id: string;
  title: string;
  status: string;
  buyer: { id: string; name: string; company: string; email: string; phone: string };
  supplier: { id: string; name: string; companyName: string } | null;
  regionEn: string;
  regionAr: string;
  createdAt: string;
  deadline: string;
  totalOrderValue: number;
  items: AdminOrderItem[];
  participants: AdminOrderParticipant[];
  timeline: AdminOrderTimelineEvent[];
}

export interface AdminCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  productCount: number;
  supplierCount: number;
  isActive: boolean;
  sortOrder: number;
}

export interface AdminCategoryDetail extends AdminCategory {
  parentId: string | null;
  iconUrl: string | null;
}

export interface AdminRegion {
  id: string;
  nameAr: string;
  nameEn: string;
  parentId: string | null;
  type: string;
  isActive: boolean;
  createdAt: string;
}

export interface RegionTreeNode {
  id: string;
  nameAr: string;
  nameEn: string;
  parentId: string | null;
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  parentName: string | null;
  children: RegionTreeNode[];
}

export interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  avatarUrl: string | null;
  preferredLang: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface UpdateAdminProfileRequest {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  preferredLang?: string;
}

export interface RegionStats {
  governorates: number;
  cities: number;
  villages: number;
}

export const adminService = {
  getDashboard: () =>
    http.get<AdminDashboardResponse>('/admin/dashboard'),

  listUsers: (params?: { search?: string; status?: string; page?: number; limit?: number }) =>
    http.get<PaginatedResponse<AdminUser>>('/admin/users', { params }),

  getUserDetail: (userId: string) =>
    http.get<AdminUserDetail>(`/admin/users/${userId}`),

  suspendUser: (userId: string, reason: string) =>
    http.post(`/admin/users/${userId}/suspend`, reason),

  reactivateUser: (userId: string) =>
    http.post(`/admin/users/${userId}/reactivate`),

  resetUserPassword: (userId: string) =>
    http.post<{ tempPassword: string }>(`/admin/users/${userId}/reset-password`),

  listSuppliers: (params?: { status?: string; categoryId?: string; regionId?: string; page?: number; limit?: number }) =>
    http.get<PaginatedResponse<AdminSupplier>>('/admin/suppliers', { params }),

  getSupplierDetail: (supplierId: string) =>
    http.get<AdminSupplierDetail>(`/admin/suppliers/${supplierId}`),

  approveSupplier: (supplierId: string) =>
    http.post(`/admin/suppliers/${supplierId}/approve`),

  rejectSupplier: (supplierId: string, reason: string) =>
    http.post(`/admin/suppliers/${supplierId}/reject`, reason),

  suspendSupplier: (supplierId: string, reason: string) =>
    http.post(`/admin/suppliers/${supplierId}/suspend`, reason),

  reactivateSupplier: (supplierId: string) =>
    http.post(`/admin/suppliers/${supplierId}/reactivate`),

  listOrders: (params?: { status?: string; regionId?: string; page?: number; limit?: number }) =>
    http.get<PaginatedResponse<AdminOrderListItem>>('/admin/orders', { params }),

  getOrderDetail: (orderId: string) =>
    http.get<AdminOrderDetailResponse>(`/admin/orders/${orderId}`),

  forceCloseOrder: (orderId: string, reason: string) =>
    http.post(`/admin/orders/${orderId}/force-close`, reason),

  listCategories: (params?: { search?: string; page?: number; limit?: number }) =>
    http.get<PaginatedResponse<AdminCategory>>('/admin/categories', { params }),

  getCategoryDetail: (categoryId: string) =>
    http.get<AdminCategoryDetail>(`/admin/categories/${categoryId}`),

  createCategory: (params: { nameAr: string; nameEn: string; parentId?: string; iconUrl?: string; sortOrder?: number }) =>
    http.post('/admin/categories', null, { params }),

  updateCategory: (categoryId: string, data: { nameAr?: string; nameEn?: string; sortOrder?: number; isActive?: boolean }) =>
    http.patch(`/admin/categories/${categoryId}`, data),

  deactivateCategory: (categoryId: string) =>
    http.delete(`/admin/categories/${categoryId}`),

  activateCategory: (categoryId: string) =>
    http.post(`/admin/categories/${categoryId}/activate`),

  deleteCategory: (categoryId: string) =>
    http.delete(`/admin/categories/${categoryId}/delete`),

  listRegions: (params?: { search?: string }) =>
    http.get<AdminRegion[]>('/admin/regions', { params }),

  createRegion: (params: { nameAr: string; nameEn: string; parentId?: string; type: string }) =>
    http.post('/admin/regions', null, { params }),

  toggleRegion: (regionId: string) =>
    http.post(`/admin/regions/${regionId}/toggle`),

  getRegionTree: () =>
    http.get<RegionTreeNode[]>('/admin/regions/tree'),

  getRegionRoots: () =>
    http.get<RegionTreeNode[]>('/admin/regions/roots'),

  getRegionStats: () =>
    http.get<RegionStats>('/admin/regions/stats'),

  getRegionChildren: (parentId: string) =>
    http.get<RegionTreeNode[]>(`/admin/regions/${parentId}/children`),

  updateRegion: (regionId: string, data: { nameAr: string; nameEn: string; parentId?: string | null; type?: string | null }) =>
    http.put(`/admin/regions/${regionId}`, data),

  deleteRegion: (regionId: string) =>
    http.delete(`/admin/regions/${regionId}`),

  getProfile: () =>
    http.get<AdminProfile>('/admin/profile'),

  updateProfile: (data: UpdateAdminProfileRequest) =>
    http.patch('/admin/profile', data),

  getGroupRegionTypes: () =>
    http.get<string[]>('/admin/settings/group-region-types'),

  setGroupRegionTypes: (types: string[]) =>
    http.put('/admin/settings/group-region-types', types),

  getDefaultDeadlineDays: () =>
    http.get<{ days: number }>('/admin/settings/default-deadline-days'),

  setDefaultDeadlineDays: (days: number) =>
    http.put('/admin/settings/default-deadline-days', { days }),

  getUrgentDeadlineHours: () =>
    http.get<{ hours: number }>('/admin/settings/urgent-deadline-hours'),

  setUrgentDeadlineHours: (hours: number) =>
    http.put('/admin/settings/urgent-deadline-hours', { hours }),
};
