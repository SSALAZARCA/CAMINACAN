import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';
import { API_URL } from '../api/config';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) return alert('Las contraseñas no coinciden');

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword })
            });

            if (res.ok) {
                alert('Contraseña actualizada correctamente');
                navigate('/login');
            } else {
                alert('El enlace ha expirado o es inválido');
            }
        } catch (error) {
            alert('Error al restablecer contraseña');
        } finally {
            setLoading(false);
        }
    };

    if (!token) return <p className="text-center p-10">Enlace inválido</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Lock className="text-green-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Nueva Contraseña</h2>
                <p className="text-gray-600 mb-8">Ingresa tu nueva contraseña para acceder.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        placeholder="Nueva contraseña"
                        className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                    <input
                        type="password"
                        placeholder="Confirmar contraseña"
                        className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                    />

                    <button
                        disabled={loading}
                        className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                    </button>
                </form>
            </div>
        </div>
    );
}
