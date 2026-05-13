/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Instagram, MessageCircle, X, ShoppingBag, ShoppingCart, Trash2, MapPin, Package, User, LogOut, CheckCircle } from 'lucide-react';
import { auth, db, login, logout, collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc, serverTimestamp, getDocFromServer } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

type Language = 'fr' | 'en' | 'ar';

interface TranslationSet {
  nav: { about: string; products: string; gallery: string; contact: string };
  hero: { tag: string; title: string; sub: string; discover: string; story: string; shades: string };
  about: { tag: string; title: string; text: string; contact: string };
  products: { tag: string; title: string; view: string; glossShades: string; linerShades: string; rusticCharm: string };
  gallery: { tag: string; title: string };
  stats: { shades: string; crueltyFree: string; inclusive: string };
  testimonial: { tag: string; quote: string; cite: string };
  contact: { tag: string; title: string; namePh: string; msgPh: string; send: string };
  footer: { desc: string; collections: string; new: string; copyright: string };
}

interface Product {
  id?: string;
  name: string;
  price: number;
  sub: string;
  img: string;
  imgs?: string[];
  swatches: string[];
  desc: {
    fr: string;
    en: string;
    ar: string;
  };
  createdAt?: any;
}

const translations: Record<Language, TranslationSet> = {
  fr: {
    nav: { about: 'À Propos', products: 'Produits', gallery: 'Galerie', contact: 'Contact' },
    hero: {
      tag: '✦ Glossy Collection',
      title: 'Votre <em>Éclat</em>,<br>Votre Pouvoir',
      sub: 'Des lèvres qui racontent une histoire. Duo Lip Gloss & Lip Liner de luxe, conçu pour sublimer toutes les teintes de peau. 9.000 Fcfa le duo + 1.000 Fcfa livraison.',
      discover: 'Découvrir',
      story: 'Notre Histoire',
      shades: 'Teintes Signature'
    },
    about: {
      tag: '✦ Notre Histoire',
      title: 'La beauté<br><em>sans limites</em>',
      text: "Shyky Beauty est née d'une passion pour l'inclusion et l'élégance. Notre Glossy Collection — Lip Duo associe un Lip Gloss ultra-brillant à un Lip Liner précis, créant un duo idéal pour toutes les femmes du monde à seulement 9.000 Fcfa (Frais d'expédition 1.000 Fcfa).",
      contact: 'Nous Contacter'
    },
    products: {
      tag: '✦ Boutique',
      title: 'La Collection <em>Signature</em>',
      view: 'Voir Produit',
      glossShades: 'Lip Gloss — Partie du Duo à 9.000 Fcfa',
      linerShades: 'Lip Liner — Partie du Duo à 9.000 Fcfa',
      rusticCharm: 'Lip Duo Bundle — Gloss & Liner (9.000 Fcfa)'
    },
    gallery: { tag: '✦ Galerie', title: 'Le Monde <em>Shyky</em>' },
    stats: { shades: 'Teintes Signature', crueltyFree: 'Cruelty Free', inclusive: 'Beauté Inclusive' },
    testimonial: {
      tag: '✦ Ce Qu\'elles Disent',
      quote: "« Ce Lip Duo a changé ma routine beauté. Le gloss tient toute la journée et le liner est ultra précis. Je ne peux plus m'en passer ! »",
      cite: '— Sofia M., Paris'
    },
    contact: {
      tag: '✦ Nous Contacter',
      title: 'On vous <em>répond</em>',
      namePh: 'Votre nom',
      msgPh: 'Votre message...',
      send: 'Envoyer →'
    },
    footer: {
      desc: 'La beauté est un droit, pas un privilège. Shyky Beauty célèbre chaque femme dans sa singularité.',
      collections: 'Collections',
      new: 'Nouveautés',
      copyright: '©️ 2025 Shyky Beauty. Tous droits réservés.'
    }
  },
  en: {
    nav: { about: 'About', products: 'Products', gallery: 'Gallery', contact: 'Contact' },
    hero: {
      tag: '✦ Glossy Collection',
      title: 'Your <em>Glow</em>,<br>Your Power',
      sub: 'Lips that tell a story. High quality Lip Gloss & Lip Liner, designed to enhance every skin tone. The perfect duo for 9,000 Fcfa.',
      discover: 'Discover',
      story: 'Our Story',
      shades: 'Signature Shades'
    },
    about: {
      tag: '✦ Our Story',
      title: 'Beauty<br><em>without limits</em>',
      text: 'Shyky Beauty was born from a passion for inclusion and elegance. Our Glossy Collection — Lip Duo combines an ultra-shiny Lip Gloss with a precise Lip Liner, creating the perfect duo for women everywhere at just 9,000 Fcfa.',
      contact: 'Contact Us'
    },
    products: {
      tag: '✦ Our Products',
      title: 'The <em>Signature</em> Collection',
      view: 'View Product',
      glossShades: 'Glossy Collection — Duo 9,000 Fcfa',
      linerShades: '5 shades — Long Lasting',
      rusticCharm: 'Lip Duo — Gloss & Liner (9,000 Fcfa)'
    },
    gallery: { tag: '✦ Gallery', title: 'The <em>Shyky</em> World' },
    stats: { shades: 'Signature Shades', crueltyFree: 'Cruelty Free', inclusive: 'Inclusive Beauty' },
    testimonial: {
      tag: '✦ What They Say',
      quote: "“This Lip Duo changed my beauty routine. The gloss lasts all day and the liner is ultra precise. I can't live without it!”",
      cite: '— Sofia M., Paris'
    },
    contact: {
      tag: '✦ Contact Us',
      title: 'We\'ll <em>reply</em>',
      namePh: 'Your name',
      msgPh: 'Your message...',
      send: 'Send →'
    },
    footer: {
      desc: 'Beauty is a right, not a privilege. Shyky Beauty celebrates every woman in her uniqueness.',
      collections: 'Collections',
      new: 'New Arrivals',
      copyright: '©️ 2025 Shyky Beauty. All rights reserved.'
    }
  },
  ar: {
    nav: { about: 'من نحن', products: 'المنتجات', gallery: 'المعرض', contact: 'تواصل' },
    hero: {
      tag: '✦ مجموعة لامعة',
      title: 'توهجك<br><em>قوّتك</em>',
      sub: 'شفاه تحكي قصة. جلوس الشفاه وتحديد الشفاه عالي الجودة، مصمم لتعزيز كل لون بشرة. الثنائي المثالي بـ 9000 فرنك أفريقي.',
      discover: 'اكتشفي',
      story: 'قصتنا',
      shades: 'ألوان مميزة'
    },
    about: {
      tag: '✦ قصتنا',
      title: 'الجمال<br><em>بلا حدود</em>',
      text: 'وُلدت Shyky Beauty من شغف بالشمولية والأناقة. تجمع مجموعتنا اللامعة — Lip Duo بين جلوس شفاه فائق اللمعان ومحدد شفاه دقيق، لخلق ثنائي مثالي لكل نساء العالم بـ 9000 فرنك أفريقي فقط.',
      contact: 'تواصلي معنا'
    },
    products: {
      tag: '✦ منتجاتنا',
      title: 'المجموعة <em>المميزة</em>',
      view: 'عرض المنتج',
      glossShades: 'مجموعة لامعة — ثنائي بـ 9000 فرنك',
      linerShades: '5 ألوان — طويل الأمد',
      rusticCharm: 'Lip Duo — جلوس ومحدد (9000 فرنك)'
    },
    gallery: { tag: '✦ معرض', title: 'عالم <em>Shyky</em>' },
    stats: { shades: 'ألوان مميزة', crueltyFree: 'خالٍ من القسوة', inclusive: 'جمال شامل' },
    testimonial: {
      tag: '✦ ما يقلنه',
      quote: "« لقد غيّر هذا الثنائي روتين جمالي تمامًا. الجلوس يدوم طوال اليوم والمحدد دقيق للغاية. لا أستطيع الاستغناء عنه! »",
      cite: '— صوفيا م.، باريس'
    },
    contact: {
      tag: '✦ تواصلي معنا',
      title: 'سنرد <em>عليك</em>',
      namePh: 'اسمك',
      msgPh: 'رسالتك...',
      send: 'إرسال →'
    },
    footer: {
      desc: 'الجمال حق، وليس امتيازاً. تحتفل Shyky Beauty بكل امرأة في تفردها.',
      collections: 'المجموعات',
      new: 'وصل حديثاً',
      copyright: '©️ 2025 Shyky Beauty. جميع الحقوق محفوظة.'
    }
  }
};

