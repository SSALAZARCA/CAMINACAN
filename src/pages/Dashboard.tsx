import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePets, type Pet } from '../context/PetContext';
import { useBookings } from '../context/BookingContext';
import { useWalker } from '../context/WalkerContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, Dog, Calendar, Clock, MapPin, Info, Activity, ShieldCheck, Heart, XCircle, Star, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import { Package } from 'lucide-react';
import { getImageUrl } from '../utils/imageHelper';

const OrdersSection: React.FC<{ userEmail: string }> = ({ userEmail }) => {
    // ... existing ...
    const { orders } = useStore();
    const userOrders = orders.filter(o => o.userId === userEmail);

    if (userOrders.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mt-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Package className="text-purple-500" /> Mis Pedidos
            </h2>
            <div className="space-y-4">
                {userOrders.map(order => (
                    <div key={order.id} className="border border-gray-100 rounded-xl p-4 flex justify-between items-center bg-gray-50">
                        <div>
                            <div className="text-sm font-bold text-gray-900">Pedido #{order.id.slice(-6)}</div>
                            <div className="text-xs text-gray-500">{order.date} • {order.items.length} items</div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-purple-700">${order.total.toLocaleString()}</div>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                }`}>
                                {order.status === 'Pending' ? 'Pendiente' :
                                    order.status === 'Shipped' ? 'En Camino' :
                                        order.status === 'Delivered' ? 'Entregado' : 'Cancelado'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Dashboard: React.FC = () => {
    const { user, logout, updateProfile, deleteAccount } = useAuth();
    const { pets, addPet, removePet } = usePets();
    const { bookings, updateBookingStatus } = useBookings();
    const { addReview } = useWalker();
    const navigate = useNavigate();

    const [isConfirming, setIsConfirming] = useState<string | null>(null);
    const [isAddingPet, setIsAddingPet] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', avatar: '', password: '' });
    const [newPet, setNewPet] = useState({
        name: '', breed: '', age: '', size: 'Mediano' as const, image: '',
        medicalConditions: '', allergies: '', behavior: '', vaccines: '', walkingInstructions: ''
    });
    const [viewingPet, setViewingPet] = useState<Pet | null>(null);
    const [reviewingBooking, setReviewingBooking] = useState<any | null>(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleAddPet = (e: React.FormEvent) => {
        e.preventDefault();
        addPet({
            name: newPet.name,
            breed: newPet.breed,
            age: Number(newPet.age),
            size: newPet.size,
            image: newPet.image || `https://images.unsplash.com/photo-1543466835-00a7907e9de1?fit=crop&w=200&h=200`,
            medicalConditions: newPet.medicalConditions,
            allergies: newPet.allergies,
            behavior: newPet.behavior,
            vaccines: newPet.vaccines,
            walkingInstructions: newPet.walkingInstructions
        });
        setIsAddingPet(false);
        setNewPet({
            name: '', breed: '', age: '', size: 'Mediano', image: '',
            medicalConditions: '', allergies: '', behavior: '', vaccines: '', walkingInstructions: ''
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmado': return 'bg-green-100 text-green-700';
            case 'En Progreso': return 'bg-blue-100 text-blue-700';
            case 'Pendiente': return 'bg-yellow-100 text-yellow-700';
            case 'Finalizado': return 'bg-gray-100 text-gray-400';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await updateProfile(editForm);
        if (success) {
            alert('Perfil actualizado correctamente');
            setIsEditingProfile(false);
        } else {
            alert('Error al actualizar el perfil');
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
            const success = await deleteAccount();
            if (success) {
                navigate('/');
            } else {
                alert('Error al eliminar la cuenta');
            }
        }
    };

    return (
        <div className="container px-4 py-10 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative group shrink-0">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 overflow-hidden border-2 border-white shadow-sm">
                            <img
                                src={getImageUrl(user?.avatar)}
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button
                            onClick={() => {
                                setEditForm({ name: user?.name || '', avatar: user?.avatar || '', password: '' });
                                setIsEditingProfile(true);
                            }}
                            className="absolute -bottom-1 -right-1 bg-white text-gray-700 p-1.5 rounded-full shadow-md hover:text-primary transition-colors"
                        >
                            <Pencil size={12} />
                        </button>
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 line-clamp-1">Hola, {user?.name}</h1>
                        <p className="text-gray-500 text-sm md:text-base">Bienvenido a tu panel</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full md:w-auto flex justify-center items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium border border-transparent hover:border-red-100 bg-red-50 md:bg-transparent"
                >
                    <LogOut size={18} /> Cerrar Sesión
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Mis Mascotas Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Dog className="text-primary" /> Mis Mascotas
                            </h2>
                            <button
                                onClick={() => setIsAddingPet(true)}
                                className="flex items-center gap-2 text-sm font-bold text-secondary hover:text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full"
                            >
                                <Plus size={16} /> Agregar
                            </button>
                        </div>

                        {/* Pet List */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {pets.length === 0 ? (
                                <div className="col-span-2 text-center py-10 text-gray-400">
                                    <p>Aún no tienes mascotas registradas.</p>
                                </div>
                            ) : (
                                pets.map(pet => (
                                    <motion.div
                                        key={pet.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="border border-gray-100 rounded-2xl p-4 flex gap-4 hover:shadow-md transition-shadow relative group"
                                    >
                                        <img src={getImageUrl(pet.image)} alt={pet.name} className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
                                        <div className="flex-grow">
                                            <h3 className="font-bold text-lg">{pet.name}</h3>
                                            <p className="text-gray-500 text-sm">{pet.breed}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{pet.size}</span>
                                                <span className="text-xs text-gray-400 font-medium">{pet.age} años</span>
                                            </div>
                                            <button
                                                onClick={() => setViewingPet(pet)}
                                                className="mt-3 text-xs font-bold text-secondary hover:underline flex items-center gap-1"
                                            >
                                                <Info size={14} /> Ver Ficha Médica
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removePet(pet.id)}
                                            className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Add Pet Form (Collapsible) */}
                        <AnimatePresence>
                            {isAddingPet && (
                                <motion.form
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="mt-6 border-t pt-6 overflow-hidden"
                                    onSubmit={handleAddPet}
                                >
                                    <h3 className="font-bold mb-4">Nueva Mascota</h3>
                                    <div className="space-y-4 mb-4">
                                        <div className="flex justify-center">
                                            <div className="relative group cursor-pointer">
                                                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
                                                    {newPet.image ? (
                                                        <img src={newPet.image} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="text-center text-gray-400">
                                                            <div className="mx-auto mb-1"><Dog size={24} /></div>
                                                            <span className="text-[10px]">Subir Foto</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setNewPet({ ...newPet, image: reader.result as string });
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-4">
                                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Información Básica</h4>
                                                <input
                                                    placeholder="Nombre de la mascota"
                                                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                                    value={newPet.name} onChange={e => setNewPet({ ...newPet, name: e.target.value })} required
                                                />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        placeholder="Raza"
                                                        className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                                        value={newPet.breed} onChange={e => setNewPet({ ...newPet, breed: e.target.value })} required
                                                    />
                                                    <input
                                                        placeholder="Edad"
                                                        type="number"
                                                        className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                                        value={newPet.age} onChange={e => setNewPet({ ...newPet, age: e.target.value })} required
                                                    />
                                                </div>
                                                <select
                                                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                                    value={newPet.size}
                                                    onChange={e => setNewPet({ ...newPet, size: e.target.value as any })}
                                                >
                                                    <option value="Pequeño">Tamaño: Pequeño</option>
                                                    <option value="Mediano">Tamaño: Mediano</option>
                                                    <option value="Grande">Tamaño: Grande</option>
                                                </select>
                                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider pt-2">Ficha Médica</h4>
                                                <input
                                                    placeholder="Vacunas (ej: Sextuple, Rabia)"
                                                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                                    value={newPet.vaccines} onChange={e => setNewPet({ ...newPet, vaccines: e.target.value })}
                                                />
                                                <input
                                                    placeholder="Alergias"
                                                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                                    value={newPet.allergies} onChange={e => setNewPet({ ...newPet, allergies: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Cuidado Profundo</h4>
                                                <textarea
                                                    placeholder="Condiciones Médicas (ej: Displasia, toma medicación)"
                                                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none min-h-[80px]"
                                                    value={newPet.medicalConditions} onChange={e => setNewPet({ ...newPet, medicalConditions: e.target.value })}
                                                />
                                                <textarea
                                                    placeholder="Comportamiento (ej: Se asusta con ruidos, no se lleva con machos)"
                                                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none min-h-[80px]"
                                                    value={newPet.behavior} onChange={e => setNewPet({ ...newPet, behavior: e.target.value })}
                                                />
                                                <textarea
                                                    placeholder="Instrucciones de Paseo (ej: Usar pechera, no comer nada del suelo)"
                                                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none min-h-[80px]"
                                                    value={newPet.walkingInstructions} onChange={e => setNewPet({ ...newPet, walkingInstructions: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 justify-end border-t pt-6">
                                        <button type="button" onClick={() => setIsAddingPet(false)} className="text-gray-500 font-bold hover:text-gray-700 transition-colors">Cancelar</button>
                                        <button type="submit" className="bg-primary text-gray-900 font-bold px-8 py-3 rounded-xl hover:bg-yellow-400 shadow-lg shadow-yellow-400/20 transition-all active:scale-95">Guardar Mascota</button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* My Orders Section */}
                    {user && (
                        <OrdersSection userEmail={user.email} />
                    )}
                </div>

                {/* Historial / Próximos Paseos */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Calendar className="text-primary" /> Mis Paseos
                    </h2>

                    <div className="space-y-4 flex-grow overflow-y-auto max-h-[500px] no-scrollbar">
                        {bookings.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">
                                <p className="mb-4">No tienes paseos registrados.</p>
                            </div>
                        ) : (
                            bookings.map(booking => (
                                <div key={booking.id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                                            {booking.status.toUpperCase()}
                                        </span>
                                        <span className="font-bold text-primary text-sm">${booking.totalPrice.toLocaleString()}</span>
                                    </div>
                                    <h4 className="font-bold text-gray-900">{booking.service}</h4>
                                    <div className="text-sm text-gray-500 space-y-1 mt-1">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} /> {booking.date}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} /> {booking.time}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} /> {booking.walkerName}
                                        </div>
                                    </div>
                                    {booking.status === 'En Progreso' && (
                                        <button
                                            onClick={() => navigate('/live-demo')}
                                            className="w-full mt-3 bg-green-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-green-600 transition-colors animate-pulse"
                                        >
                                            VER EN VIVO
                                        </button>
                                    )}
                                    {(booking.status === 'Esperando Confirmación' || booking.status === 'ESPERANDO_CONFIRMACION') && (
                                        <button
                                            disabled={isConfirming === booking.id}
                                            onClick={async () => {
                                                if (window.confirm("¿El paseo finalizó correctamente? Al confirmar, se liberará el pago al paseador.")) {
                                                    setIsConfirming(booking.id);
                                                    await updateBookingStatus(booking.id, 'Finalizado');
                                                    setIsConfirming(null);
                                                }
                                            }}
                                            className={`w-full mt-3 text-white text-xs font-bold py-2 rounded-lg shadow-sm transition-colors ${isConfirming === booking.id ? 'bg-gray-400 cursor-wait' : 'bg-purple-600 hover:bg-purple-700 animate-pulse'}`}
                                        >
                                            {isConfirming === booking.id ? "CONFIRMANDO..." : "CONFIRMAR FINALIZACIÓN"}
                                        </button>
                                    )}
                                    {booking.status === 'Finalizado' && (
                                        <button
                                            onClick={() => setReviewingBooking(booking)}
                                            className="w-full mt-3 bg-primary text-gray-900 text-xs font-bold py-2 rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Star size={14} /> CALIFICAR PASEADOR
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    <button
                        onClick={() => navigate('/paseadores')}
                        className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors mt-6 shadow-lg shadow-gray-900/20"
                    >
                        Reservar Nuevo Paseo
                    </button>
                </div>
            </div>

            {/* Pet Details Modal */}
            <AnimatePresence>
                {viewingPet && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="relative h-48">
                                <img src={getImageUrl(viewingPet.image)} alt={viewingPet.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <button
                                    onClick={() => setViewingPet(null)}
                                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                                >
                                    <XCircle size={24} />
                                </button>
                                <div className="absolute bottom-6 left-8 text-white">
                                    <h3 className="text-3xl font-bold">{viewingPet.name}</h3>
                                    <p className="opacity-90">{viewingPet.breed} • {viewingPet.age} años</p>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-8 overflow-y-auto space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                                            <ShieldCheck size={18} />
                                            <span className="text-xs font-bold uppercase tracking-wider">Vacunas</span>
                                        </div>
                                        <p className="text-sm font-medium text-blue-900">{viewingPet.vaccines || 'No registradas'}</p>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                                        <div className="flex items-center gap-2 text-red-600 mb-1">
                                            <Activity size={18} />
                                            <span className="text-xs font-bold uppercase tracking-wider">Alergias</span>
                                        </div>
                                        <p className="text-sm font-medium text-red-900">{viewingPet.allergies || 'Ninguna'}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="bg-purple-100 p-2 rounded-xl text-purple-600 h-fit">
                                            <Heart size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Condiciones Médicas</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">{viewingPet.medicalConditions || 'Sin condiciones médicas registradas.'}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="bg-yellow-100 p-2 rounded-xl text-yellow-600 h-fit">
                                            <Dog size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Comportamiento</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">{viewingPet.behavior || 'Comportamiento estándar.'}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="bg-green-100 p-2 rounded-xl text-green-600 h-fit">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Instrucciones de Paseo</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed font-medium italic">"{viewingPet.walkingInstructions || 'Sin instrucciones adicionales.'}"</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 border-t border-gray-100">
                                <button
                                    onClick={() => setViewingPet(null)}
                                    className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-gray-800 transition-colors shadow-xl shadow-gray-900/10"
                                >
                                    Cerrar Ficha
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Review Modal */}
            <AnimatePresence>
                {reviewingBooking && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-8 text-center">
                                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                    <Star size={40} fill="currentColor" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">¿Cómo estuvo el paseo?</h3>
                                <p className="text-gray-500 mb-8">Tu opinión ayuda a {reviewingBooking.walkerName} y a otros dueños.</p>

                                <div className="flex justify-center gap-2 mb-8">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => setRating(num)}
                                            className={`transition-all transform hover:scale-110 ${rating >= num ? 'text-yellow-400' : 'text-gray-200'}`}
                                        >
                                            <Star size={36} fill={rating >= num ? 'currentColor' : 'none'} />
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    placeholder="Cuéntanos más sobre el servicio..."
                                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:border-primary min-h-[100px] mb-6 text-sm"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setReviewingBooking(null)}
                                        className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                    >
                                        Omitir
                                    </button>
                                    <button
                                        onClick={() => {
                                            addReview({
                                                walkerId: reviewingBooking.walkerId,
                                                userId: user?.id || 'anon',
                                                userName: user?.name || 'Usuario',
                                                rating,
                                                comment,
                                                bookingId: reviewingBooking.id
                                            });
                                            setReviewingBooking(null);
                                            setRating(5);
                                            setComment('');
                                            alert('¡Gracias por tu reseña!');
                                        }}
                                        className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
                                    >
                                        Enviar Reseña
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Profile Edit Modal */}
            <AnimatePresence>
                {isEditingProfile && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold">Editar Perfil</h3>
                                    <button onClick={() => setIsEditingProfile(false)} className="text-gray-400 hover:text-gray-600">
                                        <XCircle size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div className="flex justify-center mb-6">
                                        <div className="relative group cursor-pointer w-24 h-24">
                                            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
                                                <img
                                                    src={getImageUrl(editForm.avatar)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setEditForm({ ...editForm, avatar: reader.result as string });
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                            <div className="absolute bottom-0 right-0 bg-primary text-gray-900 p-1.5 rounded-full shadow-sm pointer-events-none">
                                                <Pencil size={12} />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo</label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña (Opcional)</label>
                                        <input
                                            type="password"
                                            placeholder="Dejar en blanco para no cambiar"
                                            value={editForm.password}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                                            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>

                                    <div className="pt-4 space-y-3">
                                        <button
                                            type="submit"
                                            className="w-full bg-primary text-gray-900 font-bold py-3 rounded-xl hover:bg-yellow-400 shadow-lg shadow-yellow-400/20 transition-all"
                                        >
                                            Guardar Cambios
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleDeleteAccount}
                                            className="w-full flex items-center justify-center gap-2 text-red-500 font-bold py-2 rounded-xl hover:bg-red-50 transition-colors text-sm"
                                        >
                                            <Trash2 size={16} /> Eliminar Cuenta
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
