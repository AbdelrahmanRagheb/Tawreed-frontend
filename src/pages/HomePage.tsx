import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n";

import {
  Globe2,
  Menu,
  X,
  ArrowRight,
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
  TrendingUp,
  ArrowUpRight,
  Check,
  ShieldAlert,
  Award,
  Landmark,
} from "lucide-react";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function HomePage() {
  const { language, setLanguage, t } = useLanguage();
  const isRTL = language === "ar";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
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
              <div className="flex items-center justify-between px-4 pt-1">
                <button
                  onClick={() => {
                    setLanguage(language === "ar" ? "en" : "ar");
                    setMenuOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-all"
                >
                  <Globe2 className="w-3.5 h-3.5" />
                  {language === "ar" ? "English" : "العربية"}
                </button>
                <div className="flex items-center gap-2">
                  <Link
                    to="/auth/login"
                    onClick={() => setMenuOpen(false)}
                    className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all"
                  >
                    {t("login")}
                  </Link>
                  <Link
                    to="/auth/register"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all"
                  >
                    {t("createAccount")}
                  </Link>
                </div>
              </div>
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

            {/* Right Column (Visual / Interactive Dashboard Mockup) */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500 to-emerald-500 rounded-3xl opacity-10 blur-xl pointer-events-none" />

              <div className="relative rounded-2xl bg-slate-900 text-slate-100 p-5 sm:p-6 shadow-2xl border border-slate-800">
                {/* Simulated UI Window Bar */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-2xs font-mono text-slate-500">
                    tawreed-dashboard-v2
                  </span>
                </div>

                {/* Simulated Dashboard Content */}
                <div className="space-y-4">
                  {/* Metric Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-850/60 border border-slate-800 rounded-xl p-3.5">
                      <p className="text-2xs font-semibold text-slate-400 mb-0.5">
                        {language === "ar" ? "توفير التكاليف" : "Cost Savings"}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-white">
                          24.5%
                        </span>
                        <span className="text-3xs text-emerald-400 font-bold flex items-center">
                          ↑ 4%
                        </span>
                      </div>
                    </div>
                    <div className="bg-slate-850/60 border border-slate-800 rounded-xl p-3.5">
                      <p className="text-2xs font-semibold text-slate-400 mb-0.5">
                        {language === "ar" ? "سرعة التوريد" : "Lead Time"}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-white">
                          -1.8 {language === "ar" ? "يوم" : "days"}
                        </span>
                        <span className="text-3xs text-emerald-400 font-bold">
                          ✓ {language === "ar" ? "أسرع" : "Optimal"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Simulated List Item */}
                  <div className="bg-slate-850/60 border border-slate-800 rounded-xl p-3.5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-2xs font-bold text-slate-300">
                        {language === "ar"
                          ? "طلبات عروض الأسعار النشطة"
                          : "Active RFQs"}
                      </span>
                      <span className="px-2 py-0.5 text-3xs font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {language === "ar" ? "قيد المراجعة" : "Matching"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                          <span className="font-medium text-slate-200">
                            {language === "ar"
                              ? "ألواح حديد صناعي"
                              : "Industrial Steel Plates"}
                          </span>
                        </div>
                        <span className="text-3xs font-mono text-slate-400">
                          14 {language === "ar" ? "طن" : "Tons"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="font-medium text-slate-200">
                            {language === "ar"
                              ? "أسمنت بورتلاندي"
                              : "Portland Cement"}
                          </span>
                        </div>
                        <span className="text-3xs font-mono text-slate-400">
                          250 {language === "ar" ? "طن" : "Tons"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mini status visual */}
                  <div className="flex items-center gap-3 bg-indigo-950/40 border border-indigo-900/40 rounded-xl p-3 text-xs">
                    <div className="w-8 h-8 rounded-lg bg-indigo-900/60 flex items-center justify-center shrink-0 text-indigo-400">
                      <TrendingUp className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-200 truncate">
                        {language === "ar"
                          ? "توصيل عروض أسعار فوري"
                          : "Automated Bidding Live"}
                      </p>
                      <p className="text-3xs text-slate-400 truncate">
                        {language === "ar"
                          ? "مقارنة الأسعار مع ضمان الأمان"
                          : "Secure commercial offers matched"}
                      </p>
                    </div>
                    <ArrowUpRight className="w-4.5 h-4.5 text-slate-500 shrink-0" />
                  </div>
                </div>
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
