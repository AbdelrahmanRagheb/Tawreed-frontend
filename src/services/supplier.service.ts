import http from '../lib/http';
import type { PaginatedResponse } from './buyer.service';

export interface SupplierKpi {
  totalRevenue: number;
  totalOrders: number;
  activeOrders: number;
  pendingDeliveries: number;
  totalProducts: number;
  ratingAvg: number;
}

export interface ActiveGroupOrder {
  id: string;
  title: string;
  participants: number;
  totalValue: number;
  deadline: string;
  status: string;
}

export interface DeliveryOverview {
  pending: number;
  preparing: number;
  shipped: number;
  delivered: number;
  failed: number;
}

export interface SupplierPendingOrder {
  id: string;
  title: string;
  creatorName: string;
  participants: number;
  totalAmount: number;
  deadline: string;
  region: string;
  receivedAt: string;
}

export interface RecentActivity {
  actionEn: string;
  actionAr: string;
  time: string;
}

export interface SupplierDashboardResponse {
  kpi: SupplierKpi;
  pendingOrders: SupplierPendingOrder[];
  activeGroupOrders: ActiveGroupOrder[];
  inventoryAlerts: any[];
  deliveryOverview: DeliveryOverview;
  recentActivity: RecentActivity[];
}

export interface SupplierProfile {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  taxId: string | null;
  avatar: string | null;
  joinedDate: string;
  address: string;
  regionName: string;
  regionId: string;
  ratingAvg: number;
  isApproved: boolean;
  preferredLang: string;
  categoryIds: string[];
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  businessName?: string;
  address?: string;
  regionId?: string;
  avatar?: string;
  preferredLang?: string;
}

export interface RegistrationStatus {
  status: string;
  isApproved: boolean;
  approvalLogs: any[];
}

export interface SupplierOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface PricingTier {
  id: string;
  supplierProductId: string;
  minQty: number;
  maxQty: number | null;
  unitPrice: number;
}

export interface CreatePricingTierRequest {
  minQty: number;
  maxQty: number | null;
  unitPrice: number;
}

export interface UpdatePricingTierRequest {
  minQty: number;
  maxQty: number | null;
  unitPrice: number;
}

export interface SupplierProductListItem {
  id: string;
  supplierId: string;
  productId: string;
  productName: string;
  description: string | null;
  categoryId: string;
  categoryName: string;
  unitId: string;
  unit: string;
  imageUrl: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface SupplierOrderListItem {
  id: string;
  title: string;
  creatorName: string;
  buyerCompany: string;
  totalAmount: number;
  status: string;
  deadline: string;
  region: string;
  receivedAt: string;
  items: SupplierOrderItem[];
}

export interface AcceptOrderPayload {
  notes?: string;
  scheduledDeliveryAt: string;
  deliveryNotes?: string;
}

export interface AcceptDeclineResponse {
  message: string;
  orderStatus: string;
}

export interface DeliveryListItem {
  id: string;
  orderId: string;
  status: string;
  scheduledAt?: string;
  trackingNotes?: string;
  /* other fields as returned by the API */
}

export interface AddSupplierProductRequest {
  productId: string;
  price: number;
  stock: number;
  tiers?: { minQty: number; maxQty: number | null; unitPrice: number }[];
}

export interface UpdateSupplierProductRequest {
  price?: number;
  stock?: number;
  isActive?: boolean;
}

export interface UpdateDeliveryStatusRequest {
  status: string;
  trackingNotes?: string;
  scheduledAt?: string;
}

export const supplierService = {
  getDashboard: () =>
    http.get<SupplierDashboardResponse>('/supplier/dashboard'),

  listProducts: () =>
    http.get<SupplierProductListItem[]>('/supplier/products'),

  addProduct: (data: AddSupplierProductRequest) =>
    http.post<SupplierProductListItem>('/supplier/products', data),

  updateProduct: (productId: string, data: UpdateSupplierProductRequest) =>
    http.put<SupplierProductListItem>(`/supplier/products/${productId}`, data),

  removeProduct: (productId: string) =>
    http.delete(`/supplier/products/${productId}`),

  getProduct: (productId: string) =>
    http.get<SupplierProductListItem>(`/supplier/products/${productId}`),

  getTiers: (productId: string) =>
    http.get<PricingTier[]>(`/supplier/products/${productId}/tiers`),

  createTier: (productId: string, data: CreatePricingTierRequest) =>
    http.post<PricingTier>(`/supplier/products/${productId}/tiers`, data),

  updateTier: (productId: string, tierId: string, data: UpdatePricingTierRequest) =>
    http.put<PricingTier>(`/supplier/products/${productId}/tiers/${tierId}`, data),

  deleteTier: (productId: string, tierId: string) =>
    http.delete(`/supplier/products/${productId}/tiers/${tierId}`),

  getProfile: () =>
    http.get<SupplierProfile>('/supplier/profile'),

  updateProfile: (data: UpdateProfileRequest) =>
    http.put('/supplier/profile', data),

  getRegistrationStatus: () =>
    http.get<RegistrationStatus>('/supplier/registration-status'),

  listOrders: (params?: { status?: string; page?: number; limit?: number }) =>
    http.get<PaginatedResponse<SupplierOrderListItem>>('/supplier/orders', { params }),

  acceptOrder: (orderId: string, data: AcceptOrderPayload) =>
    http.post<AcceptDeclineResponse>(`/supplier/orders/${orderId}/accept`, data),

  declineOrder: (orderId: string, reason?: string) =>
    http.post<AcceptDeclineResponse>(`/supplier/orders/${orderId}/decline`, reason || ''),

  listDeliveries: (params?: { status?: string; page?: number; limit?: number }) =>
    http.get<PaginatedResponse<DeliveryListItem>>('/supplier/deliveries', { params }),

  updateDeliveryStatus: (deliveryId: string, data: UpdateDeliveryStatusRequest) =>
    http.patch(`/supplier/deliveries/${deliveryId}/status`, data),

  updateCategories: (categoryIds: string[]) =>
    http.put('/supplier/profile/categories', categoryIds),

  getCategoryIds: () =>
    http.get<string[]>('/supplier/profile/categories'),
};
