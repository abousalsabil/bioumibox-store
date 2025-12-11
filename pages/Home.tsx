import React, { useEffect, useState } from 'react';
import { CATEGORIES, MOCK_PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, Award, Leaf, ShieldCheck, Heart, Loader } from 'lucide-react';
import { supabase, mapProductFromSupabase } from '../lib/supabase';
import { Product, CategoryData } from '../types';
import BioumiLogo from '../components/BioumiLogo';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    // 1. Fetch Categories
    const fetchCategories = async () => {
        try {
            const { data } = await supabase.from('categories').select('*').order('name');
            if (data && data.length > 0) {
                setCategories(data);
            } else {
                 // Fallback to static if DB empty
                 const staticCats = CATEGORIES.slice(1).map((c, i) => ({ id: i.toString(), name: c, image: '' }));
                 setCategories(staticCats);
            }
        } catch (error) {
            console.error("Error fetching categories", error);
            const staticCats = CATEGORIES.slice(1).map((c, i) => ({ id: i.toString(), name: c, image: '' }));
            setCategories(staticCats);
        } finally {
            setLoadingCats(false);
        }
    };

    // 2. Fetch Products
    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .limit(4);
            
            if (error) throw error;

            if (!data || data.length === 0) {
                setPopularProducts(MOCK_PRODUCTS.slice(0, 4));
            } else {
                setPopularProducts(data.map(mapProductFromSupabase));
            }
        } catch (error) {
            console.warn("Error fetching products", error);
            setPopularProducts(MOCK_PRODUCTS.slice(0, 4));
        } finally {
            setLoading(false);
        }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  return (
    <div className="pb-8">
      {/* Hero Section */}
      <div className="px-4 mb-8 pt-2">
        <div className="bg-earth-900 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl min-h-[280px] flex flex-col justify-center">
            <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-earth-900 via-earth-900/80 to-transparent"></div>
            
            <div className="relative z-10">
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-bioumi-500/20 border border-bioumi-400/30 text-bioumi-300 text-xs font-bold rounded-full mb-4 backdrop-blur-sm">
                    <Leaf size={12} /> 100% Naturel & Tunisien
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3 leading-tight">
                    Le meilleur de l’alimentation <span className="text-bioumi-400">naturelle</span>
                </h1>
                <p className="text-earth-100 text-sm mb-6 leading-relaxed max-w-sm">
                    Découvrez l'authenticité de nos produits du terroir : artisanaux, sains et sans conservateurs chimiques.
                </p>
                <button 
                    onClick={() => navigate('/marketplace')}
                    className="bg-bioumi-500 hover:bg-bioumi-600 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-bioumi-900/50 active:scale-95 transition-all flex items-center gap-2 w-fit"
                >
                    Découvrir la sélection <ArrowRight size={16} />
                </button>
            </div>
        </div>
      </div>

      {/* Value Propositions */}
      <div className="grid grid-cols-4 gap-2 px-4 mb-10 text-center">
        <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-white border border-earth-100 shadow-sm flex items-center justify-center text-bioumi-600">
                <ShieldCheck size={24} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-medium text-gray-600 leading-tight">Zéro<br/>Conservateur</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-white border border-earth-100 shadow-sm flex items-center justify-center text-amber-600">
                <Award size={24} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-medium text-gray-600 leading-tight">Artisanal<br/>& Local</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-white border border-earth-100 shadow-sm flex items-center justify-center text-green-600">
                <Leaf size={24} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-medium text-gray-600 leading-tight">100%<br/>Naturel</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-white border border-earth-100 shadow-sm flex items-center justify-center text-blue-600">
                <Truck size={24} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-medium text-gray-600 leading-tight">Circuit<br/>Court</span>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-10">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-earth-900 font-serif">Nos Rayons</h2>
            <button onClick={() => navigate('/marketplace')} className="text-bioumi-700 text-sm font-medium">Voir tout</button>
        </div>
        
        {loadingCats ? (
            <div className="flex justify-center py-4"><Loader className="animate-spin text-bioumi-600" size={24} /></div>
        ) : (
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
                {categories.map((cat, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => navigate(`/marketplace?category=${encodeURIComponent(cat.name)}`)}
                        className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group"
                    >
                        <div className="w-20 h-20 rounded-full bg-white shadow-md border-2 border-white p-1 group-hover:border-bioumi-400 transition-colors relative overflow-hidden">
                            {cat.image ? (
                                <img 
                                    src={cat.image} 
                                    className="w-full h-full object-cover rounded-full"
                                    alt={cat.name}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${cat.name}&background=fde68a&color=92400e`;
                                    }}
                                />
                            ) : (
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${cat.name}&background=fde68a&color=92400e`}
                                    className="w-full h-full object-cover rounded-full"
                                    alt={cat.name}
                                />
                            )}
                        </div>
                        <span className="text-xs font-semibold text-gray-700 max-w-[80px] text-center truncate">{cat.name}</span>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Engagement Section */}
      <div className="px-4 mb-10">
        <div className="bg-bioumi-50 rounded-2xl p-6 border border-bioumi-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 text-bioumi-100 opacity-50">
                <Leaf size={100} />
            </div>
            <h3 className="text-lg font-bold text-earth-900 mb-3 font-serif flex items-center gap-2">
                <Heart size={20} className="text-bioumi-600" fill="currentColor" />
                Notre Engagement
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
                Chez Bioumi Box, chaque produit a une histoire. Nous collaborons directement avec des producteurs tunisiens qui respectent la nature et les traditions.
            </p>
            <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-xs font-bold text-earth-800">
                    <span className="w-1.5 h-1.5 bg-bioumi-600 rounded-full"></span> Zéro conservateur chimique
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-earth-800">
                    <span className="w-1.5 h-1.5 bg-bioumi-600 rounded-full"></span> Ingrédients naturels non transformés
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-earth-800">
                    <span className="w-1.5 h-1.5 bg-bioumi-600 rounded-full"></span> 100% Tunisien, 100% Sain
                </li>
            </ul>
        </div>
      </div>

      {/* Popular Products */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-earth-900 font-serif">Les Pépites du Moment</h2>
        </div>
        
        {loading ? (
            <div className="flex justify-center py-10">
                <Loader className="animate-spin text-bioumi-600" size={32} />
            </div>
        ) : (
            <div className="grid grid-cols-2 gap-4">
                {popularProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        )}
        
        <button 
            onClick={() => navigate('/marketplace')}
            className="w-full mt-6 py-4 border border-earth-200 text-earth-800 font-semibold rounded-xl hover:bg-earth-50 transition-colors flex items-center justify-center gap-2"
        >
            Voir toute la boutique
        </button>
      </div>
    </div>
  );
};

export default Home;