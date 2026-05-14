import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag } from 'lucide-react';
import { Language, Product } from '../types';

interface ProductInfoModalProps {
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  lang: Language;
  activeImgIndex: number;
  setActiveImgIndex: (idx: number) => void;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  addToCart: (p: Product, color: string | null) => void;
}

export const ProductInfoModal = ({
  selectedProduct,
  setSelectedProduct,
  lang,
  activeImgIndex,
  setActiveImgIndex,
  selectedColor,
  setSelectedColor,
  addToCart
}: ProductInfoModalProps) => {
  const isAr = lang === 'ar';
  
  return (
    <AnimatePresence>
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
            className="absolute inset-0 bg-brand-deep/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Close"
            >
              <X className="w-6 h-6 text-brand-deep" />
            </button>

            <div className="w-full md:w-1/2 flex flex-col">
              <div className="relative flex-1 aspect-square overflow-hidden bg-gray-50">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImgIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full object-cover" 
                    src={selectedProduct.imgs ? selectedProduct.imgs[activeImgIndex] : selectedProduct.img} 
                    alt={selectedProduct.name} 
                  />
                </AnimatePresence>
              </div>
              {selectedProduct.imgs && selectedProduct.imgs.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto bg-gray-50/50">
                  {selectedProduct.imgs.map((img, i) => (
                    <button 
                      key={i}
                      onClick={() => setActiveImgIndex(i)}
                      className={`w-16 h-16 flex-shrink-0 border-2 transition-all ${activeImgIndex === i ? 'border-brand-pink' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={`w-full md:w-1/2 p-10 flex flex-col justify-center ${isAr ? 'text-right' : 'text-left'}`}>
              <p className="text-[11px] tracking-[4px] uppercase text-brand-gold mb-3">✦ Glossy Collection</p>
              <h3 className="font-serif text-4xl mb-6">{selectedProduct.name}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-8">
                {selectedProduct.desc[lang]}
              </p>
              
              <div className="mb-10">
                <p className="text-[11px] tracking-[2px] uppercase text-gray-400 mb-4">Shades</p>
                <div className="flex gap-2">
                  {selectedProduct.swatches.map((color: string, i: number) => (
                    <button 
                      key={i} 
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all shadow-sm ${selectedColor === color ? 'border-brand-pink scale-110 ring-2 ring-brand-pink/20' : 'border-white-ring-1 ring-black/10'}`} 
                      style={{ background: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

                <div className="flex flex-col gap-4">
                <button 
                  onClick={() => {
                    if (selectedProduct.swatches.length > 0 && !selectedColor) {
                      alert(lang === 'fr' ? 'Veuillez choisir une couleur' : lang === 'ar' ? 'يرجى اختيار لون' : 'Please select a color');
                      return;
                    }
                    addToCart(selectedProduct, selectedColor);
                  }} 
                  className="bg-brand-pink text-white px-10 py-5 text-[12px] tracking-[3px] uppercase hover:bg-brand-dark-pink transition-colors text-center flex items-center justify-center gap-3"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {lang === 'fr' ? 'Ajouter au panier' : lang === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
                </button>
                <button onClick={() => setSelectedProduct(null)} className="text-[11px] tracking-[2px] uppercase text-gray-400 hover:text-brand-deep transition-colors">
                  {lang === 'fr' ? 'Fermer' : lang === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
