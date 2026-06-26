import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, MapPin, Users, Calendar, Bell, DollarSign, Percent, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { useAuth } from '../../contexts/AuthContext';
import { buyerService, type BuyerDashboardResponse } from '../../services/buyer.service';

export function BuyerDashboard() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [data, setData] = useState<BuyerDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    buyerService.getDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const { activeOrders, nearbyOrders, notifications, trendingProducts, totalSavings, unreadNotificationCount } = data;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder={t('searchSupplies')}
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
        />
      </div>

      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl p-5 md:p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wider">{t('totalSavings')}</p>
            <p className="text-3xl md:text-4xl font-black mt-1">EGP {totalSavings.toLocaleString()}</p>
            <p className="text-emerald-200 text-xs mt-1.5 flex items-center gap-1">
              <Percent className="w-3.5 h-3.5" />
              {t('saveUpTo')} 20% {language === 'en' ? 'on bulk orders' : 'على الطلبات بالجملة'}
            </p>
          </div>
          <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">{t('ordersNearYou')}</h2>
            </div>
            <button onClick={() => navigate('/buyer/orders')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">{t('viewAll')} →</button>
          </div>
          <div className="divide-y divide-slate-100">
            {nearbyOrders.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-slate-500">{t('noNearbyOrders')}</div>
            ) : (
              nearbyOrders.map((order) => (
                <div key={order.id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate('/buyer/orders/' + order.id)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">{order.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{order.productName} x{order.quantity} · {t('host')}: {order.creatorName}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {order.region}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {order.currentParticipants}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(order.deadline).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">{t('myActiveOrders')}</h2>
            </div>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">{activeOrders.length}</span>
          </div>
          {activeOrders.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">{t('noNotifications')}</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {activeOrders.map((order) => (
                <div key={order.id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate('/buyer/orders/' + order.id)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">{order.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{order.productCount} {t('items')}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(order.deadline).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" /> EGP {order.totalValue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold text-white ${
                        order.status === 'Open' ? 'bg-emerald-500' :
                        order.status === 'Closed' ? 'bg-slate-500' :
                        order.status === 'Completed' ? 'bg-emerald-500' :
                        order.status === 'Cancelled' ? 'bg-red-500' :
                        'bg-slate-500'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => navigate('/buyer/orders')} className="w-full py-3 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors border-t border-slate-100">
            {t('viewAll')} {t('orders')} →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-900">{t('notifications')}</h2>
            {unreadNotificationCount > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">{unreadNotificationCount}</span>
            )}
          </div>
          <button onClick={() => navigate('/buyer/orders')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">{t('viewAll')} →</button>
        </div>
        {notifications.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-slate-500">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            {t('noNotifications')}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div key={n.id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 text-amber-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{language === 'ar' ? n.titleAr : n.titleEn}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{new Date(n.createdAt).toLocaleDateString()}</p>
                </div>
                {!n.isRead && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-2" />}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">{t('trendingProducts')}</h2>
          </div>
          <button onClick={() => navigate('/buyer/orders')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">{t('viewAll')} →</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {trendingProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all group">
              <div className="aspect-square overflow-hidden bg-slate-100">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-slate-900 truncate">{product.name}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-sm font-bold text-indigo-600">EGP {product.price.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-500">{product.categoryName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
