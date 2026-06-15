import { mockProducts } from '../data';
import { ProductCard } from './ProductCard';

export function ProductGrid() {
  return (
    /* 
      Responsive Grid Layout:
      - Mobile (default): 1 column (grid-cols-1)
      - Small tablet (sm): 2 columns (grid-cols-2)
      - Large tablet (md): 3 columns (grid-cols-3)
      - Desktop (lg/xl): 4 columns (grid-cols-4)
      This ensures images and cards adapt beautifully to all screen sizes.
    */
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
      {mockProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
