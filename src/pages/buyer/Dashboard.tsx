import { Search, TrendingUp, MapPin, Users, Calendar, Bell, DollarSign, Percent, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { mockOrders, mockNotifications, mockProducts, totalSavings, mockNearbyOrders } from '../../data';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500',
  confirmed: 'bg-blue-500',
  shipped: 'bg-indigo-500',
  delivered: 'bg-emerald-500',
  cancelled: 'bg-red-500',
};

export function BuyerDashboard() {
  const { language, t } = useLanguage();

  const activeOrders = mockOrders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
  const unreadNotifications = mockNotifications.filter((n) => !n.read).slice(0, 3);
  const trendingProducts = [...mockProducts].sort(() => Math.random() - 0.5).slice(0, 4);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder={t('searchSupplies')}
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
        />
      </div>

      {/* Savings Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl p-5 md:p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wider">{t('totalSavings')}</p>
            <p className="text-3xl md:text-4xl font-black mt-1">SAR {totalSavings.toLocaleString()}</p>
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

      {/* Two columns: Orders Near You + My Active Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Orders Near You */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">{t('ordersNearYou')}</h2>
            </div>
            <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">{t('viewAll')} →</button>
          </div>
          <div className="divide-y divide-slate-100">
            {mockNearbyOrders.map((order) => (
              <div key={order.id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 truncate">{order.product[language]}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{t('host')}: {order.host[language]}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {order.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {order.currentParticipants}/{order.maxParticipants}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {order.deadline}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-emerald-600">SAR {order.unitPrice.toFixed(2)}</p>
                    <p className="text-[10px] text-emerald-500 font-semibold">-{order.savings}%</p>
                    <button className="mt-1.5 px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700 transition-colors">
                      {t('join')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Active Orders */}
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
                <div key={order.id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">{order.orderNumber}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{order.items.length} {t('items')}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                        {order.estimatedDelivery && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {order.estimatedDelivery}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" /> SAR {order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold text-white ${statusColors[order.status]}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2.5 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${statusColors[order.status]}`} style={{
                      width: order.status === 'pending' ? '15%' : order.status === 'confirmed' ? '35%' : order.status === 'shipped' ? '60%' : '0%'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <button className="w-full py-3 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors border-t border-slate-100">
            {t('viewAll')} {t('orders')} →
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-900">{t('notifications')}</h2>
            {unreadNotifications.length > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">{unreadNotifications.length}</span>
            )}
          </div>
          <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">{t('viewAll')} →</button>
        </div>
        {unreadNotifications.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-slate-500">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            {t('noNotifications')}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {unreadNotifications.map((n) => (
              <div key={n.id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 text-amber-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{n.title[language]}</p>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{n.message[language]}</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-2" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trending Products */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">{t('trendingProducts')}</h2>
          </div>
          <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">{t('viewAll')} →</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {trendingProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all group">
              <div className="aspect-square overflow-hidden">
                <img src={product.imageUrl} alt={product.name[language]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-slate-900 truncate">{product.name[language]}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-sm font-bold text-indigo-600">SAR {product.price.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-500">{product.stock} {t('inStock')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
