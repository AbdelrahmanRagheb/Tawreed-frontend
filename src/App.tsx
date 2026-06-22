import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useLanguage } from "./i18n";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import type { Language } from "./i18n";

import { AuthLayout } from "./layouts/AuthLayout";
import { BuyerLayout } from "./layouts/BuyerLayout";
import { SupplierLayout } from "./layouts/SupplierLayout";
import { AdminLayout } from "./layouts/AdminLayout";

import { HomePage } from "./pages/HomePage";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { BuyerDashboard } from "./pages/buyer/Dashboard";
import { Orders } from "./pages/buyer/Orders";
import { OrderDetail } from "./pages/buyer/OrderDetail";
import { CreateOrder } from "./pages/buyer/CreateOrder";
import { JoinOrder } from "./pages/buyer/JoinOrder";
import { SavedOrders } from "./pages/buyer/SavedOrders";
import { Notifications } from "./pages/buyer/Notifications";
import { BuyerProfile } from "./pages/buyer/Profile";
import { SupplierDashboard } from "./pages/supplier/Dashboard";
import { SupplierProducts } from "./pages/supplier/Products";
import { SupplierOrders } from "./pages/supplier/Orders";
import { SupplierDeliveries } from "./pages/supplier/Deliveries";
import { SupplierInventory } from "./pages/supplier/Inventory";
import { SupplierReports } from "./pages/supplier/SupplierReports";
import { SupplierNotifications } from "./pages/supplier/SupplierNotifications";
import { SupplierProfile } from "./pages/supplier/Profile";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminUsers } from "./pages/admin/Users";
import { AdminSuppliers } from "./pages/admin/Suppliers";
import { AdminOrders } from "./pages/admin/Orders";
import { AdminCategories } from "./pages/admin/Categories";
import { AdminRegions } from "./pages/admin/Regions";
import { AdminReports } from "./pages/admin/Reports";
import { AdminSettings } from "./pages/admin/Settings";
import { AdminProfile } from "./pages/admin/Profile";

function PrivateRoute({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (!user) return <Navigate to="/auth/login" />;
  if (user.role !== role) return <Navigate to={`/${user.role}`} />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (user) return <Navigate to={`/${user.role}`} />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    if (user?.preferredLang && user.preferredLang !== language) {
      setLanguage(user.preferredLang as Language);
    }
  }, [user?.preferredLang]);

  return (
    <div
      className={language === "ar" ? "font-sans" : "font-sans"}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route
            path="login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
        </Route>

        <Route
          path="/buyer"
          element={
            <PrivateRoute role="buyer">
              <BuyerLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<BuyerDashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="orders/:id/join" element={<JoinOrder />} />
          <Route path="create" element={<CreateOrder />} />
          <Route path="saved" element={<SavedOrders />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<BuyerProfile />} />
        </Route>

        <Route
          path="/supplier"
          element={
            <PrivateRoute role="supplier">
              <SupplierLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<SupplierDashboard />} />
          <Route path="products" element={<SupplierProducts />} />
          <Route path="inventory" element={<SupplierInventory />} />
          <Route path="orders" element={<SupplierOrders />} />
          <Route path="deliveries" element={<SupplierDeliveries />} />
          <Route path="notifications" element={<SupplierNotifications />} />
          <Route path="reports" element={<SupplierReports />} />
          <Route path="profile" element={<SupplierProfile />} />
        </Route>

        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="buyers" element={<AdminUsers />} />
          <Route path="suppliers" element={<AdminSuppliers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="regions" element={<AdminRegions />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<AdminProfile />} />
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
