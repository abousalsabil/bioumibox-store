import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, MapPin, CreditCard, CheckCircle, Loader, Phone, Mail, User } from 'lucide-react';

const Checkout: React.FC = () => {
  const { cartTotal, items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: Success
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Pré-remplissage des données utilisateur
  useEffect(() => {
    if (user) {
        setFullName(user.name || '');
        setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!phone || phone.length < 8) {
        alert("Veuillez saisir un numéro de téléphone valide pour la livraison.");
        setLoading(false);
        return;
    }

    if (!email || !email.includes('@')) {
        alert("Une adresse email valide est obligatoire pour le suivi.");
        setLoading(false);
        return;
    }

    try {
        const deliveryFee = 7.000;
        const totalAmount = cartTotal + deliveryFee;

        // Création de la commande dans Supabase
        const orderData = {
            user_id: user?.id,
            user_name: fullName,
            total_amount: totalAmount,
            status: 'pending',
            shipping_address: {
                full_name: fullName,
                phone: phone,
                address: address,
                email: email // On utilise l'email du formulaire, qui est obligatoire
            },
            items: items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            }))
        };

        const { error } = await supabase.from('orders').insert([orderData]);
        
        if (error) throw error;

        setStep(2);
        clearCart();
        setTimeout(() => {
            navigate('/profile');
        }, 3000);

    } catch (error) {
        console.error("Erreur commande:", error);
        alert("Une erreur est survenue lors de la commande. Veuillez réessayer.");
    } finally {
        setLoading(false);
    }
  };

  if (step === 2) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-white">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <CheckCircle size={48} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Commande Reçue !</h2>
              <p className="text-gray-500">Merci de faire confiance à Bioumi Box. Votre commande est enregistrée.</p>
          </div>
      )
  }

  return (
    <div className="px-4 pt-4 pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={24} /></button>
        <h1 className="text-2xl font-serif font-bold">Livraison</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-bioumi-600" /> Coordonnées & Livraison
            </h3>
            
            <div className="space-y-4">
                {/* Nom */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom complet <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <input 
                            required 
                            type="text" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-bioumi-500" 
                            placeholder="Ali Ben Salah" 
                        />
                         <User className="absolute left-3 top-3 text-gray-400" size={18} />
                    </div>
                </div>

                {/* Email (OBLIGATOIRE) */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Adresse Email <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <input 
                            required 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-bioumi-500" 
                            placeholder="exemple@email.com" 
                        />
                        <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Nécessaire pour recevoir la confirmation de commande.</p>
                </div>

                {/* Téléphone */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Téléphone mobile <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <input 
                            required 
                            type="tel" 
                            pattern="[0-9]{8}"
                            title="Veuillez entrer un numéro à 8 chiffres"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g,'').slice(0,8))}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-bioumi-500" 
                            placeholder="20 123 456" 
                        />
                        <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Essentiel pour que le livreur vous contacte.</p>
                </div>

                {/* Adresse */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Adresse complète <span className="text-red-500">*</span></label>
                    <textarea 
                        required 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-bioumi-500" 
                        placeholder="12 Rue de la liberté, Tunis" 
                        rows={3}
                    ></textarea>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-bioumi-600" /> Paiement
            </h3>
            <div className="flex items-center gap-3 p-4 border border-bioumi-500 bg-bioumi-50 rounded-xl cursor-pointer">
                <div className="w-5 h-5 rounded-full border-[5px] border-bioumi-600 bg-white"></div>
                <span className="font-medium text-gray-900">Paiement à la livraison</span>
            </div>
        </div>

        <button 
            type="submit"
            disabled={loading}
            className="w-full bg-bioumi-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-bioumi-700 transition-colors flex items-center justify-center gap-2"
        >
            {loading ? <Loader className="animate-spin" /> : `Confirmer la commande (${(cartTotal + 7).toFixed(2)} DT)`}
        </button>
      </form>
    </div>
  );
};

export default Checkout;