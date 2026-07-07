import { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingCart,
  Tags,
  MapPin,
  BarChart3,
  Settings,
  LogOut,
  Globe,
  User,
  Search,
  X,
  Package,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useLanguage } from "../i18n";
import { syncPreferredLang } from "../services/auth.service";
import { adminService, type AdminSearchResult } from "../services/admin.service";

export function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AdminSearchResult | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setShowDropdown(false);
      return;
    }
    const timer = setTimeout(() => {
      adminService
        .search(searchQuery.trim())
        .then((res) => {
          setSearchResults(res.data);
          setShowDropdown(true);
        })
        .catch(() => setShowDropdown(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalResults =
    (searchResults?.users.length ?? 0) +
    (searchResults?.suppliers.length ?? 0) +
    (searchResults?.orders.length ?? 0) +
    (searchResults?.products.length ?? 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { icon: LayoutDashboard, key: "dashboard", path: "/admin" },
    { icon: Users, key: "buyers", path: "/admin/buyers" },
    { icon: Store, key: "suppliers", path: "/admin/suppliers" },
    { icon: ShoppingCart, key: "orders", path: "/admin/orders" },
    { icon: Tags, key: "categories", path: "/admin/categories" },
    { icon: MapPin, key: "regions", path: "/admin/regions" },
    { icon: BarChart3, key: "reports", path: "/admin/reports" },
    { icon: Settings, key: "settings", path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-[#eef3f9] flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 shrink-0 p-3 lg:p-4">
        <div className="sticky top-4 flex h-[calc(100vh-32px)] flex-col rounded-[2rem] border border-white/70 bg-white/85 shadow-xl shadow-slate-200/70 backdrop-blur-xl">
          {/* Brand */}
          <div className="mb-2 flex items-center gap-3 rounded-3xl bg-slate-50 m-4 p-3">
            <img
              src="/tawreed-logo.png"
              alt="Tawreed"
              className="h-auto w-auto shrink-0"
            />
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/admin" &&
                  location.pathname.startsWith(item.path));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition",
                    isActive
                      ? "bg-gradient-to-l from-[#1e3a8a] to-[#2563eb] text-white shadow-lg shadow-blue-900/20"
                      : "text-slate-500 hover:bg-slate-100 hover:text-[#1e3a8a]",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                      isActive
                        ? "bg-white/15"
                        : "bg-white text-slate-400 group-hover:text-[#1e3a8a]",
                    )}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </span>
                  {t(item.key as any)}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-0 overflow-y-auto h-screen relative">
        <div className="h-full">
          {/* Search + Actions */}
          <div className="px-4 md:px-8 pt-4 md:pt-6 pb-2">
            <div className="flex items-center gap-3">
              <div ref={searchRef} className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onPointerDown={() => {
                    if (window.innerWidth < 768) {
                      navigate(`/admin/search?q=${encodeURIComponent(searchQuery)}`);
                    }
                  }}
                  onFocus={() => {
                    if (window.innerWidth >= 768 && searchResults && totalResults > 0) setShowDropdown(true);
                  }}
                  placeholder={t("searchSupplies")}
                  className="w-full pl-12 pr-10 py-3.5 bg-white/85 backdrop-blur-xl border border-white/70 rounded-[2rem] text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] shadow-xl shadow-slate-200/60 placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(""); setSearchResults(null); setShowDropdown(false); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {showDropdown && searchResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/80 overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
                    {searchResults.users.length > 0 && (
                      <div className="p-3">
                        <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 px-2">{t("users")}</p>
                        {searchResults.users.map((u) => (
                          <Link
                            key={u.id}
                            to={`/admin/buyers?detail=${u.id}`}
                            onClick={() => { setShowDropdown(false); setSearchQuery(""); }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition"
                          >
                            <Users className="w-4 h-4 text-slate-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-800 truncate">{u.name}</p>
                              <p className="text-xs text-slate-500 truncate">{u.email}</p>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase ml-auto">{u.role}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                    {searchResults.suppliers.length > 0 && (
                      <div className="p-3 border-t border-slate-100">
                        <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 px-2">{t("suppliers")}</p>
                        {searchResults.suppliers.map((s) => (
                          <Link
                            key={s.id}
                            to={`/admin/suppliers?detail=${s.id}`}
                            onClick={() => { setShowDropdown(false); setSearchQuery(""); }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition"
                          >
                            <Store className="w-4 h-4 text-slate-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-800 truncate">{s.companyName}</p>
                              <p className="text-xs text-slate-500 truncate">{s.email}</p>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase ml-auto">{s.status}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                    {searchResults.orders.length > 0 && (
                      <div className="p-3 border-t border-slate-100">
                        <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 px-2">{t("orders")}</p>
                        {searchResults.orders.map((o) => (
                          <Link
                            key={o.id}
                            to={`/admin/orders?detail=${o.id}`}
                            onClick={() => { setShowDropdown(false); setSearchQuery(""); }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition"
                          >
                            <ShoppingCart className="w-4 h-4 text-slate-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-800 truncate">{o.title}</p>
                              <p className="text-xs text-slate-500 truncate">{o.buyerName}</p>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase ml-auto">{o.status}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                    {searchResults.products.length > 0 && (
                      <div className="p-3 border-t border-slate-100">
                        <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 px-2">{t("products")}</p>
                        {searchResults.products.map((p) => (
                          <Link
                            key={p.id}
                            to={`/admin/categories`}
                            onClick={() => { setShowDropdown(false); setSearchQuery(""); }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition"
                          >
                            <Package className="w-4 h-4 text-slate-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-800 truncate">{p.name}</p>
                              <p className="text-xs text-slate-500 truncate">{p.categoryName}</p>
                            </div>
                            {p.marketPrice != null && (
                              <span className="text-xs font-bold text-slate-600">{p.marketPrice} EGP</span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                    {totalResults === 0 && (
                      <div className="p-6 text-center text-sm text-slate-500">
                        {t("noResults")}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  const newLang = language === "en" ? "ar" : "en";
                  setLanguage(newLang);
                  syncPreferredLang(user?.role, newLang);
                }}
                className="shrink-0 rounded-2xl border border-white/70 bg-white/85 backdrop-blur-xl px-3 py-3.5 text-xs font-bold text-slate-600 shadow-xl shadow-slate-200/60 transition hover:border-[#1e3a8a] hover:text-[#1e3a8a] flex items-center gap-1.5"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">
                  {language === "en" ? "AR" : "EN"}
                </span>
              </button>
              <NavLink
                to="/admin/profile"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] text-white text-sm font-extrabold shadow-lg"
              >
                {user?.name?.charAt(0).toUpperCase() || (
                  <User className="w-4 h-4" />
                )}
              </NavLink>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="shrink-0 rounded-2xl border border-white/70 bg-white/85 backdrop-blur-xl px-3 py-3.5 text-xs font-bold text-red-600 shadow-xl shadow-slate-200/60 transition hover:border-red-300 hover:bg-red-50 flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t("logout")}</span>
              </button>
            </div>
          </div>
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed inset-x-0 bottom-0 z-50">
        <div className="pointer-events-none absolute -inset-x-0 -top-6 h-6 bg-gradient-to-t from-white/95 to-transparent" />
        <div className="border-t border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-[0_-4px_30px_rgba(0,0,0,.06)]">
          <div className="mx-auto flex h-16 max-w-[1500px] items-stretch justify-around px-1">
            {navItems
              .filter((item) => item.key !== "settings")
              .map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== "/admin" &&
                    location.pathname.startsWith(item.path));
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/admin"}
                    className="group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5"
                  >
                    <Icon
                      className={`w-4 h-4 ${isActive ? "text-[#1e3a8a]" : "text-slate-400 group-active:text-[#1e3a8a] transition-colors"}`}
                    />
                    <span
                      className={`text-[11px] font-extrabold tracking-tight ${
                        isActive
                          ? "text-[#1e3a8a]"
                          : "font-semibold text-slate-400 group-active:text-[#1e3a8a]"
                      }`}
                    >
                      {t(item.key as any)}
                    </span>
                  </NavLink>
                );
              })}
          </div>
        </div>
        <div className="h-safe-area-inset-bottom" />
      </nav>
    </div>
  );
}
