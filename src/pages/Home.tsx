
import React from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import { ArrowRight, Star, Shield, Clock, Calendar, MapPin, UserCheck, Dog, Heart, CheckCircle2, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen font-sans bg-white overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-40 lg:pt-48 lg:pb-60">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 left-0 -ml-20 -mt-20 w-[600px] h-[600px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-20 w-[600px] h-[600px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Text Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm mb-8">
                                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                    <span className="text-sm font-semibold text-gray-600 tracking-wide uppercase">Disponible en toda Colombia</span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-[1.1] tracking-tight">
                                    Paseos que <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">hacen cola.</span>
                                </h1>
                                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                    Conectamos a tu mejor amigo con paseadores certificados, apasionados y verificados. Rastreo GPS en vivo y amor garantizado en cada paso.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                                    <Link to="/register" className="group px-8 py-4 bg-gray-900 text-white text-lg font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3">
                                        Empezar Ahora
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link to="/walkers" className="px-8 py-4 bg-white text-gray-900 text-lg font-bold rounded-2xl hover:bg-gray-50 border border-gray-200 transition-all shadow-sm hover:shadow-md flex items-center justify-center">
                                        Ver Paseadores
                                    </Link>
                                </div>

                                <div className="mt-14 flex items-center justify-center lg:justify-start gap-8 border-t border-gray-100 pt-8">
                                    <div className="text-center lg:text-left">
                                        <p className="text-3xl font-bold text-gray-900">10k+</p>
                                        <p className="text-sm text-gray-500 font-medium">Paseos Felices</p>
                                    </div>
                                    <div className="w-px h-10 bg-gray-200"></div>
                                    <div className="text-center lg:text-left">
                                        <p className="text-3xl font-bold text-gray-900">4.9/5</p>
                                        <p className="text-sm text-gray-500 font-medium">Calificación Promedio</p>
                                    </div>
                                    <div className="w-px h-10 bg-gray-200"></div>
                                    <div className="text-center lg:text-left">
                                        <p className="text-3xl font-bold text-gray-900">100%</p>
                                        <p className="text-sm text-gray-500 font-medium">Seguros</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Image Composition */}
                        <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="relative z-10"
                            >
                                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50">
                                    <img
                                        src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                                        alt="Happy dog walking"
                                        className="w-full h-auto object-cover transform transition-transform hover:scale-105 duration-700"
                                    />

                                    {/* Floating Card 1 */}
                                    <motion.div
                                        initial={{ x: 50, opacity: 0 }}
                                        animate={{ x: 40, opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="absolute top-8 -right-12 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 hidden md:block"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-yellow-100 p-2 rounded-xl">
                                                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-semibold uppercase">Top Rated</p>
                                                <p className="font-bold text-gray-900">Paseador Estelar</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Floating Card 2 */}
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: -20, opacity: 1 }}
                                        transition={{ delay: 1 }}
                                        className="absolute -bottom-8 -left-12 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 flex items-center gap-4 hidden md:flex"
                                    >
                                        <div className="relative">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                                <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?fit=crop&w=150&h=150" alt="Walker" />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Camila R.</p>
                                            <p className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full inline-block">● En camino</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 bg-gray-50 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3 block">¿Por qué nosotros?</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Tranquilidad en cada paso</h2>
                        <p className="text-xl text-gray-600">Diseñamos CaminaCan pensando en lo que más te importa: la seguridad y felicidad de tu mascota.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Shield className="w-10 h-10 text-white" />,
                                color: "bg-blue-500",
                                title: "100% Verificados",
                                desc: "Cada paseador pasa un estricto proceso de validación de identidad y antecedentes policiales."
                            },
                            {
                                icon: <MapPin className="w-10 h-10 text-white" />,
                                color: "bg-yellow-500",
                                title: "Rastreo GPS",
                                desc: "Observa el recorrido en tiempo real. Sabrás exactamente dónde hizo pipí tu amigo."
                            },
                            {
                                icon: <Heart className="w-10 h-10 text-white" />,
                                color: "bg-red-500",
                                title: "Amor Garantizado",
                                desc: "Si tu perro no mueve la cola al vernos, te devolvemos tu dinero. Amamos lo que hacemos."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 relative group overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 ${item.color} opacity-5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150`}></div>
                                <div className={`${item.color} w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg mb-8 transform group-hover:rotate-6 transition-transform`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                                <p className="text-gray-600 text-lg leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works - Timeline Style */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <div className="flex-1 order-2 lg:order-1">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-300 to-primary rounded-[3rem] transform rotate-3 blur-sm opacity-50"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                                    alt="App steps"
                                    className="relative rounded-[3rem] shadow-2xl border-8 border-white"
                                />
                            </div>
                        </div>
                        <div className="flex-1 order-1 lg:order-2">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">Tan fácil como <br />pedir un taxi</h2>

                            <div className="space-y-12">
                                {[
                                    {
                                        icon: <Calendar className="w-6 h-6" />,
                                        title: "Reserva en segundos",
                                        desc: "Elige horario y paseador favorito desde la app o web."
                                    },
                                    {
                                        icon: <UserCheck className="w-6 h-6" />,
                                        title: "Tu paseador llega",
                                        desc: "Identificado con chaleco y carnet de CaminaCan."
                                    },
                                    {
                                        icon: <Zap className="w-6 h-6" />,
                                        title: "Disfruta tu tiempo",
                                        desc: "Mientras nosotros quemamos la energía de tu mascota."
                                    }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                                            {step.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                                            <p className="text-gray-500 text-lg">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium CTA */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-900"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">¿Listo para empezar?</h2>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">Únete a la comunidad de dueños de mascotas más grande de Colombia. Tu primer paseo corre por nuestra cuenta.</p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link to="/register" className="px-10 py-5 bg-primary text-gray-900 text-xl font-bold rounded-2xl hover:bg-yellow-400 transition-colors shadow-lg shadow-primary/25">
                            Crear Cuenta Gratis
                        </Link>
                        <Link to="/about" className="px-10 py-5 bg-transparent border-2 border-white/20 text-white text-xl font-bold rounded-2xl hover:bg-white/10 transition-colors">
                            Conocer Más
                        </Link>
                    </div>

                    <p className="mt-8 text-sm text-gray-500">Sin tarjetas de crédito requeridas para registro.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
