import { Language, TranslationSet } from '../types';
import { ShoppingCart, Package, User, LogOut } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  lang: Language;
  setLang: (l: Language) => void;
  t: TranslationSet;
  cartCount: number;
  setIsCartOpen: (open: boolean) => void;
  isAdmin: boolean;
  showSellerView: boolean;
  setShowSellerView: (show: boolean) => void;
  user: FirebaseUser | null;
  logout: () => void;
  handleAuthLogin: () => void;
  isLoggingIn: boolean;
}

export const Navbar = ({
  lang,
  setLang,
  t,
  cartCount,
  setIsCartOpen,
  isAdmin,
  showSellerView,
  setShowSellerView,
  user,
  logout,
  handleAuthLogin,
  isLoggingIn
}: NavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-5 md:px-10 py-4 flex items-center justify-between bg-brand-cream/90 backdrop-blur-md border-b border-brand-pink/10">
      <a className="block select-none no-underline" href="#">
        <img 
          src="/logo.png" 
          alt="Shyky Beauty" 
          className="h-16 md:h-20 w-auto object-contain"
        />
      </a>
      
      <ul className="hidden md:flex items-center gap-8 list-none">
        {Object.entries(t.nav).map(([key, label]) => (
          <li key={key}>
            <a href={`#${key}`} className="text-[12px] tracking-[2px] uppercase text-brand-deep hover:text-brand-pink transition-colors">
              {label}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          {(['fr', 'en', 'ar'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`border border-brand-pink text-[11px] tracking-widest px-3 py-1 uppercase transition-all ${
                lang === l ? 'bg-brand-pink text-white' : 'text-brand-pink hover:bg-brand-pink/10'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-2 text-brand-deep hover:text-brand-pink transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-pink text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        {isAdmin && (
          <button 
            onClick={() => setShowSellerView(!showSellerView)}
            className={`p-2 transition-colors ${showSellerView ? 'text-brand-pink' : 'text-brand-deep'}`}
            title="Seller Dashboard"
          >
            <Package className="w-5 h-5" />
          </button>
        )}

        {user ? (
          <button onClick={() => logout()} className="p-2 text-brand-deep hover:text-red-500 transition-colors" title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        ) : (
          <button 
            onClick={handleAuthLogin} 
            disabled={isLoggingIn}
            className={`p-2 text-brand-deep hover:text-brand-pink transition-colors ${isLoggingIn ? 'opacity-50 cursor-not-allowed' : ''}`} 
            title="Admin Login"
          >
            <User className="w-5 h-5" />
          </button>
        )}
      </div>
    </nav>
  );
};
