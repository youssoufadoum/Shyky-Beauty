import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle } from 'lucide-react';
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
  
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
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
    try {
      const u = await login();
      if (u) {
        const isAuthorized = AUTHORIZED_USERS.includes(u.email || '');
        if (!isAuthorized) alert(`Authorized list check failed for ${u.email}`);
        else if (!u.emailVerified) alert("Email not verified.");
      }
    } catch (err: any) {
      alert(err.message || "Auth error");
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
    if (!isAdmin) return;
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
      if (editingProduct?.id) await updateDoc(doc(db, 'products', editingProduct.id), productData);
      else await addDoc(collection(db, 'products'), productData);
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
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
      </AnimatePresence>
    </div>
  );
}

const SellerDashboardProductForm = ({ isOpen, onClose, onSubmit, editingProduct, isSaving }: any) => {
  if (!isOpen) return null;

  const initialAdditionalImgs = editingProduct?.imgs 
    ? editingProduct.imgs.filter((item: string) => item !== editingProduct.img) 
    : [];

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center px-4">
      <div onClick={onClose} className="absolute inset-0 bg-brand-deep/60 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white w-full max-w-2xl p-10 shadow-2xl h-[90vh] overflow-y-auto">
        <h3 className="font-serif text-3xl mb-8">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
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
