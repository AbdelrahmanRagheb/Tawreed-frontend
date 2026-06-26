import http from '../lib/http';

export interface PublicProduct {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  categoryName: string;
  unitId: string;
  unit: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface PublicCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  parentId: string | null;
  productCount?: number;
  isActive?: boolean;
  sortOrder?: number;
}

export interface PublicBusinessType {
  id: string;
  nameAr: string;
  nameEn: string;
}

export interface PublicRegion {
  id: string;
  nameAr: string;
  nameEn: string;
  parentId: string | null;
  type?: string;
  isActive?: boolean;
}

export interface PublicGroupOrder {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  deadline: string;
  /* other fields as returned */
}

export interface NotificationItem {
  id: string;
  type: string;
  titleEn: string;
  titleAr: string;
  bodyEn: string | null;
  bodyAr: string | null;
  isRead: boolean;
  createdAt: string;
  relatedOrderId: string | null;
}

export const publicService = {
  listProducts: () =>
    http.get<PublicProduct[]>('/products'),

  getProduct: (id: string) =>
    http.get<PublicProduct>(`/products/${id}`),

  listBusinessTypes: () =>
    http.get<PublicBusinessType[]>('/business-types'),

  listCategories: () =>
    http.get<PublicCategory[]>('/categories'),

  getRootCategories: () =>
    http.get<PublicCategory[]>('/categories/root'),

  getCategory: (id: string) =>
    http.get<PublicCategory>(`/categories/${id}`),

  listRegions: () =>
    http.get<PublicRegion[]>('/regions'),

  searchRegions: (q: string) =>
    http.get<PublicRegion[]>(`/regions/search?q=${encodeURIComponent(q)}`),

  getRootRegions: () =>
    http.get<PublicRegion[]>('/regions/root'),

  getRegion: (id: string) =>
    http.get<PublicRegion>(`/regions/${id}`),

  getRegionChildren: (parentId: string) =>
    http.get<PublicRegion[]>(`/regions/${parentId}/children`),

  getDeliveryCoverageRegions: () =>
    http.get<PublicRegion[]>('/regions/delivery-coverage'),

  listGroupOrders: () =>
    http.get<PublicGroupOrder[]>('/group-orders'),

  getGroupOrder: (id: string) =>
    http.get<PublicGroupOrder>(`/group-orders/${id}`),

  getUnreadNotifications: (userId: string) =>
    http.get<NotificationItem[]>(`/notifications/unread/${userId}`),

  getUnreadNotificationCount: (userId: string) =>
    http.get<{ count: number }>(`/notifications/unread-count/${userId}`),

  markAsRead: (notificationId: string) =>
    http.patch(`/notifications/${notificationId}/read`),

  markAllAsRead: (userId: string) =>
    http.patch(`/notifications/read-all/${userId}`),
};
