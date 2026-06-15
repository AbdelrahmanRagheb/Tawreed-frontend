import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useLanguage } from './i18n';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import { AuthLayout } from './layouts/AuthLayout';
import { BuyerLayout } from './layouts/BuyerLayout';
import { SupplierLayout } from './layouts/SupplierLayout';
import { AdminLayout } from './layouts/AdminLayout';

import { Splash } from './pages/auth/Splash';
import { Login } from './pages/auth/Login';
import { BuyerDashboard } from './pages/buyer/Dashboard';
import { Orders } from './pages/buyer/Orders';
import { OrderDetail } from './pages/buyer/OrderDetail';
import { CreateOrder } from './pages/buyer/CreateOrder';
import { SavedOrders } from './pages/buyer/SavedOrders';
import { Notifications } from './pages/buyer/Notifications';
import { BuyerProfile } from './pages/buyer/Profile';
import { SupplierDashboard } from './pages/supplier/Dashboard';
import { SupplierProducts } from './pages/supplier/Products';
import { SupplierOrders } from './pages/supplier/Orders';
import { SupplierDeliveries } from './pages/supplier/Deliveries';
import { SupplierInventory } from './pages/supplier/Inventory';
import { SupplierReports } from './pages/supplier/SupplierReports';
import { SupplierNotifications } from './pages/supplier/SupplierNotifications';
import { SupplierProfile } from './pages/supplier/Profile';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminUsers } from './pages/admin/Users';
import { AdminSuppliers } from './pages/admin/Suppliers';
import { AdminOrders } from './pages/admin/Orders';
import { AdminCategories } from './pages/admin/Categories';
import { AdminRegions } from './pages/admin/Regions';
import { AdminReports } from './pages/admin/Reports';
import { AdminSettings } from './pages/admin/Settings';

function PrivateRoute({ role, children }: { role: string, children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth/login" />;
  if (user.role !== role) return <Navigate to={`/${user.role}`} />;
  return <>{children}</>;
}

function AppRoutes() {
  const { language } = useLanguage();
  return (
    <div className={language === 'ar' ? 'font-sans' : 'font-sans'} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/splash" />} />
        
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="splash" element={<Splash />} />
          <Route path="login" element={<Login />} />
        </Route>

        <Route path="/buyer" element={<PrivateRoute role="buyer"><BuyerLayout /></PrivateRoute>}>
          <Route index element={<BuyerDashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="create" element={<CreateOrder />} />
          <Route path="saved" element={<SavedOrders />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<BuyerProfile />} />
        </Route>

        <Route path="/supplier" element={<PrivateRoute role="supplier"><SupplierLayout /></PrivateRoute>}>
          <Route index element={<SupplierDashboard />} />
          <Route path="products" element={<SupplierProducts />} />
          <Route path="inventory" element={<SupplierInventory />} />
          <Route path="orders" element={<SupplierOrders />} />
          <Route path="deliveries" element={<SupplierDeliveries />} />
          <Route path="notifications" element={<SupplierNotifications />} />
          <Route path="reports" element={<SupplierReports />} />
          <Route path="profile" element={<SupplierProfile />} />
        </Route>

        <Route path="/admin" element={<PrivateRoute role="admin"><AdminLayout /></PrivateRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="suppliers" element={<AdminSuppliers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="regions" element={<AdminRegions />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
