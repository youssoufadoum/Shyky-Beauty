import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, ShieldAlert, ExternalLink, X } from 'lucide-react';
import { auth, db, login, logout, collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc, serverTimestamp, getDocFromServer } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

// Internal System Imports
import { Language, Product, OperationType } from './types';
import { translations, AUTHORIZED_USERS, INITIAL_PRODUCTS } from './constants';
import { handleFirestoreError } from './lib/utils';

// Component Imports
import { Navbar } from './components/Navbar';
import { SellerDashboard } from './components/SellerDashboard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductInfoModal } from './components/ProductInfoModal';
import { Hero, Marquee, About, ProductGrid, Gallery, Stats, Testimonial, Contact, Footer } from './components/Sections';

export default function App() {
  const [lang, setLang] = useState<Language>('fr');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [productSuccess, setProductSuccess] = useState<string | null>(null);
  const [productError, setProductError] = useState<string | null>(null);
  
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<{ code: string; message: string; showHelp: boolean } | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [showSellerView, setShowSellerView] = useState(false);
  const [sellerTab, setSellerTab] = useState<'orders' | 'products'>('orders');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');

  const t = translations[lang];
  const isAr = lang === 'ar';

  const [hiddenInitialNames, setHiddenInitialNames] = useState<string[]>(() => {
    const saved = localStorage.getItem('shyky_hidden_products');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shyky_hidden_products', JSON.stringify(hiddenInitialNames));
  }, [hiddenInitialNames]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      const userEmail = u?.email;
      setIsAdmin(!!userEmail && AUTHORIZED_USERS.includes(userEmail) && !!u?.emailVerified);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function testConn() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        console.error("Firebase connection test:", error);
      }
    }
    testConn();

    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbProducts = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      const combined = INITIAL_PRODUCTS
        .filter(p => !hiddenInitialNames.includes(p.name))
        .map(p => ({ ...p }));
      
      dbProducts.forEach(dbProd => {
        const index = combined.findIndex(p => p.name === dbProd.name);
        if (index !== -1) combined[index] = { ...combined[index], ...dbProd };
        else combined.push(dbProd);
      });
      setProducts(combined);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });
    return () => unsubscribe();
  }, [hiddenInitialNames]);

  useEffect(() => {
    if (isAdmin && showSellerView) {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      });
      return () => unsubscribe();
    }
  }, [isAdmin, showSellerView]);

  useEffect(() => {
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isAr]);

  const addToCart = (product: Product, color: string | null) => {
    setCart(prev => {
      const existing = prev.find(item => item.name === product.name && item.color === color);
      if (existing) {
        return prev.map(item => (item.name === product.name && item.color === color) ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, color }];
    });
    setIsCartOpen(true);
    setSelectedProduct(null);
    setSelectedColor(null);
  };

  const handleAuthLogin = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const u = await login();
      if (u) {
        const isAuthorized = AUTHORIZED_USERS.includes(u.email || '');
        if (!isAuthorized) {
          setAuthError({
            code: 'auth/unauthorized-user',
            message: `L'adresse e-mail ${u.email} n'est pas autorisée dans la liste d'administration / The email ${u.email} is not in the authorized admin list.`,
            showHelp: false
          });
        } else if (!u.emailVerified) {
          setAuthError({
            code: 'auth/email-not-verified',
            message: "L'e-mail de l'administrateur n'est pas vérifié. / The admin email is not verified.",
            showHelp: false
          });
        }
      }
    } catch (err: any) {
      console.error("Login failure: ", err);
      // In a nested frame context, signInWithPopup often fails due to third-party cookie restrictions
      const isIframe = window.self !== window.top;
      const isUnauthorizedDomain = err?.code === 'auth/unauthorized-domain' || 
                                   String(err?.message || '').includes('unauthorized-domain') ||
                                   String(err || '').includes('unauthorized-domain');
      setAuthError({
        code: err?.code || 'auth/unknown',
        message: err?.message || String(err),
        showHelp: isUnauthorizedDomain || isIframe
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const updateQuantity = (name: string, color: string | null, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.name === name && item.color === color) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeFromCart = (name: string, color: string | null) => {
    setCart(prev => prev.filter(item => !(item.name === name && item.color === color)));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = orderType === 'delivery' ? 1000 : 0;
  const totalAmount = subtotal + deliveryFee;

  const handleOrder = async (e: FormEvent) => {
    e.preventDefault();
    setIsOrderLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const orderData = {
      customerName: String(formData.get('name') || ''),
      customerContact: String(formData.get('contact') || ''),
      orderType: String(formData.get('orderType') || 'pickup'),
      address: String(formData.get('address') || 'N/A'),
      items: cart.map(item => ({ 
        name: item.name, 
        quantity: item.quantity, 
        price: item.price,
        color: item.color || 'N/A'
      })),
      totalAmount,
      status: 'pending',
      paymentMethod: 'cash',
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'orders'), orderData);
      setCart([]);
      setIsCheckoutOpen(false);
      setOrderSuccess(orderData.customerName);
      setTimeout(() => setOrderSuccess(null), 5000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
      alert("Order failed.");
    } finally {
      setIsOrderLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const handleProductSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProductError(null);
    setProductSuccess(null);

    if (!isAdmin) {
      const errMessage = lang === 'fr' 
        ? "Vous n'avez pas d'autorisation administrateur pour enregistrer des produits. Si vous venez de vous connecter, assurez-vous que votre adresse e-mail est vérifiée."
        : "You do not have administrator permissions to save products. If you just logged in, please make sure your email is verified.";
      setProductError(errMessage);
      alert(errMessage);
      return;
    }

    setIsSavingProduct(true);
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const mainImg = String(formData.get('img'));
    const additionalImgsRaw = String(formData.get('imgs') || '');
    const additionalImgs = additionalImgsRaw
      ? additionalImgsRaw.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    
    const productData: Omit<Product, 'id'> = {
      name: String(formData.get('name')),
      price: Number(formData.get('price')),
      sub: String(formData.get('sub')),
      img: mainImg,
      imgs: [mainImg, ...additionalImgs],
      swatches: String(formData.get('swatches')).split(',').map(s => s.trim()),
      desc: {
        fr: String(formData.get('desc_fr')),
        en: String(formData.get('desc_en')),
        ar: String(formData.get('desc_ar')),
      },
      createdAt: editingProduct?.createdAt || serverTimestamp(),
    };

    try {
      if (editingProduct?.id) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
        setProductSuccess(lang === 'fr' ? `Produit "${productData.name}" mis à jour avec succès !` : `Product "${productData.name}" successfully updated!`);
      } else {
        await addDoc(collection(db, 'products'), productData);
        setProductSuccess(lang === 'fr' ? `Produit "${productData.name}" ajouté avec succès !` : `Product "${productData.name}" successfully added!`);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      
      // Auto-dismiss the success notification after 5 seconds
      setTimeout(() => setProductSuccess(null), 5000);
    } catch (error: any) {
      console.error("Error saving product: ", error);
      const fsErr = handleFirestoreError(error, OperationType.WRITE, 'products');
      const friendlyError = fsErr.error || String(error);
      setProductError(friendlyError);
      alert(`${lang === 'fr' ? "Erreur d'enregistrement : " : "Error saving product: "} ${friendlyError}`);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const deleteProduct = async (prod: Product) => {
    if (!isAdmin) return;
    if (!confirm(`Delete ${prod.name}?`)) return;

    if (prod.id) {
      try {
        await deleteDoc(doc(db, 'products', prod.id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `products/${prod.id}`);
      }
    } else {
      setHiddenInitialNames(prev => [...prev, prod.name]);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar 
        lang={lang} setLang={setLang} t={t} 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        setIsCartOpen={setIsCartOpen}
        isAdmin={isAdmin} showSellerView={showSellerView} setShowSellerView={setShowSellerView}
        user={user} logout={logout} handleAuthLogin={handleAuthLogin} isLoggingIn={isLoggingIn}
      />

      <Hero t={t} isAr={isAr} />
      <Marquee />
      <About t={t} />
      <ProductGrid t={t} products={products} onProductClick={(p) => { setSelectedProduct(p); setActiveImgIndex(0); }} />
      <Gallery t={t} />
      <Stats t={t} />
      <Testimonial t={t} />
      <Contact t={t} />
      <Footer t={t} />

      {/* Modals */}
      <ProductInfoModal 
        selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} 
        lang={lang} activeImgIndex={activeImgIndex} setActiveImgIndex={setActiveImgIndex}
        selectedColor={selectedColor} setSelectedColor={setSelectedColor}
        addToCart={addToCart}
      />
      <CartDrawer 
        isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} lang={lang} cart={cart}
        updateQuantity={updateQuantity} removeFromCart={removeFromCart} subtotal={subtotal}
        setIsCheckoutOpen={setIsCheckoutOpen}
      />
      <CheckoutModal 
        isCheckoutOpen={isCheckoutOpen} setIsCheckoutOpen={setIsCheckoutOpen} lang={lang} t={t}
        handleOrder={handleOrder} orderType={orderType} setOrderType={setOrderType}
        subtotal={subtotal} totalAmount={totalAmount} isOrderLoading={isOrderLoading}
      />
      <SellerDashboard 
        showSellerView={showSellerView} setShowSellerView={setShowSellerView} user={user}
        sellerTab={sellerTab} setSellerTab={setSellerTab} orders={orders} products={products}
        updateOrderStatus={updateOrderStatus} setIsProductModalOpen={setIsProductModalOpen}
        setEditingProduct={setEditingProduct} deleteProduct={deleteProduct}
      />

      {/* Seller Dashboard Internals - Product Form */}
      <SellerDashboardProductForm 
        isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)}
        onSubmit={handleProductSubmit} editingProduct={editingProduct} isSaving={isSavingProduct}
        productError={productError} setProductError={setProductError}
      />

      {/* Success Notification */}
      <AnimatePresence>
        {orderSuccess && (
          <div className="fixed bottom-10 right-10 z-[200] bg-green-500 text-white p-6 shadow-2xl flex items-center gap-4">
            <CheckCircle className="w-8 h-8" />
            <div>
              <p className="font-serif text-xl">{lang === 'fr' ? 'Merci' : 'Thank You'}, {orderSuccess}!</p>
              <p className="text-xs uppercase tracking-widest opacity-80">Order Placed.</p>
            </div>
          </div>
        )}
        {productSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 right-10 z-[200] bg-brand-pink text-white p-6 shadow-2xl flex items-center gap-4 rounded-xl border border-white/20"
          >
            <CheckCircle className="w-8 h-8" />
            <div>
              <p className="font-serif text-xl">{lang === 'fr' ? 'Succès !' : 'Success!'}</p>
              <p className="text-xs uppercase tracking-widest opacity-80">{productSuccess}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Firebase Auth Error Modal & Preview Environment Assistant */}
      <AnimatePresence>
        {authError && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuthError(null)}
              className="absolute inset-0 bg-brand-deep/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg p-6 md:p-8 shadow-2xl border border-brand-pink/10 text-brand-deep overflow-hidden rounded-2xl"
            >
              <button 
                onClick={() => setAuthError(null)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-brand-deep" />
              </button>

              <div className="flex items-start gap-4 mt-2">
                <div className="p-3 bg-red-50 text-red-500 rounded-xl">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl mb-1 text-brand-deep">
                    {lang === 'fr' ? 'Erreur de connexion' : 'Login Error'}
                  </h3>
                  <p className="text-xs text-red-500 uppercase tracking-widest font-mono">
                    {authError.code}
                  </p>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-600 leading-relaxed space-y-4">
                <p className="font-sans font-medium text-gray-800">
                  {authError.message}
                </p>

                {authError.showHelp && (
                  <div className="bg-brand-cream/80 border border-brand-pink/20 p-4 rounded-xl mt-4 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-pink">
                      ✦ {lang === 'fr' ? 'Solution de contournement (Aperçu)' : 'Preview Environment Solution'}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {lang === 'fr' 
                        ? "En raison des restrictions d'iframe des navigateurs web récents, les connexions par pop-up tiers de Firebase Auth sont bloquées lorsqu'elles sont exécutées dans un cadre intégré d'aperçu d'éditeur."
                        : "Due to modern browser security and iframe privacy settings, Firebase Auth popups are blocked from completing authentication inside embedded editing workspace frames."}
                    </p>
                    <p className="text-xs text-gray-700 font-medium font-sans">
                      {lang === 'fr'
                        ? "👉 Veuillez ouvrir votre application directement dans un nouvel onglet autonome à l'aide de l'icône de flèche (Open in New Tab) située en haut à droite de l'aperçu AI Studio pour que la connexion s'exécute correctement."
                        : "👉 Please open the application in a standalone browser tab using the 'Open in New Tab' arrow icon at the top-right corner of the development preview window to log in."}
                    </p>
                    
                    <a 
                      href={window.location.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-brand-pink hover:bg-brand-deep text-white px-4 py-3 text-[11px] tracking-widest uppercase transition-colors rounded font-sans w-full justify-center mt-2 cursor-pointer text-center font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {lang === 'fr' ? "Ouvrir dans un nouvel onglet" : "Open in New Tab"}
                    </a>
                  </div>
                )}

                {!authError.showHelp && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 font-sans">
                    {lang === 'fr'
                      ? `Si vous utilisez un domaine personnalisé, assurez-vous d'avoir ajouté "${window.location.hostname}" à la liste des domaines autorisés ("Authorized domains") dans vos paramètres Firebase Auth console.`
                      : `If deploying to a custom domain, ensure that "${window.location.hostname}" has been explicitly whitelisted under "Authorized domains" within the Firebase Console settings.`}
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setAuthError(null)}
                  className="bg-brand-deep text-white hover:bg-brand-pink px-6 py-2.5 text-xs tracking-widest uppercase transition-colors cursor-pointer font-sans rounded-lg"
                >
                  {lang === 'fr' ? 'Fermer' : 'Close'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SellerDashboardProductForm = ({ isOpen, onClose, onSubmit, editingProduct, isSaving, productError, setProductError }: any) => {
  if (!isOpen) return null;

  const initialAdditionalImgs = editingProduct?.imgs 
    ? editingProduct.imgs.filter((item: string) => item !== editingProduct.img) 
    : [];

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center px-4">
      <div onClick={onClose} className="absolute inset-0 bg-brand-deep/60 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white w-full max-w-2xl p-10 shadow-2xl h-[90vh] overflow-y-auto">
        <h3 className="font-serif text-3xl mb-8">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
        
        {/* Error Banner */}
        {productError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-xs mb-6 flex justify-between items-start leading-relaxed">
            <div className="flex-1">
              <p className="font-semibold mb-1">Could not save product / Impossible d'enregistrer le produit :</p>
              <p className="font-mono">{productError}</p>
            </div>
            <button 
              type="button" 
              onClick={() => setProductError(null)} 
              className="text-red-400 hover:text-red-700 font-bold ml-3 text-sm px-1.5 py-0.5 hover:bg-red-100 rounded transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <input name="name" required defaultValue={editingProduct?.name} placeholder="Name" className="border p-3 outline-none" />
            <input name="price" type="number" required defaultValue={editingProduct?.price} placeholder="Price" className="border p-3 outline-none" />
          </div>
          <input name="sub" required defaultValue={editingProduct?.sub} placeholder="Subtitle" className="w-full border p-3 outline-none" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 uppercase tracking-widest font-medium">Main Image URL</label>
              <input name="img" required defaultValue={editingProduct?.img} placeholder="Image URL (e.g. /glossy-1.jpg)" className="border p-3 outline-none w-full" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 uppercase tracking-widest font-medium">Additional Image URLs (Comma-separated)</label>
              <input name="imgs" defaultValue={initialAdditionalImgs.join(', ')} placeholder="Optional extra photos (comma separated)" className="border p-3 outline-none w-full" />
            </div>
          </div>
          <input name="swatches" required defaultValue={editingProduct?.swatches?.join(', ')} placeholder="Swatches (#hex, #hex)" className="w-full border p-3 outline-none" />
          <div className="space-y-4">
            <textarea name="desc_fr" placeholder="Description FR" defaultValue={editingProduct?.desc.fr} className="w-full border p-3 h-20 outline-none" />
            <textarea name="desc_en" placeholder="Description EN" defaultValue={editingProduct?.desc.en} className="w-full border p-3 h-20 outline-none" />
            <textarea name="desc_ar" placeholder="Description AR" defaultValue={editingProduct?.desc.ar} className="w-full border p-3 h-20 outline-none text-right" dir="rtl" />
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 border py-4">Cancel</button>
            <button type="submit" disabled={isSaving} className="flex-1 bg-brand-pink text-white py-4">{isSaving ? '...' : 'Save'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
