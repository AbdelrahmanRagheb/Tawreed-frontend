import { Menu, Search, ShoppingCart, User, Globe } from 'lucide-react';
import { useLanguage } from '../i18n';

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 cursor-pointer">
            <img src="/tawreed-logo.png" alt="Tawreed" className="h-20 w-auto shrink-0" />
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl px-4 sm:px-8 hidden sm:flex">
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                className="block w-full ps-10 pe-4 py-2 border-transparent rounded-lg leading-5 bg-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
                placeholder={t('searchPlaceholder')}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button className="text-slate-500 hover:text-slate-900 sm:hidden">
              <Search className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 font-medium"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm uppercase font-bold">{language === 'en' ? 'AR' : 'EN'}</span>
            </button>
            <button className="text-slate-500 hover:text-indigo-600 transition-colors hidden sm:flex items-center gap-2 font-medium">
              <User className="w-5 h-5" />
              <span className="text-sm">{t('account')}</span>
            </button>
            <div className="flex items-center gap-4">
              <button className="relative text-slate-500 hover:text-indigo-600 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1.5 -end-1.5 bg-indigo-600 text-white text-[10px] sm:text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center border-2 border-white">
                  3
                </span>
              </button>
              {/* Mobile Menu Icon */}
              <button className="text-slate-500 hover:text-slate-900 sm:hidden ms-2">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="sm:hidden pb-4 pt-2">
           <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                className="block w-full ps-10 pe-3 py-2 border-transparent rounded-lg text-sm bg-slate-100 placeholder-slate-400 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder={t('searchPlaceholder')}
              />
            </div>
        </div>
      </div>
    </nav>
  );
}
