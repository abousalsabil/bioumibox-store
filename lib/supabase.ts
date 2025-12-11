import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fomhzhusmzgtupvvzcst.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvbWh6aHVzbXpndHVwdnZ6Y3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNzE4OTEsImV4cCI6MjA4MDk0Nzg5MX0.cjlmiFGtccB5-fy71t2puw-YMDcrBQPMBQBG-qxPxvM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper pour mapper les colonnes snake_case (Postgres) vers camelCase (React)
export const mapProductFromSupabase = (doc: any) => ({
    id: doc.id.toString(), // Assure que l'ID est une string
    name: doc.name,
    category: doc.category,
    price: doc.price,
    image: doc.image,
    description: doc.description,
    producer: doc.producer,
    benefits: doc.benefits || [],
    ingredients: doc.ingredients || [],
    isOrganic: doc.is_organic ?? doc.isOrganic, // Gère snake_case ou camelCase
    isArtisanal: doc.is_artisanal ?? doc.isArtisanal,
    rating: doc.rating,
    reviews: doc.reviews
});