```typescript
import React from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import { ArrowRight, Star, Shield, Clock, Calendar, MapPin, UserCheck, Dog, Heart, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col font-sans">

            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50/50 to-yellow-50/30">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 w-2/3 h-full bg-[#FFF9C4] rounded-bl-[200px] -z-10 opacity-40 blur-3xl transform translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-100 rounded-tr-[150px] -z-10 opacity-30 blur-2xl"></div>

                <div className="container grid md:grid-cols-2 gap-12 items-center pt-20 pb-20">
                    <div className="space-y-8 z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md text-sm font-bold text-secondary border border-blue-50"
                        >
                            <Shield size={16} className="text-secondary fill-blue-100" />
            <section className="relative overflow-hidden bg-white pt-24 pb-32">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                                    🐾 El mejor cuidado para tu mascota
                                </span>
                                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                    Paseos seguros y felices para tu <span className="text-primary">mejor amigo</span>
                                </h1>
                                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                                    Conectamos dueños amorosos con paseadores verificados y apasionados. Rastreo GPS en vivo, reportes detallados y la tranquilidad que mereces.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Link to="/register" className="btn btn-primary btn-lg flex items-center justify-center gap-2 group">
                                        Empezar Ahora
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link to="/walkers" className="btn btn-outline btn-lg">
                                        Ver Paseadores
                                    </Link>
                                </div>

                                <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-primary" />
                                        <span>100% Verificados</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Star className="w-5 h-5 text-yellow-400" />
                                        <span>4.9/5 Calificación</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-blue-500" />
                                        <span>Rastreo GPS</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                        <div className="flex-1 relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.7 }}
                                className="relative z-10"
                            >
                                <div className="relative">
                                    <img 
                                        src="https://images.unsplash.com/photo-1601758228041-f3b2795255db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" 
                                        alt="Happy dog walking" 
                                        className="rounded-2xl shadow-2xl w-full max-w-md mx-auto transform rotate-3 hover:rotate-0 transition-transform duration-500"
                                    />
                                    <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3 animate-bounce-slow hidden md:flex">
                                        <div className="bg-green-100 p-2 rounded-full">
                                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Paseo Completado</p>
                                            <p className="text-xs text-gray-500">Hace 5 min • Max</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                            
                            {/* Decorative blobs */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-3xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Por qué elegir CaminaCan?</h2>
                        <p className="text-gray-600">Nos tomamos muy en serio la seguridad y felicidad de tu mascota. Nuestra plataforma está diseñada para darte total tranquilidad.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Seguro SURA Incluido", desc: "Cobertura de accidentes y responsabilidad civil en cada paseo." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-500">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">{item.title}</h4>
                                    <p className="text-gray-500">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4">
                        <Link to="/paseadores" className="text-secondary font-bold hover:text-blue-700 flex items-center gap-2">
                            Conoce a nuestros paseadores <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
            </section >

    {/* Owners CTA */ }
    < section className = "py-20 relative overflow-hidden" >
        <div className="container relative z-10">
            <div className="bg-secondary rounded-[40px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black mb-8">El primer paseo va por nuestra cuenta</h2>
                    <p className="text-blue-100 text-xl mb-10 leading-relaxed">
                        Regístrate hoy y recibe un descuento del 100% en tu primer paseo de 30 minutos. Tu perro te lo agradecerá.
                    </p>
                    <Link to="/register" className="inline-block bg-white text-secondary px-10 py-5 rounded-full font-bold text-xl hover:bg-yellow-400 hover:text-gray-900 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                        ¡Quiero mi paseo gratis!
                    </Link>

                    <p className="mt-8 text-sm opacity-70">Oferta válida para nuevos usuarios en Bogotá y Medellín.</p>
                </div>
                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
            </div>
        </div>
            </section >

    {/* Walker Recruitment Section (Dark Theme) */ }
    < section className = "bg-gray-900 py-24 text-white relative overflow-hidden border-t border-gray-800" >
        <div className="container relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <div className="inline-block bg-gray-800 px-4 py-1.5 rounded-full text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        Trabaja con nosotros
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black leading-tight">
                        Convierte tus pasos en <span className="text-primary">ingresos extra</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                        ¿Amas los perros? Únete a la red de paseadores mejor paga del país. Maneja tu propio horario, recibe pagos semanales y cuenta con respaldo de seguridad 24/7.
                    </p>

                    <div className="grid grid-cols-2 gap-6 pt-4">
                        <div>
                            <h4 className="text-2xl font-bold text-white mb-2">$1.8M+</h4>
                            <p className="text-gray-500 text-sm">Ingreso promedio mensual de paseadores full-time</p>
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold text-white mb-2">Flexible</h4>
                            <p className="text-gray-500 text-sm">Tú eliges cuándo y dónde trabajar</p>
                        </div>
                    </div>

                    <div className="pt-6">
                        <Link to="/registro-paseador" className="btn btn-primary text-gray-900 px-8 py-4 text-lg hover:bg-yellow-300 shadow-lg hover:shadow-yellow-400/50">
                            Aplicar como Paseador
                        </Link>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-3xl transform rotate-3 scale-105 blur-xl"></div>
                    <img
                        src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?fit=crop&w=800&q=80"
                        alt="Paseador feliz"
                        className="relative rounded-3xl opacity-90 grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl transform hover:-translate-y-2"
                    />
                </div>
            </div>
        </div>
            </section >
        </div >
    );
};

export default Home;
