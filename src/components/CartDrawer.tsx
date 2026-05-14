import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { Language } from '../types';

interface CartDrawerProps {
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  lang: Language;
  cart: any[];
  updateQuantity: (name: string, color: string | null, delta: number) => void;
  removeFromCart: (name: string, color: string | null) => void;
  subtotal: number;
  setIsCheckoutOpen: (open: boolean) => void;
}

export const CartDrawer = ({
  isCartOpen,
  setIsCartOpen,
  lang,
  cart,
  updateQuantity,
  removeFromCart,
  subtotal,
  setIsCheckoutOpen
}: CartDrawerProps) => {
  const isAr = lang === 'ar';
  
  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-brand-deep/20 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className={`relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col ${isAr ? 'mr-auto' : 'ml-auto'}`}
          >
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-serif text-2xl">{lang === 'fr' ? 'Panier' : lang === 'ar' ? 'السلة' : 'Cart'}</h3>
              <button onClick={() => setIsCartOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>{lang === 'fr' ? 'Votre panier est vide' : lang === 'ar' ? 'سلتك فارغة' : 'Your cart is empty'}</p>
                </div>
              ) : (
                cart.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <img src={item.img} className="w-20 h-20 object-cover" alt="" />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      {item.color && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-3 h-3 rounded-full border border-gray-200" style={{ background: item.color }}></div>
                          <span className="text-[10px] text-gray-400 uppercase tracking-widest">{item.color}</span>
                        </div>
                      )}
                      <p className="text-sm text-brand-pink">{item.price} Fcfa</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQuantity(item.name, item.color, -1)} className="w-6 h-6 border flex items-center justify-center">-</button>
                        <span className="text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.name, item.color, 1)} className="w-6 h-6 border flex items-center justify-center">+</button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.name, item.color)} className="text-gray-300 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                  </div>
                ) as any)
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between mb-2 font-serif text-lg text-brand-deep">
                  <span>Subtotal</span>
                  <span>{subtotal} Fcfa</span>
                </div>
                <div className="flex justify-between mb-6 font-serif text-xl border-t pt-2 text-brand-deep">
                  <span>Total</span>
                  <span>{subtotal} Fcfa</span>
                </div>
                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full bg-brand-pink text-white py-4 text-[12px] tracking-[3px] uppercase hover:bg-brand-dark-pink transition-colors"
                >
                  {lang === 'fr' ? 'Commander' : lang === 'ar' ? 'إتمام الطلب' : 'Checkout'}
                </button>
                <p className="text-[10px] text-center text-gray-400 mt-4 uppercase tracking-widest">{lang === 'fr' ? 'Règlement en espèces à la remise' : lang === 'ar' ? 'الدفع نقداً عند الاستلام' : 'Cash on delivery / Pickup'}</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
