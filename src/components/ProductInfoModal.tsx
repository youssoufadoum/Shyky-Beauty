import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag } from 'lucide-react';
import { Language, Product } from '../types';
import { asset } from '../lib/utils';
import { SafeImage } from './UI';

const MotionSafeImage = motion(SafeImage);

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
            className="relative bg-white w-full max-w-4xl max-h-[88vh] md:max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row rounded-2xl border border-brand-pink/10"
          >
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-50 p-2.5 bg-white/95 backdrop-blur-md shadow-md hover:bg-gray-100 border border-brand-pink/10 rounded-full transition-all duration-200 cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5 text-brand-deep" />
            </button>

            <div className="w-full md:w-1/2 flex flex-col">
              <div className="relative flex-1 aspect-square overflow-hidden bg-gray-50">
                <AnimatePresence mode="wait">
                  <MotionSafeImage 
                    key={activeImgIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full object-cover" 
                    src={asset(selectedProduct.imgs ? selectedProduct.imgs[activeImgIndex] : selectedProduct.img)} 
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
                      className={`w-16 h-16 flex-shrink-0 border-2 transition-all cursor-pointer ${activeImgIndex === i ? 'border-brand-pink' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <SafeImage src={asset(img)} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={`w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center ${isAr ? 'text-right' : 'text-left'}`}>
              <p className="text-[11px] tracking-[4px] uppercase text-brand-gold mb-3">✦ Glossy Collection</p>
              <h3 className="font-serif text-3xl md:text-4xl mb-4 md:mb-6">{selectedProduct.name}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6 md:mb-8">
                {selectedProduct.desc[lang]}
              </p>
              
              <div className="mb-6 md:mb-10">
                <p className="text-[11px] tracking-[2px] uppercase text-gray-400 mb-4">Shades</p>
                <div className="flex gap-2">
                  {selectedProduct.swatches.map((color: string, i: number) => (
                    <button 
                      key={i} 
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all shadow-sm cursor-pointer ${selectedColor === color ? 'border-brand-pink scale-110 ring-2 ring-brand-pink/20' : 'border-white ring-1 ring-black/10'}`} 
                      style={{ background: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 md:gap-4 mt-2">
                <button 
                  onClick={() => {
                    if (selectedProduct.swatches.length > 0 && !selectedColor) {
                      alert(lang === 'fr' ? 'Veuillez choisir une couleur' : lang === 'ar' ? 'يرجى اختيار لون' : 'Please select a color');
                      return;
                    }
                    addToCart(selectedProduct, selectedColor);
                  }} 
                  className="bg-brand-pink text-white px-10 py-4 md:py-5 text-[12px] tracking-[3px] uppercase hover:bg-brand-dark-pink transition-colors text-center flex items-center justify-center gap-3 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {lang === 'fr' ? 'Ajouter au panier' : lang === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
                </button>
                <button 
                  onClick={() => setSelectedProduct(null)} 
                  className="border border-brand-pink/20 text-brand-deep hover:bg-brand-cream/30 px-10 py-4 text-[12px] tracking-[3px] uppercase transition-all duration-200 text-center font-sans cursor-pointer"
                >
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
