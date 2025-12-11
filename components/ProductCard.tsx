import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import BioumiLogo from './BioumiLogo';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-earth-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative h-40 w-full bg-earth-50 flex items-center justify-center overflow-hidden">
        {!imgError && product.image ? (
             <img 
             src={product.image} 
             alt={product.name} 
             className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
             loading="lazy"
             onError={() => setImgError(true)}
           />
        ) : (
            <div className="opacity-50 grayscale">
                <BioumiLogo className="w-20 h-20" showText={false} />
            </div>
        )}
       
        {(product.isOrganic || product.isArtisanal) && (
          <div className="absolute top-2 left-2 flex gap-1 z-10">
             {product.isOrganic && <span className="bg-bioumi-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">BIO</span>}
             {product.isArtisanal && <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">Artisan</span>}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-1 text-amber-500 mb-1">
            <Star size={12} fill="currentColor" />
            <span className="text-xs text-gray-500">{product.rating} ({product.reviews})</span>
        </div>
        <h3 className="font-semibold text-earth-900 leading-tight mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-3">{product.producer}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-bioumi-800">{product.price.toFixed(2)} DT</span>
          <button 
            onClick={handleAddToCart}
            className="w-8 h-8 rounded-full bg-bioumi-100 text-bioumi-700 flex items-center justify-center hover:bg-bioumi-600 hover:text-white transition-colors shadow-sm"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;