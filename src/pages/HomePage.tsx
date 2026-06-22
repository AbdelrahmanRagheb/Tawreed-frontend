import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';

import {
  Globe2, Menu, X, ArrowRight, Sparkles, Truck, BarChart3, ShieldCheck,
  ShoppingCart, Package, Building2, MapPin, ChevronRight, CheckCircle2, Star, Zap,
} from 'lucide-react';

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export function HomePage() {
  const { language, setLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    { icon: Sparkles, title: t('homeFeature1Title'), desc: t('homeFeature1Desc'), color: 'bg-indigo-50 text-indigo-600' },
    { icon: Truck, title: t('homeFeature2Title'), desc: t('homeFeature2Desc'), color: 'bg-emerald-50 text-emerald-600' },
    { icon: BarChart3, title: t('homeFeature3Title'), desc: t('homeFeature3Desc'), color: 'bg-amber-50 text-amber-600' },
    { icon: ShieldCheck, title: t('homeFeature4Title'), desc: t('homeFeature4Desc'), color: 'bg-blue-50 text-blue-600' },
  ];

  const steps = [
    { step: '01', icon: Zap, title: t('homeStep1Title'), desc: t('homeStep1Desc'), color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    { step: '02', icon: Building2, title: t('homeStep2Title'), desc: t('homeStep2Desc'), color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { step: '03', icon: Star, title: t('homeStep3Title'), desc: t('homeStep3Desc'), color: 'bg-amber-50 text-amber-600 border-amber-200' },
  ];

  const stats = [
    { value: '1,200+', label: t('homeStatsBuyers'), icon: ShoppingCart },
    { value: '340+', label: t('homeStatsSuppliers'), icon: Package },
    { value: '48K+', label: t('homeStatsOrders'), icon: Truck },
    { value: '27', label: t('homeStatsRegions'), icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ════════════ NAVBAR ════════════ */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
                <span className="text-white text-lg font-extrabold" style={{ fontFamily: "'Cairo', sans-serif" }}>ت</span>
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">{t('appTitle')}</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { id: 'features', label: t('homeNavFeatures') },
                { id: 'how', label: t('homeNavHow') },
                { id: 'stats', label: t('homeNavStats') },
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="px-3.5 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70 rounded-xl transition-all"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Desktop right actions */}
            <div className="hidden md:flex items-center gap-2.5">
              <button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-indigo-700 text-xs font-bold transition-all shadow-sm"
              >
                <Globe2 className="w-3.5 h-3.5" />
                {language === 'ar' ? 'English' : 'العربية'}
              </button>

              <Link
                to="/auth/login"
                className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"
              >
                {t('login')}
              </Link>

              <Link
                to="/auth/register"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30"
              >
                {t('createAccount')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 -mr-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
              aria-label={menuOpen ? t('closeMenu') : t('menu')}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white animate-fadeIn">
            <div className="px-4 py-4 space-y-2">
              {['features', 'how', 'stats'].map((id) => (
                <button
                  key={id}
                  onClick={() => { scrollTo(id); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                >
                  {t(`homeNav${id.charAt(0).toUpperCase() + id.slice(1)}` as any)}
                </button>
              ))}
              <hr className="border-slate-100 my-2" />
              <div className="flex items-center justify-between px-4 pt-1">
                <button
                  onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-all"
                >
                  <Globe2 className="w-3.5 h-3.5" />
                  {language === 'ar' ? 'English' : 'العربية'}
                </button>
                <div className="flex items-center gap-2">
                  <Link
                    to="/auth/login"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to="/auth/register"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center gap-1 px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all"
                  >
                    {t('createAccount')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ════════════ HERO ════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-36 pb-20 sm:pb-28 lg:pb-36">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 mb-8 shadow-sm animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              {language === 'ar' ? 'المنصة الرائدة في مصر للمشتريات والتوريد' : "Egypt's leading procurement & supply platform"}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              {t('homeHeroTitle')}{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  {t('homeHeroHighlight')}
                </span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-indigo-100 -z-0 rounded-full opacity-60" />
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
              {t('homeHeroSub')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/auth/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 hover:shadow-2xl hover:shadow-indigo-600/30 active:scale-[0.98]"
              >
                {t('homeGetStarted')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={() => scrollTo('features')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold text-slate-700 bg-white border-2 border-slate-200 rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-[0.98]"
              >
                {t('homeLearnMore')}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-8 border-t border-slate-200/60">
              {[
                { icon: CheckCircle2, text: language === 'ar' ? 'موردين موثوقين' : 'Verified Suppliers' },
                { icon: ShieldCheck, text: language === 'ar' ? 'مدفوعات آمنة' : 'Secure Payments' },
                { icon: Truck, text: language === 'ar' ? 'تسليم سريع' : 'Fast Delivery' },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <b.icon className="w-4 h-4 text-emerald-500" />
                  {b.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ FEATURES ════════════ */}
      <section id="features" className="py-20 sm:py-28 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg mb-4 uppercase tracking-wider">
              {language === 'ar' ? 'المميزات الرئيسية' : 'Key Features'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {t('homeFeaturesTitle')}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
              {t('homeFeaturesSub')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-200/60 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ HOW IT WORKS ════════════ */}
      <section id="how" className="py-20 sm:py-28 bg-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg mb-4 uppercase tracking-wider">
              {language === 'ar' ? 'طريقة العمل' : 'How It Works'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {t('homeHowTitle')}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
              {t('homeHowSub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-0.5 bg-gradient-to-r from-indigo-200 to-emerald-200" />
                )}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center relative hover:shadow-lg transition-all duration-300">
                  <div className={`w-14 h-14 rounded-xl ${s.color} border flex items-center justify-center mx-auto mb-5`}>
                    <s.icon className="w-7 h-7" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-extrabold shadow-lg">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ STATS ════════════ */}
      <section id="stats" className="py-20 sm:py-28 bg-indigo-600 relative overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center group">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mx-auto mb-4 group-hover:bg-white/25 transition-colors">
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">{s.value}</p>
                <p className="text-sm font-semibold text-indigo-200">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ CTA ════════════ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 border border-indigo-100/60 rounded-3xl p-10 sm:p-16 shadow-xl shadow-indigo-100/50">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {t('homeCTATitle')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto mb-10">
              {t('homeCTASub')}
            </p>
            <Link
              to="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 hover:shadow-2xl hover:shadow-indigo-600/30 active:scale-[0.98]"
            >
              {t('homeCTAButton')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <span className="text-white text-sm font-extrabold" style={{ fontFamily: "'Cairo', sans-serif" }}>ت</span>
              </div>
              <span className="text-base font-extrabold text-slate-900">{t('appTitle')}</span>
              <span className="text-xs text-slate-400 ml-1">&middot; {t('appTagline')}</span>
            </div>

            <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
              <a href="#" className="hover:text-indigo-600 transition-colors">{t('homeFooterPrivacy')}</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">{t('homeFooterTerms')}</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">{t('homeFooterContact')}</a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} {t('appTitle')}. {t('homeFooterRights')}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {language === 'ar' ? 'المنصة تعمل على مدار الساعة' : 'Platform running 24/7'}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
