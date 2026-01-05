import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { useWalker } from '../context/WalkerContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, MapPin, Navigation, Clock, DollarSign, Dog, Camera, Droplets, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

import { API_URL, BASE_URL } from '../api/config';

const WalkerDashboard: React.FC = () => {
    const { logout, user, token } = useAuth();
    const { bookings, updateBookingStatus, updateLiveTracking } = useBookings();
    const { updateWalkerProfile } = useWalker();
    const navigate = useNavigate();

    const avatarInputRef = React.useRef<HTMLInputElement>(null);
    const galleryInputRef = React.useRef<HTMLInputElement>(null);

    // Calculate Today's Earnings
    const todayEarnings = bookings
        .filter(b => b.walkerId === user?.id && (b.status === 'Finalizado' || b.status === 'FINALIZADO'))
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
    const myBookings = bookings.filter(b => b.walkerId === user?.id || (user?.email === 'ana@caminacan.com' && b.walkerId === 'walker-101'));
    const activeWalk = myBookings.find(b => b.status === 'En Progreso');

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

    // Screen Wake Lock & GPS
    React.useEffect(() => {
        let watchId: number | null = null;
        let wakeLock: any = null;

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
            if (activeWalk && document.visibilityState === 'visible') {
                await requestWakeLock();
            }
        };

        if (activeWalk) {
            // 1. Silent Audio "Hack" for Background Execution
            // Playing a silent audio loop forces the browser to treat this tab as "media playing",
            // preventing fierce battery throttling and keeping Geolocation active in background.
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'); // Short silent or quiet sound
            audio.loop = true;
            audio.volume = 0.01; // Almost silent

            audio.play().catch(e => console.log("Audio autoplay might be blocked, user interaction needed first.", e));

            // 2. Start GPS Watch
            if ('geolocation' in navigator) {
                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        const newPoint = [position.coords.latitude, position.coords.longitude];
                        const currentPath = (activeWalk.liveData as any)?.path || [];
                        const updatedPath = [...currentPath, newPoint];
                        updateLiveTracking(activeWalk.id, { path: updatedPath });
                    },
                    (error) => console.error("Error GPS:", error),
                    { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
                );
            }

            // 3. Request Wake Lock
            requestWakeLock();
            document.addEventListener('visibilitychange', handleVisibilityChange);

            // Cleanup audio on unmount
            return () => {
                audio.pause();
                audio.src = "";
                if (watchId !== null) navigator.geolocation.clearWatch(watchId);
                if (wakeLock) wakeLock.release();
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            };
        }

        return () => {
            if (watchId !== null) navigator.geolocation.clearWatch(watchId);
            if (wakeLock) wakeLock.release();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
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

    const reportEvent = (id: string, type: 'pee' | 'poo' | 'hydration') => {
        if (!activeWalk) return;
        const currentData = activeWalk.liveData || { peeCount: 0, pooCount: 0, hydrationCount: 0, path: [], photos: [], incidents: [] };
        // Safe cast as any for dynamic json properties
        const data = currentData as any;
        updateLiveTracking(id, {
            peeCount: type === 'pee' ? (data.peeCount || 0) + 1 : data.peeCount,
            pooCount: type === 'poo' ? (data.pooCount || 0) + 1 : data.pooCount,
            hydrationCount: type === 'hydration' ? (data.hydrationCount || 0) + 1 : data.hydrationCount,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && activeWalk) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const currentPhotos = (activeWalk.liveData as any)?.photos || [];
                updateLiveTracking(activeWalk.id, {
                    photos: [...currentPhotos, base64String]
                });
            };
            reader.readAsDataURL(file);
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
                                    <h3 className="text-xl font-bold">{activeWalk.service}</h3>
                                    <p className="text-gray-500 text-sm flex items-center gap-1">
                                        <MapPin size={14} /> Localización Compartida
                                    </p>
                                </div>
                            </div>

                            {/* Live Controls */}
                            <div className="grid grid-cols-4 gap-3 mb-6">
                                <button onClick={() => reportEvent(activeWalk.id, 'pee')} className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-blue-50 text-blue-600">
                                    <Droplets size={20} />
                                    <span className="text-[10px] font-bold">Pipí ({activeWalk.liveData?.peeCount || 0})</span>
                                </button>
                                <button onClick={() => reportEvent(activeWalk.id, 'poo')} className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-orange-50 text-orange-600">
                                    <Trash2 size={20} />
                                    <span className="text-[10px] font-bold">Popó ({activeWalk.liveData?.pooCount || 0})</span>
                                </button>
                                <button onClick={() => reportEvent(activeWalk.id, 'hydration')} className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-cyan-50 text-cyan-600">
                                    <Droplets size={20} fill="currentColor" />
                                    <span className="text-[10px] font-bold">Agua ({activeWalk.liveData?.hydrationCount || 0})</span>
                                </button>
                                <button onClick={addPhoto} className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-purple-50 text-purple-600">
                                    <Camera size={20} />
                                    <span className="text-[10px] font-bold">Foto ({activeWalk.liveData?.photos?.length || 0})</span>
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    capture="environment"
                                />
                            </div>

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

            </div>
        </div>
    );
};

export default WalkerDashboard;