const SectionTitle = ({ html, className = "" }: { html: string, className?: string }) => (
  <h2 
    className={`font-serif text-4xl md:text-5xl font-light leading-tight mb-6 ${className}`}
    dangerouslySetInnerHTML={{ __html: html.replace(/<em>/g, '<em class="italic text-brand-pink">') }}
  />
);

const Reveal = ({ children, className = "", ...props }: { children: ReactNode, className?: string, [key: string]: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    name: "Lip Gloss",
    price: 9000,
    sub: "Glossy Collection — Duo 9.000 Fcfa",
    img: "/glossy-1.jpg",
    imgs: [
      "/glossy-1.jpg",
      "/glossy-2.jpg",
      "/glossy-3.jpg",
      "/glossy-4.jpg",
      "/glossy-5.jpg",
      "/glossy-6.jpg"
    ],
    swatches: ["#FFC0CB", "#FFB6C1", "#7B3F00", "#F5F5DC", "#FFF8DC"],
    desc: {
      fr: "Un gloss ultra-brillant qui nourrit vos lèvres tout en leur donnant un éclat incomparable. Texture non collante et longue tenue. Couleurs: Pink, Light Pink, Chocolate, Beige, Light Beige.",
      en: "An ultra-shiny gloss that nourishes your lips while giving them an incomparable glow. Non-sticky texture and long lasting. Colors: Pink, Light Pink, Chocolate, Beige, Light Beige.",
      ar: "جلوس فائق اللمعان يغذي شفتيك ويمنحهما توهجاً لا مثيل له. ملمس غير لزج ويدوم طويلاً. الألوان: وردي، وردي فاتح، شوكولاتة، بيج، بيج فاتح."
    },
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    name: "Lip Liner",
    price: 9000,
    sub: "5 shades — Long Lasting",
    img: "/liner-1.jpg",
    swatches: ["#3D2B1F", "#CD7F32", "#DC143C", "#E6A8D7", "#3B2F2F"],
    desc: {
      fr: "Un traceur de lèvres précis et longue tenue pour définir parfaitement votre sourire. Couleurs: Dunk, Bronze, Crimson, Petal, Espresso.",
      en: "A precise, long-lasting lip liner to perfectly define your smile. Colors: Dunk, Bronze, Crimson, Petal, Espresso.",
      ar: "محدد شفاه دقيق ويدوم طويلاً لتحديد ابتسامتك بشكل مثالي. الألوان: دانك، برونزي، قرمزي، بيتال، إسبريسو."
    },
    createdAt: "2024-01-01T00:00:00Z"
  }
];

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

  const AUTHORIZED_USERS = ['y.adamabakar81@gmail.com', 'shykybeauty@yahoo.com'];

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
        console.log("Firebase connection successful");
      } catch (error) {
        if (error instanceof Error && error.message.includes('permission')) {
          console.error("Test connection failed: permissions");
        } else {
          console.error("Firebase test connection failed:", error);
        }
      }
    }
    testConn();

    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbProducts = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      
      // Merge initial products with database products
      // Filter out products that have been "hidden"
      const combined = INITIAL_PRODUCTS
        .filter(p => !hiddenInitialNames.includes(p.name))
        .map(p => ({ ...p }));
      
      dbProducts.forEach(dbProd => {
        const index = combined.findIndex(p => p.name === dbProd.name);
        if (index !== -1) {
          combined[index] = dbProd;
        } else {
          combined.push(dbProd);
        }
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

  const addToCart = (product: any, color: string | null) => {
    setCart(prev => {
      const existing = prev.find(item => item.name === product.name && item.color === color);
      if (existing) {
        return prev.map(item => (item.name === product.name && item.color === color) ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, price: product.price || 9000, color }];
    });
    setIsCartOpen(true);
  };

  const handleAuthLogin = async () => {
    setIsLoggingIn(true);
    try {
      const u = await login();
      if (u) {
        const isAuthorized = AUTHORIZED_USERS.includes(u.email || '');
        if (!isAuthorized) {
          alert(`Success! Logged in as ${u.email}. However, this email is not on the authorized list for the Seller Dashboard.`);
        } else if (!u.emailVerified) {
          alert("Email not verified. For security, the Seller Dashboard is only available to verified emails. Please check your Google account settings.");
        } else {
          alert("Welcome! You are now logged in as an administrator.");
        }
      }
    } catch (err: any) {
      alert(err.message || "Auth error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const removeFromCart = (name: string, color: string | null) => {
    setCart(prev => prev.filter(item => !(item.name === name && item.color === color)));
  };

  const updateQuantity = (name: string, color: string | null, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.name === name && item.color === color) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
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
      setOrderSuccess(orderData.customerName as string);
      setTimeout(() => setOrderSuccess(null), 5000);
    } catch (error) {
      const errInfo = handleFirestoreError(error, OperationType.CREATE, 'orders');
      alert(`Order error: ${errInfo.error}\n\nPlease check if your email is verified if you are an admin.`);
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
    
    const productData: Omit<Product, 'id'> = {
      name: String(formData.get('name')),
      price: Number(formData.get('price')),
      sub: String(formData.get('sub')),
      img: String(formData.get('img')),
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
      } else {
        await addDoc(collection(db, 'products'), productData);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
      alert("Failed to save product.");
    } finally {
      setIsSavingProduct(false);
    }
  };

  const deleteProduct = async (prod: Product) => {
    if (!isAdmin) {
      alert("Admin access denied. Please ensure you are logged in with an authorized email and it is verified.");
      return;
    }
    if (!confirm(`Are you sure you want to delete "${prod.name}"?`)) return;

    if (prod.id) {
      try {
        await deleteDoc(doc(db, 'products', prod.id));
        alert("Product deleted successfully.");
      } catch (error) {
        const errInfo = handleFirestoreError(error, OperationType.DELETE, `products/${prod.id}`);
        alert(`Delete failed: ${errInfo.error}`);
      }
    } else {
      // It's an initial product, we hide it locally
      setHiddenInitialNames(prev => [...prev, prod.name]);
      alert(`${prod.name} has been hidden from the storefront.`);
    }
  };

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const contact = (form.elements.namedItem('contact') as HTMLInputElement).value;
    const msg = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
    
    const subject = encodeURIComponent(`Message - ${name}`);
    const body = encodeURIComponent(`${msg}\n\nDe: ${name}\nContact: ${contact}`);
    // Contact initiated
  };

  return (
    <div className={`min-h-screen ${isAr ? 'font-sans' : 'font-sans'}`}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-5 md:px-10 py-4 flex items-center justify-between bg-brand-cream/90 backdrop-blur-md border-b border-brand-pink/10">
        <a className="logo" href="#">Shyky<span>Beauty</span></a>
        
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
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-pink text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cart.reduce((a, b) => a + b.quantity, 0)}
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

      {/* Hero Section */}
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 pt-20">
        <div className="flex flex-col justify-center px-10 md:px-20 py-20 bg-brand-light">
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[11px] tracking-[4px] uppercase text-brand-gold mb-6"
          >
            {t.hero.tag}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl font-light leading-tight text-brand-deep mb-4"
            dangerouslySetInnerHTML={{ __html: t.hero.title.replace(/<em>/g, '<em class="italic text-brand-pink">') }}
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm leading-relaxed text-gray-500 max-w-sm mb-10"
          >
            {t.hero.sub}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <a href="#products" className="bg-brand-pink text-white px-10 py-4 text-[12px] tracking-[3px] uppercase hover:bg-brand-dark-pink transition-colors">
              {t.hero.discover}
            </a>
            <a href="#about" className="border border-brand-deep text-brand-deep px-10 py-4 text-[12px] tracking-[3px] uppercase hover:bg-brand-deep hover:text-white transition-all">
              {t.hero.story}
            </a>
          </motion.div>
        </div>
        <div className="relative overflow-hidden bg-[#f0dae2] aspect-[4/5] lg:aspect-auto">
          <Reveal 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-full object-cover"
          >
            <img 
              className="w-full h-full object-cover"
              src="/input_file_4.png" 
              alt="Shyky Beauty Model"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&q=85"; }}
            />
          </Reveal>
          <div className={`absolute bottom-10 ${isAr ? 'right-10' : 'left-10'} bg-white/95 p-6 border-brand-pink ${isAr ? 'border-r-4' : 'border-l-4'}`}>
            <div className="font-serif text-4xl text-brand-pink leading-none">9k</div>
            <div className="text-[11px] tracking-[2px] uppercase text-gray-400 mt-1">Fcfa / Lip Duo</div>
          </div>
        </div>
      </section>

      {/* Marquee Strip */}
      <div className="bg-brand-pink py-4 overflow-hidden whitespace-nowrap">
        <div className="inline-flex animate-marquee">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="flex">
              <span className="text-[11px] tracking-[3px] uppercase text-white px-10">Lip Duo</span>
              <span className="text-[11px] tracking-[3px] uppercase text-white px-10">✦</span>
              <span className="text-[11px] tracking-[3px] uppercase text-white px-10">Glossy Collection</span>
              <span className="text-[11px] tracking-[3px] uppercase text-white px-10">✦</span>
              <span className="text-[11px] tracking-[3px] uppercase text-white px-10">Lip Liner</span>
              <span className="text-[11px] tracking-[3px] uppercase text-white px-10">✦</span>
              <span className="text-[11px] tracking-[3px] uppercase text-white px-10">Your Glow, Your Power</span>
              <span className="text-[11px] tracking-[3px] uppercase text-white px-10">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 py-20 px-10 md:px-20" id="about">
        <Reveal className="grid grid-cols-2 gap-2 h-full">
          <img className="w-full h-[320px] object-cover self-end" src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=85" alt="Beauty" />
          <img className="w-full h-[260px] object-cover mt-10" src="https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&q=85" alt="Lipstick" />
        </Reveal>
        <Reveal className="flex flex-col justify-center">
          <p className="text-[11px] tracking-[4px] uppercase text-brand-gold mb-5">{t.about.tag}</p>
          <SectionTitle html={t.about.title} />
          <p className="text-sm leading-relaxed text-gray-500 mb-8">{t.about.text}</p>
          <a href="#contact" className="bg-brand-pink text-white self-start px-10 py-4 text-[12px] tracking-[3px] uppercase hover:bg-brand-dark-pink transition-colors">
            {t.about.contact}
          </a>
        </Reveal>
      </section>

      {/* Products Section */}
      <section className="py-20 px-10 md:px-20 bg-brand-light" id="products">
        <div className="text-center mb-16">
          <p className="text-[11px] tracking-[4px] uppercase text-brand-gold mb-5">{t.products.tag}</p>
          <SectionTitle html={t.products.title} className="text-center" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 px-0">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white/50 border border-dashed rounded-lg">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-brand-pink/20" />
              <p className="font-serif text-2xl text-brand-deep/40">La boutique est en cours de préparation...</p>
              <p className="text-xs uppercase tracking-widest text-brand-gold mt-2">Revenez bientôt</p>
            </div>
          ) : (
            products.map((prod, idx) => (
              <div key={prod.id || idx} onClick={() => {
                setSelectedProduct(prod);
                setActiveImgIndex(0);
              }}>
                <Reveal className="group relative bg-white overflow-hidden cursor-pointer h-full">
                  <div className="overflow-hidden aspect-[4/5]">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      src={prod.img} 
                      alt={prod.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=85";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                      <p className="text-white font-serif text-2xl italic mb-4">{prod.name}</p>
                      <span className="text-white text-[11px] tracking-[3px] uppercase border border-white px-7 py-3 transition-colors hover:bg-white hover:text-brand-deep">
                        {t.products.view}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="font-serif text-xl mb-1">{prod.name}</p>
                    <p className="text-[11px] tracking-[2px] uppercase text-gray-400 mb-3">{prod.sub}</p>
                    <div className="flex gap-1.5">
                      {prod.swatches.map((color, i) => (
                        <div key={i} className="w-4 h-4 rounded-full border-2 border-white ring-1 ring-black/10" style={{ background: color }} />
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-10 md:px-20" id="gallery">
        <div className="text-center mb-12">
          <p className="text-[11px] tracking-[4px] uppercase text-brand-gold mb-5">{t.gallery.tag}</p>
          <SectionTitle html={t.gallery.title} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <Reveal className="lg:row-span-2 overflow-hidden">
            <img 
              className="w-full h-full object-cover aspect-[4/5] lg:aspect-auto hover:scale-105 transition-transform duration-500" 
              src="/input_file_2.png" 
              alt="Model" 
              onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=85"; }}
            />
          </Reveal>
          <Reveal className="overflow-hidden h-64 md:h-80">
            <img 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
              src="/input_file_0.png" 
              alt="Product" 
              onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&q=85"; }}
            />
          </Reveal>
          <Reveal className="overflow-hidden h-64 md:h-80">
            <img 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
              src="/input_file_6.png" 
              alt="Makeup" 
              onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&q=85"; }}
            />
          </Reveal>
          <Reveal className="overflow-hidden h-64 md:h-80">
            <img 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
              src="/input_file_1.png" 
              alt="Beauty" 
              onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=85"; }}
            />
          </Reveal>
          <Reveal className="overflow-hidden h-64 md:h-80">
            <img 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
              src="/input_file_3.png" 
              alt="Gloss" 
              onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1614093302611-8efc90c35d3f?w=500&q=85"; }}
            />
          </Reveal>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-brand-deep py-20 px-10 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { num: '5', label: t.stats.shades },
          { num: '100%', label: t.stats.crueltyFree },
          { num: '∞', label: t.stats.inclusive },
        ].map((stat, i) => (
          <div key={i} className="text-center md:border-r last:border-0 border-white/10 py-5">
            <div className="font-serif text-6xl text-brand-pink leading-none mb-3">{stat.num}</div>
            <div className="text-[11px] tracking-[3px] uppercase text-white/50">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Testimonial Section */}
      <section className="bg-brand-blush py-24 px-10 md:px-20 text-center">
        <Reveal>
          <p className="text-[11px] tracking-[4px] uppercase text-brand-gold mb-8">{t.testimonial.tag}</p>
          <blockquote className="font-serif text-2xl md:text-3xl italic font-light text-brand-deep max-w-2xl mx-auto leading-relaxed mb-6">
            {t.testimonial.quote}
          </blockquote>
          <cite className="text-[11px] tracking-[3px] uppercase text-brand-pink block">{t.testimonial.cite}</cite>
        </Reveal>
      </section>

      {/* Contact Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2" id="contact">
        <div className="hidden lg:block overflow-hidden max-h-[600px]">
          <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1521341957697-b93449760f30?w=800&q=85" alt="Contact" />
        </div>
        <Reveal className="p-10 md:p-20 bg-brand-light flex flex-col justify-center">
          <p className="text-[11px] tracking-[4px] uppercase text-brand-gold mb-5">{t.contact.tag}</p>
          <SectionTitle html={t.contact.title} />
          
          <div className="bg-brand-pink/5 border border-brand-pink/20 p-4 mb-8 text-brand-pink text-sm tracking-wide flex items-center gap-3">
            <MessageSquare className="w-5 h-5" />
            shykybeauty@yahoo.com
          </div>

          <form onSubmit={sendMessage} className="space-y-6">
            <input 
              name="name"
              required
              className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:border-brand-pink outline-none transition-colors"
              placeholder={t.contact.namePh}
            />
            <input 
              name="contact"
              required
              className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:border-brand-pink outline-none transition-colors"
              placeholder="Contact"
            />
            <textarea 
              name="message"
              required
              className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:border-brand-pink outline-none transition-colors min-h-[100px] resize-none"
              placeholder={t.contact.msgPh}
            />
            <button type="submit" className="bg-brand-pink text-white px-10 py-4 text-[12px] tracking-[3px] uppercase hover:bg-brand-dark-pink transition-colors">
              {t.contact.send}
            </button>
          </form>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="bg-brand-deep py-20 px-10 md:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-white/40">
        <div className="lg:col-span-2">
          <div className="logo text-white/90">Shyky<span className="text-white/30">Beauty</span></div>
          <p className="text-sm leading-relaxed mt-6 max-w-sm">
            {t.footer.desc}
          </p>
        </div>
        <div>
          <h4 className="text-[11px] tracking-[3px] uppercase text-white/20 mb-6">{t.footer.collections}</h4>
          <ul className="space-y-3 list-none p-0">
            <li><a href="#products" className="text-[13px] hover:text-brand-pink transition-colors">Lip Gloss</a></li>
            <li><a href="#products" className="text-[13px] hover:text-brand-pink transition-colors">Lip Liner</a></li>
            <li><a href="#products" className="text-[13px] hover:text-brand-pink transition-colors">Lip Duo</a></li>
            <li><a href="#products" className="text-[13px] hover:text-brand-pink transition-colors">{t.footer.new}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[11px] tracking-[3px] uppercase text-white/20 mb-6">{t.nav.contact}</h4>
          <span className="text-[13px] text-brand-pink font-medium block mb-4">shykybeauty@yahoo.com</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-brand-pink transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="hover:text-brand-pink transition-colors"><MessageCircle className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
      <div className="bg-brand-deep border-t border-white/5 py-6 px-10 md:px-20 text-center">
        <p className="text-[10px] tracking-[1px] text-white/20">{t.footer.copyright}</p>
      </div>

      {/* Product Info Modal */}
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
                      setSelectedProduct(null);
                      setSelectedColor(null);
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

      {/* Cart Drawer */}
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
                  ))
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

      {/* Checkout Modal */}
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

      {/* Success Notification */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-10 right-10 md:left-auto md:right-10 z-[200] bg-green-500 text-white p-6 shadow-2xl flex items-center gap-4"
          >
            <CheckCircle className="w-8 h-8" />
            <div>
              <p className="font-serif text-xl">{lang === 'fr' ? 'Merci' : lang === 'ar' ? 'شكراً لك' : 'Thank You'}, {orderSuccess}!</p>
              <p className="text-xs uppercase tracking-widest opacity-80">{lang === 'fr' ? 'Votre commande est enregistrée.' : lang === 'ar' ? 'تم تسجيل طلبك.' : 'Your order is placed.'}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Seller Dashboard Modal */}
      <AnimatePresence>
        {showSellerView && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-brand-cream py-20 px-4">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-white w-full max-w-6xl min-h-[80vh] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-8">
                  <div>
                    <h2 className="font-serif text-4xl mb-2">Seller Dashboard</h2>
                    <p className="text-xs uppercase tracking-[4px] text-brand-gold">
                      {sellerTab === 'orders' ? 'Managing Orders' : 'Managing Products'}
                    </p>
                  </div>
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                      onClick={() => setSellerTab('orders')}
                      className={`px-6 py-2 text-xs uppercase tracking-widest rounded-md transition-all ${sellerTab === 'orders' ? 'bg-white shadow-sm text-brand-pink' : 'text-gray-400'}`}
                    >
                      Orders
                    </button>
                    <button 
                      onClick={() => setSellerTab('products')}
                      className={`px-6 py-2 text-xs uppercase tracking-widest rounded-md transition-all ${sellerTab === 'products' ? 'bg-white shadow-sm text-brand-pink' : 'text-gray-400'}`}
                    >
                      Products
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {sellerTab === 'products' && (
                    <button 
                      onClick={() => {
                        setEditingProduct(null);
                        setIsProductModalOpen(true);
                      }}
                      className="bg-brand-pink text-white px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-brand-dark-pink transition-colors"
                    >
                      Add Product
                    </button>
                  )}
                  <button 
                    onClick={() => setShowSellerView(false)}
                    className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-8 h-8" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-8">
                {sellerTab === 'orders' ? (
                  orders.length === 0 ? (
                    <div className="text-center py-20 text-gray-300">
                      <Package className="w-16 h-16 mx-auto mb-6 opacity-20" />
                      <p className="font-serif text-2xl">No orders yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border p-6 hover:shadow-lg transition-shadow bg-brand-light/20 relative overflow-hidden flex flex-col">
                          <div className={`absolute top-0 right-0 px-4 py-1 text-[10px] uppercase font-medium tracking-widest ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            order.status === 'preparing' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100'
                          }`}>
                            {order.status}
                          </div>
                          
                          <div className="mb-6">
                            <p className="text-xs text-gray-400 mb-1">Customer</p>
                            <p className="font-serif text-xl">{order.customerName}</p>
                            <p className="text-sm font-medium text-brand-pink">{order.customerContact}</p>
                          </div>
  
                            <div className="mb-6 space-y-2">
                              <p className="text-xs text-gray-400">Items</p>
                              {order.items.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between text-sm">
                                  <span>
                                    {item.name} {item.color && item.color !== 'N/A' && `(${item.color})`} x{item.quantity}
                                  </span>
                                  <span className="text-gray-400">{item.price * item.quantity} Fcfa</span>
                                </div>
                              ))}
                            <div className="pt-2 border-t flex justify-between font-bold">
                              <span>Total</span>
                              <span>{order.totalAmount} Fcfa</span>
                            </div>
                          </div>
  
                          <div className="mb-6">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                              {order.orderType === 'delivery' ? <MapPin className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
                              <span className="uppercase tracking-widest">{order.orderType}</span>
                            </div>
                            {order.orderType === 'delivery' && (
                              <p className="text-xs bg-white p-3 border border-dashed border-gray-200">{order.address}</p>
                            )}
                          </div>
  
                          <div className="grid grid-cols-2 gap-2 mt-auto">
                            <select 
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="bg-white border text-xs p-2 outline-none focus:border-brand-pink"
                            >
                              <option value="pending">Pending</option>
                              <option value="preparing">Preparing</option>
                              <option value="delivered">Delivered</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button className="bg-brand-deep text-white text-[10px] uppercase tracking-widest py-2 hover:bg-brand-pink transition-colors">
                              Print
                            </button>
                          </div>
                          
                          <p className="text-[9px] text-gray-400 mt-6 text-right">
                            {order.createdAt?.toDate().toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((prod, idx) => (
                      <div key={prod.id || idx} className="border bg-white overflow-hidden flex flex-col">
                        <img src={prod.img} className="w-full h-48 object-cover" alt="" />
                        <div className="p-6 flex-1 flex flex-col">
                          <h4 className="font-serif text-xl mb-1">{prod.name}</h4>
                          <p className="text-brand-pink text-sm font-medium mb-2">{prod.price} Fcfa</p>
                          <p className="text-xs text-gray-400 mb-4 line-clamp-2">{prod.sub}</p>
                          
                          <div className="flex gap-2 mt-auto">
                            <button 
                              onClick={() => {
                                setEditingProduct(prod);
                                setIsProductModalOpen(true);
                              }}
                              className="flex-1 bg-gray-100 text-[10px] uppercase tracking-widest py-3 hover:bg-brand-pink hover:text-white transition-all"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => deleteProduct(prod)}
                              className="px-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Edit/Add Modal */}
              <AnimatePresence>
                {isProductModalOpen && (
                  <div className="fixed inset-0 z-[210] flex items-center justify-center px-4">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsProductModalOpen(false)}
                      className="absolute inset-0 bg-brand-deep/60 backdrop-blur-md"
                    />
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="relative bg-white w-full max-w-2xl p-10 shadow-2xl h-[90vh] overflow-y-auto"
                    >
                      <h3 className="font-serif text-3xl mb-8">
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                      </h3>
                      
                      <form onSubmit={handleProductSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-gray-400">Name</label>
                            <input name="name" required defaultValue={editingProduct?.name} className="w-full border p-3 focus:border-brand-pink outline-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-gray-400">Price (Fcfa)</label>
                            <input name="price" type="number" required defaultValue={editingProduct?.price} className="w-full border p-3 focus:border-brand-pink outline-none" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-gray-400">Subtitle (English)</label>
                          <input name="sub" required defaultValue={editingProduct?.sub} className="w-full border p-3 focus:border-brand-pink outline-none" />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-gray-400">Image URL</label>
                          <input name="img" required defaultValue={editingProduct?.img} className="w-full border p-3 focus:border-brand-pink outline-none" />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-gray-400">Swatches (Hex codes, comma separated)</label>
                          <input name="swatches" required defaultValue={editingProduct?.swatches.join(',')} placeholder="#ffffff, #000000" className="w-full border p-3 focus:border-brand-pink outline-none" />
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                          <label className="text-xs uppercase tracking-widest text-brand-gold font-bold">Descriptions</label>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase text-gray-400">Français</label>
                            <textarea name="desc_fr" required defaultValue={editingProduct?.desc.fr} className="w-full border p-3 focus:border-brand-pink outline-none h-24 resize-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase text-gray-400">English</label>
                            <textarea name="desc_en" required defaultValue={editingProduct?.desc.en} className="w-full border p-3 focus:border-brand-pink outline-none h-24 resize-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase text-gray-400">العربية</label>
                            <textarea name="desc_ar" required defaultValue={editingProduct?.desc.ar} className="w-full border p-3 focus:border-brand-pink outline-none h-24 resize-none text-right" dir="rtl" />
                          </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                          <button 
                            type="button" 
                            onClick={() => setIsProductModalOpen(false)}
                            className="flex-1 border py-4 text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            disabled={isSavingProduct}
                            className="flex-2 bg-brand-pink text-white py-4 text-[10px] uppercase tracking-widest hover:bg-brand-dark-pink transition-colors disabled:opacity-50"
                          >
                            {isSavingProduct ? 'Saving...' : 'Save Product'}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
