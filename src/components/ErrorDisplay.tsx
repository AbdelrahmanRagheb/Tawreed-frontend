import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../i18n';

interface ErrorDisplayProps {
  message: string;
  statusCode?: number;
  onRetry?: () => void;
  fullPage?: boolean;
}

export function ErrorDisplay({ message, statusCode, onRetry, fullPage }: ErrorDisplayProps) {
  const { t } = useLanguage();

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      {statusCode && (
        <span className="text-sm font-mono text-gray-400">Error {statusCode}</span>
      )}
      <p className="text-sm text-gray-600 text-center max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {t('errorPageRetry')}
        </button>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {content}
    </div>
  );
}
