import http from '../lib/http';

export interface BuyerDashboardResponse {
  activeOrders: DashboardOrder[];
  nearbyOrders: NearbyOrder[];
  notifications: DashboardNotification[];
  trendingProducts: TrendingProduct[];
  totalSavings: number;
  unreadNotificationCount: number;
}

export interface DashboardOrder {
  id: string;
  title: string;
  status: string;
  deadline: string;
  participantCount: number;
  totalValue: number;
  productCount: number;
  creatorName: string;
  region: string;
  isCreator: boolean;
}

export interface NearbyOrder {
  id: string;
  creatorName: string;
  productName: string;
  quantity: number;
  currentParticipants: number;
  deadline: string;
  region: string;
}

export interface DashboardNotification {
  id: string;
  type: string;
  titleEn: string;
  titleAr: string;
  isRead: boolean;
  createdAt: string;
}

export interface TrendingProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  categoryName: string;
  orderCount: number;
}

export interface BuyerOrderListItem {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  deadline: string;
  totalOrderValue: number;
  participantCount: number;
  productCount: number;
  region: string;
  creatorName: string;
  supplierName: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrderProduct {
  productId: string;
  productName: string;
  currentQuantity: number;
  targetQuantity: number;
  unit: string;
  unitPrice?: number;
  supplierProductId?: string;
}

export interface ParticipantItem {
  groupOrderItemId: string;
  productName: string;
  quantity: number;
}

export interface Participant {
  id: string;
  name: string;
  joinedAt: string;
  items: ParticipantItem[];
}

export interface OrderActivity {
  id: string;
  eventType: string;
  notes: string;
  createdBy: string;
  createdAt: string;
}

export interface OrderDetailResponse {
  id: string;
  title: string;
  description: string;
  creatorName: string;
  region: string;
  createdAt: string;
  deadline: string;
  deadlinePassed: boolean;
  status: string;
  totalOrderValue: number;
  supplierName: string;
  supplierId: string;
  products: OrderProduct[];
  participants: Participant[];
  activities: OrderActivity[];
}

export interface CreateOrderRequest {
  title: string;
  description?: string;
  deadline: string;
  items: { productId: string; targetQuantity: number }[];
}

export interface JoinOrderRequest {
  items: { groupOrderItemId: string; quantity: number }[];
}

export interface JoinOrderResponse {
  message: string;
  participant: Participant;
  updatedProducts: { itemId: string; productId: string }[];
}

export interface LeaveOrderResponse {
  message: string;
}

export interface UpdateItemsRequest {
  items: { groupOrderItemId: string; quantity: number }[];
}

export interface BuyerProfile {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  taxId: string | null;
  avatar: string | null;
  joinedDate: string;
  address: string | null;
  regionName: string;
  regionId: string;
  preferredLang: string;
}

export interface BuyerUpdateProfileRequest {
  fullName?: string;
  phone?: string;
  businessName?: string;
  businessType?: string;
  taxId?: string;
  address?: string;
  regionId?: string;
  avatar?: string;
  preferredLang?: string;
}

export const buyerService = {
  getDashboard: (regionId?: string) =>
    http.get<BuyerDashboardResponse>('/buyer/dashboard', {
      params: { regionId },
    }),

  listOrders: (params?: { status?: string; page?: number; limit?: number }) =>
    http.get<PaginatedResponse<BuyerOrderListItem>>('/buyer/orders', { params }),

  getOrderDetail: (orderId: string) =>
    http.get<OrderDetailResponse>(`/buyer/orders/${orderId}`),

  createOrder: (data: CreateOrderRequest) =>
    http.post('/buyer/orders', data),

  saveDraft: (data: CreateOrderRequest) =>
    http.post('/buyer/orders/draft', data),

  getDrafts: (params?: { page?: number; limit?: number }) =>
    http.get<PaginatedResponse<BuyerOrderListItem>>('/buyer/orders/drafts', { params }),

  deleteDraft: (orderId: string) =>
    http.delete(`/buyer/orders/${orderId}/draft`),

  publishDraft: (orderId: string) =>
    http.post(`/buyer/orders/${orderId}/publish`),

  joinOrder: (orderId: string, data: JoinOrderRequest) =>
    http.post<JoinOrderResponse>(`/buyer/orders/${orderId}/join`, data),

  leaveOrder: (orderId: string) =>
    http.post<LeaveOrderResponse>(`/buyer/orders/${orderId}/leave`),

  updateParticipantItems: (orderId: string, participantId: string, data: UpdateItemsRequest) =>
    http.put(`/buyer/orders/${orderId}/participants/${participantId}/items`, data),

  getProfile: () =>
    http.get<BuyerProfile>('/buyer/profile'),

  updateProfile: (data: BuyerUpdateProfileRequest) =>
    http.put('/buyer/profile', data),
};
