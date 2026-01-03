import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePets } from '../context/PetContext';
import { useBookings } from '../context/BookingContext';
import { useWalker } from '../context/WalkerContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Dog, MapPin, CheckCircle, ChevronRight, ChevronLeft, CreditCard, RotateCcw, Info } from 'lucide-react';

const STEPS = ['Servicio', 'Mascota', 'Fecha', 'Resumen'];

const Booking: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { pets } = usePets();
    const { addBooking } = useBookings();
    const { activeWalkers } = useWalker();
    const navigate = useNavigate();
    const location = useLocation();

    const [step, setStep] = useState(1);
    const [bookingData, setBookingData] = useState({
        service: 'Paseo 1h',
        walkerId: location.state?.walkerId || 'walker-101',
        walkerName: location.state?.walkerName || 'Ana María V.',
        petIds: [] as string[],
        date: new Date().toISOString().split('T')[0],
        time: '',
        price: 25000,
        isRecurring: false,
        selectedDays: [] as number[], // 0: Sun, 1: Mon, etc.
    });

    const selectedWalker = activeWalkers.find(w => w.id === bookingData.walkerId);
    const availableHours = selectedWalker?.availableSlots?.[bookingData.date] || ['07:00', '08:00', '09:00', '16:00', '17:00', '18:00'];

    const DAYS_ES = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

    useEffect(() => {
        if (!isAuthenticated) {
            // Redirect to login but save return url logic could be added here
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleNext = () => {
        // Validation Step 2: Pets
        if (step === 2 && bookingData.petIds.length === 0) {
            alert("Por favor selecciona al menos una mascota.");
            return;
        }
        // Validation Step 3: Time
        if (step === 3 && !bookingData.time) {
            alert("Por favor selecciona una hora.");
            return;
        }
        setStep(s => Math.min(s + 1, 4));
    };
    const handleBack = () => setStep(s => Math.max(s - 1, 1));

    // Redirect if no walker selected (direct access protection)
    useEffect(() => {
        if (!location.state?.walkerId) {
            // Optional: You could allow selecting walker here, but for now redirecting is safer
            // console.warn("No walker selected, redirecting...");
        }
    }, [location.state]);

    const handleSubmit = () => {
        addBooking({
            service: bookingData.service as any,
            walkerId: bookingData.walkerId,
            walkerName: bookingData.walkerName,
            petIds: bookingData.petIds,
            date: bookingData.date,
            time: bookingData.time,
            totalPrice: bookingData.price,
            isRecurring: bookingData.isRecurring,
            selectedDays: bookingData.selectedDays
        });
        alert('¡Reserva Confirmada!');
        navigate('/dashboard');
    };

    const stepsVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 }
    };

    return (
        <div className="container py-10 min-h-screen max-w-2xl">
            {/* Progress Bar */}
            <div className="flex justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full" />
                <div
                    className="absolute top-1/2 left-0 h-1 bg-primary -z-10 rounded-full transition-all duration-300"
                    style={{ width: `${((step - 1) / 3) * 100}%` }}
                />
                {STEPS.map((label, idx) => (
                    <div key={idx} className="flex flex-col items-center bg-white px-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > idx + 1 ? 'bg-primary text-gray-900' : step === idx + 1 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {idx + 1}
                        </div>
                        <span className="text-xs mt-1 font-medium text-gray-500">{label}</span>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 min-h-[400px] flex flex-col relative overflow-hidden">
                <AnimatePresence mode="wait">

                    {/* STEP 1: SERVICE */}
                    {step === 1 && (
                        <motion.div key="step1" variants={stepsVariants} initial="hidden" animate="visible" exit="exit" className="flex-grow">
                            <h2 className="text-2xl font-bold mb-6">Elige el servicio</h2>
                            <div className="space-y-4">
                                {['Paseo 1h', 'Paseo 30m', 'Guardería'].map(srv => (
                                    <div
                                        key={srv}
                                        onClick={() => setBookingData({ ...bookingData, service: srv, price: srv === 'Paseo 30m' ? 15000 : srv === 'Guardería' ? 45000 : 25000 })}
                                        className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all ${bookingData.service === srv ? 'border-primary bg-yellow-50' : 'border-gray-100 hover:border-blue-100'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white p-2 rounded-full shadow-sm text-primary">
                                                {srv === 'Guardería' ? <MapPin /> : <Dog />}
                                            </div>
                                            <span className="font-bold text-gray-900">{srv}</span>
                                        </div>
                                        <span className="font-bold text-gray-900">
                                            ${srv === 'Paseo 30m' ? '15,000' : srv === 'Guardería' ? '45,000' : '25,000'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: PETS */}
                    {step === 2 && (
                        <motion.div key="step2" variants={stepsVariants} initial="hidden" animate="visible" exit="exit" className="flex-grow">
                            <h2 className="text-2xl font-bold mb-6">¿Quién va al paseo?</h2>
                            {pets.length === 0 ? (
                                <div className="text-center py-10">
                                    <p className="text-gray-500 mb-4">No tienes mascotas registradas.</p>
                                    <button onClick={() => navigate('/dashboard')} className="text-primary font-bold underline">Ir a registrar mascota</button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    {pets.map(pet => (
                                        <div
                                            key={pet.id}
                                            onClick={() => {
                                                const ids = bookingData.petIds.includes(pet.id)
                                                    ? bookingData.petIds.filter(id => id !== pet.id)
                                                    : [...bookingData.petIds, pet.id];
                                                setBookingData({ ...bookingData, petIds: ids });
                                            }}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${bookingData.petIds.includes(pet.id) ? 'border-primary bg-yellow-50' : 'border-gray-100'}`}
                                        >
                                            <img src={pet.image} alt={pet.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                                            <h3 className="font-bold text-center">{pet.name}</h3>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* STEP 3: DATE & TIME */}
                    {step === 3 && (
                        <motion.div key="step3" variants={stepsVariants} initial="hidden" animate="visible" exit="exit" className="flex-grow">
                            <h2 className="text-2xl font-bold mb-6">¿Cuándo?</h2>

                            {/* Recurring Toggle */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <RotateCcw size={18} className="text-secondary" />
                                        <span className="font-bold">¿Hacerlo recurrente?</span>
                                    </div>
                                    <button
                                        onClick={() => setBookingData({ ...bookingData, isRecurring: !bookingData.isRecurring })}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${bookingData.isRecurring ? 'bg-primary' : 'bg-gray-300'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${bookingData.isRecurring ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>

                                {bookingData.isRecurring && (
                                    <div className="flex justify-between gap-1">
                                        {DAYS_ES.map((day, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    const days = bookingData.selectedDays.includes(idx)
                                                        ? bookingData.selectedDays.filter(d => d !== idx)
                                                        : [...bookingData.selectedDays, idx];
                                                    setBookingData({ ...bookingData, selectedDays: days });
                                                }}
                                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${bookingData.selectedDays.includes(idx) ? 'bg-gray-900 text-white' : 'bg-white text-gray-400 border border-gray-100 hover:border-primary'}`}
                                            >
                                                {day}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        {bookingData.isRecurring ? 'Fecha de inicio' : 'Fecha'}
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full p-3 rounded-xl border border-gray-200"
                                        value={bookingData.date}
                                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value, time: '' })}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Hora disponible</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {availableHours.map(hour => (
                                            <button
                                                key={hour}
                                                onClick={() => setBookingData({ ...bookingData, time: hour })}
                                                className={`p-2 text-sm font-bold rounded-xl border-2 transition-all ${bookingData.time === hour ? 'border-primary bg-yellow-50 text-gray-900' : 'border-gray-100 text-gray-500 hover:border-blue-100'}`}
                                            >
                                                {hour}
                                            </button>
                                        ))}
                                    </div>
                                    {availableHours.length === 0 && (
                                        <p className="text-red-500 text-xs mt-2 font-medium">No hay horarios disponibles para esta fecha.</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: SUMMARY */}
                    {step === 4 && (
                        <motion.div key="step4" variants={stepsVariants} initial="hidden" animate="visible" exit="exit" className="flex-grow">
                            <h2 className="text-2xl font-bold mb-6">Resumen</h2>
                            <div className="bg-gray-50 p-6 rounded-2xl space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Servicio</span>
                                    <span className="font-bold">{bookingData.service}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Paseador</span>
                                    <span className="font-bold">{bookingData.walkerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Fecha</span>
                                    <span className="font-bold">{bookingData.date} - {bookingData.time}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Mascotas</span>
                                    <span className="font-bold">{bookingData.petIds.length}</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between text-xl">
                                    <span className="font-bold">Total</span>
                                    <span className="font-bold text-primary">${bookingData.price.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl space-y-3">
                                <div className="flex items-center gap-3 text-sm text-blue-800">
                                    <CreditCard size={18} />
                                    Pago seguro (Mock)
                                </div>
                                <div className="flex items-start gap-3 text-[10px] text-blue-600 leading-tight">
                                    <Info size={14} className="flex-shrink-0" />
                                    <p>
                                        <strong>Política de Cancelación:</strong> Devolución del 100% si cancelas con más de 24h.
                                        50% entre 12h y 24h. Sin reembolso si es menor a 12h.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>

                {/* Footer Buttons */}
                <div className="mt-8 flex justify-between pt-6 border-t border-gray-100">
                    <button
                        onClick={handleBack}
                        disabled={step === 1}
                        className={`flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-colors ${step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <ChevronLeft size={20} /> Atrás
                    </button>

                    {step < 4 ? (
                        <button
                            onClick={handleNext}
                            className="bg-gray-900 text-white font-bold px-8 py-3 rounded-xl hover:bg-black flex items-center gap-2"
                        >
                            Siguiente <ChevronRight size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="bg-primary text-gray-900 font-bold px-8 py-3 rounded-xl hover:bg-yellow-400 flex items-center gap-2 shadow-lg shadow-yellow-400/20"
                        >
                            Confirmar y Pagar <CheckCircle size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Booking;
