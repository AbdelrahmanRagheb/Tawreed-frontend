import { useEffect, useState } from "react";
import Logo from "./components/Logo";

type Tab = {
  name: string;
  icon: string;
};

const tabs: Tab[] = [
  { name: "الرئيسية", icon: "M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H8v6H4a1 1 0 0 1-1-1v-8.5z" },
  { name: "الطلبات", icon: "M7 7h14l-2 9H8L6 4H3m6 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" },
  { name: "المحفوظة", icon: "M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" },
  { name: "إنشاء", icon: "M12 5v14m-7-7h14" },
  { name: "التنبيهات", icon: "M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 0 1-6 0" },
  { name: "التوصيلات", icon: "M3 7h11v8H3V7zm11 3h3l4 4v1h-7v-5zM7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
  { name: "الملف الشخصي", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm7 9a7 7 0 0 0-14 0" },
];

// Only show these 5 in bottom nav on mobile — keep others accessible via "more"
const bottomNavTabs = tabs.slice(0, 5);

const stats = [
  { label: "طلبات هذا الشهر", value: "128", change: "+18%" },
  { label: "قيد التوصيل", value: "12", change: "اليوم" },
  { label: "إجمالي التوفير", value: "15.6K", change: "ريال", highlight: true },
  { label: "إجمالي المشتريات", value: "84.2K", change: "ريال" },
];

const orders = [
  { id: "TR-2481", supplier: "Al-Salam Foods", category: "مواد غذائية", amount: "12,450 ر.س", status: "قيد التجهيز", tone: "bg-amber-50 text-amber-700" },
  { id: "TR-2479", supplier: "Gulf Beverages", category: "مشروبات", amount: "8,920 ر.س", status: "في الطريق", tone: "bg-blue-50 text-blue-700" },
  { id: "TR-2474", supplier: "Prime Stationery", category: "قرطاسية", amount: "3,180 ر.س", status: "مكتمل", tone: "bg-emerald-50 text-emerald-700" },
];

const deliveries = [
  { title: "شحنة مواد غذائية", place: "الرياض، حي النرجس", progress: 72 },
  { title: "شحنة أدوات مكتبية", place: "جدة، طريق الملك", progress: 38 },
  { title: "شحنة مشروبات", place: "الدمام، الفيصلية", progress: 91 },
];

function SidebarIcon({ path, className = "" }: { path: string; className?: string }) {
  return (
    <svg className={`h-5 w-5 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("الرئيسية");
  const [lang, setLang] = useState<"ar" | "en">("ar");

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const toggleLang = () => setLang((l) => (l === "ar" ? "en" : "ar"));

  return (
    <div className="min-h-screen bg-[#eef3f9] font-ar text-slate-900">
      {/* ambient background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 left-10 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="absolute -bottom-16 right-40 h-[420px] w-[420px] rounded-full bg-indigo-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1500px] gap-5 p-3 lg:p-6">

        {/* ===== SIDEBAR – DESKTOP ONLY ===== */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-4 flex h-[calc(100vh-32px)] flex-col rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-200/70 backdrop-blur-xl">
            {/* Brand */}
            <div className="mb-7 flex items-center gap-3 rounded-3xl bg-slate-50 p-3">
              <Logo className="h-13 w-15 shrink-0" showWordmark={false} />
              <div>
                <p className="text-xl font-extrabold text-[#1e3a8a]">توريد</p>
                <p className="text-xs font-semibold text-slate-400">{lang === "ar" ? "لوحة المشتري" : "Buyer Dashboard"}</p>
              </div>
            </div>

            {/* Nav links */}
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const active = activeTab === tab.name;
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition ${
                      active
                        ? "bg-gradient-to-l from-[#1e3a8a] to-[#2563eb] text-white shadow-lg shadow-blue-900/20"
                        : "text-slate-500 hover:bg-slate-100 hover:text-[#1e3a8a]"
                    }`}
                  >
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${active ? "bg-white/15" : "bg-white text-slate-400 group-hover:text-[#1e3a8a]"}`}>
                      <SidebarIcon path={tab.icon} />
                    </span>
                    {tab.name}
                  </button>
                );
              })}
            </nav>

            {/* Bottom CTA card */}
            <div className="mt-auto rounded-[1.75rem] bg-gradient-to-br from-slate-950 to-[#1e3a8a] p-5 text-white">
              <p className="text-sm font-bold">{lang === "ar" ? "هل تحتاج مورد جديد؟" : "Need a new supplier?"}</p>
              <p className="mt-1 text-xs leading-6 text-blue-100">
                {lang === "ar" ? "أنشئ طلب توريد جديد وسيتم ترشيح أفضل الموردين لك خلال دقائق." : "Create a new sourcing request and we'll match you with the best suppliers in minutes."}
              </p>
              <button onClick={() => setActiveTab("إنشاء")} className="mt-4 rounded-2xl bg-white px-5 py-2.5 text-xs font-extrabold text-[#1e3a8a] transition hover:bg-blue-50">
                {lang === "ar" ? "إنشاء طلب" : "Create Request"}
              </button>
            </div>
          </div>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex min-w-0 flex-1 flex-col gap-4 pb-20 lg:pb-4">

          {/* HEADER – contains language + profile buttons on BOTH mobile & desktop */}
          <header className="rounded-[1.75rem] sm:rounded-[2rem] border border-white/70 bg-white/85 p-4 sm:p-5 shadow-xl shadow-slate-200/60 backdrop-blur-xl">
            {/* Row 1: Title / Search / Actions */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                {/* Logo visible only on mobile */}
                <Logo className="h-9 w-auto shrink-0 lg:hidden" showWordmark={false} />
                <div>
                  <p className="text-xs font-bold tracking-wide text-[#1e3a8a] uppercase">
                    {lang === "ar" ? "لوحة التحكم" : "Dashboard"} · {activeTab}
                  </p>
                  <h1 className="mt-0.5 text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
                    {lang === "ar" ? "مرحباً، شركة النور للتجارة" : "Welcome, Al-Noor Trading Co."}
                  </h1>
                  <p className="mt-1 hidden text-sm text-slate-500 sm:block">
                    {lang === "ar" ? "تابع طلباتك، الموردين المحفوظين، والتنبيهات من مكان واحد." : "Track orders, saved suppliers, and alerts—all in one place."}
                  </p>
                </div>
              </div>

              {/* Right-side action buttons */}
              <div className="flex items-center gap-2">
                {/* Search input – compact on mobile */}
                <div className="relative w-full md:w-64 lg:w-80">
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pr-10 pl-4 text-sm outline-none transition focus:border-[#1e3a8a] focus:bg-white placeholder:text-slate-400"
                    placeholder={lang === "ar" ? "ابحث عن طلب أو مورد..." : "Search orders or suppliers..."}
                  />
                  <svg className="absolute right-3.5 top-2.5 h-4.5 w-4.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 21l-5.2-5.2m2.2-5.3a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z" />
                  </svg>
                </div>

                {/* NOTIFICATION BELL – mobile only */}
                <button
                  aria-label="Notifications"
                  className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white shadow-md transition hover:bg-[#1e3a8a] lg:hidden"
                >
                  <SidebarIcon path="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 0 1-6 0" />
                  {/* Badge */}
                  <span className="absolute top-2 left-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-slate-950" />
                </button>

                {/* LANGUAGE TOGGLE BUTTON – visible on all screens */}
                <button
                  onClick={toggleLang}
                  className="shrink-0 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm transition hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
                >
                  <span className="font-sans">{lang === "ar" ? "EN" : "عربي"}</span>
                </button>

                {/* PROFILE AVATAR BUTTON – mobile only */}
                <button
                  onClick={() => setActiveTab("الملف الشخصي")}
                  aria-label={lang === "ar" ? "الملف الشخصي" : "Profile"}
                  className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 active:translate-y-0 lg:hidden"
                >
                  ن
                </button>
              </div>
            </div>
          </header>

          {/* STATS GRID – 2 cols mobile, 4 cols desktop */}
          <section className="grid grid-cols-2 gap-3 lg:gap-4 xl:grid-cols-4">
            {stats.map((stat) =>
              stat.highlight ? (
                // Highlighted "Total Savings" card
                <div
                  key={stat.label}
                  className="relative overflow-hidden rounded-2xl lg:rounded-[1.75rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-500 to-teal-600 p-4 lg:p-5 shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5"
                >
                  {/* Decorative glow */}
                  <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                  <div className="relative flex items-center justify-between">
                    <p className="text-xs font-semibold text-emerald-50 lg:text-sm">{stat.label}</p>
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 text-emerald-50 lg:h-8 lg:w-8">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </span>
                  </div>
                  <div className="relative mt-3 flex items-end justify-between">
                    <span className="text-2xl font-extrabold tracking-tight text-white lg:text-4xl">{stat.value}</span>
                    <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-extrabold text-white lg:px-3 lg:py-1 lg:text-xs">{stat.change}</span>
                  </div>
                </div>
              ) : (
                <div key={stat.label} className="rounded-2xl lg:rounded-[1.75rem] border border-white/70 bg-white/90 p-4 lg:p-5 shadow-lg shadow-slate-200/50 transition hover:-translate-y-0.5">
                  <p className="text-xs font-semibold text-slate-500 lg:text-sm">{stat.label}</p>
                  <div className="mt-3 flex items-end justify-between">
                    <span className="text-2xl font-extrabold tracking-tight text-slate-950 lg:text-4xl">{stat.value}</span>
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold text-[#1e3a8a] lg:px-3 lg:py-1 lg:text-xs">{stat.change}</span>
                  </div>
                </div>
              )
            )}
          </section>

          {/* ORDERS + DELIVERIES ROW */}
          <section className="grid grid-cols-1 gap-4 lg:gap-5 xl:grid-cols-[1.35fr_0.9fr]">
            {/* Recent Orders Card */}
            <div className="rounded-2xl lg:rounded-[2rem] border border-white/70 bg-white/90 p-4 lg:p-5 shadow-xl shadow-slate-200/60">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold lg:text-xl">{lang === "ar" ? "آخر الطلبات" : "Recent Orders"}</h2>
                  <p className="mt-0.5 text-xs text-slate-500 lg:text-sm">{lang === "ar" ? "نظرة سريعة على أحدث عمليات الشراء" : "Quick look at your latest purchases"}</p>
                </div>
                <button onClick={() => setActiveTab("الطلبات")} className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-[#1e3a8a] hover:text-white lg:px-4 lg:py-2 lg:text-sm">
                  {lang === "ar" ? "عرض الكل" : "View All"}
                </button>
              </div>

              <div className="-mx-1 overflow-x-auto pb-1">
                <div className="min-w-[520px]">
                  {/* Table header — hidden on very small screens */}
                  <div className="hidden grid-cols-5 bg-slate-50 rounded-t-2xl px-4 py-3 text-xs font-extrabold text-slate-400 md:grid">
                    <span>{lang === "ar" ? "رقم الطلب" : "Order #"}</span>
                    <span>{lang === "ar" ? "المورد" : "Supplier"}</span>
                    <span>{lang === "ar" ? "الفئة" : "Category"}</span>
                    <span>{lang === "ar" ? "المبلغ" : "Amount"}</span>
                    <span>{lang === "ar" ? "الحالة" : "Status"}</span>
                  </div>
                  {orders.map((order) => (
                    <div key={order.id} className="group grid gap-3 border-t border-slate-100 px-4 py-3.5 text-sm md:grid-cols-5 md:items-center">
                      <div className="font-extrabold text-[#1e3a8a]">{order.id}</div>
                      <div>
                        <div className="font-bold text-slate-800">{order.supplier}</div>
                        {/* Show category below on mobile like a sub-line */}
                        <div className="md:hidden mt-1 text-xs text-slate-400">{order.category}</div>
                      </div>
                      <div className="hidden text-slate-500 md:block">{order.category}</div>
                      <div className="font-bold">{order.amount}</div>
                      <div>
                        <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-extrabold ${order.tone}`}>{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Deliveries Card */}
            <div className="rounded-2xl lg:rounded-[2rem] border border-white/70 bg-slate-950 p-4 lg:p-5 text-white shadow-xl shadow-slate-200/60">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold lg:text-xl">{lang === "ar" ? "التوصيلات النشطة" : "Active Deliveries"}</h2>
                  <p className="mt-0.5 text-xs text-white/50 lg:text-sm">{lang === "ar" ? "تحديث مباشر لحالة الشحنات" : "Real-time shipment updates"}</p>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-bold text-emerald-300 lg:px-3 lg:text-xs">LIVE</span>
              </div>

              <div className="space-y-3.5">
                {deliveries.map((delivery) => (
                  <div key={delivery.title} className="rounded-xl lg:rounded-[1.4rem] bg-white/[0.06] p-4 ring-1 ring-white/10">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold">{delivery.title}</p>
                        <p className="mt-0.5 text-[11px] text-white/45 lg:text-xs">{delivery.place}</p>
                      </div>
                      <span className="text-xs font-extrabold text-blue-200 lg:text-sm">{delivery.progress}%</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-l from-blue-300 to-emerald-300 transition-all duration-700 ease-out"
                        style={{ width: `${delivery.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SAVED SUPPLIERS + ALERTS ROW */}
          <section className="grid grid-cols-1 gap-4 lg:gap-5 xl:grid-cols-3">
            {/* Saved Suppliers – spans 2 cols on desktop */}
            <div className="rounded-2xl lg:rounded-[2rem] border border-white/70 bg-white/90 p-4 lg:p-5 shadow-xl shadow-slate-200/60 xl:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold lg:text-xl">{lang === "ar" ? "موردون محفوظون" : "Saved Suppliers"}</h2>
                  <p className="mt-0.5 text-xs text-slate-500 lg:text-sm">{lang === "ar" ? "أفضل الموردين حسب مشترياتك الأخيرة" : "Top suppliers based on recent purchases"}</p>
                </div>
                <button onClick={() => setActiveTab("المحفوظة")} className="text-xs font-extrabold text-[#1e3a8a] hover:underline lg:text-sm">
                  {lang === "ar" ? "إدارة" : "Manage"}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {["Al-Salam Foods", "TechHub Electronics", "Nour Fashion"].map((supplier, index) => (
                  <div key={supplier} className="rounded-2xl lg:rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-[#1e3a8a] hover:bg-white cursor-pointer group">
                    <div className="mb-3 grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-base font-extrabold text-[#1e3a8a] shadow-sm lg:h-12 lg:w-12 lg:text-lg">
                      {index + 1}
                    </div>
                    <p className="font-extrabold text-sm lg:text-base truncate">{supplier}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 lg:text-xs">⭐ 4.{9 - index}/5</p>
                    <button className="mt-3.5 w-full rounded-2xl bg-white py-2 text-[11px] font-extrabold text-slate-600 shadow-sm transition group-hover:bg-[#1e3a8a] group-hover:text-white lg:py-2.5 lg:text-xs">
                      {lang === "ar" ? "طلب سريع" : "Quick Order"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Alerts */}
            <div className="rounded-2xl lg:rounded-[2rem] border border-white/70 bg-white/90 p-4 lg:p-5 shadow-xl shadow-slate-200/60">
              <h2 className="text-lg font-extrabold lg:text-xl">{lang === "ar" ? "تنبيهات مهمة" : "Important Alerts"}</h2>
              <div className="mt-4 space-y-2.5">
                {(lang === "ar" ? [
                  "فاتورة TR-2481 جاهزة للدفع",
                  "مورد جديد متاح في فئة المشروبات",
                  "تم تحديث موعد توصيل شحنة جدة",
                ] : [
                  "Invoice TR-2481 ready for payment",
                  "New supplier available in Beverages",
                  "Jeddah shipment delivery time updated",
                ]).map((alert) => (
                  <div key={alert} className="rounded-xl lg:rounded-[1.25rem] bg-blue-50 p-3.5 text-xs font-semibold text-slate-700 leading-relaxed lg:p-4 lg:text-sm">
                    🔔 {alert}
                  </div>
                ))}
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* ===== BOTTOM NAVIGATION BAR – MOBILE ONLY ===== */}
      <nav className="fixed inset-x-0 bottom-0 z-50 safe-area-pb lg:hidden">
        {/* subtle gradient fade up from nav into content area */}
        <div className="pointer-events-none absolute -inset-x-0 -top-6 h-6 bg-gradient-to-t from-white/95 to-transparent" />
        <div className="border-t border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-[0_-4px_30px_rgba(0,0,0,.06)]">
          <div className="mx-auto flex h-16 max-w-[1500px] items-stretch justify-around px-1">
            {bottomNavTabs.map((tab) => {
              const active = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className="group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5"
                >
                  {/* Active pill highlight behind icon */}
                  {active && (
                    <span className="absolute -top-1.5 mx-auto h-1 w-7 rounded-full bg-[#1e3a8a]" />
                  )}
                  <SidebarIcon
                    path={tab.icon}
                    className={`${active ? "text-[#1e3a8a]" : "text-slate-400 group-active:text-[#1e3a8a] transition-colors"} ${!active && "scale-110 opacity-60"}`}
                  />
                  <span className={`[11px] font-extrabold tracking-tight ${
                    active
                      ? "text-[#1e3a8a]"
                      : "text-[11px] font-semibold text-slate-400 group-active:text-[#1e3a8a]"
                  }`}>
                    {/* Shortened names for mobile bottom bar */}
                    {tab.name === "الرئيسية" ? (lang === "ar" ? "الرئيسية" : "Home") :
                     tab.name === "الطلبات" ? (lang === "ar" ? "طلبات" : "Orders") :
                     tab.name === "المحفوظة" ? (lang === "ar" ? "محفوظة" : "Saved") :
                     tab.name === "إنشاء" ? (lang === "ar" ? "طلب جديد" : "New Order") :
                     tab.name === "التنبيهات" ? (lang === "ar" ? "تنبيهات" : "Alerts")
                     : tab.name}
                  </span>
                </button>
              );
            })}

            {/* More menu item for tabs not shown in bottom nav */}
            <button
              className="group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5"
            >
              <SidebarIcon path="M19 8H5m14 0V6a2 2 0 00-2-2H7a2 2 0 00-2 2v2m14 0v12a2 2 0 01-2 2H7a2 2 0 01-2-2V8m14 0H5m14 0v12a2 2 0 01-2 2H7a2 2 0 01-2-2V8" className="text-slate-400 scale-110 opacity-60" />
              <span className="[11px] font-semibold text-slate-400">{lang === "ar" ? "المزيد" : "More"}</span>
            </button>
          </div>
        </div>
        {/* Safe area padding for notch devices */}
        <div className="h-safe-area-inset-bottom" />
      </nav>
    </div>
  );
}
