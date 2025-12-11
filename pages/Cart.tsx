import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowLeft } from 'lucide-react';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const deliveryFee = 7.000;
  const finalTotal = cartTotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] px-6 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Trash2 size={32} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
        <p className="text-gray-500 mb-8">Découvrez nos produits artisanaux et remplissez votre panier de bienfaits.</p>
        <button 
            onClick={() => navigate('/marketplace')}
            className="px-8 py-3 bg-bioumi-600 text-white rounded-xl font-semibold shadow-lg shadow-bioumi-200"
        >
            Commencer mes achats
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-32">
        <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={24} /></button>
            <h1 className="text-2xl font-serif font-bold">Mon Panier</h1>
        </div>
      
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
            <div className="w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="flex-grow flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                        <p className="text-xs text-gray-500">{item.quantity} x {item.price.toFixed(2)} DT</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 p-1">
                        <Trash2 size={18} />
                    </button>
                </div>
                <div className="flex justify-between items-end">
                    <div className="font-bold text-bioumi-700">{(item.price * item.quantity).toFixed(2)} DT</div>
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                        <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-l-lg"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-r-lg"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Récapitulatif</h3>
        <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{cartTotal.toFixed(2)} DT</span>
            </div>
            <div className="flex justify-between text-gray-600">
                <span>Frais de livraison</span>
                <span>{deliveryFee.toFixed(2)} DT</span>
            </div>
            <div className="border-t border-dashed border-gray-200 my-2 pt-2 flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span className="text-bioumi-700">{finalTotal.toFixed(2)} DT</span>
            </div>
        </div>
      </div>

      <button 
        onClick={() => navigate('/checkout')}
        className="fixed bottom-[80px] md:bottom-4 left-4 right-4 md:left-auto md:right-auto md:w-96 bg-earth-900 text-white font-bold py-4 rounded-xl shadow-xl flex justify-between px-6 items-center"
      >
        <span>Passer la commande</span>
        <span className="bg-white/20 px-2 py-1 rounded text-sm">{finalTotal.toFixed(2)} DT</span>
      </button>
    </div>
  );
};

export default Cart;
