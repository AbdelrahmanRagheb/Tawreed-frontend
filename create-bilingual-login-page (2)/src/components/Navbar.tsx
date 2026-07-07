import { useState } from "react";
import Logo from "./Logo";

interface NavbarProps {
  isRTL: boolean;
  tr: any;
  toggleLang: () => void;
  onLoginClick: () => void;
}

export default function Navbar({ isRTL, tr, toggleLang, onLoginClick }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: tr.navFeatures, href: "#features" },
    { label: tr.navCategories, href: "#categories" },
    { label: tr.navSuppliers, href: "#suppliers" },
    { label: tr.navHow, href: "#how" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <Logo className="h-9 w-auto" showWordmark={false} />
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-[-0.5px] text-[#1e3a8a]">
              TAWREED
            </span>
            <span className="text-[10px] font-semibold text-slate-400 -mt-1.5">
              {isRTL ? "توريد" : "SUPPLY"}
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-[#1e3a8a]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-[#1e3a8a] hover:text-[#1e3a8a] md:flex"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" strokeWidth="2" />
            </svg>
            <span className={isRTL ? "font-sans" : "font-ar"}>{tr.langButton}</span>
          </button>

          {/* Login */}
          <button
            onClick={onLoginClick}
            className="hidden rounded-lg px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 md:block"
          >
            {tr.navLogin}
          </button>

          {/* CTA Button */}
          <a
            href="#cta"
            className="rounded-lg bg-[#1e3a8a] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#172554] shadow-sm"
          >
            {tr.navGetStarted}
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-slate-600 md:hidden"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-1 font-medium text-slate-600"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => { onLoginClick(); setMenuOpen(false); }}
              className="py-2 text-left font-semibold text-slate-700"
            >
              {tr.navLogin}
            </button>
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 py-2 text-left font-semibold text-[#1e3a8a]"
            >
              <span>{tr.langButton}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
