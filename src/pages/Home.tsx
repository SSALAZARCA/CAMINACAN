
import React from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import { ArrowRight, Star, Shield, Clock, Calendar, MapPin, UserCheck, Dog, Heart, CheckCircle2, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen font-sans">
            {/* Hero Section */}
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
                            {
                                icon: <Shield className="w-8 h-8 text-primary" />,
                                title: "Confianza y Seguridad",
                                desc: "Todos nuestros paseadores pasan por un riguroso proceso de verificación de antecedentes y capacitación."
                            },
                            {
                                icon: <MapPin className="w-8 h-8 text-blue-500" />,
                                title: "Rastreo GPS en vivo",
                                desc: "Sigue el paseo de tu perro en tiempo real desde tu celular. Sabrás exactamente dónde está en todo momento."
                            },
                            {
                                icon: <Heart className="w-8 h-8 text-red-500" />,
                                title: "Amor por los animales",
                                desc: "Somos una comunidad de amantes de los perros. Trataremos a tu mascota como si fuera nuestra."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                            >
                                <div className="mb-4 bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 order-2 lg:order-1">
                            <img
                                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80"
                                alt="Dog walking app"
                                className="rounded-2xl shadow-2xl"
                            />
                        </div>
                        <div className="flex-1 order-1 lg:order-2">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Pasear a tu perro nunca fue tan fácil</h2>
                            <p className="text-lg text-gray-600 mb-10">En solo unos clics puedes programar paseos recurrentes o de última hora. Nosotros nos encargamos del resto.</p>

                            <div className="space-y-8">
                                {[
                                    { icon: <Calendar />, title: "1. Reserva", desc: "Elige el horario y paseador que más te guste." },
                                    { icon: <UserCheck />, title: "2. Recogida", desc: "El paseador llega a tu puerta identificado." },
                                    { icon: <MapPin />, title: "3. Monitorea", desc: "Sigue la ruta GPS y recibe fotos en vivo." },
                                    { icon: <Dog />, title: "4. Regreso Feliz", desc: "Entrega segura y reporte completo del paseo." }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                                                {React.cloneElement(step.icon as React.ReactElement<any>, { size: 20, className: "text-gray-400" })}
                                                {step.title}
                                            </h4>
                                            <p className="text-gray-600">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">¿Listo para darle la mejor vida a tu perro?</h2>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">Únete a miles de dueños felices que confían en CaminaCan. Tu primer paseo tiene descuento.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="btn bg-white text-primary hover:bg-gray-100 border-none btn-lg font-bold shadow-lg">
                            Crear Cuenta Gratis
                        </Link>
                        <Link to="/about" className="btn btn-outline border-white text-white hover:bg-white/10 btn-lg">
                            Saber más
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
