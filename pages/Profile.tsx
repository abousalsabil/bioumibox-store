import React, { useState } from 'react';
import { User, Package, Heart, Settings, LogOut, ChevronRight, Info, Leaf, CheckCircle, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BioumiLogo from '../components/BioumiLogo';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout, isAdmin } = useAuth();
    const [showAbout, setShowAbout] = useState(false);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
                <BioumiLogo className="w-24 h-24 mb-6" />
                <h2 className="text-xl font-bold mb-4">Connectez-vous pour accéder à votre profil</h2>
                <button 
                    onClick={() => navigate('/login')}
                    className="bg-bioumi-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg"
                >
                    Se connecter / S'inscrire
                </button>
            </div>
        )
    }

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const MenuItem = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) => (
        <button 
            onClick={onClick}
            className="w-full bg-white p-4 flex items-center justify-between border-b border-gray-50 last:border-0 active:bg-gray-50 text-left"
        >
            <div className="flex items-center gap-4">
                <div className="text-gray-500">{icon}</div>
                <span className="font-medium text-gray-700">{label}</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
        </button>
    );

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="bg-white pt-8 pb-8 px-6 text-center border-b border-gray-100">
                <div className="w-24 h-24 mx-auto bg-earth-100 rounded-full mb-4 p-1 flex items-center justify-center text-3xl font-serif font-bold text-earth-800 overflow-hidden">
                     {/* On prend la première lettre du nom (qui peut être l'email) */}
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <h1 className="text-xl font-bold text-gray-900 break-words">{user.name}</h1>
                
                {/* On n'affiche l'email que s'il est différent du nom pour éviter la duplication */}
                {user.email && user.name !== user.email && (
                     <p className="text-sm text-gray-500">{user.email}</p>
                )}
               
                <div className="mt-4 inline-flex items-center gap-1 px-3 py-1 bg-bioumi-100 text-bioumi-800 text-xs font-bold rounded-full">
                    <User size={12} /> Membre depuis {new Date(user.$createdAt).getFullYear()}
                </div>
            </div>

            {/* Admin Access Button (Only for Admin) */}
            {isAdmin && (
                <div className="mt-6 mx-4">
                    <button 
                        onClick={() => navigate('/admin')}
                        className="w-full bg-earth-900 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between hover:bg-earth-800 transition-colors"
                    >
                         <div className="flex items-center gap-4">
                            <div className="text-bioumi-400"><LayoutDashboard size={20} /></div>
                            <span className="font-bold">Administration Boutique</span>
                        </div>
                        <ChevronRight size={18} className="text-gray-400" />
                    </button>
                </div>
            )}

            {/* Menu Groups */}
            <div className="mt-6 mx-4 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <MenuItem 
                    icon={<Package size={20} />} 
                    label="Mes Commandes" 
                    onClick={() => navigate('/orders')} 
                />
                <MenuItem icon={<Heart size={20} />} label="Mes Favoris" />
                <MenuItem icon={<Settings size={20} />} label="Paramètres" />
            </div>

            <div className="mt-6 mx-4 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <MenuItem icon={<Info size={20} />} label="Aide & Support" />
                <MenuItem 
                    icon={<Leaf size={20} />} 
                    label="À propos de Bioumi Box" 
                    onClick={() => setShowAbout(!showAbout)}
                />
            </div>

            {/* About Expansion */}
            {showAbout && (
                <div className="mx-4 mt-2 bg-white rounded-2xl p-6 shadow-sm border border-bioumi-100 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-center mb-4">
                        <BioumiLogo className="w-20 h-20" />
                    </div>
                    <h3 className="font-serif font-bold text-center text-lg mb-2">🌿 Bioumi Box</h3>
                    <p className="text-center text-sm font-medium text-bioumi-700 mb-4">Le meilleur de l’alimentation naturelle tunisienne</p>
                    
                    <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                        <p>
                            Bienvenue chez Bioumi Box. Nous croyons que manger sain ne doit jamais être compliqué. 
                            C’est pourquoi nous sélectionnons des produits <strong>sans conservateurs chimiques</strong>, fabriqués avec passion par des artisans locaux.
                        </p>
                        
                        <div className="bg-earth-50 p-4 rounded-xl">
                            <h4 className="font-bold text-earth-900 mb-2">Notre Mission</h4>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-bioumi-600 mt-0.5" /> <span>Zéro conservateur chimique</span></li>
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-bioumi-600 mt-0.5" /> <span>Production locale et artisanale</span></li>
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-bioumi-600 mt-0.5" /> <span>Circuits courts & fraîcheur</span></li>
                            </ul>
                        </div>

                        <p className="text-center italic text-gray-500 text-xs">
                            En choisissant Bioumi Box, vous soutenez les artisans tunisiens et une consommation responsable.
                        </p>
                    </div>
                </div>
            )}

            <div className="mt-8 px-4">
                <button 
                    onClick={handleLogout}
                    className="w-full py-3 border border-red-200 text-red-500 font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-red-50"
                >
                    <LogOut size={18} /> Se déconnecter
                </button>
            </div>
        </div>
    );
};

export default Profile;