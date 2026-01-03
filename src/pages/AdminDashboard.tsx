import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWalker } from '../context/WalkerContext';
import { useStore } from '../context/StoreContext';
import { useConfig } from '../context/ConfigContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, DollarSign, Users, Activity, BarChart2, CheckCircle, Clock, FileText, XCircle, Trash2, Plus, Edit2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { API_URL } from '../api/config';

const AdminDashboard: React.FC = () => {
    const { logout } = useAuth();
    const { applicants, activeWalkers, approveApplicant, rejectApplicant, suspendWalker, activateWalker, deleteWalker } = useWalker();
    const { products, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'financial' | 'applicants' | 'walkers' | 'store' | 'planes' | 'config'>('financial');
    const [smtpConfig, setSmtpConfig] = useState({ host: '', port: '', user: '', pass: '', adminEmail: '' });
    const [isEditingProduct, setIsEditingProduct] = useState<number | null>(null);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Alimento', stock: '', description: '', image: '' });

    // Config functionality
    const { fees, updateFees, plans, addPlan, updatePlan, deletePlan, updateSystemConfig } = useConfig();
    const [isEditingPlan, setIsEditingPlan] = useState<string | null>(null);
    const [newPlan, setNewPlan] = useState({ name: '', price: '', period: 'mensual', description: '', features: [''], highlight: false });
    const [tempFees, setTempFees] = useState(fees);

    // Stats (Mixed Mock + Context)
    const stats = [
        { title: 'Ingresos Totales', value: '$12,500,000', icon: <DollarSign className="text-green-500" />, change: '+12%' },
        { title: 'Paseos Activos', value: '34', icon: <Activity className="text-blue-500" />, change: '+5' },
        { title: 'Solicitudes Pendientes', value: applicants.length.toString(), icon: <Users className="text-purple-500" />, change: 'New' },
    ];

    const recentBookings = [
        { id: 101, user: 'Ana G.', walker: 'Juan Correa', price: 25000, status: 'Completado' },
        { id: 102, user: 'Pedro P.', walker: 'Carlos R.', price: 15000, status: 'En Progreso' },
        { id: 103, user: 'Luisa M.', walker: 'Ana María V.', price: 17000, status: 'Pendiente' },
    ];

    const [statsData, setStatsData] = useState<any>(null);
    const [payouts, setPayouts] = useState<any[]>([]);

    const { token } = useAuth();

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await fetch(`${API_URL}/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (statsRes.ok) setStatsData(await statsRes.json());

                const payoutsRes = await fetch(`${API_URL}/admin/payouts`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (payoutsRes.ok) setPayouts(await payoutsRes.json());
            } catch (err) {
                console.error("Error fetching admin data", err);
            }
        };
        if (token) fetchData();
    }, [token]);


    const processPayout = async (walkerId: string) => {
        try {
            const res = await fetch(`${API_URL}/admin/payouts/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ walkerId })
            });
            if (res.ok) {
                alert('Pago procesado con éxito');
                // Refresh list
                const payoutsRes = await fetch(`${API_URL}/admin/payouts`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (payoutsRes.ok) setPayouts(await payoutsRes.json());
            }
        } catch (err) {
            alert('Error al procesar pago');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleFeatureChange = (index: number, value: string) => {
        const updatedFeatures = [...newPlan.features];
        updatedFeatures[index] = value;
        setNewPlan({ ...newPlan, features: updatedFeatures });
    };

    const addFeatureField = () => {
        setNewPlan({ ...newPlan, features: [...newPlan.features, ''] });
    };

    const removeFeatureField = (index: number) => {
        const updatedFeatures = newPlan.features.filter((_, i) => i !== index);
        setNewPlan({ ...newPlan, features: updatedFeatures });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <nav className="bg-gray-900 text-white p-4 sticky top-0 z-10">
                <div className="container flex justify-between items-center">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <BarChart2 /> Admin Panel
                    </h1>
                    <div className="flex items-center gap-6">
                        <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('financial')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${activeTab === 'financial' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                            >Finanzas</button>
                            <button
                                onClick={() => setActiveTab('applicants')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${activeTab === 'applicants' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                            >Solicitudes ({applicants.length})</button>
                            <button
                                onClick={() => setActiveTab('walkers')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${activeTab === 'walkers' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                            >Paseadores</button>
                            <button
                                onClick={() => setActiveTab('store')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${activeTab === 'store' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                            >Tienda</button>
                            <button
                                onClick={() => setActiveTab('planes')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${activeTab === 'planes' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                            >Planes</button>
                            <button
                                onClick={() => setActiveTab('config')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${activeTab === 'config' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                            >Configuración</button>
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-2 hover:text-red-400 font-bold text-sm">
                            <LogOut size={16} /> Salir
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container py-10">

                {/* Stats & Charts */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 md:col-span-2">
                        <h3 className="text-lg font-bold mb-4">Crecimiento de Usuarios</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={statsData?.userGrowth || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#FCD34D" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold mb-4">Top Paseadores</h3>
                        <div className="space-y-4">
                            {statsData?.topWalkers.map((walker: any, i: number) => (
                                <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0">
                                    <span className="font-medium text-gray-700">{i + 1}. {walker.name}</span>
                                    <span className="font-bold text-green-600">${walker.earnings.toLocaleString()}</span>
                                </div>
                            )) || <p className="text-gray-400 text-sm">Cargando datos...</p>}
                        </div>
                    </div>
                </div>

                {activeTab === 'financial' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold mb-4">Configuración de Comisiones</h3>
                            <div className="grid md:grid-cols-3 gap-6 mb-8 bg-gray-50 p-6 rounded-2xl">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Comisión Plataforma (%)</label>
                                    <input
                                        type="number"
                                        value={tempFees.commission}
                                        onChange={(e) => setTempFees({ ...tempFees, commission: Number(e.target.value) })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Seguros e Impuestos (%)</label>
                                    <input
                                        type="number"
                                        value={tempFees.insurance}
                                        onChange={(e) => setTempFees({ ...tempFees, insurance: Number(e.target.value) })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={() => {
                                            updateFees(tempFees);
                                            alert('Tarifas actualizadas correctamente.');
                                        }}
                                        className="w-full bg-primary text-gray-900 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
                                    >
                                        Actualizar Tarifas
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-xl font-bold">Resumen Financiero</h3>
                                    <p className="text-sm text-gray-500">Cálculos basados en: Comisión {fees.commission}% | Seguros e Impuestos.</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-400 uppercase">Total Pendiente de Pago</p>
                                    <p className="text-2xl font-bold text-gray-900">${payouts.reduce((sum, p) => sum + p.netPayout, 0).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Paseador</th>
                                        <th className="px-6 py-4">Cuenta</th>
                                        <th className="px-6 py-4">Paseos Pendientes</th>
                                        <th className="px-6 py-4 text-green-600">Total Ganado</th>
                                        <th className="px-6 py-4 text-blue-600">Comisión</th>
                                        <th className="px-6 py-4 text-purple-600 font-bold border-l border-gray-200">A Pagar</th>
                                        <th className="px-6 py-4">Accion</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {payouts.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-gray-400">Todo al día. No hay pagos pendientes.</td>
                                        </tr>
                                    ) : (
                                        payouts.map((payout) => (
                                            <tr key={payout.walkerId} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-gray-900">{payout.walkerName}</td>
                                                <td className="px-6 py-4 font-mono text-sm text-gray-500">{payout.bankAccount}</td>
                                                <td className="px-6 py-4 font-bold">{payout.pendingBookings}</td>
                                                <td className="px-6 py-4 text-green-600 font-medium">${payout.totalEarnings.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-blue-600">-${payout.commission.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-purple-700 font-bold border-l border-gray-200 text-lg">${payout.netPayout.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => processPayout(payout.walkerId)}
                                                        className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-bold shadow hover:bg-green-600 transition-colors"
                                                    >
                                                        Pagar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'planes' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">Gestión de Planes</h3>
                                <p className="text-sm text-gray-500">Crea y edita los planes de suscripción.</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsEditingPlan('new');
                                    setNewPlan({ name: '', price: '', period: 'mensual', description: '', features: [''], highlight: false });
                                }}
                                className="bg-primary text-gray-900 px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-yellow-400 transition-colors flex items-center gap-2"
                            >
                                <Plus size={16} /> Crear Plan
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Nombre</th>
                                        <th className="px-6 py-4">Precio</th>
                                        <th className="px-6 py-4">Características</th>
                                        <th className="px-6 py-4">Destacado</th>
                                        <th className="px-6 py-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {plans.map(plan => (
                                        <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900">{plan.name}</td>
                                            <td className="px-6 py-4 font-bold text-green-700">${plan.price.toLocaleString()} / {plan.period}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                {plan.features.length} características
                                            </td>
                                            <td className="px-6 py-4">
                                                {plan.highlight ? (
                                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">SI</span>
                                                ) : <span className="text-gray-400 text-xs">NO</span>}
                                            </td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setIsEditingPlan(plan.id);
                                                        setNewPlan({
                                                            name: plan.name,
                                                            price: plan.price.toString(),
                                                            period: plan.period,
                                                            description: plan.description,
                                                            features: plan.features,
                                                            highlight: plan.highlight
                                                        });
                                                    }}
                                                    className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => { if (confirm('¿Eliminar plan?')) deletePlan(plan.id); }}
                                                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'applicants' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold">Solicitudes Pendientes</h3>
                            <p className="text-sm text-gray-500">Revisa la documentación y aprueba nuevos paseadores.</p>
                        </div>
                        {applicants.length === 0 ? (
                            <div className="p-10 text-center text-gray-500">
                                <CheckCircle size={48} className="mx-auto mb-4 text-gray-300" />
                                <p>No hay solicitudes pendientes.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {applicants.map(app => (
                                    <div key={app.id} className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-lg text-gray-900">{app.name}</h4>
                                                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-bold">Pendiente</span>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-2 flex items-center gap-4">
                                                <span>📍 {app.city}, {app.neighborhood}</span>
                                                <span>📞 {app.phone}</span>
                                                <span>📅 {app.dateApplied}</span>
                                            </p>
                                            <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg italic">"{app.experience}"</p>

                                            <div className="flex gap-2">
                                                {Object.entries(app.documents).map(([key, val]) => (
                                                    <div key={key} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100 cursor-pointer hover:bg-blue-100">
                                                        <FileText size={12} /> {key}: {val}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => rejectApplicant(app.id)}
                                                className="px-4 py-2 border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 text-sm flex items-center gap-2"
                                            >
                                                <XCircle size={16} /> Rechazar
                                            </button>
                                            <button
                                                onClick={() => approveApplicant(app.id)}
                                                className="px-4 py-2 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 text-sm flex items-center gap-2 shadow-lg shadow-green-500/20"
                                            >
                                                <CheckCircle size={16} /> Aprobar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'walkers' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold">Paseadores Activos</h3>
                            <p className="text-sm text-gray-500">Gestión de usuarios activos.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Paseador</th>
                                        <th className="px-6 py-4">Ubicación</th>
                                        <th className="px-6 py-4">Paseos</th>
                                        <th className="px-6 py-4">Ganancias</th>
                                        <th className="px-6 py-4">Estado</th>
                                        <th className="px-6 py-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {activeWalkers.map(walker => (
                                        <tr key={walker.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{walker.name}</div>
                                                <div className="text-xs text-gray-500">{walker.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">{walker.city}, {walker.neighborhood}</td>
                                            <td className="px-6 py-4 font-bold">{walker.walksCompleted}</td>
                                            <td className="px-6 py-4 text-green-600 font-bold">${walker.earnings.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${walker.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {walker.status === 'Active' ? 'ACTIVO' : 'SUSPENDIDO'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {walker.status === 'Active' ? (
                                                    <button
                                                        onClick={() => suspendWalker(walker.id)}
                                                        className="text-yellow-600 hover:text-yellow-700 font-bold text-xs bg-yellow-50 px-3 py-1 rounded-lg mr-2"
                                                    >
                                                        Suspender
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => activateWalker(walker.id)}
                                                        className="text-green-600 hover:text-green-700 font-bold text-xs bg-green-50 px-3 py-1 rounded-lg mr-2"
                                                    >
                                                        Activar
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => { if (confirm('¿Eliminar paseador?')) deleteWalker(walker.id); }}
                                                    className="text-red-400 hover:text-red-600"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'store' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Products Section */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold">Inventario de Productos</h3>
                                    <p className="text-sm text-gray-500">Gestiona precios y stock de la tienda.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsEditingProduct(0); // 0 indicates new product
                                        setNewProduct({ name: '', price: '', category: 'Alimento', stock: '', description: '', image: '' });
                                    }}
                                    className="bg-primary text-gray-900 px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-yellow-400 transition-colors flex items-center gap-2"
                                >
                                    <Plus size={16} /> Nuevo Producto
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                                        <tr>
                                            <th className="px-6 py-4">Producto</th>
                                            <th className="px-6 py-4">Categoría</th>
                                            <th className="px-6 py-4">Precio</th>
                                            <th className="px-6 py-4">Stock</th>
                                            <th className="px-6 py-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {products.map(product => (
                                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                                    <span className="font-bold text-gray-900">{product.name}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm">{product.category}</td>
                                                <td className="px-6 py-4 font-bold text-green-700">${product.price.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {product.stock} unid.
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setIsEditingProduct(product.id);
                                                            setNewProduct({
                                                                name: product.name,
                                                                price: product.price.toString(),
                                                                stock: product.stock.toString(),
                                                                category: product.category,
                                                                image: product.image,
                                                                description: product.description
                                                            });
                                                        }}
                                                        className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => { if (confirm('¿Borrar?')) deleteProduct(product.id) }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Orders Section */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-xl font-bold">Pedidos Recientes</h3>
                                <p className="text-sm text-gray-500">Seguimiento de entregas a clientes.</p>
                            </div>
                            {orders.length === 0 ? (
                                <div className="p-10 text-center text-gray-400">No hay pedidos recientes.</div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {orders.map(order => (
                                        <div key={order.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50 transition-colors">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-gray-900">Pedido #{order.id.slice(-6)}</h4>
                                                    <span className="text-sm text-gray-500">• {order.date}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">Cliente: <span className="font-bold">{order.userName}</span> ({order.userId})</p>
                                                <div className="flex gap-2 text-xs text-gray-500">
                                                    {order.items.map((item, i) => (
                                                        <span key={i} className="bg-gray-100 px-2 py-1 rounded-md">{item.quantity}x {item.product.name}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right mr-4">
                                                    <p className="font-bold text-lg">${order.total.toLocaleString()}</p>
                                                    <p className="text-xs text-gray-500">{order.items.length} productos</p>
                                                </div>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                                                    className={`px-3 py-2 rounded-lg font-bold text-sm border focus:outline-none focus:ring-2 focus:ring-primary ${order.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                            'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                        }`}
                                                >
                                                    <option value="Pending">Pendiente</option>
                                                    <option value="Shipped">En Camino</option>
                                                    <option value="Delivered">Entregado</option>
                                                    <option value="Cancelled">Cancelado</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}


                {activeTab === 'config' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in p-8">
                        <h3 className="text-xl font-bold mb-6">Configuración del Sistema</h3>

                        <div className="bg-yellow-50 p-6 rounded-2xl mb-8 border border-yellow-100">
                            <h4 className="font-bold text-yellow-800 mb-2">Servidor de Correo (SMTP)</h4>
                            <p className="text-sm text-yellow-700 mb-4">
                                Configura las credenciales para enviar correos transaccionales (Bienvenida, Recuperación de contraseña, Alertas).
                                Estos valores deben coincidir con tu proveedor de correo (ej. Gmail, Outlook, AWS SES).
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Host SMTP</label>
                                    <input type="text" placeholder="smtp.gmail.com" className="w-full px-4 py-2 border rounded-lg" value={smtpConfig.host} onChange={e => setSmtpConfig({ ...smtpConfig, host: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Puerto</label>
                                    <input type="text" placeholder="587" className="w-full px-4 py-2 border rounded-lg" value={smtpConfig.port} onChange={e => setSmtpConfig({ ...smtpConfig, port: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Usuario (Email)</label>
                                    <input type="text" placeholder="tu_correo@gmail.com" className="w-full px-4 py-2 border rounded-lg" value={smtpConfig.user} onChange={e => setSmtpConfig({ ...smtpConfig, user: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña (App Password)</label>
                                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border rounded-lg" value={smtpConfig.pass} onChange={e => setSmtpConfig({ ...smtpConfig, pass: e.target.value })} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Administrador (Notifications)</label>
                                    <input type="email" placeholder="admin@caminacan.com" className="w-full px-4 py-2 border rounded-lg" value={smtpConfig.adminEmail} onChange={e => setSmtpConfig({ ...smtpConfig, adminEmail: e.target.value })} />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={async () => {
                                        if (!smtpConfig.host || !smtpConfig.user) return alert('Datos incompletos');
                                        await updateSystemConfig(smtpConfig);
                                        alert('Configuración guardada y servidor actualizado.');
                                    }}
                                    className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                                >
                                    Guardar Configuración
                                </button>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                            <h4 className="font-bold text-gray-800 mb-4">Variables de Entorno (.env)</h4>
                            <code className="block bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                                SMTP_HOST={smtpConfig.host || 'smtp.gmail.com'}<br />
                                SMTP_PORT={smtpConfig.port || '587'}<br />
                                SMTP_USER={smtpConfig.user || 'usuario@gmail.com'}<br />
                                SMTP_PASS={smtpConfig.pass || '******'}<br />
                                ADMIN_EMAIL={smtpConfig.adminEmail || 'admin@caminacan.com'}
                            </code>
                            <p className="mt-4 text-xs text-gray-500">
                                * Por seguridad, estos valores deben guardarse en el archivo .env del servidor, no en la base de datos pública.
                                Copia el bloque de arriba y pégalo en tu archivo .env en el servidor.
                            </p>
                        </div>
                    </div>
                )}

            </div>

            {/* Plan Modal */}
            {isEditingPlan && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                {isEditingPlan === 'new' ? 'Crear Nuevo Plan' : 'Editar Plan'}
                            </h3>
                            <button onClick={() => setIsEditingPlan(null)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-colors">
                                <XCircle size={24} />
                            </button>
                        </div>
                        <div className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Plan</label>
                                <input type="text" value={newPlan.name} onChange={e => setNewPlan({ ...newPlan, name: e.target.value })} className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Precio</label>
                                    <input type="number" value={newPlan.price} onChange={e => setNewPlan({ ...newPlan, price: e.target.value })} className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Periodo</label>
                                    <input type="text" value={newPlan.period} onChange={e => setNewPlan({ ...newPlan, period: e.target.value })} className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                                <textarea value={newPlan.description} onChange={e => setNewPlan({ ...newPlan, description: e.target.value })} className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Características</label>
                                {newPlan.features.map((feature, i) => (
                                    <div key={i} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={e => handleFeatureChange(i, e.target.value)}
                                            className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200"
                                            placeholder={`Característica ${i + 1}`}
                                        />
                                        <button onClick={() => removeFeatureField(i)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                                <button onClick={addFeatureField} className="text-primary font-bold text-sm hover:underline">+ Agregar Característica</button>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={newPlan.highlight}
                                    onChange={e => setNewPlan({ ...newPlan, highlight: e.target.checked })}
                                    id="highlight"
                                    className="w-5 h-5 text-primary rounded focus:ring-primary"
                                />
                                <label htmlFor="highlight" className="font-bold text-gray-700">¿Destacar este plan?</label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button onClick={() => setIsEditingPlan(null)} className="px-6 py-2 rounded-lg font-bold text-gray-500 hover:bg-gray-100">Cancelar</button>
                                <button
                                    onClick={() => {
                                        if (isEditingPlan === 'new') {
                                            addPlan({ ...newPlan, price: Number(newPlan.price) });
                                        } else if (isEditingPlan) {
                                            updatePlan(isEditingPlan, { ...newPlan, price: Number(newPlan.price) });
                                        }
                                        setIsEditingPlan(null);
                                    }}
                                    className="px-6 py-2 bg-primary text-gray-900 rounded-lg font-bold hover:bg-yellow-400 shadow-md"
                                >
                                    Guardar Plan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}




            {/* Product Modal */}
            {isEditingProduct !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                {isEditingProduct === 0 ? <Plus className="text-primary" /> : <Edit2 className="text-blue-500" />}
                                {isEditingProduct === 0 ? 'Crear Nuevo Producto' : 'Editar Producto'}
                            </h3>
                            <button onClick={() => setIsEditingProduct(null)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-colors">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Nombre del Producto</label>
                                    <input
                                        type="text"
                                        value={newProduct.name}
                                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium"
                                        placeholder="Ej: Collar GPS"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Categoría</label>
                                    <select
                                        value={newProduct.category}
                                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium"
                                    >
                                        <option value="Alimento">Alimento</option>
                                        <option value="Juguetes">Juguetes</option>
                                        <option value="Accesorios">Accesorios</option>
                                        <option value="Salud">Salud</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Precio</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-gray-400 font-bold">$</span>
                                        <input
                                            type="number"
                                            value={newProduct.price}
                                            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-all font-bold text-gray-900"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Stock Disponible</label>
                                    <input
                                        type="number"
                                        value={newProduct.stock}
                                        onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-all font-bold text-gray-900"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">URL de Imagen</label>
                                <input
                                    type="text"
                                    value={newProduct.image}
                                    onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm font-mono text-gray-600"
                                    placeholder="https://"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Descripción</label>
                                <textarea
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-all min-h-[100px]"
                                    placeholder="Detalles del producto..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => setIsEditingProduct(null)}
                                    className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => {
                                        if (isEditingProduct === 0) {
                                            addProduct({
                                                ...newProduct,
                                                price: Number(newProduct.price),
                                                stock: Number(newProduct.stock)
                                            });
                                        } else if (isEditingProduct !== null) {
                                            updateProduct(isEditingProduct, {
                                                ...newProduct,
                                                price: Number(newProduct.price),
                                                stock: Number(newProduct.stock)
                                            });
                                        }
                                        setIsEditingProduct(null);
                                    }}
                                    className="px-6 py-2.5 bg-primary text-gray-900 rounded-xl font-bold hover:bg-yellow-400 shadow-md transform active:scale-95 transition-all"
                                >
                                    {isEditingProduct === 0 ? 'Crear Producto' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Plan Modal */}
            {isEditingPlan !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                {isEditingPlan === 'new' ? <Plus className="text-primary" /> : <Edit2 className="text-blue-500" />}
                                {isEditingPlan === 'new' ? 'Crear Nuevo Plan' : 'Editar Plan'}
                            </h3>
                            <button onClick={() => setIsEditingPlan(null)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-colors">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Plan</label>
                                    <input
                                        type="text"
                                        value={newPlan.name}
                                        onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                                        placeholder="Ej: Básico"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Precio</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-gray-400 font-bold">$</span>
                                        <input
                                            type="number"
                                            value={newPlan.price}
                                            onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-gray-900"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Periodo</label>
                                    <select
                                        value={newPlan.period}
                                        onChange={(e) => setNewPlan({ ...newPlan, period: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                                    >
                                        <option value="mensual">Mensual</option>
                                        <option value="semestral">Semestral</option>
                                        <option value="anual">Anual</option>
                                    </select>
                                </div>
                                <div className="flex items-center pt-8">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newPlan.highlight}
                                            onChange={(e) => setNewPlan({ ...newPlan, highlight: e.target.checked })}
                                            className="w-6 h-6 text-primary rounded focus:ring-primary border-gray-300"
                                        />
                                        <span className="font-bold text-gray-700">Destacar este plan</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Descripción Corta</label>
                                <textarea
                                    value={newPlan.description}
                                    onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                    rows={2}
                                    placeholder="Breve descripción del plan..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Características</label>
                                <div className="space-y-3">
                                    {newPlan.features.map((feature, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={(e) => {
                                                    const updatedFeatures = [...newPlan.features];
                                                    updatedFeatures[index] = e.target.value;
                                                    setNewPlan({ ...newPlan, features: updatedFeatures });
                                                }}
                                                className="flex-1 px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none"
                                                placeholder={`Característica ${index + 1}`}
                                            />
                                            <button
                                                onClick={() => {
                                                    const updatedFeatures = newPlan.features.filter((_, i) => i !== index);
                                                    setNewPlan({ ...newPlan, features: updatedFeatures });
                                                }}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setNewPlan({ ...newPlan, features: [...newPlan.features, ''] })}
                                        className="text-sm font-bold text-primary hover:text-yellow-600 flex items-center gap-1"
                                    >
                                        <Plus size={16} /> Agregar característica
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => setIsEditingPlan(null)}
                                    className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => {
                                        if (isEditingPlan === 'new') {
                                            if (!newPlan.name || !newPlan.price) return alert("Nombre y precio requeridos");
                                            addPlan({
                                                name: newPlan.name,
                                                price: Number(newPlan.price),
                                                period: newPlan.period,
                                                description: newPlan.description,
                                                features: newPlan.features.filter(f => f.trim() !== ''),
                                                highlight: newPlan.highlight
                                            });
                                        } else if (isEditingPlan) {
                                            updatePlan(isEditingPlan, {
                                                name: newPlan.name,
                                                price: Number(newPlan.price),
                                                period: newPlan.period,
                                                description: newPlan.description,
                                                features: newPlan.features.filter(f => f.trim() !== ''),
                                                highlight: newPlan.highlight
                                            });
                                        }
                                        setIsEditingPlan(null);
                                    }}
                                    className="px-6 py-2.5 bg-primary text-gray-900 rounded-xl font-bold hover:bg-yellow-400 shadow-md transform active:scale-95 transition-all"
                                >
                                    {isEditingPlan === 'new' ? 'Crear Plan' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
