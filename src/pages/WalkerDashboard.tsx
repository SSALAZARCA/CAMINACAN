import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { useWalker } from '../context/WalkerContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, MapPin, Navigation, Clock, DollarSign, Dog, Camera, Droplets, Trash2, Info, MessageCircle, X, HeartPulse, Settings, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { API_URL, BASE_URL } from '../api/config';

const WalkerDashboard: React.FC = () => {
    const { logout, user, token } = useAuth();
    const { bookings, updateBookingStatus, updateLiveTracking, fetchBookings } = useBookings();
    const { updateWalkerProfile } = useWalker();
    const navigate = useNavigate();

    const [selectedPet, setSelectedPet] = useState<any | null>(null);

    // Force fetch latest bookings on mount
    React.useEffect(() => {
        fetchBookings();
    }, []);

    const avatarInputRef = React.useRef<HTMLInputElement>(null);
    const galleryInputRef = React.useRef<HTMLInputElement>(null);

    // --- Work Config Logic ---
    const [configLocation, setConfigLocation] = useState({ city: '', neighborhood: '' });
    const [configSchedule, setConfigSchedule] = useState({
        days: [] as number[],
        startTime: '08:00',
        endTime: '17:00'
    });

    useEffect(() => {
        if (user?.walkerProfile) {
            setConfigLocation({
                city: user.walkerProfile.city || '',
                neighborhood: user.walkerProfile.neighborhood || ''
            });
            const savedSlots = user.walkerProfile.availableSlots as any;
            if (savedSlots?.schedule) {
                setConfigSchedule(savedSlots.schedule);
            }
        }
    }, [user]);

    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    const toggleDay = (idx: number) => {
        setConfigSchedule(prev => {
            if (prev.days.includes(idx)) return { ...prev, days: prev.days.filter(d => d !== idx) };
            return { ...prev, days: [...prev.days, idx].sort() };
        });
    };

    const handleSaveConfig = async () => {
        const payload = {
            city: configLocation.city,
            neighborhood: configLocation.neighborhood,
            availableSlots: {
                ...(user?.walkerProfile?.availableSlots as any),
                schedule: configSchedule
            }
        };
        await updateWalkerProfile(payload);
        alert("Configuración actualizada. Tus cambios serán visibles para los dueños.");
    };


    // Calculate Today's Earnings
    const todayEarnings = bookings
        .filter(b => b.status === 'Finalizado' || b.status === 'FINALIZADO')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !token) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const res = await fetch(`${API_URL}/auth/me/avatar`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            if (res.ok) {
                window.location.reload();
            } else {
                alert("Error al subir foto de perfil.");
            }
        } catch (err) { console.error(err); }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !token) return;

        const formData = new FormData();
        formData.append('photo', file);

        try {
            const res = await fetch(`${API_URL}/walkers/gallery`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            if (res.ok) {
                window.location.reload();
            } else {
                alert("Error al subir foto a galería.");
            }
        } catch (err) { console.error(err); }
    };

    // Find first active or scheduled walk for this walker
    const myBookings = bookings;
    const activeWalk = bookings.find(b => b.status === 'En Progreso' || b.status === 'EN_PROGRESO');

    const [elapsedTime, setElapsedTime] = useState("00:00:00");

    useEffect(() => {
        let interval: any;
        if (activeWalk && (activeWalk.status === 'En Progreso' || activeWalk.status === 'EN_PROGRESO')) {
            const startTimeStr = activeWalk.liveData?.startTime;
            if (startTimeStr) {
                const startTime = new Date(startTimeStr).getTime();

                const updateTimer = () => {
                    const now = Date.now();
                    const diff = Math.max(0, now - startTime);
                    const hours = Math.floor(diff / 3600000);
                    const minutes = Math.floor((diff % 3600000) / 60000);
                    const seconds = Math.floor((diff % 60000) / 1000);
                    setElapsedTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
                };

                updateTimer(); // Initial call
                interval = setInterval(updateTimer, 1000);
            }
        } else {
            setElapsedTime("00:00:00");
        }
        return () => clearInterval(interval);
    }, [activeWalk]);

    // Sort scheduled walks chronologically (Earliest first)
    const scheduledWalks = myBookings
        .filter(b => b.status === 'Confirmado' || b.status === 'Pendiente')
        .sort((a, b) => {
            try {
                // Handle potential different date formats simply by string compare if ISO, else parse
                // Since we use YYYY-MM-DD, string comparison works for date.
                // Time comparison also works if HH:MM 24h.
                if (a.date !== b.date) return a.date.localeCompare(b.date);
                return a.time.localeCompare(b.time);
            } catch (e) { return 0; }
        });

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // --- ACCESS CONTROL: Check Walker Status ---
    const status = user?.walkerProfile?.status;

    if (status === 'PENDING') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-yellow-100 p-6 rounded-full mb-6 text-yellow-600 animate-pulse">
                    <Clock size={48} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Verificación en Proceso</h1>
                <p className="text-gray-500 max-w-sm mb-8">
                    Tu perfil de paseador se ha creado exitosamente. Estamos revisando tus documentos.
                    Una vez aprobado, podrás acceder al panel de paseos.
                </p>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 w-full max-w-xs text-left">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        <span className="text-sm font-bold text-gray-700">Estado: Pendiente</span>
                    </div>
                    <p className="text-xs text-gray-400">Tus datos están seguros y visibles para la administración.</p>
                </div>
                <button onClick={handleLogout} className="text-gray-400 font-medium hover:text-red-500 flex items-center gap-2">
                    <LogOut size={18} /> Cerrar Sesión
                </button>
            </div>
        );
    }

    if (status === 'REJECTED' || status === 'SUSPENDED') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-red-100 p-6 rounded-full mb-6 text-red-600">
                    <Trash2 size={48} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Restringido</h1>
                <p className="text-gray-500 max-w-sm mb-8">
                    Tu cuenta ha sido {status === 'REJECTED' ? 'rechazada' : 'suspendida'}.
                    Contacta a soporte para más información.
                </p>
                <button onClick={handleLogout} className="text-gray-400 font-medium hover:text-red-500 flex items-center gap-2">
                    <LogOut size={18} /> Cerrar Sesión
                </button>
            </div>
        );
    }

    const activeWalkRef = useRef(activeWalk);

    useEffect(() => {
        activeWalkRef.current = activeWalk;
    }, [activeWalk]);

    const pathBuffer = useRef<[number, number][]>([]);

    // Screen Wake Lock & GPS
    React.useEffect(() => {
        let watchId: number | null = null;
        let wakeLock: any = null;
        let syncInterval: any = null;

        const requestWakeLock = async () => {
            if ('wakeLock' in navigator) {
                try {
                    // @ts-ignore
                    wakeLock = await navigator.wakeLock.request('screen');
                    console.log('Screen Wake Lock acquired');
                } catch (err) {
                    console.error('Wake Lock error:', err);
                }
            }
        };

        const handleVisibilityChange = async () => {
            if (activeWalkRef.current && document.visibilityState === 'visible') {
                await requestWakeLock();
            }
        };

        if (activeWalk?.id) {
            // 1. Silent Audio "Hack" for Background Execution
            // Playing a silent audio loop forces the browser to treat this tab as "media playing",
            // preventing fierce battery throttling and keeping Geolocation active in background.
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'); // Short silent or quiet sound
            audio.loop = true;
            audio.volume = 0.01; // Almost silent

            audio.play().catch(e => console.log("Audio autoplay might be blocked, user interaction needed first.", e));

            // Sync Interval (10s) to batch update server
            syncInterval = setInterval(() => {
                const currentWalk = activeWalkRef.current;
                if (currentWalk && pathBuffer.current.length > 0) {
                    const currentPath = (currentWalk.liveData as any)?.path || [];
                    const pointsToAdd = [...pathBuffer.current];
                    pathBuffer.current = []; // Clear buffer

                    const newPath = [...currentPath, ...pointsToAdd];
                    updateLiveTracking(currentWalk.id, { path: newPath });
                }
            }, 10000);

            // 2. Start GPS Watch
            if ('geolocation' in navigator) {
                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        const newPoint: [number, number] = [position.coords.latitude, position.coords.longitude];
                        pathBuffer.current.push(newPoint);
                    },
                    (error) => console.error("Error GPS:", error),
                    { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
                );
            }

            // 3. Request Wake Lock
            requestWakeLock();
            document.addEventListener('visibilitychange', handleVisibilityChange);

            // Cleanup audio on unmount
            return () => {
                audio.pause();
                audio.src = "";
                if (syncInterval) clearInterval(syncInterval);
                if (watchId !== null) navigator.geolocation.clearWatch(watchId);
                if (wakeLock) wakeLock.release();
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            };
        }
    }, [activeWalk?.id]);

    const startWalk = (id: string) => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const startPoint = [position.coords.latitude, position.coords.longitude];
                updateBookingStatus(id, 'En Progreso');
                updateLiveTracking(id, {
                    startTime: new Date().toISOString(),
                    path: [startPoint]
                });
            }, (error) => {
                alert("Necesitamos tu ubicación para iniciar el paseo.");
                console.error(error);
            });
        } else {
            alert("GPS no soportado en este dispositivo.");
        }
    };

    const endWalk = (id: string) => {
        updateBookingStatus(id, 'Esperando Confirmación');
        updateLiveTracking(id, {
            endTime: new Date().toISOString()
        });
        alert("Paseo finalizado. Esperando que el dueño confirme para liberar el pago.");
    };

    const reportEvent = async (id: string, type: 'pee' | 'poo' | 'hydration') => {
        if (!activeWalk) return;
        const currentData = activeWalk.liveData || { peeCount: 0, pooCount: 0, hydrationCount: 0, path: [], photos: [], incidents: [] };
        const data = currentData as any;

        const updates = {
            peeCount: type === 'pee' ? (data.peeCount || 0) + 1 : data.peeCount,
            pooCount: type === 'poo' ? (data.pooCount || 0) + 1 : data.pooCount,
            hydrationCount: type === 'hydration' ? (data.hydrationCount || 0) + 1 : data.hydrationCount,
        };

        if (navigator.vibrate) navigator.vibrate(50);

        try {
            await updateLiveTracking(id, updates);
        } catch (error) {
            console.error("Error reporting event:", error);
            alert("Error de conexión.");
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && activeWalk && token) {
            const formData = new FormData();
            formData.append('photo', file);

            try {
                const res = await fetch(`${API_URL}/bookings/${activeWalk.id}/photos`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });
                if (res.ok) {
                    await fetchBookings();
                    alert("Foto enviada exitosamente.");
                } else {
                    alert("Error al enviar foto.");
                }
            } catch (error) {
                console.error("Error uploading photo", error);
                alert("Error de conexión enviando foto.");
            }
        }
    };

    const addPhoto = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <nav className="bg-white shadow-sm p-4 sticky top-0 z-10">
                <div className="container flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div
                            onClick={() => avatarInputRef.current?.click()}
                            className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold cursor-pointer overflow-hidden relative border border-primary/20 hover:opacity-80 transition-opacity"
                            title="Cambiar foto de perfil"
                        >
                            {user?.avatar ? (
                                <img src={`${BASE_URL}/uploads/${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.charAt(0)
                            )}
                            <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Bienvenido,</p>
                            <h3 className="font-bold text-gray-900 leading-none">{user?.name}</h3>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="text-gray-400 hover:text-red-500">
                        <LogOut size={20} />
                    </button>
                </div>
            </nav>

            <div className="container py-6 space-y-6">
                <div className="bg-gray-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                    <p className="text-gray-400 text-sm mb-1">Ganancias de Hoy</p>
                    <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-4xl font-bold">${todayEarnings.toLocaleString()}</span>
                        <span className="text-green-400 text-sm font-bold flex items-center gap-1">
                            <DollarSign size={12} /> Disponible
                        </span>
                    </div>
                </div>

                {activeWalk ? (
                    <div>
                        <h2 className="font-bold text-gray-900 mb-4 px-2">Paseo En Curso</h2>
                        <motion.div layoutId={activeWalk.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl">🐶</div>
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        {activeWalk.service}
                                        {activeWalk.pets && activeWalk.pets.length > 0 && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedPet(activeWalk.pets[0]); }}
                                                className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-full flex items-center gap-1 hover:bg-blue-200"
                                            >
                                                <Info size={12} /> {activeWalk.pets[0].name}
                                            </button>
                                        )}
                                    </h3>
                                    <p className="text-gray-500 text-sm flex items-center gap-1">
                                        <MapPin size={14} /> Localización Compartida
                                    </p>
                                    <p className="text-green-600 text-lg font-mono font-bold flex items-center gap-2 mt-1">
                                        <Clock size={16} /> {elapsedTime}
                                    </p>
                                </div>
                            </div>

                            {/* Live Controls */}
                            <div className="grid grid-cols-4 gap-3 mb-6">
                                <button
                                    onClick={(e) => { e.stopPropagation(); reportEvent(activeWalk.id, 'pee'); }}
                                    className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-blue-50 text-blue-600 active:scale-95 transition-transform"
                                >
                                    <Droplets size={20} />
                                    <span className="text-[10px] font-bold">Pipí ({activeWalk.liveData?.peeCount || 0})</span>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); reportEvent(activeWalk.id, 'poo'); }}
                                    className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-orange-50 text-orange-600 active:scale-95 transition-transform"
                                >
                                    <Trash2 size={20} />
                                    <span className="text-[10px] font-bold">Popó ({activeWalk.liveData?.pooCount || 0})</span>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); reportEvent(activeWalk.id, 'hydration'); }}
                                    className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-cyan-50 text-cyan-600 active:scale-95 transition-transform"
                                >
                                    <Droplets size={20} fill="currentColor" />
                                    <span className="text-[10px] font-bold">Agua ({activeWalk.liveData?.hydrationCount || 0})</span>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); addPhoto(); }}
                                    className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-purple-50 text-purple-600 active:scale-95 transition-transform"
                                >
                                    <Camera size={20} />
                                    <span className="text-[10px] font-bold">Foto ({activeWalk.liveData?.photos?.length || 0})</span>
                                </button>
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                capture="environment"
                                onChange={handleFileChange}
                            />

                            <button
                                onClick={() => endWalk(activeWalk.id)}
                                className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                            >
                                <Clock size={20} /> Terminar Paseo
                            </button>
                        </motion.div>
                    </div>
                ) : scheduledWalks.length > 0 ? (
                    <div>
                        <h2 className="font-bold text-gray-900 mb-4 px-2">Próximo Paseo</h2>
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold">{scheduledWalks[0].service}</h3>
                                    <p className="text-gray-500 text-sm">{scheduledWalks[0].date} • {scheduledWalks[0].time}</p>
                                </div>
                                <div className="text-primary font-bold">{scheduledWalks[0].petIds.length} Perro(s)</div>
                            </div>
                            <button
                                onClick={() => startWalk(scheduledWalks[0].id)}
                                className="w-full py-4 bg-primary text-gray-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-400 transition-all"
                            >
                                <Navigation size={20} /> Iniciar Paseo
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-200">
                        <Dog className="mx-auto text-gray-300 mb-2" size={40} />
                        <p className="text-gray-500">No tienes paseos pendientes.</p>
                    </div>
                )}

                {/* Others Scheduled */}
                {scheduledWalks.length > 1 && (
                    <div>
                        <h2 className="font-bold text-gray-900 mb-4 px-2">Otros Programados</h2>
                        <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 max-h-96 overflow-y-auto">
                            {scheduledWalks.slice(1).map(walk => (
                                <div key={walk.id} className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0">
                                    <span className="font-bold text-gray-500 w-16">{walk.time}</span>
                                    <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center text-blue-500">
                                        <Dog size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{walk.service}</h4>
                                        <p className="text-xs text-gray-400">{walk.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Work Config Section */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                            <Settings size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Configuración de Trabajo</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Location */}
                        <div>
                            <h4 className="font-bold mb-3 flex items-center gap-2 text-gray-700">
                                <MapPin size={18} /> Zona de Cobertura
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-gray-500 ml-1">Ciudad</label>
                                    <input
                                        value={configLocation.city}
                                        onChange={e => setConfigLocation({ ...configLocation, city: e.target.value })}
                                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 ml-1">Barrio(s)</label>
                                    <input
                                        value={configLocation.neighborhood}
                                        onChange={e => setConfigLocation({ ...configLocation, neighborhood: e.target.value })}
                                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                        placeholder="Ej: Poblado, Laureles..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Schedule */}
                        <div>
                            <h4 className="font-bold mb-3 flex items-center gap-2 text-gray-700">
                                <Clock size={18} /> Disponibilidad
                            </h4>

                            <div className="mb-4">
                                <label className="text-xs text-gray-500 ml-1 mb-2 block">Días de Trabajo</label>
                                <div className="flex flex-wrap gap-2">
                                    {daysOfWeek.map((day, idx) => (
                                        <button
                                            key={day}
                                            onClick={() => toggleDay(idx)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${configSchedule.days.includes(idx)
                                                ? 'bg-purple-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-500 ml-1">Hora Inicio</label>
                                    <input
                                        type="time"
                                        value={configSchedule.startTime}
                                        onChange={ev => setConfigSchedule({ ...configSchedule, startTime: ev.target.value })}
                                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 ml-1">Hora Fin</label>
                                    <input
                                        type="time"
                                        value={configSchedule.endTime}
                                        onChange={ev => setConfigSchedule({ ...configSchedule, endTime: ev.target.value })}
                                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSaveConfig}
                            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg active:scale-95 flex items-center gap-2"
                        >
                            <CheckCircle2 size={18} /> Guardar Configuración
                        </button>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
                    <h2 className="font-bold text-gray-900 mb-4">Mi Perfil Público</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Biografía</label>
                            <textarea
                                className="w-full mt-1 p-3 border rounded-xl"
                                defaultValue={user?.walkerProfile?.bio || ""}
                                onBlur={(e) => {
                                    updateWalkerProfile({ bio: e.target.value });
                                }}
                                placeholder="Cuéntanos sobre ti..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Galería de Fotos</label>
                            <div className="grid grid-cols-3 gap-2">
                                {user?.walkerProfile?.gallery?.map((img: string, idx: number) => (
                                    <img
                                        key={idx}
                                        src={img.startsWith('http') ? img : `${BASE_URL}/uploads/${img}`}
                                        alt={`Gallery ${idx}`}
                                        className="w-full h-24 object-cover rounded-lg"
                                    />
                                ))}
                                <button className="w-full h-24 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
                                    onClick={() => galleryInputRef.current?.click()}
                                >
                                    <Camera size={20} />
                                    <span className="text-xs">Agregar</span>
                                </button>
                                <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" onChange={handleGalleryUpload} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Chat Button */}
                {/* Floating Chat Button */}
                <button
                    onClick={() => navigate('/messages', { state: { createChatWith: activeWalk?.ownerId } })}
                    className="fixed bottom-24 right-6 bg-yellow-400 text-gray-900 p-4 rounded-full shadow-lg z-40 hover:scale-110 transition-transform"
                >
                    <div className="relative">
                        <MessageCircle size={24} />
                    </div>
                </button>

                {/* Pet Info Modal */}
                <AnimatePresence>
                    {selectedPet && (
                        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedPet(null)}>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white p-6 rounded-3xl w-full max-w-sm relative shadow-2xl max-h-[90vh] flex flex-col"
                                onClick={e => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setSelectedPet(null)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
                                >
                                    <X size={24} />
                                </button>

                                <div className="flex flex-col items-center mb-6 shrink-0">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full mb-3 overflow-hidden shadow-md border-4 border-white">
                                        {selectedPet.photo || selectedPet.image ? (
                                            <img src={selectedPet.photo || selectedPet.image} alt={selectedPet.name} loading="lazy" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl">🐶</div>
                                        )}
                                    </div>
                                    <h2 className="text-2xl font-bold">{selectedPet.name}</h2>
                                    <p className="text-gray-500">{selectedPet.breed}, {selectedPet.age} años</p>
                                </div>

                                <div className="space-y-4 text-sm overflow-y-auto pr-2 custom-scrollbar">
                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gray-50 p-3 rounded-2xl text-center">
                                            <p className="text-gray-400 text-xs mb-1">Peso</p>
                                            <p className="font-bold text-gray-800 text-lg">{selectedPet.weight || '--'} <span className="text-xs font-normal">kg</span></p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-2xl text-center">
                                            <p className="text-gray-400 text-xs mb-1">Tamaño</p>
                                            <p className="font-bold text-gray-800 text-lg">{selectedPet.size || '--'}</p>
                                        </div>
                                    </div>

                                    {/* Health */}
                                    {(selectedPet.medicalConditions || selectedPet.allergies || selectedPet.vaccines) && (
                                        <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                                            <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2"><HeartPulse size={16} /> Salud & Cuidados</h4>
                                            {selectedPet.medicalConditions && <p className="mb-1"><span className="font-bold">Condiciones:</span> {selectedPet.medicalConditions}</p>}
                                            {selectedPet.allergies && <p className="mb-1"><span className="font-bold">Alergias:</span> {selectedPet.allergies}</p>}
                                            {selectedPet.vaccines && <p className="text-xs text-red-600 mt-2 bg-white/50 p-2 rounded-lg inline-block"><span className="font-bold">Vacunas:</span> {selectedPet.vaccines}</p>}
                                        </div>
                                    )}

                                    {/* Walking Instructions & Behavior */}
                                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 space-y-3">
                                        <div>
                                            <h4 className="font-bold text-blue-800 mb-1 flex items-center gap-2"><MapPin size={16} /> Instrucciones de Paseo</h4>
                                            <p className="text-blue-900 leading-relaxed">{selectedPet.walkingInstructions || "Sin instrucciones específicas de paseo."}</p>
                                        </div>
                                        {selectedPet.behavior && (
                                            <div className="pt-3 border-t border-blue-200/50">
                                                <h4 className="font-bold text-blue-800 mb-1">Comportamiento</h4>
                                                <p className="text-blue-900">{selectedPet.behavior}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* General Notes */}
                                    {selectedPet.notes && (
                                        <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
                                            <h4 className="font-bold text-yellow-800 mb-1 flex items-center gap-2"><Info size={16} /> Notas del Dueño</h4>
                                            <p className="text-yellow-900">{selectedPet.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default WalkerDashboard;

