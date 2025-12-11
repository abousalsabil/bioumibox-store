import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

// Nous étendons l'interface utilisateur locale pour inclure les propriétés spécifiques dont nous avons besoin
export interface AuthUser {
    id: string;
    email?: string;
    name: string;
    $createdAt: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isAdmin: boolean;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// L'email de l'administrateur
const ADMIN_EMAIL = 'bioumibox@gmail.com';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Vérifier la session active au chargement
        const checkUser = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    mapUser(session.user);
                } else {
                    setUser(null);
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error("Auth check error", error);
                setUser(null);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        checkUser();

        // Écouter les changements d'état (Login, Logout, Auto-refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                mapUser(session.user);
            } else {
                setUser(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const mapUser = (sbUser: User) => {
        const email = sbUser.email || '';
        // Priorité : Métadonnée Nom complet -> Email complet -> 'Invité'
        const displayName = sbUser.user_metadata?.full_name || email || 'Invité';

        setUser({
            id: sbUser.id,
            email: email,
            name: displayName,
            $createdAt: sbUser.created_at
        });
        
        // Vérification simple côté client pour l'UI. 
        // La vraie sécurité est gérée par les Row Level Policies (RLS) de Supabase.
        setIsAdmin(email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    };

    const logout = async () => {
        try {
            // Tente de déconnecter proprement côté serveur
            await supabase.auth.signOut();
        } catch (error) {
            console.error("Logout error (ignored to force UI logout):", error);
        } finally {
            // CRITIQUE : On force toujours la déconnexion locale même si l'API échoue
            setIsAdmin(false);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};