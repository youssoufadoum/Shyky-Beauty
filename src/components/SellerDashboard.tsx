import { motion, AnimatePresence } from 'motion/react';
import { X, Package, ShoppingBag, Plus, MapPin, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { User as FirebaseUser } from 'firebase/auth';
import { asset } from '../lib/utils';
import { SafeImage } from './UI';

interface SellerDashboardProps {
  showSellerView: boolean;
  setShowSellerView: (show: boolean) => void;
  user: FirebaseUser | null;
  sellerTab: 'orders' | 'products';
  setSellerTab: (tab: 'orders' | 'products') => void;
  orders: any[];
  products: Product[];
  updateOrderStatus: (orderId: string, status: string) => void;
  setIsProductModalOpen: (open: boolean) => void;
  setEditingProduct: (p: Product | null) => void;
  deleteProduct: (p: Product) => void;
}

export const SellerDashboard = ({
  showSellerView,
  setShowSellerView,
  user,
  sellerTab,
  setSellerTab,
  orders,
  products,
  updateOrderStatus,
  setIsProductModalOpen,
  setEditingProduct,
  deleteProduct
}: SellerDashboardProps) => {
  return (
    <AnimatePresence>
        {showSellerView && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-brand-cream/90 py-4 md:py-10 px-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-7xl h-full max-h-[95vh] shadow-2xl flex flex-col rounded-2xl md:rounded-[2.5rem] overflow-hidden"
            >
              <div className="border-b bg-white z-10 flex-none">
                {/* Top bar with quick info and close */}
                <div className="px-6 md:px-10 py-4 border-b flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center text-white text-xs font-bold">
                      {user?.email?.[0].toUpperCase()}
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">{user?.email}</span>
                  </div>
                  <button 
                    onClick={() => setShowSellerView(false)}
                    className="p-2 hover:bg-brand-pink/10 rounded-full text-brand-pink transition-colors group"
                    title="Close Dashboard"
                  >
                    <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>

                {/* Main Navigation Header */}
                <div className="px-6 md:px-10 py-8 md:py-10 flex flex-col lg:flex-row lg:items-start justify-between gap-8 bg-white">
                  <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-16">
                    <div className="flex-shrink-0">
                      <h2 className="font-serif text-3xl md:text-5xl mb-2 text-brand-deep tracking-tight">Seller Dashboard</h2>
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-brand-gold"></span>
                        <p className="text-[10px] uppercase tracking-[4px] text-brand-gold font-bold">
                          Shyky Beauty Official
                        </p>
                      </div>
                    </div>

                    <nav className="flex bg-gray-50 border border-gray-100 p-1.5 rounded-2xl self-start">
                      <button 
                        onClick={() => setSellerTab('orders')}
                        className={`flex items-center gap-3 px-8 py-3 text-[10px] uppercase tracking-[2px] rounded-xl transition-all duration-300 ${sellerTab === 'orders' ? 'bg-white shadow-lg shadow-black/5 text-brand-pink font-bold translate-y-[-1px]' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <Package className="w-3.5 h-3.5" />
                        Orders
                      </button>
                      <button 
                        onClick={() => setSellerTab('products')}
                        className={`flex items-center gap-3 px-8 py-3 text-[10px] uppercase tracking-[2px] rounded-xl transition-all duration-300 ${sellerTab === 'products' ? 'bg-white shadow-lg shadow-black/5 text-brand-pink font-bold translate-y-[-1px]' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Inventory
                      </button>
                    </nav>
                  </div>

                  <div className="flex items-center gap-6 self-start lg:self-start">
                    <div className="h-12 w-[1px] bg-gray-100 hidden md:block" />
                    
                    <div className="flex flex-col items-start lg:items-start">
                      <span className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">{sellerTab ==='orders' ? 'Active Orders' : 'Store Count'}</span>
                      <span className="text-2xl font-serif text-brand-deep leading-none">
                        {sellerTab === 'orders' ? orders.length : products.length}
                      </span>
                    </div>

                    {sellerTab === 'products' && (
                      <button 
                        onClick={() => {
                          setEditingProduct(null);
                          setIsProductModalOpen(true);
                        }}
                        className="flex items-center gap-3 bg-brand-pink text-white px-8 py-4 text-[10px] uppercase tracking-[2px] font-bold shadow-xl shadow-brand-pink/20 hover:bg-brand-deep hover:scale-[1.02] transition-all active:scale-[0.98]"
                      >
                        <Plus className="w-4 h-4" />
                        Add Product
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50/30 custom-scrollbar">
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
                        <SafeImage src={asset(prod.img)} className="w-full h-48 object-cover" alt="" />
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
  );
};
