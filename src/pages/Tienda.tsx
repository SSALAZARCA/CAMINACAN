import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Search, X, ShoppingBag, Plus, Minus, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ["Todos", "Alimento", "Juguetes", "Accesorios", "Comida"];

const Tienda: React.FC = () => {
    const { products, cart, addToCart, removeFromCart, placeOrder, wishlist, toggleWishlist } = useStore();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === "Todos" ? true : product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleCheckout = () => {
        if (!user) {
            alert("Por favor inicia sesión para completar tu pedido.");
            navigate('/login');
            return;
        }
        if (cart.length === 0) return;

        const address = prompt("¿Cuál es la dirección de envío?");
        if (address) {
            placeOrder(user.id, user.name, address); // Using ID now
            setIsCartOpen(false);
            // Redirection happens in context
        }
    };

    return (
        <div className="container py-10 min-h-screen relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Tienda CaminaCan</h1>
                    <p className="text-gray-600">Lo mejor para tu mascota, entregado en tu puerta.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            className="pl-10 pr-4 py-3 rounded-full border bg-white w-64 focus:outline-none focus:border-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow relative"
                    >
                        <ShoppingCart size={24} className="text-gray-700" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-4 overflow-x-auto pb-6 mb-4 no-scrollbar">
                {CATEGORIES.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${selectedCategory === category ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col"
                    >
                        <div className="relative mb-4 group overflow-hidden rounded-xl bg-gray-50 h-48">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleWishlist(product);
                                    }}
                                    className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${wishlist.some(p => p.id === product.id) ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-400 hover:text-red-500'}`}
                                >
                                    <Heart size={16} fill={wishlist.some(p => p.id === product.id) ? "currentColor" : "none"} />
                                </button>
                                <div className="bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-gray-600">
                                    {product.category}
                                </div>
                            </div>
                        </div>

                        <div className="flex-grow">
                            <h3 className="font-bold text-lg mb-1 leading-tight">{product.name}</h3>
                            <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product.description}</p>
                            {product.stock < 5 && (
                                <p className="text-red-500 text-xs font-bold mb-2">¡Solo revisan {product.stock}!</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                            <span className="font-bold text-xl">${product.price.toLocaleString()}</span>
                            <button
                                onClick={() => addToCart(product)}
                                className="p-2 bg-primary text-gray-900 rounded-full hover:bg-yellow-400 transition-colors shadow-sm"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Cart Sidebar */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-40"
                            onClick={() => setIsCartOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 p-6 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Tu Carrito</h2>
                                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-grow overflow-y-auto space-y-4">
                                {cart.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                        <ShoppingBag size={48} className="mb-4" />
                                        <p>Tu carrito está vacío.</p>
                                    </div>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.product.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                                            <img src={item.product.image} className="w-20 h-20 rounded-lg object-cover bg-white" alt="" />
                                            <div className="flex-grow">
                                                <h4 className="font-bold">{item.product.name}</h4>
                                                <p className="text-primary font-bold">${item.product.price.toLocaleString()}</p>

                                                <div className="flex items-center gap-3 mt-2">
                                                    <button onClick={() => removeFromCart(item.product.id)} className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow hover:bg-red-50 text-red-500">
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                                    <button onClick={() => addToCart(item.product)} className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow hover:bg-green-50 text-green-500">
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="border-t pt-6 mt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-500">Total</span>
                                    <span className="text-2xl font-bold">${cartTotal.toLocaleString()}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    disabled={cart.length === 0}
                                    className="w-full bg-primary text-gray-900 font-bold py-4 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-yellow-400/50"
                                >
                                    Realizar Pedido
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tienda;
