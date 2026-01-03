import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    description: string;
    stock: number;
}

export interface Order {
    id: string;
    userId: string; // Email or ID
    userName: string;
    items: { product: Product; quantity: number }[];
    total: number;
    status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
    date: string;
    address: string;
}

interface StoreContextType {
    products: Product[];
    orders: Order[];
    cart: { product: Product; quantity: number }[];
    wishlist: Product[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (id: number, product: Partial<Product>) => void;
    deleteProduct: (id: number) => void;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    placeOrder: (userId: string, userName: string, address: string) => void;
    updateOrderStatus: (orderId: string, status: Order['status']) => void;
    toggleWishlist: (product: Product) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

import { API_URL, getHeaders } from '../api/config';

// ... existing interfaces ...

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    const [wishlist, setWishlist] = useState<Product[]>([]);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/store/products`);
            if (res.ok) setProducts(await res.json());
        } catch (error) {
            console.error(error);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API_URL}/store/orders`, { headers: getHeaders() });
            if (res.ok) setOrders(await res.json());
        } catch (error) {
            console.error(error);
        }
    };

    const fetchWishlist = async () => {
        try {
            const res = await fetch(`${API_URL}/store/wishlist`, { headers: getHeaders() });
            if (res.ok) setWishlist(await res.json());
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProducts();
        if (localStorage.getItem('caminacan_token')) {
            fetchOrders();
            fetchWishlist();
        }
    }, []);

    useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);

    const addProduct = async (productData: Omit<Product, 'id'>) => {
        // ... implementation for admin (optional for now)
    };

    const updateProduct = (id: number, updates: Partial<Product>) => {
        // ...
    };

    const deleteProduct = (id: number) => {
        // ...
    };

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const clearCart = () => setCart([]);

    const toggleWishlist = async (product: Product) => {
        try {
            const res = await fetch(`${API_URL}/store/wishlist`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ productId: product.id })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.action === 'added') {
                    setWishlist(prev => [...prev, product]);
                } else {
                    setWishlist(prev => prev.filter(p => p.id !== product.id));
                }
            }
        } catch (error) {
            console.error("Error toggling wishlist", error);
        }
    };

    const placeOrder = async (userId: string, userName: string, address: string) => {
        const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const items = cart.map(item => ({ productId: item.product.id, quantity: item.quantity }));
        const itemsWithDetails = cart.map(item => ({
            id: item.product.id,
            title: item.product.name,
            quantity: item.quantity,
            price: item.product.price
        }));

        try {
            // 1. Create Order (Checks Stock)
            const orderRes = await fetch(`${API_URL}/store/orders`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ items, total, address, userName })
            });

            if (!orderRes.ok) {
                const err = await orderRes.json();
                alert(`Error: ${err.error || 'Stock insuficiente'}`);
                return;
            }

            const order = await orderRes.json();
            clearCart();
            fetchOrders();

            // 2. Create Payment Preference
            const paymentRes = await fetch(`${API_URL}/payment/preference`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ items: itemsWithDetails, orderId: order.id })
            });

            if (paymentRes.ok) {
                const preference = await paymentRes.json();
                // Redirect to MercadoPago
                window.location.href = preference.init_point;
            }

        } catch (error) {
            console.error("Order failed", error);
            alert("Error procesando la orden");
        }
    };

    const updateOrderStatus = (orderId: string, status: Order['status']) => {
        // ...
    };

    return (
        <StoreContext.Provider value={{
            products,
            orders,
            cart,
            wishlist,
            addProduct,
            updateProduct,
            deleteProduct,
            addToCart,
            removeFromCart,
            clearCart,
            placeOrder,
            updateOrderStatus,
            toggleWishlist
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error('useStore must be used within a StoreProvider');
    return context;
};
