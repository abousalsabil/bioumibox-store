import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fomhzhusmzgtupvvzcst.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvbWh6aHVzbXpndHVwdnZ6Y3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNzE4OTEsImV4cCI6MjA4MDk0Nzg5MX0.cjlmiFGtccB5-fy71t2puw-YMDcrBQPMBQBG-qxPxvM';

// Stockage en mémoire (RAM) utilisé si le localStorage est bloqué
class MemoryStorage {
  private map = new Map<string, string>();
  
  getItem(key: string): string | null {
    return this.map.get(key) || null;
  }
  
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  
  removeItem(key: string): void {
    this.map.delete(key);
  }
}

let isFallbackMode = false;

// Fonction blindée pour obtenir un stockage valide sans faire planter l'app
const getSafeStorage = () => {
  if (typeof window === 'undefined') return new MemoryStorage();
  
  try {
    // Le simple accès à window.localStorage peut lever une exception SecurityError
    const storage = window.localStorage;
    const testKey = '__bioumi_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return storage;
  } catch (e) {
    console.warn('⚠️ Mode strict détecté : Fallback sur MemoryStorage (Session temporaire)');
    isFallbackMode = true;
    return new MemoryStorage();
  }
};

const safeStorage = getSafeStorage();

// Configuration défensive
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: safeStorage,
        autoRefreshToken: true,
        // Si on est en fallback (RAM), on évite de forcer la persistance complexe qui pourrait échouer
        persistSession: !isFallbackMode, 
        detectSessionInUrl: true,
    },
});

// Helper pour mapper les colonnes snake_case (Postgres) vers camelCase (React)
export const mapProductFromSupabase = (doc: any) => ({
    id: doc.id.toString(),
    name: doc.name,
    category: doc.category,
    price: doc.price,
    image: doc.image,
    description: doc.description,
    producer: doc.producer,
    benefits: doc.benefits || [],
    ingredients: doc.ingredients || [],
    isOrganic: doc.is_organic ?? doc.isOrganic,
    isArtisanal: doc.is_artisanal ?? doc.isArtisanal,
    rating: doc.rating,
    reviews: doc.reviews
});