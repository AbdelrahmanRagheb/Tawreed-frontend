import { useSearchParams, useNavigate } from 'react-router-dom';
import { WifiOff, ServerCrash, FileQuestion } from 'lucide-react';
import { useLanguage } from '../i18n';
import { useAuth } from '../contexts/AuthContext';

export function ErrorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const code = searchParams.get('code') || '';
  const msg = searchParams.get('message') || '';

  let message: string;
  let statusCode: string | undefined;
  let Icon: React.ComponentType<{ className?: string }>;

  if (!code && !msg) {
    message = t('errorPageNotFound');
    statusCode = '404';
    Icon = FileQuestion;
  } else if (code === 'network') {
    message = msg || t('errorPageNetworkError');
    Icon = WifiOff;
  } else if (code === '403') {
    message = msg || t('errorPageForbidden');
    statusCode = '403';
    Icon = ServerCrash;
  } else if (code === '500' || code.startsWith('5')) {
    message = msg || t('errorPageServerError');
    statusCode = code;
    Icon = ServerCrash;
  } else {
    message = msg || t('errorPageTitle');
    Icon = ServerCrash;
  }

  const homePath = user ? `/${user.role}` : '/';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
        <Icon className="w-10 h-10 text-red-500" />
      </div>
      {statusCode && (
        <span className="text-sm font-mono text-gray-400">Error {statusCode}</span>
      )}
      <h1 className="text-xl font-semibold text-gray-900">{t('errorPageTitle')}</h1>
      <p className="text-sm text-gray-600 text-center max-w-md">{message}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {t('errorPageRetry')}
        </button>
        <button
          onClick={() => navigate(homePath)}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          {t('errorPageGoHome')}
        </button>
      </div>
    </div>
  );
}
