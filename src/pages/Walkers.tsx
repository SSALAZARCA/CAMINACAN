import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Star, Shield, MapPin, Filter, Heart, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWalker } from '../context/WalkerContext';
import SEO from '../components/SEO';

const LOCATIONS: Record<string, string[]> = {
    "Bogotá": ["Chapinero", "Usaquén", "Suba", "Teusaquillo"],
    "Medellín": ["Poblado", "Laureles", "Envigado", "Belen"],
    "Cali": ["San Fernando", "Granada", "Peñón"],
    "Barranquilla": ["El Prado", "Alto Prado", "Riomar"]
};

const Walkers: React.FC = () => {
    const { activeWalkers, reviews } = useWalker();
    const [selectedCity, setSelectedCity] = useState('Todos');
    const [selectedNeighborhood, setSelectedNeighborhood] = useState('Todos');
    const [sortBy, setSortBy] = useState('recommended');
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const filteredWalkers = activeWalkers.filter(walker => {
        if (selectedCity !== 'Todos' && walker.city !== selectedCity) return false;
        if (selectedNeighborhood !== 'Todos' && walker.neighborhood !== selectedNeighborhood) return false;
        return true;
    }).sort((a, b) => {
        const priceA = a.price || 15000;
        const priceB = b.price || 15000;
        if (sortBy === 'price_asc') return priceA - priceB;
        if (sortBy === 'price_desc') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
    });

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCity(e.target.value);
        setSelectedNeighborhood('Todos');
    };

    const handleBooking = (walkerId: string, walkerName: string) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        navigate('/reservar', { state: { walkerId, walkerName } });
    };

    return (
        <div className="container py-10">
            <SEO
                title="Paseadores de Perros"
                description="Encuentra paseadores verificados en tu ciudad."
            />
            {/* Header with title and filter/sort options */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Encuentra tu Paseador Ideal</h1>
                    <p className="text-gray-600">Profesionales verificados, asegurados y amantes de los animales.</p>
                    <p className="text-xs text-gray-400 mt-2 italic">* Próximamente: Búsqueda por ubicación exacta GPS</p>
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-4 w-full md:w-auto">
                    {/* City Filter */}
                    <div className="relative group w-full md:w-auto">
                        <Filter className="absolute left-3 top-3 text-gray-400" size={18} />
                        <select
                            className="pl-10 pr-4 py-2 border rounded-full appearance-none bg-white focus:outline-none focus:border-primary w-full md:w-40"
                            value={selectedCity}
                            onChange={handleCityChange}
                        >
                            <option value="Todos">Todas las Ciudades</option>
                            {Object.keys(LOCATIONS).map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                    </div>

                    {/* Neighborhood Filter (Dynamic) */}
                    <div className="relative group w-full md:w-auto">
                        <select
                            className={`pl-4 pr-10 py-2 border rounded-full appearance-none focus:outline-none focus:border-primary w-full md:w-40 ${selectedCity === 'Todos' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white'}`}
                            value={selectedNeighborhood}
                            onChange={(e) => setSelectedNeighborhood(e.target.value)}
                            disabled={selectedCity === 'Todos'}
                        >
                            <option value="Todos">Todos los Sectores</option>
                            {selectedCity !== 'Todos' && LOCATIONS[selectedCity]?.map(hood => (
                                <option key={hood} value={hood}>{hood}</option>
                            ))}
                        </select>
                        <MapPin className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={18} />
                    </div>

                    {/* Sort */}
                    <select
                        className="px-4 py-2 border rounded-full bg-white focus:outline-none focus:border-primary w-full md:w-48"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="recommended">Recomendados</option>
                        <option value="price_asc">Menor Precio</option>
                        <option value="price_desc">Mayor Precio</option>
                        <option value="rating">Mejor Calificación</option>
                    </select>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredWalkers.map((walker, index) => (
                    <motion.div
                        key={walker.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden relative flex flex-col"
                    >
                        <div className="absolute top-4 right-4 z-10">
                            <button className="p-2 bg-white/80 backdrop-blur rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                                <Heart size={18} />
                            </button>
                        </div>

                        {walker.badges?.includes("Veterinario Jr.") && (
                            <div className="absolute top-4 left-4 z-10 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                <Shield size={12} /> VERIFICADO
                            </div>
                        )}

                        <div className="p-6 pb-0 flex gap-4">
                            <img
                                src={walker.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?fit=crop&w=200&h=200'}
                                alt={walker.name}
                                className="w-20 h-20 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform duration-500"
                            />
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{walker.name}</h3>
                                <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                                    <MapPin size={14} /> {walker.city}, {walker.neighborhood}
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                                    <Star size={14} fill="currentColor" /> {walker.rating}
                                    <span className="text-gray-400 font-normal">({reviews.filter(r => r.walkerId === walker.id).length})</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {walker.badges?.map((badge, i) => (
                                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200">
                                        {badge}
                                    </span>
                                ))}
                            </div>

                            {/* Gallery Preview */}
                            {walker.gallery && walker.gallery.length > 0 && (
                                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                                    {walker.gallery.slice(0, 3).map((img, i) => (
                                        <img key={i} src={img} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" alt="Gallery" />
                                    ))}
                                </div>
                            )}

                            <p className="text-gray-600 text-sm mb-6 line-clamp-2">"{walker.bio || 'Paseador confiable en CaminaCan'}"</p>

                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                                <div>
                                    <span className="text-xs text-gray-400 uppercase font-bold">Desde</span>
                                    <p className="text-xl font-bold text-primary">${(walker.price || 15000).toLocaleString()}<span className="text-sm text-gray-400 font-normal">/h</span></p>
                                </div>
                                <button
                                    onClick={() => handleBooking(walker.id, walker.name)}
                                    className="px-6 py-2 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
                                >
                                    Reservar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Walkers;
