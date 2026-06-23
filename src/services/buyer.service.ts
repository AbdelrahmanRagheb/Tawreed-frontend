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
  creatorId: string;
  isCreator: boolean;
  isParticipant: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrderProduct {
  groupOrderItemId: string;
  productId: string;
  productName: string;
  categoryId: string;
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
  userId: string;
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
  creatorId: string;
  creatorUserId: string;
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
  activities: Activity[];
  isParticipant: boolean;
}

export interface CreateOrderRequest {
  title: string;
  description?: string;
  deadline: string;
  items: { productId: string; targetQuantity: number }[];
}

export interface JoinOrderRequest {
  items: { productId: string; quantity: number }[];
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

export interface EligibleSupplier {
  supplierId: string;
  supplierName: string;
  rating: number;
  totalEstimatedCost: number;
}

export interface SupplierPublicPricingTier {
  minQty: number;
  maxQty: number | null;
  unitPrice: number;
  isCurrentTier: boolean;
}

export interface SupplierPublicProduct {
  supplierProductId: string;
  productId: string;
  productName: string;
  categoryId: string;
  categoryName: string;
  unit: string;
  basePrice: number;
  availableStock: number;
  isRequiredByOrder: boolean;
  orderRequestedQty: number | null;
  imageUrl: string | null;
  pricingTiers: SupplierPublicPricingTier[];
}

export interface SupplierPublicProfile {
  supplierId: string;
  supplierName: string;
  rating: number;
  address: string | null;
  categories: string[];
  products: SupplierPublicProduct[];
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

  getEligibleSuppliers: (orderId: string) =>
    http.get<EligibleSupplier[]>(`/buyer/orders/${orderId}/eligible-suppliers`),

  getSupplierProfile: (orderId: string, supplierId: string) =>
    http.get<SupplierPublicProfile>(`/buyer/orders/${orderId}/suppliers/${supplierId}`),

  createOrder: (data: CreateOrderRequest) =>
    http.post('/buyer/orders', data),

  saveDraft: (data: CreateOrderRequest) =>
    http.post('/buyer/orders/draft', data),

  getDrafts: (params?: { page?: number; limit?: number }) =>
    http.get<PaginatedResponse<BuyerOrderListItem>>('/buyer/orders/drafts', { params }),

  deleteDraft: (orderId: string) =>
    http.delete(`/buyer/orders/${orderId}/draft`),

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
