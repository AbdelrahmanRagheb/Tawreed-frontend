import { BarChart3, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { mockReportEntries } from '../../data';

export function AdminReports() {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('reports')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('analytics')}</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
          <BarChart3 className="w-4 h-4" />
          {t('generateReport')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockReportEntries.map((report) => (
          <div key={report.id} className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{report.title[language]}</h3>
                  <p className="text-xs text-slate-500">{report.type[language]} • {report.period}</p>
                </div>
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold ${
                report.growth >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {report.growth >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {report.growth >= 0 ? '+' : ''}{report.growth}%
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {report.type[language] === 'Financial' || report.type[language] === 'مالي'
                    ? `SAR ${(report.total / 1000).toFixed(1)}K`
                    : report.total.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{t('download')} {report.generatedAt}</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <Download className="w-3.5 h-3.5" />
                {t('download')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
