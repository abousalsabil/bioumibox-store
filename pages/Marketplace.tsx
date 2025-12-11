import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Loader } from 'lucide-react';
import { CATEGORIES as STATIC_CATEGORIES, MOCK_PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import { Category, Product, CategoryData } from '../types';
import { supabase, mapProductFromSupabase } from '../lib/supabase';

const Marketplace: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || Category.ALL;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([Category.ALL]);
  const [loading, setLoading] = useState(true);

  // Sync with URL param if it changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  // Fetch Categories and Products
  useEffect(() => {
    const initData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Categories
            const { data: catData } = await supabase.from('categories').select('name').order('name');
            if (catData && catData.length > 0) {
                setCategories([Category.ALL, ...catData.map(c => c.name)]);
            } else {
                setCategories(STATIC_CATEGORIES);
            }

            // 2. Build Product Query
            let query = supabase.from('products').select('*');
            
            if (selectedCategory !== Category.ALL) {
                query = query.eq('category', selectedCategory);
            }
            
            if (searchTerm) {
                query = query.ilike('name', `%${searchTerm}%`);
            }

            const { data: prodData, error } = await query;
            
            if (error) throw error;

            if ((!prodData || prodData.length === 0) && !searchTerm && selectedCategory === Category.ALL) {
                 setProducts(MOCK_PRODUCTS);
            } else {
                 setProducts((prodData || []).map(mapProductFromSupabase));
            }

        } catch (error) {
            console.warn("Error fetching data", error);
            // Fallback
            setCategories(STATIC_CATEGORIES);
            let localData = MOCK_PRODUCTS;
            if (selectedCategory !== Category.ALL) {
                localData = localData.filter(p => p.category === selectedCategory);
            }
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                localData = localData.filter(p => p.name.toLowerCase().includes(term));
            }
            setProducts(localData);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search slightly
    const timeoutId = setTimeout(() => {
        initData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedCategory, searchTerm]);

  return (
    <div className="px-4 pt-2 pb-20 min-h-screen">
      <div className="sticky top-0 bg-earth-50 z-30 pb-4 pt-2">
        {/* Search Bar */}
        <div className="relative mb-4">
            <input
            type="text"
            placeholder="Rechercher : Miel, Dattes, Huile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-bioumi-500 focus:ring-1 focus:ring-bioumi-500 shadow-sm bg-white text-gray-900 placeholder-gray-400"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`absolute right-2 top-2 p-1.5 rounded-lg transition-colors ${showFilters ? 'bg-bioumi-100 text-bioumi-700' : 'bg-gray-100 text-gray-500'}`}
            >
                <SlidersHorizontal size={20} />
            </button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
            <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                    ? 'bg-bioumi-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
            >
                {cat}
            </button>
            ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center pt-20">
            <Loader className="animate-spin text-bioumi-600" size={32} />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center pt-20 text-gray-500">
            <Search size={48} className="text-gray-300 mb-4" />
            <p className="text-lg font-medium">Aucun résultat trouvé</p>
            <p className="text-sm">Essayez d'autres mots-clés ou catégories.</p>
            <button 
                onClick={() => {setSelectedCategory(Category.ALL); setSearchTerm('');}}
                className="mt-4 text-bioumi-600 font-semibold"
            >
                Effacer les filtres
            </button>
        </div>
      )}
    </div>
  );
};

export default Marketplace;