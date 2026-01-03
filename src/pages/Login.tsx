import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Dog, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = await login(email, password);
        if (success) {
            // Get user from localStorage to check role immediately after login
            const storedUser = JSON.parse(localStorage.getItem('caminacan_user') || '{}');
            if (storedUser.role === 'admin') navigate('/admin');
            else if (storedUser.role === 'walker') navigate('/walker');
            else navigate('/dashboard');
        } else {
            setError('Credenciales inválidas. Usa demo123 (Dueño), admin123 (Admin) o walker123 (Paseador).');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                        <Dog size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Bienvenido de nuevo</h2>
                    <p className="text-gray-500">Ingresa a tu cuenta para gestionar tus paseos</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                            <input
                                type="email"
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                            <input
                                type="password"
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>


                    <div className="flex justify-end">
                        <Link to="/forgot-password" className="text-sm font-medium text-gray-400 hover:text-gray-600">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-gray-900 font-bold py-4 rounded-xl hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-400/20"
                    >
                        Iniciar Sesión
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    ¿No tienes cuenta? <Link to="/register" className="text-secondary font-bold hover:underline">Regístrate aquí</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
