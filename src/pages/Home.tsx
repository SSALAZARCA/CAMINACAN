import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Shield, Star, Clock, Calendar, CheckCircle, Smartphone, UserCheck, Heart, ArrowRight, Dog } from 'lucide-react';
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
                            <span>100% Asegurado con SURA</span>
                        </motion.div>

                        <Link to="/live-demo" className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full shadow-sm text-sm font-bold text-red-600 border border-red-100 hover:bg-red-100 transition-colors ml-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            Ver Demo en Vivo
                        </Link>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight"
                        >
                            Felicidad para tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-500">Mejor Amigo</span>, tranquilidad para ti.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-600 max-w-lg leading-relaxed"
                        >
                            La primera plataforma en Colombia que conecta a dueños con paseadores certificados, verificación en tiempo real y cobertura total.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 pt-2"
                        >
                            <Link to="/paseadores" className="btn btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group">
                                Buscar Paseador <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/planes" className="btn btn-secondary text-lg px-8 py-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all border-2 border-gray-100 bg-white">
                                Ver Planes
                            </Link>
                        </motion.div>

                        <div className="pt-8 flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <img key={i} src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="User" className="w-10 h-10 rounded-full border-4 border-white shadow-sm" />
                                ))}
                            </div>
                            <div>
                                <div className="flex text-yellow-500 gap-0.5 mb-1">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <p className="font-medium text-gray-900">+5,000 dueños felices</p>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image / Interaction Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative hidden md:block"
                    >
                        <div className="relative z-10 bg-white p-5 rounded-[40px] shadow-2xl max-w-sm mx-auto transform rotate-[-3deg] border border-gray-100">
                            <div className="bg-gray-100 h-80 rounded-[30px] mb-5 flex items-center justify-center text-gray-400 overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?fit=crop&w=600&h=800" alt="Perro Feliz" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 flex items-center gap-1 shadow-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> En vivo
                                </div>
                            </div>
                            <div className="flex justify-between items-center mb-4 px-2">
                                <div>
                                    <h3 className="font-extrabold text-xl text-gray-900">Paseo de Rocco</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1 font-medium">
                                        <MapPin size={14} className="text-primary" /> Parque Virrey, Bogotá
                                    </p>
                                </div>
                                <div className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
                                    EN CURSO
                                </div>
                            </div>
                            <div className="flex items-center gap-4 border-t border-gray-100 pt-5 px-2">
                                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-md">
                                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=100&h=100" alt="Paseador" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Camilo P.</p>
                                    <p className="text-xs text-secondary font-medium">Paseador Certificado</p>
                                </div>
                                <div className="ml-auto flex items-center gap-1 text-yellow-500 font-bold bg-yellow-50 px-2 py-1 rounded-lg">
                                    <Star size={14} fill="currentColor" /> 4.9
                                </div>
                            </div>
                        </div>

                        {/* Float Elements */}
                        <div className="absolute top-20 -right-8 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce border border-gray-50" style={{ animationDuration: '4s' }}>
                            <div className="bg-green-100 text-green-600 rounded-full p-2.5">
                                <CheckCircle size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">¡Rocco hizo pipí!</p>
                                <p className="text-xs text-gray-400 font-medium">Hace 2 min</p>
                            </div>
                        </div>

                        <div className="absolute bottom-32 -left-8 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-pulse border border-gray-50 delay-700">
                            <div className="bg-blue-100 text-blue-600 rounded-full p-2.5">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">Llegando al parque</p>
                                <p className="text-xs text-gray-400 font-medium">Hace 5 min</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-20 bg-white">
                <div className="container">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-secondary font-bold tracking-wider text-sm uppercase mb-2 block">¿Cómo funciona?</span>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">Tu perro paseado en 4 pasos</h2>
                        <p className="text-xl text-gray-500">Es tan fácil como pedir un transporte. Sin efectivo, sin complicaciones y con monitoreo total.</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>

                        {[
                            { icon: <Smartphone />, title: "1. Reserva", desc: "Elige horario y paseador favorito desde la app." },
                            { icon: <UserCheck />, title: "2. Recogida", desc: "El paseador llega a tu puerta identificado." },
                            { icon: <MapPin />, title: "3. Monitorea", desc: "Sigue la ruta GPS y recibe fotos en vivo." },
                            { icon: <Dog />, title: "4. Regreso Feliz", desc: "Entrega segura y reporte completo del paseo." }
                        ].map((step, i) => (
                            <div key={i} className="flex flex-col items-center text-center group">
                                <div className="w-24 h-24 bg-white border-4 border-gray-50 rounded-full flex items-center justify-center text-secondary shadow-sm mb-6 group-hover:border-primary/30 group-hover:scale-110 transition-all duration-300 relative z-10">
                                    {React.cloneElement(step.icon as React.ReactElement, { size: 32 })}
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-gray-900 shadow-sm">
                                        {i + 1}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Info */}
            <section className="py-20 bg-gray-50">
                <div className="container">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1 relative">
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-200 rounded-full filter blur-3xl opacity-50"></div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-200 rounded-full filter blur-3xl opacity-50"></div>
                            <img src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?fit=crop&w=800&q=80" alt="Paseador con perros" className="relative rounded-[30px] shadow-2xl transform hover:scale-[1.01] transition-transform duration-500" />
                        </div>
                        <div className="order-1 md:order-2 space-y-8">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">Seguridad que se siente</h2>
                                <p className="text-lg text-gray-600 mb-6">Sabemos que no le confías tu perro a cualquiera. Por eso construimos el proceso de seguridad más riguroso del mercado.</p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { title: "Verificación de Antecedentes", desc: "Revisamos antecedentes judiciales y policivos de cada paseador." },
                                    { title: "Pruebas Psicotécnicas", desc: "Evaluamos confiabilidad y amor por los animales." },
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
            </section>

            {/* Owners CTA */}
            <section className="py-20 relative overflow-hidden">
                <div className="container relative z-10">
                    <div className="bg-primary rounded-[40px] p-12 md:p-20 text-center text-gray-900 relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-black mb-8">El primer paseo va por nuestra cuenta</h2>
                            <p className="text-gray-800 text-xl mb-10 leading-relaxed font-medium">
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
            </section>

            {/* Walker Recruitment Section (Dark Theme) */}
            <section className="bg-gray-900 py-24 text-white relative overflow-hidden border-t border-gray-800">
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
            </section>
        </div>
    );
};

export default Home;
