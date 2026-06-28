import http from '../lib/http';

export interface DeliveryPersonDashboardData {
  activeDeliveries: number;
  completedToday: number;
  rating: number;
  earningsToday: number;
}

export interface DeliveryPersonDeliveryDto {
  id: string;
  orderId: string;
  orderTitle: string;
  shippingRegion: string;
  status: string;
  scheduledAt?: string;
  participants: DeliveryPersonParticipantDto[];
}

export interface DeliveryPersonParticipantDto {
  invoiceId: string;
  participantId: string;
  participantName: string;
  status: string;
}

export interface DeliveryPersonDeliveryDetailDto extends DeliveryPersonDeliveryDto {
  participantDetails: DeliveryPersonParticipantDetailDto[];
}

export interface DeliveryPersonParticipantDetailDto {
  invoiceId: string;
  participantId: string;
  participantName: string;
  email: string;
  phone: string;
  address: string;
  addressAr: string;
  addressEn: string;
  status: string;
  verificationCode?: string | null;
  items: DeliveryPersonItemDto[];
}

export interface DeliveryPersonItemDto {
  name: string;
  quantity: number;
  price: number;
  unitPrice: number;
  totalPrice: number;
}

export interface DeliveryPersonProfile {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  vehicleType: string;
  baseDeliveryFee: number;
  rating: number;
  totalDeliveries: number;
  isActive: boolean;
  coverageRegionId: string | null;
  coverageRegionName: string | null;
}

export interface UpdateDeliveryPersonProfileRequest {
  vehicleType?: string;
  baseDeliveryFee?: number;
  coverageRegionId?: string;
}

export interface AvailableRegion {
  id: string;
  nameAr: string;
  nameEn: string;
}

export interface PendingDeliveryRequest {
  id: string;
  orderId: string;
  orderTitle: string;
  creatorName: string;
  supplierName: string;
  region: string;
  proposedFee?: number;
  status: string;
  createdAt: string;
  respondedAt?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const deliveryPersonService = {
  getDashboard: () =>
    http.get<DeliveryPersonDashboardData>('/delivery-person/dashboard'),

  getDeliveries: (params?: { status?: string; page?: number; limit?: number }) =>
    http.get<PaginatedResponse<DeliveryPersonDeliveryDto>>('/delivery-person/deliveries', { params }),

  getDeliveryDetail: (id: string) =>
    http.get<DeliveryPersonDeliveryDetailDto>(`/delivery-person/deliveries/${id}`),

  updateDeliveryStatus: (deliveryId: string, data: { status: string; trackingNotes?: string }) =>
    http.patch(`/delivery-person/deliveries/${deliveryId}/status`, data),

  verifyDelivery: (deliveryId: string, invoiceId: string, data: { verificationCode: string }) =>
    http.post(`/delivery-person/deliveries/${deliveryId}/verify/${invoiceId}`, data),

  getProfile: () =>
    http.get<DeliveryPersonProfile>('/delivery-person/profile'),

  updateProfile: (data: UpdateDeliveryPersonProfileRequest) =>
    http.put('/delivery-person/profile', data),

  getAvailableRegions: () =>
    http.get<AvailableRegion[]>('/delivery-person/available-regions'),

  getPendingRequests: () =>
    http.get<PendingDeliveryRequest[]>('/delivery-person/pending-requests'),

  acceptRequest: (requestId: string) =>
    http.post(`/delivery-person/accept-request/${requestId}`),

  declineRequest: (requestId: string, reason?: string) =>
    http.post(`/delivery-person/decline-request/${requestId}`, { reason }),
};