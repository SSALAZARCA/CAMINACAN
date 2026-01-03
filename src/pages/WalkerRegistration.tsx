import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalker } from '../context/WalkerContext';
import { Upload, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const LOCATIONS: Record<string, string[]> = {
    "Bogotá": ["Chapinero", "Usaquén", "Suba", "Teusaquillo"],
    "Medellín": ["Poblado", "Laureles", "Envigado", "Belen"],
    "Cali": ["San Fernando", "Granada", "Peñón"],
    "Barranquilla": ["El Prado", "Alto Prado", "Riomar"]
};

const WalkerRegistration: React.FC = () => {
    const navigate = useNavigate();
    const { registerApplicant } = useWalker();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        neighborhood: '',
        experience: '',
        documents: {
            idCard: '' as string | File,
            policeRecord: '' as string | File,
            certificate: '' as string | File
        }
    });

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, city: e.target.value, neighborhood: '' });
    };

    const handleFileUpload = (field: keyof typeof formData.documents) => {
        // Mock file upload
        // In a real application, this would involve uploading the file to a service (e.g., Cloudinary)
        // and then storing the returned URL or ID.
        // For this mock, we'll just set a placeholder string.
        setFormData(prev => ({
            ...prev,
            documents: {
                ...prev.documents,
                [field]: `uploaded_file_placeholder_${field}.pdf` // Simplified for build: In real app, upload to Cloudinary and get URL
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        registerApplicant({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            city: formData.city,
            neighborhood: formData.neighborhood,
            experience: formData.experience,
            bio: "Nuevo paseador en CaminaCan",
            price: 15000,
            image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?fit=crop&w=200&h=200",
            badges: ["Nuevo Ingreso"],
            documents: formData.documents
        });
        setStep(3); // Success step
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Únete a CaminaCan</h1>
                    <p className="text-gray-500 mt-2">Conviértete en un paseador verificado y gana dinero haciendo lo que amas.</p>
                </div>

                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
                    >
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="bg-primary text-gray-900 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                            Información Personal
                        </h2>

                        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                                    <input
                                        type="text" required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email" required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono / WhatsApp</label>
                                <input
                                    type="tel" required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
                                        value={formData.city} onChange={handleCityChange}
                                    >
                                        <option value="">Seleccionar Ciudad</option>
                                        {Object.keys(LOCATIONS).map(city => <option key={city} value={city}>{city}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Barrio / Sector</label>
                                    <select
                                        required
                                        disabled={!formData.city}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white disabled:bg-gray-50"
                                        value={formData.neighborhood} onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                                    >
                                        <option value="">Seleccionar Sector</option>
                                        {formData.city && LOCATIONS[formData.city]?.map(hood => (
                                            <option key={hood} value={hood}>{hood}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Experiencia con Perros</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="Cuéntanos brevemente tu experiencia..."
                                    value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors">
                                Siguiente: Documentación
                            </button>
                        </form>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
                    >
                        <button onClick={() => setStep(1)} className="text-gray-400 text-sm hover:text-gray-600 mb-6">← Volver</button>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="bg-primary text-gray-900 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                            Verificación de Documentos
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm mb-6">
                                <p>Sube tus documentos en PDF o Imagen. Estos serán revisados manualmente por nuestro equipo.</p>
                            </div>

                            {[
                                { id: 'idCard', label: 'Cédula de Ciudadanía' },
                                { id: 'policeRecord', label: 'Antecedentes Policiales' },
                                { id: 'certificate', label: 'Certificado de Curso Canino (Opcional)' }
                            ].map((doc) => (
                                <div key={doc.id} className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary transition-colors">
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                const file = e.target.files[0];
                                                setFormData(prev => ({
                                                    ...prev,
                                                    documents: {
                                                        ...prev.documents,
                                                        [doc.id]: file as any // Cast to any to align with simplified build type placeholder
                                                    }
                                                }));
                                            }
                                        }}
                                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                                    />
                                    {formData.documents[doc.id as keyof typeof formData.documents] instanceof File ? (
                                        <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
                                            <CheckCircle size={20} />
                                            {(formData.documents[doc.id as keyof typeof formData.documents] as any).name}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <Upload size={24} />
                                            <span className="text-sm font-medium">Subir {doc.label}</span>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <button type="submit" className="w-full bg-primary text-gray-900 font-bold py-4 rounded-xl hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-400/20">
                                Enviar Solicitud
                            </button>
                        </form>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md mx-auto"
                    >
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">¡Solicitud Enviada!</h2>
                        <p className="text-gray-500 mb-8">
                            Hemos recibido tus datos. Nuestro equipo de administración revisará tu perfil y te contactará en las próximas 24 horas.
                        </p>
                        <button onClick={() => navigate('/')} className="w-full bg-gray-100 text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">
                            Volver al Inicio
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default WalkerRegistration;
