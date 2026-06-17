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

export interface RecentActivity {
  action: string;
  time: string;
}

export interface SupplierDashboardResponse {
  kpi: SupplierKpi;
  pendingOrders: any[];
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
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  businessName?: string;
  address?: string;
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

export interface UpdateDeliveryStatusRequest {
  status: string;
  trackingNotes?: string;
  scheduledAt?: string;
}

export const supplierService = {
  getDashboard: () =>
    http.get<SupplierDashboardResponse>('/supplier/dashboard'),

  getProfile: () =>
    http.get<SupplierProfile>('/supplier/profile'),

  updateProfile: (data: UpdateProfileRequest) =>
    http.put('/supplier/profile', data),

  getRegistrationStatus: () =>
    http.get<RegistrationStatus>('/supplier/registration-status'),

  listOrders: (params?: { status?: string; page?: number; limit?: number }) =>
    http.get<PaginatedResponse<SupplierOrderListItem>>('/supplier/orders', { params }),

  acceptOrder: (orderId: string, notes?: string) =>
    http.post<AcceptDeclineResponse>(`/supplier/orders/${orderId}/accept`, notes || ''),

  declineOrder: (orderId: string, reason?: string) =>
    http.post<AcceptDeclineResponse>(`/supplier/orders/${orderId}/decline`, reason || ''),

  listDeliveries: (params?: { status?: string; page?: number; limit?: number }) =>
    http.get<PaginatedResponse<DeliveryListItem>>('/supplier/deliveries', { params }),

  updateDeliveryStatus: (deliveryId: string, data: UpdateDeliveryStatusRequest) =>
    http.patch(`/supplier/deliveries/${deliveryId}/status`, data),
};
