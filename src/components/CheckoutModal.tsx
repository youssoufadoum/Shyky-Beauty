import { motion, AnimatePresence } from 'motion/react';
import { FormEvent } from 'react';
import { Language, TranslationSet } from '../types';

interface CheckoutModalProps {
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  lang: Language;
  t: TranslationSet;
  handleOrder: (e: FormEvent) => void;
  orderType: 'pickup' | 'delivery';
  setOrderType: (type: 'pickup' | 'delivery') => void;
  subtotal: number;
  totalAmount: number;
  isOrderLoading: boolean;
}

export const CheckoutModal = ({
  isCheckoutOpen,
  setIsCheckoutOpen,
  lang,
  t,
  handleOrder,
  orderType,
  setOrderType,
  subtotal,
  totalAmount,
  isOrderLoading
}: CheckoutModalProps) => {
  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCheckoutOpen(false)}
            className="absolute inset-0 bg-brand-deep/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white w-full max-w-lg p-10 shadow-2xl"
          >
            <h3 className="font-serif text-3xl mb-8">{lang === 'fr' ? 'Finaliser la commande' : lang === 'ar' ? 'خانات الطلب' : 'Finalize Settlement'}</h3>
            
            <form onSubmit={handleOrder} className="space-y-6">
              <input name="name" required placeholder={t.contact.namePh} className="w-full border-b py-2 outline-none focus:border-brand-pink" />
              <input name="contact" required placeholder="Phone / WhatsApp" className="w-full border-b py-2 outline-none focus:border-brand-pink" />
              
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="orderType" value="pickup" checked={orderType === 'pickup'} onChange={() => setOrderType('pickup')} className="accent-brand-pink" />
                  <span className="text-sm">{lang === 'fr' ? 'Récupération' : lang === 'ar' ? 'استلام' : 'Pickup'}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="orderType" value="delivery" checked={orderType === 'delivery'} onChange={() => setOrderType('delivery')} className="accent-brand-pink" />
                  <span className="text-sm">{lang === 'fr' ? 'Expédition' : lang === 'ar' ? 'توصيل' : 'Delivery'}</span>
                </label>
              </div>

              <div className="bg-gray-50 p-4 border border-dashed border-gray-200">
                <textarea name="address" placeholder={lang === 'fr' ? 'Adresse de remise (si possible)' : lang === 'ar' ? 'عنوان التوصيل (إذا وجد)' : 'Delivery Address (if possible)'} className="w-full bg-transparent text-sm resize-none h-20 outline-none"></textarea>
              </div>

              <div className="space-y-2 py-4 border-t border-b">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>{subtotal} Fcfa</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{lang === 'fr' ? 'Frais de livraison' : lang === 'ar' ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
                    <span>1000 Fcfa</span>
                  </div>
                )}
                <div className="flex justify-between items-center font-serif text-xl pt-2 border-t">
                  <span>{lang === 'fr' ? 'À payer' : lang === 'ar' ? 'المبلغ المطلوب' : 'To Pay'}</span>
                  <span className="text-brand-pink">{totalAmount} Fcfa</span>
                </div>
              </div>

              <button 
                disabled={isOrderLoading}
                className="w-full bg-brand-pink text-white py-5 text-[12px] tracking-[3px] uppercase hover:bg-brand-dark-pink transition-colors disabled:opacity-50"
              >
                {isOrderLoading ? '...' : (lang === 'fr' ? 'Confirmer l\'achat' : lang === 'ar' ? 'تأكيد الشراء' : 'Confirm Purchase')}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
