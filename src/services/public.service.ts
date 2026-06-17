import http from '../lib/http';

export interface PublicProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  categoryName: string;
  stock: number;
  unit?: string;
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

export interface PublicRegion {
  id: string;
  nameAr: string;
  nameEn: string;
  parentId: string | null;
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
  isRead: boolean;
  createdAt: string;
}

export const publicService = {
  listProducts: () =>
    http.get<PublicProduct[]>('/api/products'),

  getProduct: (id: string) =>
    http.get<PublicProduct>(`/api/products/${id}`),

  listCategories: () =>
    http.get<PublicCategory[]>('/api/categories'),

  getRootCategories: () =>
    http.get<PublicCategory[]>('/api/categories/root'),

  getCategory: (id: string) =>
    http.get<PublicCategory>(`/api/categories/${id}`),

  listRegions: () =>
    http.get<PublicRegion[]>('/api/regions'),

  getRootRegions: () =>
    http.get<PublicRegion[]>('/api/regions/root'),

  getRegion: (id: string) =>
    http.get<PublicRegion>(`/api/regions/${id}`),

  listGroupOrders: () =>
    http.get<PublicGroupOrder[]>('/api/group-orders'),

  getGroupOrder: (id: string) =>
    http.get<PublicGroupOrder>(`/api/group-orders/${id}`),

  getUnreadNotifications: (userId: string) =>
    http.get<NotificationItem[]>(`/api/notifications/unread/${userId}`),

  getUnreadNotificationCount: (userId: string) =>
    http.get<{ count: number }>(`/api/notifications/unread-count/${userId}`),

  markAsRead: (notificationId: string) =>
    http.patch(`/api/notifications/${notificationId}/read`),

  markAllAsRead: (userId: string) =>
    http.patch(`/api/notifications/read-all/${userId}`),
};
