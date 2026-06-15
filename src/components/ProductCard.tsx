import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../i18n';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, t } = useLanguage();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full transition-shadow hover:shadow-md">
      <div className="relative aspect-square sm:aspect-[4/3] bg-slate-200 overflow-hidden text-start">
        <img 
          src={product.imageUrl} 
          alt={product.name[language]} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-3 start-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm">
          {product.category[language]}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-1 text-start">
        <h4 className="font-bold text-slate-800 leading-tight line-clamp-1" dir="auto">{product.name[language]}</h4>
        <p className="text-xs text-slate-500 line-clamp-2" dir="auto">{product.description[language]}</p>
        
        <div className="mt-4 flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-lg font-black text-indigo-600 flex items-center">
              ${product.price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              <span className="text-[10px] text-slate-400 font-normal ms-1 whitespace-nowrap">{t('unit')}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{product.stock} {t('inStock')}</span>
          </div>
          <button className="p-2 bg-slate-100 rounded-full hover:bg-indigo-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex-shrink-0">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
