import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Package, Loader, Calendar, MapPin, ChevronRight, ShoppingBag } from 'lucide-react';

const Orders: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setOrders(data || []);
            } catch (error) {
                console.error("Erreur chargement commandes", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchOrders();
    }, [user, authLoading, navigate]);

    if (loading || authLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader className="animate-spin text-bioumi-600" size={32} />
            </div>
        );
    }

    return (
        <div className="px-4 pt-4 pb-20 min-h-screen bg-earth-50">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors"><ArrowLeft size={24} /></button>
                <h1 className="text-2xl font-serif font-bold text-gray-900">Mes Commandes</h1>
            </div>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center pt-20 text-center opacity-60">
                    <Package size={64} className="text-gray-400 mb-4" />
                    <h2 className="text-xl font-bold text-gray-700">Aucune commande</h2>
                    <p className="text-sm text-gray-500 mb-6">Vous n'avez pas encore passé de commande.</p>
                    <button 
                        onClick={() => navigate('/marketplace')}
                        className="bg-bioumi-600 text-white px-6 py-2 rounded-xl font-bold"
                    >
                        Découvrir nos produits
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-earth-200">
                            {/* Header Carte */}
                            <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-3">
                                <div>
                                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Commande #{order.id.slice(0, 6)}</div>
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <Calendar size={14} />
                                        {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {order.status === 'pending' ? 'En Attente' :
                                     order.status === 'confirmed' ? 'Confirmée' :
                                     order.status === 'delivered' ? 'Livrée' : 
                                     order.status === 'cancelled' ? 'Annulée' : order.status}
                                </div>
                            </div>

                            {/* Contenu */}
                            <div className="mb-4">
                                <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <ShoppingBag size={16} className="text-bioumi-600" /> Articles
                                </div>
                                <ul className="space-y-2 pl-6 border-l-2 border-gray-100">
                                    {order.items?.map((item: any, idx: number) => (
                                        <li key={idx} className="text-sm text-gray-600 flex justify-between">
                                            <span>{item.quantity}x {item.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Footer & Total */}
                            <div className="flex items-center justify-between pt-2">
                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                    <MapPin size={12} /> Livraison incluse
                                </div>
                                <div className="text-lg font-bold text-bioumi-800">
                                    {order.total_amount.toFixed(2)} DT
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;