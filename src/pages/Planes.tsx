import React from 'react';
import { Check, Star, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useConfig } from '../context/ConfigContext';

const getIcon = (name: string) => {
    switch (name) {
        case 'Básico': return <Star className="text-gray-400" size={32} />;
        case 'Pro': return <Zap className="text-yellow-500" size={32} />;
        case 'Premium': return <Shield className="text-blue-500" size={32} />;
        default: return <Star className="text-gray-400" size={32} />;
    }
};

const getColor = (name: string) => {
    switch (name) {
        case 'Básico': return "border-gray-200";
        case 'Pro': return "border-yellow-400 border-2";
        case 'Premium': return "border-blue-100";
        default: return "border-gray-200";
    }
};

const getButtonColor = (name: string) => {
    switch (name) {
        case 'Básico': return "bg-gray-100 text-gray-900 hover:bg-gray-200";
        case 'Pro': return "bg-primary text-gray-900 hover:bg-yellow-400";
        case 'Premium': return "bg-gray-900 text-white hover:bg-gray-800";
        default: return "bg-gray-100 text-gray-900 hover:bg-gray-200";
    }
};

const Planes: React.FC = () => {
    const { plans } = useConfig();

    return (
        <div className="container py-20 min-h-screen">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h1 className="text-4xl font-bold mb-4">Planes diseñados para cada necesidad</h1>
                <p className="text-xl text-gray-600">Ahorra hasta un 20% con nuestros paquetes mensuales. Cancela cuando quieras.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-start">
                {plans.map((plan, index) => {
                    const icon = getIcon(plan.name);
                    const borderColor = getColor(plan.name);
                    const buttonColor = getButtonColor(plan.name);

                    return (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-white rounded-3xl p-8 relative shadow-lg ${borderColor} ${plan.highlight ? 'transform md:-translate-y-4 shadow-xl z-10' : ''}`}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                    {plan.tag || 'MEJOR VALOR'}
                                </div>
                            )}

                            <div className="mb-6">
                                <div className="mb-4">{icon}</div>
                                <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{plan.description}</p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-gray-900">${plan.price.toLocaleString()}</span>
                                    <span className="text-gray-400">/{plan.period}</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-gray-600 text-sm">
                                        <Check className="text-green-500 shrink-0" size={18} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl ${buttonColor}`}>
                                Elegir Plan {plan.name}
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            {/* FAQ Section Placeholder */}
            <div className="mt-20 max-w-3xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-8">Preguntas Frecuentes</h2>
                <div className="grid gap-6 text-left">
                    <div className="bg-gray-50 p-6 rounded-2xl">
                        <h4 className="font-bold text-gray-900 mb-2">¿Puedo cancelar mi suscripción?</h4>
                        <p className="text-gray-600">Sí, puedes cancelar o pausar tu plan en cualquier momento desde tu cuenta sin costos adicionales.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl">
                        <h4 className="font-bold text-gray-900 mb-2">¿Qué pasa si llueve?</h4>
                        <p className="text-gray-600">Nos adaptamos. Si hay lluvia fuerte, reprogramamos el paseo o realizamos actividades en interior si es posible.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Planes;
