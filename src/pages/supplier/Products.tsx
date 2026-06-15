import { useState } from 'react';
import { Plus, Search, Edit3, Trash2, AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { mockProductList } from '../../data';
import type { SupplierProduct } from '../../types';

const productUnits: Record<string, string> = {
  'sp1': 'KG', 'sp2': 'KG', 'sp3': 'L', 'sp4': 'TIN',
  'sp5': 'BOX', 'sp6': 'JAR',
};

type ModalMode = 'none' | 'add' | 'edit' | 'delete';

const emptyForm = { nameEn: '', nameAr: '', price: 0, stock: 0, category: '', status: 'active' as const, image: '' };

export function SupplierProducts() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<SupplierProduct[]>(mockProductList);
  const [modal, setModal] = useState<ModalMode>('none');
  const [selectedProduct, setSelectedProduct] = useState<SupplierProduct | null>(null);
  const [form, setForm] = useState(emptyForm);

  const nextId = () => `sp${Date.now()}`;

  const openAdd = () => {
    setForm(emptyForm);
    setSelectedProduct(null);
    setModal('add');
  };

  const openEdit = (p: SupplierProduct) => {
    setForm({ nameEn: p.name.en, nameAr: p.name.ar, price: p.price, stock: p.stock, category: p.category, status: p.status, image: p.image });
    setSelectedProduct(p);
    setModal('edit');
  };

  const openDelete = (p: SupplierProduct) => {
    setSelectedProduct(p);
    setModal('delete');
  };

  const handleSave = () => {
    if (!form.nameEn.trim() || !form.nameAr.trim() || !form.category.trim()) return;
    const newProduct: SupplierProduct = {
      id: selectedProduct ? selectedProduct.id : nextId(),
      name: { en: form.nameEn, ar: form.nameAr },
      price: form.price,
      stock: form.stock,
      category: form.category,
      status: form.status,
      image: form.image || 'https://images.unsplash.com/photo-1552767059-ce1833656d5b?auto=format&fit=crop&q=80&w=800',
    };
    if (selectedProduct) {
      setProducts((prev) => prev.map((p) => (p.id === selectedProduct.id ? newProduct : p)));
    } else {
      setProducts((prev) => [newProduct, ...prev]);
    }
    setModal('none');
  };

  const handleDelete = () => {
    if (!selectedProduct) return;
    setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
    setModal('none');
  };

  const filtered = products.filter((p) =>
    p.name[language].toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = products.filter((p) => p.stock < 100).length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('productsManagement')}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {products.length} {t('productsListed')}
            {lowStockCount > 0 && (
              <span className="text-amber-600 ml-2">
                &middot; {lowStockCount} {t('lowStockProducts').toLowerCase()}
              </span>
            )}
          </p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" />
          {t('addProduct')}
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchProducts')}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('product')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('category')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('stock')}</th>
                <th className="text-start px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('price')}</th>
                <th className="text-center px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('status')}</th>
                <th className="text-end px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((product) => {
                const unit = productUnits[product.id] || 'UNIT';
                const isLowStock = product.stock < 100;
                return (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                          <img src={product.image} alt={product.name[language]} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm font-medium text-slate-900">{product.name[language]}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{product.category}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${isLowStock ? 'text-amber-600' : 'text-slate-900'}`}>
                          {product.stock} {unit}
                        </span>
                        {isLowStock && (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{product.price} EGP</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        product.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-end">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(product)} className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors" title={t('editProduct')}>
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => openDelete(product)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors" title={t('deleteProduct')}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-slate-500">{t('noProductsFound')}</div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30" onClick={() => setModal('none')}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">{modal === 'add' ? t('addProduct') : t('editProduct')}</h2>
              <button onClick={() => setModal('none')} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{t('product')} (EN)</label>
                  <input type="text" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{t('product')} (AR)</label>
                  <input type="text" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{t('category')}</label>
                  <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{t('price')} (EGP)</label>
                  <input type="number" min="0" step="0.01" value={form.price || ''} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{t('stock')}</label>
                  <input type="number" min="0" value={form.stock || ''} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{t('status')}</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="active">{t('active')}</option>
                    <option value="inactive">{t('inactive')}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Image URL</label>
                <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100">
              <button onClick={() => setModal('none')} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">{t('cancel')}</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">{t('save')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {modal === 'delete' && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30" onClick={() => setModal('none')}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">{t('deleteProduct')}</h2>
              <p className="text-sm text-slate-500 mb-6">
                {t('deleteConfirm')} &quot;{selectedProduct.name[language]}&quot;?
              </p>
              <div className="flex gap-2 justify-center">
                <button onClick={() => setModal('none')} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">{t('cancel')}</button>
                <button onClick={handleDelete} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">{t('delete')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
