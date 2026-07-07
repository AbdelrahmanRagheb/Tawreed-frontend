import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage, toArabicNumeral } from "../i18n";
import { useAuth } from "../contexts/AuthContext";

import {
  Globe2,
  Menu,
  X,
  ArrowRight,
  LayoutDashboard,
  Sparkles,
  Truck,
  BarChart3,
  ShieldCheck,
  ShoppingCart,
  Package,
  Building2,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Star,
  Zap,
  Check,
  ShieldAlert,
  Award,
  Landmark,
  Search,
} from "lucide-react";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function HomePage() {
  const { language, setLanguage, t } = useLanguage();
  const isRTL = language === "ar";
  const { user, role } = useAuth();
  const isLoggedIn = !!user;
  const dashboardUrl = role === 'admin' ? '/admin' : role === 'buyer' ? '/buyer' : role === 'supplier' ? '/supplier' : '/delivery';
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [previewTab, setPreviewTab] = useState("orders");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: t("homeFeature1Title"),
      desc: fomatText(t("homeFeature1Desc")),
      color: "bg-indigo-50 text-indigo-600 border-indigo-100/50",
    },
    {
      icon: Truck,
      title: t("homeFeature2Title"),
      desc: fomatText(t("homeFeature2Desc")),
      color: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
    },
    {
      icon: BarChart3,
      title: t("homeFeature3Title"),
      desc: fomatText(t("homeFeature3Desc")),
      color: "bg-amber-50 text-amber-600 border-amber-100/50",
    },
    {
      icon: ShieldCheck,
      title: t("homeFeature4Title"),
      desc: fomatText(t("homeFeature4Desc")),
      color: "bg-blue-50 text-blue-600 border-blue-100/50",
    },
  ];

  // Utility to handle clean typography strings
  function fomatText(text: string) {
    return text || "";
  }

  const steps = [
    {
      step: "01",
      icon: Zap,
      title: t("homeStep1Title"),
      desc: t("homeStep1Desc"),
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      step: "02",
      icon: Building2,
      title: t("homeStep2Title"),
      desc: t("homeStep2Desc"),
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      step: "03",
      icon: Star,
      title: t("homeStep3Title"),
      desc: t("homeStep3Desc"),
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
  ];

  // Pre-launch core pillars replacing numeric stats
  const pillars = [
    {
      icon: ShieldCheck,
      title:
        language === "ar" ? "التحقق الكامل للموردين" : "100% Vetted Suppliers",
      desc:
        language === "ar"
          ? "نقوم بمراجعة كافة السجلات التجارية والبطاقات الضريبية لضمان قانونية التعاملات."
          : "We verify all commercial registries and tax cards to ensure complete compliance.",
    },
    {
      icon: Award,
      title:
        language === "ar" ? "ضمان الجودة والشفافية" : "Quality & Transparency",
      desc:
        language === "ar"
          ? "أسعار تنافسية مباشرة من المصنعين والموزعين المعتمدين دون وسيط."
          : "Direct factory and distributor pricing with clear terms and zero hidden fees.",
    },
    {
      icon: Truck,
      title:
        language === "ar"
          ? "تغطية واسعة لكافة المحافظات"
          : "Nationwide Coverage",
      desc:
        language === "ar"
          ? "شبكة لوجستية مرنة تغطي كافة أقاليم ومحافظات جمهورية مصر العربية."
          : "Flexible shipping and delivery options reaching all regions and governorates across Egypt.",
    },
    {
      icon: Landmark,
      title:
        language === "ar"
          ? "التوافق مع اللوائح المحلية"
          : "Regulatory Compliance",
      desc:
        language === "ar"
          ? "منصة مصممة للتوافق الكامل مع منظومة الفاتورة الإلكترونية واللوائح المصرية."
          : "Fully aligned with local business practices and modern e-invoicing standards.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* ════════════ NAVBAR ════════════ */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <img
                src="/tawreed-logo.png"
                alt="Tawreed"
                className="h-14 sm:h-16 w-auto transition-transform duration-300 group-hover:scale-102"
              />
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200/40">
              {[
                { id: "features", label: t("homeNavFeatures") },
                { id: "how", label: t("homeNavHow") },
                {
                  id: "why-tawreed",
                  label: language === "ar" ? "لماذا توريد؟" : "Why Tawreed?",
                },
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-white rounded-full transition-all duration-200"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Desktop right actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all shadow-sm"
              >
                <Globe2 className="w-3.5 h-3.5" />
                {language === "ar" ? "English" : "العربية"}
              </button>

              {isLoggedIn ? (
                <Link
                  to={dashboardUrl}
                  className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-600/10 hover:shadow-md hover:shadow-indigo-600/20 active:scale-98"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  {t("dashboard")}
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-all"
                  >
                    {t("login")}
                  </Link>

                  <Link
                    to="/auth/register"
                    className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-600/10 hover:shadow-md hover:shadow-indigo-600/20 active:scale-98"
                  >
                    {t("createAccount")}
                    <ArrowRight
                      className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`}
                    />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile right actions */}
            <div className="md:hidden flex items-center gap-1.5">
              <button
                onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-[11px] font-semibold transition-all"
              >
                <Globe2 className="w-3.5 h-3.5" />
                {language === "ar" ? "English" : "العربية"}
              </button>

              {isLoggedIn ? (
                <Link
                  to={dashboardUrl}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all active:scale-98"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  {t("dashboard")}
                </Link>
              ) : (
                <Link
                  to="/auth/login"
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-all"
                >
                  {t("login")}
                </Link>
              )}

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                aria-label={menuOpen ? t("closeMenu") : t("menu")}
              >
                {menuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white animate-fadeIn shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {["features", "how"].map((id) => (
                <button
                  key={id}
                  onClick={() => {
                    scrollTo(id);
                    setMenuOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all ${isRTL ? "text-right" : "text-left"}`}
                >
                  {t(
                    `homeNav${id.charAt(0).toUpperCase() + id.slice(1)}` as any,
                  )}
                </button>
              ))}
              <button
                onClick={() => {
                  scrollTo("why-tawreed");
                  setMenuOpen(false);
                }}
                className={`w-full px-4 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all ${isRTL ? "text-right" : "text-left"}`}
              >
                {language === "ar" ? "لماذا توريد؟" : "Why Tawreed?"}
              </button>
              <hr className="border-slate-100 my-2" />
              {!isLoggedIn && (
                <Link
                  to="/auth/register"
                  onClick={() => setMenuOpen(false)}
                  className="w-full px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all text-center block"
                >
                  {t("createAccount")}
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ════════════ HERO ════════════ */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-20 sm:pb-32 bg-white">
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-indigo-50/20 to-transparent pointer-events-none" />
        <div className="absolute top-1/4 right-5 w-72 h-72 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-5 w-72 h-72 bg-emerald-100/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column (Copy) */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left rtl:lg:text-right">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 border border-indigo-100/60 rounded-full text-xs font-bold text-indigo-700 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>
                  {language === "ar"
                    ? "المنصة الرائدة في مصر للمشتريات والتوريد"
                    : "Egypt's leading procurement & supply platform"}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6.5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                {t("homeHeroTitle")}{" "}
                <span className="relative inline-block text-indigo-600">
                  {t("homeHeroHighlight")}
                  <span className="absolute left-0 rtl:right-0 bottom-1 w-full h-[6px] bg-indigo-100 -z-10 rounded-full" />
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {t("homeHeroSub")}
              </p>

              <div className="flex flex-col sm:flex-row ">
                <Link
                  to="/auth/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-600/10 hover:shadow-md active:scale-98"
                >
                  {t("homeGetStarted")}
                  <ArrowRight
                    className={`w-4.5 h-4.5 ${isRTL ? "rotate-180" : ""}`}
                  />
                </Link>
                <button
                  onClick={() => scrollTo("features")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-98"
                >
                  {t("homeLearnMore")}
                  <ChevronRight
                    className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap  gap-x-6 gap-y-3">
                {[
                  {
                    icon: CheckCircle2,
                    text:
                      language === "ar"
                        ? "موردين موثوقين"
                        : "Verified Suppliers",
                  },
                  {
                    icon: ShieldCheck,
                    text:
                      language === "ar" ? "مدفوعات آمنة" : "Secure Payments",
                  },
                  {
                    icon: Truck,
                    text: language === "ar" ? "تسليم سريع" : "Fast Delivery",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500"
                  >
                    <item.icon className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column — Live App Preview */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500 to-emerald-500 rounded-3xl opacity-10 blur-xl pointer-events-none" />

              <div className="relative rounded-[2rem] bg-white/85 backdrop-blur-xl border border-white/70 p-5 sm:p-6 shadow-2xl shadow-slate-200/70">
                {/* Tabs */}
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-5">
                  {[
                    { key: "orders", label: language === "ar" ? "الطلبات" : "Orders" },
                    { key: "products", label: language === "ar" ? "المنتجات" : "Products" },
                    { key: "tracking", label: language === "ar" ? "التتبع" : "Tracking" },
                  ].map((tab) => (
                    <PreviewTab
                      key={tab.key}
                      active={previewTab === tab.key}
                      label={tab.label}
                      onClick={() => setPreviewTab(tab.key)}
                    />
                  ))}
                </div>

                {previewTab === "orders" && <OrdersPreview language={language} toArabicNumeral={toArabicNumeral} />}
                {previewTab === "products" && <ProductsPreview language={language} toArabicNumeral={toArabicNumeral} />}
                {previewTab === "tracking" && <TrackingPreview language={language} toArabicNumeral={toArabicNumeral} />}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ FEATURES (High Readability Grid) ════════════ */}
      <section
        id="features"
        className="py-10 sm:py-28 bg-slate-50/50 border-y border-slate-100 scroll-mt-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 max-w-2xl mx-auto">
            <span className="inline-block px-3  bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg mb-4 uppercase tracking-wider">
              {language === "ar" ? "المميزات الرئيسية" : "Key Features"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {t("homeFeaturesTitle")}
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              {t("homeFeaturesSub")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((f, idx) => (
              <div
                key={idx}
                className="group bg-white border border-slate-200/75 hover:border-indigo-200 rounded-2xl p-6 sm:p-8 hover:shadow-xl hover:shadow-indigo-500/[0.02] transition-all duration-300"
              >
                <div className="flex gap-5 items-start">
                  <div
                    className={`w-12 h-12 rounded-xl ${f.color} border flex items-center justify-center shrink-0`}
                  >
                    <f.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ HOW IT WORKS ════════════ */}
      <section id="how" className="py-20 sm:py-28 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg mb-4 uppercase tracking-wider">
              {language === "ar" ? "طريقة العمل" : "How It Works"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {t("homeHowTitle")}
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              {t("homeHowSub")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((s, i) => (
              <div key={s.step} className="relative group">
                {/* Visual Connector Line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-0.5 bg-slate-200" />
                )}

                <div className="bg-slate-50/50 border border-slate-200/75 rounded-2xl p-6.5 sm:p-8 text-center relative hover:shadow-md transition-all duration-300">
                  <div
                    className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center mx-auto mb-6 border`}
                  >
                    <s.icon className="w-5.5 h-5.5" />
                  </div>
                  <div className="absolute top-4 right-4 text-xs font-black tracking-tight text-slate-300 group-hover:text-indigo-600 transition-colors">
                    {s.step}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ VALUE PILLARS (Replaces Stats) ════════════ */}
      <section
        id="why-tawreed"
        className="py-20 sm:py-28 bg-slate-50 border-y border-slate-200/50 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg mb-4 uppercase tracking-wider">
              {language === "ar" ? "مبادئنا الأساسية" : "Platform Pillars"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {language === "ar"
                ? "مبنية على الثقة والجودة والالتزام"
                : "Built for Trust & Compliance"}
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              {language === "ar"
                ? "نلتزم بتوفير شبكة توريد آمنة لضمان استمرارية أعمالك ونموها في السوق المصري."
                : "We provide a secure, compliant procurement ecosystem designed to scale your business in Egypt."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <pillar.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ CTA (Softer, Low-Contrast Theme) ════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-slate-50 border border-slate-200/80 text-slate-900 px-8 py-12 sm:py-16 text-center">
            {/* Visual background accents (Very soft, non-irritating) */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -top-20 w-80 h-80 bg-slate-100 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                {t("homeCTATitle")}
              </h2>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-lg mx-auto">
                {t("homeCTASub")}
              </p>
              <div className="pt-4">
                <Link
                  to="/auth/register"
                  className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm shadow-indigo-600/10 active:scale-98"
                >
                  {t("homeCTAButton")}
                  <ArrowRight
                    className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ FOOTER (Unified Dark Theme) ════════════ */}
      <footer className="bg-[#0B0F19] border-t border-slate-800 text-slate-450">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start pb-12 border-b border-slate-800/80">
            {/* Left side brand info */}
            <div className="md:col-span-5 space-y-4">
              <img
                src="/tawreed-logo.png"
                alt="Tawreed"
                className="h-16 w-auto brightness-0 invert"
              />
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                {language === "ar"
                  ? "منصة مصر الأولى لتسهيل عمليات التوريد والمشتريات الحكومية والخاصة بذكاء وأمان."
                  : "Egypt's premier procurement platform connecting smart buyers with vetted suppliers securely."}
              </p>
            </div>

            {/* Quick links */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-white">
                  {language === "ar" ? "المنصة" : "Platform"}
                </p>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li>
                    <button
                      onClick={() => scrollTo("features")}
                      className="hover:text-indigo-400 transition-colors"
                    >
                      {t("homeNavFeatures")}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollTo("how")}
                      className="hover:text-indigo-400 transition-colors"
                    >
                      {t("homeNavHow")}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollTo("why-tawreed")}
                      className="hover:text-indigo-400 transition-colors"
                    >
                      {language === "ar" ? "المميزات" : "Why Us"}
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-white">
                  {language === "ar" ? "القوانين" : "Legal"}
                </p>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li>
                    <a
                      href="#"
                      className="hover:text-indigo-400 transition-colors"
                    >
                      {t("homeFooterPrivacy")}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-indigo-400 transition-colors"
                    >
                      {t("homeFooterTerms")}
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 col-span-2 sm:col-span-1">
                <p className="text-xs font-bold uppercase tracking-wider text-white">
                  {language === "ar" ? "الدعم" : "Support"}
                </p>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li>
                    <a
                      href="#"
                      className="hover:text-indigo-400 transition-colors"
                    >
                      {t("homeFooterContact")}
                    </a>
                  </li>
                  <li className="flex items-center gap-1.5 text-3xs text-slate-500 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>
                      {language === "ar"
                        ? "متاحين على مدار الساعة"
                        : "System Operational"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright Row */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              &copy; {new Date().getFullYear()} {t("appTitle")}.{" "}
              {t("homeFooterRights")}
            </p>
            <p className="text-3xs text-slate-600">
              {language === "ar"
                ? "صنع بعناية للمشتريات الحديثة"
                : "Built for modern procurement"}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PreviewTab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
        active
          ? "bg-gradient-to-l from-[#1e3a8a] to-[#2563eb] text-white shadow-md"
          : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {label}
    </button>
  );
}

function OrdersPreview({ language, toArabicNumeral }: { language: string; toArabicNumeral: (s: string, l: string) => string }) {
  const items = [
    { name: language === "ar" ? "أرز بسمتي" : "Basmati Rice", qty: 50, price: 38 },
    { name: language === "ar" ? "سكر" : "Sugar", qty: 100, price: 22 },
    { name: language === "ar" ? "زيت طعام" : "Cooking Oil", qty: 30, price: 46 },
    { name: language === "ar" ? "دقيق قمح" : "Wheat Flour", qty: 75, price: 18 },
  ];
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr_60px_70px] gap-2 text-xs text-slate-400 pb-2 border-b border-slate-100">
        <span className="font-semibold text-slate-700">{language === "ar" ? "المنتج" : "Product"}</span>
        <span className="font-semibold text-slate-700 text-center">{language === "ar" ? "الكمية" : "Qty"}</span>
        <span className="font-semibold text-slate-700 text-right">{language === "ar" ? "السعر" : "Price"}</span>
      </div>
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-[1fr_60px_70px] gap-2 text-sm py-1.5">
          <span className="font-medium text-slate-900 truncate">{item.name}</span>
          <span className="font-semibold text-slate-900 text-center">{toArabicNumeral(String(item.qty), language)}</span>
          <span className="font-bold text-[#1e3a8a] text-right">{toArabicNumeral(String(item.price), language)}</span>
        </div>
      ))}
      <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-500">{language === "ar" ? "إجمالي القيمة" : "Total Value"}</span>
        <span className="text-lg font-extrabold text-[#1e3a8a]">{toArabicNumeral(total.toLocaleString(), language)} {language === "ar" ? "ج.م" : "EGP"}</span>
      </div>
      <button className="w-full py-2.5 text-xs font-bold text-white bg-gradient-to-l from-[#1e3a8a] to-[#2563eb] rounded-xl shadow-md shadow-blue-900/20 hover:shadow-lg transition">
        {language === "ar" ? "تقديم الطلب" : "Submit Order"}
      </button>
    </div>
  );
}

function ProductsPreview({ language, toArabicNumeral }: { language: string; toArabicNumeral: (s: string, l: string) => string }) {
  const products = [
    { name: language === "ar" ? "أرز بسمتي هندي" : "Indian Basmati Rice", price: 38, unit: language === "ar" ? "كجم" : "kg" },
    { name: language === "ar" ? "سكر أبيض" : "White Sugar", price: 22, unit: language === "ar" ? "كجم" : "kg" },
    { name: language === "ar" ? "زيت عباد شمس" : "Sunflower Oil", price: 46, unit: language === "ar" ? "لتر" : "L" },
    { name: language === "ar" ? "دقيق قمح فاخر" : "Premium Wheat Flour", price: 18, unit: language === "ar" ? "كجم" : "kg" },
    { name: language === "ar" ? "عدس أصفر" : "Yellow Lentils", price: 28, unit: language === "ar" ? "كجم" : "kg" },
    { name: language === "ar" ? "مكرونة" : "Pasta", price: 14, unit: language === "ar" ? "كجم" : "kg" },
  ];

  return (
    <div className="space-y-2">
      <div className="relative mb-3">
        <input
          type="text"
          placeholder={language === "ar" ? "ابحث عن منتج..." : "Search product..."}
          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] placeholder:text-slate-400"
        />
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
      </div>
      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {products.map((p, i) => (
          <div key={i} className="border border-slate-100 rounded-xl p-3 hover:border-indigo-200 hover:shadow-sm transition cursor-pointer">
            <p className="text-xs font-semibold text-slate-900 truncate">{p.name}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {toArabicNumeral(String(p.price), language)} {language === "ar" ? "ج.م" : "EGP"} / {p.unit}
            </p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-3xs text-slate-400">{language === "ar" ? "متوفر" : "In Stock"}</span>
              </div>
              <span className="text-3xs font-bold text-[#1e3a8a]">{language === "ar" ? "+ أضف" : "+ Add"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrackingPreview({ language, toArabicNumeral }: { language: string; toArabicNumeral: (s: string, l: string) => string }) {
  const STEPS = ["Pending", "PickedUp", "OutForDelivery", "Delivered"] as const;

  const stepLabels: Record<string, { en: string; ar: string }> = {
    Pending: { en: "Pending", ar: "قيد الانتظار" },
    PickedUp: { en: "Picked Up", ar: "تم الاستلام" },
    OutForDelivery: { en: "Out for Delivery", ar: "قيد التوصيل" },
    Delivered: { en: "Delivered", ar: "تم التسليم" },
  };

  const currentStepIndex = 2;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-slate-900">{language === "ar" ? "توصيلة #٢٤١" : "Delivery #241"}</p>
        <span className="px-2 py-0.5 text-3xs font-bold bg-amber-100 text-amber-700 rounded-full">
          {language === "ar" ? "قيد التوصيل" : "On Route"}
        </span>
      </div>

      <div className="flex items-center">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div key={step} className="flex-1 flex flex-col items-center relative">
              {idx > 0 && (
                <div
                  className={`absolute top-2.5 w-full h-0.5 -translate-y-1/2 ${
                    language === "ar" ? "left-1/2" : "right-1/2"
                  } ${
                    isCompleted
                      ? "bg-emerald-500"
                      : isCurrent
                        ? "bg-amber-400"
                        : "bg-slate-200"
                  }`}
                />
              )}
              <div className={`w-5 h-5 rounded-full flex items-center justify-center z-10 ${
                isCompleted
                  ? "bg-emerald-500 text-white"
                  : isCurrent
                    ? "bg-amber-400 text-white ring-4 ring-amber-100"
                    : "bg-slate-200"
              }`}>
                {isCompleted ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <div className={`w-2 h-2 rounded-full ${isCurrent ? "bg-white" : "bg-slate-400"}`} />
                )}
              </div>
              <p className={`text-3xs mt-1.5 text-center whitespace-nowrap ${
                isCompleted
                  ? "text-emerald-700 font-semibold"
                  : isCurrent
                    ? "text-amber-700 font-semibold"
                    : "text-slate-400"
              }`}>
                {stepLabels[step]?.[language === "ar" ? "ar" : "en"] || step}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-2">
        <div className="flex justify-between">
          <span className="text-slate-500">{language === "ar" ? "تاريخ التوصيل" : "Delivery Date"}</span>
          <span className="font-semibold text-slate-900">15 {language === "ar" ? "يوليو" : "Jul"} 2026</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">{language === "ar" ? "مندوب التوصيل" : "Delivery Person"}</span>
          <span className="font-semibold text-slate-900">{language === "ar" ? "محمود سعيد" : "Mahmoud Saeed"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">{language === "ar" ? "رمز التحقق" : "Verification Code"}</span>
          <span className="font-bold text-[#1e3a8a] tracking-widest">{toArabicNumeral("588810", language)}</span>
        </div>
      </div>
    </div>
  );
}
