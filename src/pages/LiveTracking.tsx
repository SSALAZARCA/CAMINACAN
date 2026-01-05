import React, { useEffect, useState, useRef } from 'react';
import { useBookings } from '../context/BookingContext';
import type { Booking } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';
import { Battery, Signal, Phone, MessageCircle, CheckCircle2, Map as MapIcon, Image as ImageIcon } from 'lucide-react';
import { API_URL, BASE_URL } from '../api/config';

const LiveTracking: React.FC = () => {
    const { bookings, updateBookingStatus } = useBookings();
    const navigate = useNavigate();
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const pathRef = useRef<any>(null);

    // Find active walk for this user
    const activeWalk = bookings.find(b => b.status === 'En Progreso' || b.status === 'Esperando Confirmación');
    const [activeTab, setActiveTab] = useState<'map' | 'report'>('map');

    // Init Real Map for Active Walk
    useEffect(() => {
        if (activeTab !== 'map' || !activeWalk) return;

        // Safety cleanup if ref exists but DOM was re-created
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }

        // Defer init to ensure DOM layout is ready
        const initTimer = setTimeout(() => {
            const L = (window as any).L;
            if (!L) return;

            const startPos = activeWalk.liveData?.path[0] || [4.6534, -74.0536];
            const map = L.map('map-container').setView(startPos, 16);
            mapRef.current = map;

            // Layers
            const streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            });
            const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '© Esri'
            });

            streets.addTo(map);
            L.control.layers({ "Mapa Calles": streets, "Satélite": satellite }).addTo(map);

            markerRef.current = L.marker(startPos).addTo(map);
            pathRef.current = L.polyline(activeWalk.liveData?.path || [], { color: 'red', weight: 5 }).addTo(map);

            // Force update layout
            setTimeout(() => { map.invalidateSize(); }, 300);
        }, 100);

        return () => {
            clearTimeout(initTimer);
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [activeWalk, activeTab]);

    // Update markers and path when live data changes
    useEffect(() => {
        if (!mapRef.current || !activeWalk?.liveData) return;
        const path = activeWalk.liveData.path;
        if (path.length > 0) {
            const lastPos = path[path.length - 1];
            if (markerRef.current) markerRef.current.setLatLng(lastPos);
            if (pathRef.current) pathRef.current.setLatLngs(path);
            mapRef.current.panTo(lastPos);
        }
    }, [activeWalk?.liveData?.path]);

    // Demo Mode State for Marketing
    useEffect(() => {
        if (activeWalk || activeTab !== 'map') return;

        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }

        // Defer init
        const initTimer = setTimeout(() => {
            const L = (window as any).L;
            if (!L) return;

            // Demo Coordinates (Simulated Walk)
            const startPos = [4.6534, -74.0536]; // Park Virrey
            const map = L.map('map-container').setView(startPos, 16);
            mapRef.current = map;

            const streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' });
            const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: '© Esri' });

            streets.addTo(map);
            L.control.layers({ "Mapa Calles": streets, "Satélite": satellite }).addTo(map);

            markerRef.current = L.marker(startPos).addTo(map);

            // Animated Path for Demo
            const demoPath = [
                [4.6534, -74.0536], [4.6536, -74.0534], [4.6538, -74.0532],
                [4.6540, -74.0530], [4.6542, -74.0528], [4.6545, -74.0525]
            ];
            const polyline = L.polyline([], { color: 'red', weight: 5 }).addTo(map);

            let i = 0;
            const interval = setInterval(() => {
                if (i < demoPath.length) {
                    const point = demoPath[i];
                    polyline.addLatLng(point);
                    if (markerRef.current) markerRef.current.setLatLng(point);
                    map.panTo(point);
                    i++;
                } else {
                    i = 0;
                    polyline.setLatLngs([]);
                }
            }, 1000);

            // Clean interval on unmount
            (map as any)._demoInterval = interval;

            // Force redraw
            setTimeout(() => map.invalidateSize(), 300);

        }, 100);

        return () => {
            clearTimeout(initTimer);
            if (mapRef.current && (mapRef.current as any)._demoInterval) clearInterval((mapRef.current as any)._demoInterval);
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [activeWalk, activeTab]);

    // Use simulated data if no active walk
    const displayData = activeWalk || {
        status: 'DEMOSTRACIÓN',
        walkerName: 'Camilo (Demo)',
        service: 'Paseo Premium',
        liveData: {
            path: [],
            photos: ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?fit=crop&w=400&h=300'],
            hydrationCount: 2,
            peeCount: 1,
            pooCount: 0
        }
    };

    // If showing Demo, we render the same UI but with mock data
    // Remove the early return "No hay paseos"
    // Instead, rely on displayData


    // Use Booking type but acknowledge it might be a mock object
    const normalizedData = displayData as Booking | Record<string, any>;

    return (
        <div className="bg-gray-100 h-[calc(100vh-80px)] relative overflow-hidden flex justify-center md:h-[calc(100vh-64px)] md:p-0 py-8">
            <div className="w-full max-w-md md:max-w-full bg-white h-full shadow-xl md:shadow-none relative flex flex-col rounded-[3rem] md:rounded-none overflow-hidden border-8 md:border-0 border-gray-900">

                {/* Status Bar (Mobile Only) */}
                <div className="md:hidden bg-gray-900 text-white px-8 py-4 flex justify-between text-xs items-center z-10 pt-8">
                    <span className="font-bold">9:41</span>
                    <div className="flex gap-2 items-center">
                        <Signal size={14} />
                        <span className="font-bold">5G</span>
                        <Battery size={16} />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow relative bg-gray-50 overflow-hidden flex flex-col">

                    {/* View Switcher */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur shadow-lg rounded-full flex p-1 border border-gray-100">
                        <button
                            onClick={() => setActiveTab('map')}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'map' ? 'bg-gray-900 text-white' : 'text-gray-500'}`}
                        >
                            <MapIcon size={14} /> Mapa
                        </button>
                        <button
                            onClick={() => setActiveTab('report')}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'report' ? 'bg-gray-900 text-white' : 'text-gray-500'}`}
                        >
                            <CheckCircle2 size={14} /> Reporte
                        </button>
                    </div>

                    {activeTab === 'map' ? (
                        <>
                            <div id="map-container" className="flex-grow z-0 h-full w-full"></div>
                            {!activeWalk && (
                                <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-xs font-bold shadow-lg z-[1000] animate-pulse">
                                    MODO DEMOSTRACIÓN
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-grow p-6 overflow-y-auto space-y-6 pt-16">
                            <h3 className="text-xl font-bold">Reporte de Paseo</h3>

                            {/* Photos Grid */}
                            <div className="grid grid-cols-2 gap-2">
                                {normalizedData.liveData?.photos?.map((p: string, i: number) => (
                                    <img key={i} src={p.startsWith('http') ? p : `${BASE_URL}/uploads/${p}`} loading="lazy" className="w-full h-32 object-cover rounded-xl bg-gray-200" />
                                ))}
                                {(!normalizedData.liveData?.photos || normalizedData.liveData.photos.length === 0) && (
                                    <div className="col-span-2 py-8 bg-gray-100 rounded-xl text-center text-gray-400 text-xs">
                                        <ImageIcon className="mx-auto mb-2" /> Sin fotos aún
                                    </div>
                                )}
                            </div>

                            {/* Activity Log */}
                            <div className="space-y-3">
                                <div className="flex justify-between p-4 bg-blue-50 rounded-2xl">
                                    <span className="font-bold text-blue-700">Hidratación</span>
                                    <span className="font-bold">{normalizedData.liveData?.hydrationCount} veces</span>
                                </div>
                                <div className="flex justify-between p-4 bg-yellow-50 rounded-2xl">
                                    <span className="font-bold text-yellow-700">Pee & Poo</span>
                                    <span className="font-bold">💧 {normalizedData.liveData?.peeCount} | 💩 {normalizedData.liveData?.pooCount}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notification Overlay for Wait Confirmation */}
                    {normalizedData.status === 'Esperando Confirmación' && (
                        <div className="absolute inset-x-0 top-16 mx-4 z-[2000] bg-primary text-gray-900 p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
                            <CheckCircle2 size={24} />
                            <div>
                                <p className="font-bold text-sm">¡Paseador terminó el recorrido!</p>
                                <p className="text-[10px] opacity-80">Por favor valida la llegada de tu mascota.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Interactive Bottom Sheet */}
                <div className="bg-white md:rounded-none rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-8 relative z-10 -mt-8 md:mt-0 border-t border-gray-100">
                    <div className="md:hidden w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8"></div>

                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{normalizedData.walkerName}</h2>
                            <p className="text-gray-500 text-sm">{normalizedData.service} • {normalizedData.status}</p>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${normalizedData.status === 'En Progreso' ? 'bg-green-100 text-green-700 animate-pulse' : 'bg-orange-100 text-orange-700'}`}>
                            {normalizedData.status.toUpperCase()}
                        </div>
                    </div>

                    {normalizedData.status === 'Esperando Confirmación' ? (
                        <button
                            onClick={() => {
                                if (activeWalk) {
                                    updateBookingStatus(activeWalk.id, 'Finalizado');
                                    alert("Paseo confirmado. ¡Gracias por confiar en CaminaCan!");
                                } else {
                                    alert("En modo demo no puedes confirmar paseos reales.");
                                }
                            }}
                            className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-bold shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3"
                        >
                            Confirmar Llegada de Mascota
                        </button>
                    ) : (
                        <div className="flex gap-4">
                            <button className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2">
                                <Phone size={20} /> Llamar
                            </button>
                            <button onClick={() => navigate('/messages', { state: { createChatWith: (normalizedData as any).walkerUserId } })} className="flex-1 bg-gray-100 text-gray-800 py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                                <MessageCircle size={20} /> Chat
                            </button>
                        </div>
                    )}
                </div>

                {/* iPhone Notch Simulation (Mobile Only) */}
                <div className="md:hidden absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20"></div>
            </div>
        </div>
    );
};



export default LiveTracking;

