import React from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { Home, ShoppingBag, User, Search, ShoppingCart, LayoutDashboard, LogIn, LogOut, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import BioumiLogo from './BioumiLogo';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { isAdmin, user, logout } = useAuth();

  const isProductPage = location.pathname.startsWith('/product/');
  const isAuthPage = location.pathname === '/login';

  if (isAuthPage) {
    return <Outlet />;
  }

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

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-earth-50 max-w-2xl mx-auto md:max-w-4xl border-x border-earth-200 shadow-xl relative">
      {/* Mobile Top Header */}
      {!isProductPage && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-2 flex items-center justify-between border-b border-earth-100 shadow-sm">
          <Link to="/" className="flex items-center gap-2">
            <BioumiLogo className="w-14 h-14" />
          </Link>

          <div className="flex items-center gap-3">
             {/* Affichage du nom si connecté (caché sur très petits écrans si besoin, mais ici visible) */}
             {user && (
                 <span className="hidden sm:block text-xs font-medium text-earth-800 bg-earth-100 px-2 py-1 rounded-full truncate max-w-[150px]">
                     {user.name}
                 </span>
             )}

             {isAdmin && (
                <button 
                  onClick={() => navigate('/admin')} 
                  className="text-bioumi-700 hover:text-bioumi-900 bg-bioumi-100 p-2 rounded-full"
                  title="Administration"
                >
                    <LayoutDashboard size={20} />
                </button>
             )}
             
             {/* BOUTON COMMANDES : Visible uniquement si connecté */}
             {user && (
                <button 
                    onClick={() => navigate('/orders')} 
                    className="text-gray-500 hover:text-bioumi-700 relative"
                    title="Mes Commandes"
                >
                    <Package size={24} />
                </button>
             )}

             <button onClick={() => navigate('/marketplace')} className="text-gray-500 hover:text-bioumi-700">
                <Search size={24} />
             </button>
             <button onClick={() => navigate('/cart')} className="relative text-gray-500 hover:text-bioumi-700">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
             </button>
             
             {/* Bouton Connexion / Déconnexion */}
             <button 
                onClick={handleAuthAction}
                className={`p-2 rounded-full transition-colors ${user ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-bioumi-50 text-bioumi-700 hover:bg-bioumi-100'}`}
                title={user ? "Se déconnecter" : "Se connecter"}
             >
                {user ? <LogOut size={20} /> : <LogIn size={20} />}
             </button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className={isProductPage ? '' : 'pt-2'}>
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 px-6 flex justify-between items-center z-50 md:hidden">
        <NavLink to="/" icon={<Home size={24} />} label="Accueil" active={location.pathname === '/'} />
        <NavLink to="/marketplace" icon={<ShoppingBag size={24} />} label="Rayons" active={location.pathname === '/marketplace'} />
        <div className="relative">
             <NavLink to="/cart" icon={<ShoppingCart size={24} />} label="Panier" active={location.pathname === '/cart'} />
             {cartCount > 0 && (
                  <span className="absolute top-0 right-3 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {cartCount}
                  </span>
                )}
        </div>
        <NavLink to="/profile" icon={<User size={24} />} label="Compte" active={location.pathname === '/profile'} />
      </nav>

      {/* Desktop Footer Substitute */}
      <div className="hidden md:block py-8 text-center text-gray-400 text-sm">
        <p>&copy; 2025 Bioumi Box Tunisie. 100% Naturel, 100% Tunisien.</p>
      </div>
    </div>
  );
};

const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean }> = ({ to, icon, label, active }) => (
  <Link to={to} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-bioumi-700' : 'text-gray-400'}`}>
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </Link>
);

export default Layout;