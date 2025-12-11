import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Share2, Heart, Star, CheckCircle, Minus, Plus, Loader, LogIn, LogOut } from 'lucide-react';
import { supabase, mapProductFromSupabase } from '../lib/supabase';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';
import BioumiLogo from '../components/BioumiLogo';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, logout } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
        if (!id) return;

        // Check pour ID de mock (court) vs ID de base de données (long/uuid)
        if (id.length < 5) {
             const localProduct = MOCK_PRODUCTS.find(p => p.id === id);
             setProduct(localProduct || null);
             setLoading(false);
             return;
        }

        try {
            // Récupération depuis Supabase
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            
            if (data) {
                setProduct(mapProductFromSupabase(data));
            } else {
                setProduct(null);
            }
        } catch (error) {
            console.warn("Mode Démo : Produit non trouvé sur Supabase, recherche locale.", error);
            const localProduct = MOCK_PRODUCTS.find(p => p.id === id);
            setProduct(localProduct || null);
        } finally {
            setLoading(false);
        }
    };
    fetchProduct();
  }, [id]);

  const handleAuthAction = async () => {
    if (user) {
        if (confirm("Voulez-vous vous déconnecter ?")) {
            await logout();
            navigate('/login');
        }
    } else {
        navigate('/login');
    }
  };

  if (loading) return (
      <div className="flex items-center justify-center min-h-screen">
          <Loader className="animate-spin text-bioumi-600" size={32} />
      </div>
  );

  if (!product) return <div className="p-8 text-center text-gray-500">Produit non trouvé</div>;

  const handleAddToCart = () => {
    for(let i=0; i<qty; i++) {
        addToCart(product);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24 relative">
      {/* Top Nav Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between z-10">
        <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-700 hover:bg-white"
        >
            <ChevronLeft size={24} />
        </button>
        <div className="flex gap-3">
            <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={`w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-white ${isFavorite ? 'text-red-500' : 'text-gray-700'}`}
            >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-700 hover:bg-white">
                <Share2 size={20} />
            </button>
            <button 
                onClick={handleAuthAction}
                className={`w-10 h-10 rounded-full backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-white ${user ? 'bg-red-50/80 text-red-500' : 'bg-white/80 text-bioumi-700'}`}
                title={user ? "Se déconnecter" : "Se connecter"}
            >
                {user ? <LogOut size={20} /> : <LogIn size={20} />}
            </button>
        </div>
      </div>

      {/* Image Header */}
      <div className="h-[45vh] w-full bg-earth-50 flex items-center justify-center">
        {!imgError && product.image ? (
             <img 
             src={product.image} 
             alt={product.name} 
             className="w-full h-full object-cover"
             onError={() => setImgError(true)}
           />
        ) : (
            <div className="opacity-50 grayscale flex flex-col items-center gap-2">
                <BioumiLogo className="w-32 h-32" showText={false} />
                <span className="text-xs text-gray-400 font-medium">Image non disponible</span>
            </div>
        )}
      </div>

      {/* Content Container */}
      <div className="-mt-6 bg-white rounded-t-[32px] relative z-0 px-6 pt-8 pb-4 shadow-[-0_-10px_20px_rgba(0,0,0,0.05)]">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
            <div>
                <span className="text-bioumi-600 text-xs font-bold uppercase tracking-wider">{product.category}</span>
                <h1 className="text-2xl font-serif font-bold text-gray-900 mt-1">{product.name}</h1>
                <div className="text-sm text-gray-500 mt-1">Par <span className="text-earth-800 font-medium underline">{product.producer}</span></div>
            </div>
            <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                    <Star size={14} className="text-amber-500" fill="currentColor" />
                    <span className="text-sm font-bold text-amber-700">{product.rating}</span>
                </div>
                <span className="text-xs text-gray-400 mt-1">{product.reviews} avis</span>
            </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mb-6 mt-4">
            {product.isOrganic && <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">100% Bio</span>}
            {product.isArtisanal && <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">Artisanat</span>}
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">Tunisien</span>
        </div>

        {/* Description */}
        <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
        </div>

        {/* Ingredients */}
        <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-2">Ingrédients</h3>
            <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing, i) => (
                    <span key={i} className="text-xs bg-earth-50 text-earth-800 px-2 py-1 rounded-md border border-earth-100">{ing}</span>
                ))}
            </div>
        </div>

        {/* Benefits */}
        <div className="mb-6 bg-bioumi-50 p-4 rounded-xl">
            <h3 className="font-bold text-bioumi-800 mb-3 flex items-center gap-2">
                <CheckCircle size={16} /> Bienfaits Santé
            </h3>
            <ul className="space-y-2">
                {product.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 bg-bioumi-500 rounded-full mt-1.5 flex-shrink-0"></span>
                        {benefit}
                    </li>
                ))}
            </ul>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-6 flex items-center gap-4 z-20 max-w-2xl mx-auto md:max-w-4xl">
        <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-3">
            <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-6 h-6 flex items-center justify-center text-gray-600 active:scale-90"
            >
                <Minus size={16} />
            </button>
            <span className="font-bold text-lg w-4 text-center">{qty}</span>
            <button 
                onClick={() => setQty(qty + 1)}
                className="w-6 h-6 flex items-center justify-center text-gray-600 active:scale-90"
            >
                <Plus size={16} />
            </button>
        </div>
        <button 
            onClick={handleAddToCart}
            className="flex-grow bg-bioumi-700 text-white font-bold text-lg py-3 rounded-xl shadow-lg shadow-bioumi-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
            Ajouter {(product.price * qty).toFixed(2)} DT
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;