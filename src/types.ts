export interface LocalizedString {
  en: string;
  ar: string;
}

export interface Product {
  id: string;
  name: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  supplierProductId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery?: string;
  paymentMethod?: string;
  shippingAddress?: LocalizedString;
  trackingNumber?: string;
}

export interface Notification {
  id: string;
  title: LocalizedString;
  message: LocalizedString;
  type: 'order' | 'system' | 'message';
  read: boolean;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  company: LocalizedString;
  role: LocalizedString;
  avatar: string;
  joinedDate: string;
  address: LocalizedString;
}

export interface SupplierEntry {
  id: string;
  companyName: LocalizedString;
  contactName: string;
  email: string;
  phone: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  joinedDate: string;
  rating: number;
  totalProducts: number;
  region?: string;
  ordersFulfilled?: number;
  activeOrders?: number;
  completionRate?: number;
  acceptanceRate?: number;
  deliverySuccessRate?: number;
  avgFulfillmentDays?: number;
  address?: LocalizedString;
  businessLicense?: string;
  submittedDocuments?: string[];
  activityTimeline?: { action: LocalizedString; time: string }[];
  products?: { name: LocalizedString; category: string; stock: number; unit: string }[];
}

export interface Delivery {
  id: string;
  orderId: string;
  orderNumber: string;
  address: LocalizedString;
  status: 'preparing' | 'in-transit' | 'delivered' | 'delayed';
  estimatedDate: string;
  carrier: string;
  trackingNumber: string;
}

export interface CategoryEntry {
  id: string;
  name: LocalizedString;
  productCount: number;
  supplierCount: number;
  active: boolean;
  monthlyOrders: number;
  growth: number;
  revenue: number;
  trend: 'hot' | 'growing' | 'stable' | 'declining';
  supplierBreakdown: { large: number; medium: number; small: number };
  topProducts: { name: string; orders: number }[];
}

export interface RegionEntry {
  id: string;
  name: LocalizedString;
  supplierCount: number;
  buyerCount: number;
  active: boolean;
}

export interface AdminStats {
  totalUsers: number;
  totalSuppliers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingSuppliers: number;
  activeCategories: number;
  monthlyGrowth: number;
}

export interface UserEntry {
  id: string;
  name: string;
  email: string;
  role: LocalizedString;
  status: 'active' | 'suspended';
  joinedDate: string;
  lastActive: string;
  businessName?: LocalizedString;
  phone?: string;
  region?: string;
  ordersCreated?: number;
  ordersJoined?: number;
  completedOrders?: number;
  cancelledOrders?: number;
  totalSavings?: number;
  suspensionReason?: string;
  activityHistory?: { action: LocalizedString; time: string }[];
}

export interface ReportEntry {
  id: string;
  title: LocalizedString;
  type: LocalizedString;
  period: string;
  generatedAt: string;
  total: number;
  growth: number;
}

export interface SupplierProduct {
  id: string;
  name: LocalizedString;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive';
  image: string;
}

export interface DraftCartItem {
  productId: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  unit: string;
  stock: number;
}

export interface SavedOrderDraft {
  id: string;
  name: string;
  description: string;
  region: string;
  deadlineDate: string;
  deadlineTime: string;
  visibility: 'public' | 'private';
  notes: string;
  items: DraftCartItem[];
  totalCost: number;
  totalQuantity: number;
  savedAt: string;
  type: 'draft' | 'template';
}

export type GroupOrderStatus = 'open' | 'closing_soon' | 'supplier_confirmed' | 'in_transit' | 'delivered';

export interface GroupOrderParticipant {
  id: string;
  name: string;
  avatar?: string;
  joinedAt: string;
  items: { groupOrderItemId: string; quantity: number }[];
}

export interface GroupOrderProductDetail {
  productId: string;
  productName: string;
  currentQuantity: number;
  targetQuantity: number;
  unit: string;
  unitPrice?: number;
  supplierProductId?: string;
}

export interface GroupOrderActivity {
  id: string;
  type: 'participant_joined' | 'quantity_updated' | 'discount_reached' | 'supplier_update';
  message: LocalizedString;
  timestamp: string;
}

export interface GroupOrderDetail {
  id: string;
  orderNumber: string;
  title: LocalizedString;
  createdBy: string;
  region: string;
  createdAt: string;
  deadline: string;
  status: GroupOrderStatus;
  participants: GroupOrderParticipant[];
  products: GroupOrderProductDetail[];
  activities: GroupOrderActivity[];
  totalOrderValue: number;
  currentDiscount: number;
  projectedFinalCost: number;
  supplier: {
    name: string;
    deliveryRegion: string;
    expectedDelivery: string;
  };
}
