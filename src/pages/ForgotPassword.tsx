import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle } from 'lucide-react';
import { API_URL } from '../api/config';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            setSent(true);
        } catch (error) {
            alert('Error enviando correo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in text-center">
                {sent ? (
                    <>
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle className="text-green-600" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">¡Correo Enviado!</h2>
                        <p className="text-gray-600 mb-8">
                            Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña en unos minutos.
                        </p>
                        <Link to="/login" className="text-green-600 font-bold hover:underline">
                            Volver al Login
                        </Link>
                    </>
                ) : (
                    <>
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <Mail className="text-green-600" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Recuperar Contraseña</h2>
                        <p className="text-gray-600 mb-8">Ingresa tu correo para recibir instrucciones.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <input
                                type="email"
                                placeholder="tu@correo.com"
                                className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />

                            <button
                                disabled={loading}
                                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Enviando...' : 'Enviar Enlace'}
                            </button>
                        </form>

                        <div className="mt-8">
                            <Link to="/login" className="text-sm text-gray-400 hover:text-gray-600">
                                Cancelar
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
