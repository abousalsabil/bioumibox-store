import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BioumiLogo from '../components/BioumiLogo';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Loader } from 'lucide-react';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    
    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            // Redirection conditionnelle basée sur le rôle
            if (isAdmin) {
                navigate('/admin');
            } else {
                navigate('/profile');
            }
        }
    }, [user, isAdmin, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        try {
            if (isLogin) {
                // Login via Supabase
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            } else {
                // Register via Supabase
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                        }
                    }
                });
                if (error) throw error;

                // Vérification si la session est créée (connexion auto) ou si email confirm requis
                if (data.user && !data.session) {
                    setSuccessMsg("Compte créé ! Veuillez vérifier vos emails pour confirmer votre inscription avant de vous connecter.");
                    setIsLogin(true); // Basculer vers l'écran de connexion
                    setLoading(false);
                    return; 
                }
            }
            // La redirection est gérée par le useEffect qui écoute 'user' et 'isAdmin'
        } catch (err: any) {
            console.error(err);
            setError(err.message === "Invalid login credentials" ? "Email ou mot de passe incorrect." : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-earth-50 flex flex-col items-center justify-center px-6 py-12">
            <div className="mb-6 flex flex-col items-center text-center">
                 <div className="bg-white p-4 rounded-full shadow-lg shadow-earth-200/50 mb-6">
                    <BioumiLogo className="w-32 h-32" />
                </div>
                <h1 className="text-2xl font-serif font-bold text-earth-900 mb-2">
                    Le meilleur de l’alimentation <br/> <span className="text-bioumi-600">naturelle tunisienne</span>
                </h1>
                <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                    Zéro conservateur chimique. Production locale et artisanale. Directement du producteur à votre table.
                </p>
            </div>

            <div className="bg-white w-full max-w-sm p-8 rounded-3xl shadow-xl shadow-earth-200/50 border border-earth-100">
                <div className="flex mb-6 bg-gray-50 p-1 rounded-xl">
                    <button 
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-earth-900 shadow-sm' : 'text-gray-400'}`}
                        onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }}
                    >
                        Connexion
                    </button>
                    <button 
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-earth-900 shadow-sm' : 'text-gray-400'}`}
                        onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); }}
                    >
                        Inscription
                    </button>
                </div>

                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">{error}</div>}
                {successMsg && <div className="mb-4 p-3 bg-green-50 text-green-700 text-xs rounded-lg border border-green-100">{successMsg}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <input 
                                type="text" 
                                placeholder="Nom complet" 
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-bioumi-500 transition-colors" 
                                required={!isLogin}
                            />
                        </div>
                    )}
                    <div>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-bioumi-500 transition-colors" 
                            required
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder="Mot de passe" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-bioumi-500 transition-colors" 
                            required
                        />
                    </div>
                    
                    {isLogin && (
                        <div className="text-right">
                            <a href="#" className="text-xs text-bioumi-600 font-medium hover:underline">Mot de passe oublié ?</a>
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-earth-900 text-white font-bold py-3.5 rounded-xl hover:bg-earth-800 transition-all shadow-lg shadow-earth-900/20 active:scale-95 flex justify-center items-center gap-2"
                    >
                        {loading && <Loader className="animate-spin" size={16} />}
                        {isLogin ? 'Se connecter' : "Rejoindre Bioumi Box"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400">En continuant, vous acceptez nos conditions d'utilisation.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;