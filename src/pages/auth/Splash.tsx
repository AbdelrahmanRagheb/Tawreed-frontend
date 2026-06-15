import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n';

export function Splash() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

  const handleSelectLanguage = (lang: 'en' | 'ar') => {
    setLanguage(lang);
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 bg-indigo-500 flex items-center justify-center rounded-lg mb-6 shadow-xl">
        <div className="w-8 h-8 border-4 border-white rotate-45"></div>
      </div>
      <h1 className="text-4xl font-bold tracking-widest uppercase mb-12">Tawreed</h1>
      
      <div className="space-y-4 w-full max-w-xs">
        <button 
          onClick={() => handleSelectLanguage('en')}
          className="w-full py-3 bg-white text-slate-900 rounded-lg font-bold hover:bg-slate-100 transition-colors"
        >
          English
        </button>
        <button 
          onClick={() => handleSelectLanguage('ar')}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
        >
          العربية
        </button>
      </div>
    </div>
  );
}
