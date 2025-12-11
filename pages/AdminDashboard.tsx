import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase, mapProductFromSupabase } from '../lib/supabase';
import { Product, CategoryData } from '../types';
import { CATEGORIES as DEFAULT_CATEGORIES } from '../constants';
import { Loader, Plus, Upload, Trash2, Edit2, Package, ShoppingBag, CheckCircle, XCircle, FolderOpen, Mail, Phone, MapPin } from 'lucide-react';
import BioumiLogo from '../components/BioumiLogo';

const AdminDashboard: React.FC = () => {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    
    // Tabs: 'products' | 'categories' | 'orders'
    const [activeTab, setActiveTab] = useState('products');

    // Data States
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Form State for Products
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        description: '',
        producer: '',
        isOrganic: false,
        isArtisanal: false,
        image: ''
    });

    // Form State for Categories
    const [catName, setCatName] = useState('');
    const [catImage, setCatImage] = useState('');
    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
    
    const [uploading, setUploading] = useState(false);

    // Initial Check
    useEffect(() => {
        if (!authLoading) {
            if (!user || !isAdmin) {
                navigate('/');
            } else {
                fetchData();
            }
        }
    }, [user, isAdmin, authLoading, activeTab]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'products') {
                const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
                if (prodData) setProducts(prodData.map(mapProductFromSupabase));
                
                // Fetch categories for the dropdown
                const { data: catData } = await supabase.from('categories').select('*').order('name');
                if (catData && catData.length > 0) {
                     setCategories(catData);
                     // Set default category if not set
                     if(!formData.category) setFormData(prev => ({...prev, category: catData[0].name}));
                } else {
                     // Fallback to static
                     const staticCats = DEFAULT_CATEGORIES.slice(1).map(c => ({ id: c, name: c, image: '' }));
                     setCategories(staticCats);
                }
            } else if (activeTab === 'categories') {
                 const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
                 if (data) setCategories(data);
            } else {
                const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
                if (data) setOrders(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, bucket: string = 'products') => {
        try {
            if (!event.target.files || event.target.files.length === 0) return;
            setUploading(true);
            
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products') // Using 'products' bucket for everything to simplify permissions
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('products').getPublicUrl(filePath);
            
            if (activeTab === 'products') {
                setFormData(prev => ({ ...prev, image: data.publicUrl }));
            } else {
                setCatImage(data.publicUrl);
            }

        } catch (error) {
            alert('Erreur upload image');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    // --- Product Handlers ---
    const handleSubmitProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const productData = {
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price),
            description: formData.description,
            producer: formData.producer,
            is_organic: formData.isOrganic,
            is_artisanal: formData.isArtisanal,
            image: formData.image,
            benefits: [],
            ingredients: []
        };

        try {
            if (isEditing && editId) {
                const { error } = await supabase.from('products').update(productData).eq('id', editId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('products').insert([productData]);
                if (error) throw error;
            }
            
            setIsEditing(false);
            setEditId(null);
            setFormData(prev => ({
                ...prev, name: '', price: '', description: '', producer: '',
                isOrganic: false, isArtisanal: false, image: ''
            }));
            fetchData();

        } catch (error: any) {
            alert(`Erreur: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            alert('Erreur lors de la suppression');
        }
    };

    const startEdit = (product: Product) => {
        setIsEditing(true);
        setEditId(product.id);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price.toString(),
            description: product.description,
            producer: product.producer,
            isOrganic: product.isOrganic,
            isArtisanal: product.isArtisanal,
            image: product.image
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- Category Handlers ---
    const handleSubmitCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isEditingCategory && editCategoryId) {
                const { error } = await supabase.from('categories').update({ name: catName, image: catImage }).eq('id', editCategoryId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('categories').insert([{ name: catName, image: catImage }]);
                if (error) throw error;
            }
            
            setCatName('');
            setCatImage('');
            setIsEditingCategory(false);
            setEditCategoryId(null);
            fetchData();
        } catch (error: any) {
            alert(`Erreur: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

     const handleDeleteCategory = async (id: string) => {
        if (!confirm('Supprimer cette catégorie ?')) return;
        try {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
            setCategories(categories.filter(c => c.id !== id));
        } catch (error) {
            alert('Erreur suppression');
        }
    };

    const startEditCategory = (cat: CategoryData) => {
        setIsEditingCategory(true);
        setEditCategoryId(cat.id!);
        setCatName(cat.name);
        setCatImage(cat.image);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEditCategory = () => {
        setIsEditingCategory(false);
        setEditCategoryId(null);
        setCatName('');
        setCatImage('');
    };

    // --- Order Handlers ---
    const updateOrderStatus = async (id: string, status: string) => {
        try {
            const { error } = await supabase.from('orders').update({ status }).eq('id', id);
            if (error) throw error;
            fetchData();
        } catch (error) {
            alert('Erreur update status');
        }
    };

    if (authLoading) return <div className="p-10 text-center"><Loader className="animate-spin mx-auto" /></div>;

    return (
        <div className="min-h-screen bg-earth-50 pb-20">
            <div className="bg-earth-900 text-white p-6 sticky top-0 z-30 shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BioumiLogo className="w-10 h-10" showText={false} />
                        <h1 className="text-xl font-bold">Administration</h1>
                    </div>
                    <button onClick={() => navigate('/profile')} className="text-xs bg-white/10 px-3 py-1 rounded-full">Retour au site</button>
                </div>
                <div className="flex mt-6 gap-4 border-b border-white/10 overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('products')}
                        className={`pb-3 px-2 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'products' ? 'text-white border-b-2 border-bioumi-500' : 'text-gray-400'}`}
                    >
                        Gestion Produits
                    </button>
                     <button 
                        onClick={() => setActiveTab('categories')}
                        className={`pb-3 px-2 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'categories' ? 'text-white border-b-2 border-bioumi-500' : 'text-gray-400'}`}
                    >
                        Gestion Rayons
                    </button>
                    <button 
                        onClick={() => setActiveTab('orders')}
                        className={`pb-3 px-2 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'orders' ? 'text-white border-b-2 border-bioumi-500' : 'text-gray-400'}`}
                    >
                        Suivi Commandes
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4">
                
                {/* ---------------- PRODUCTS TAB ---------------- */}
                {activeTab === 'products' && (
                    <div className="space-y-8">
                        {/* Form */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-earth-200">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
                                {isEditing ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
                            </h2>
                            <form onSubmit={handleSubmitProduct} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom du produit</label>
                                        <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-900" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Catégorie</label>
                                        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-900">
                                            {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prix (DT)</label>
                                        <input required type="number" step="0.1" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-900" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Producteur</label>
                                        <input required type="text" value={formData.producer} onChange={e => setFormData({...formData, producer: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-900" />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                    <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-900"></textarea>
                                </div>

                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={formData.isOrganic} onChange={e => setFormData({...formData, isOrganic: e.target.checked})} className="rounded text-bioumi-600 focus:ring-bioumi-500" />
                                        <span className="text-sm">Produit Bio</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={formData.isArtisanal} onChange={e => setFormData({...formData, isArtisanal: e.target.checked})} className="rounded text-bioumi-600 focus:ring-bioumi-500" />
                                        <span className="text-sm">Produit Artisanal</span>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image du produit</label>
                                    <div className="flex items-center gap-4">
                                        {formData.image && <img src={formData.image} alt="Preview" className="w-16 h-16 rounded object-cover border" />}
                                        <label className="flex-1 cursor-pointer bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
                                            {uploading ? <Loader className="animate-spin text-bioumi-600" /> : <Upload className="text-gray-400" />}
                                            <span className="text-xs text-gray-500 mt-1">{uploading ? 'Upload en cours...' : 'Cliquez pour choisir une photo'}</span>
                                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} className="hidden" />
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    {isEditing && (
                                        <button type="button" onClick={() => { setIsEditing(false); setEditId(null); setFormData(prev => ({...prev, name: '', price: '', description: '', producer: '', isOrganic: false, isArtisanal: false, image: ''})); }} className="px-4 py-2 text-gray-500 bg-gray-100 rounded-lg font-medium">Annuler</button>
                                    )}
                                    <button disabled={isLoading || uploading} type="submit" className="flex-1 bg-bioumi-600 text-white py-2 rounded-lg font-bold shadow-md hover:bg-bioumi-700 transition-colors flex items-center justify-center gap-2">
                                        {isLoading ? <Loader className="animate-spin" size={18} /> : (isEditing ? 'Mettre à jour' : 'Ajouter le produit')}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* List */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-gray-700">Inventaire ({products.length})</h3>
                            {products.map(product => (
                                <div key={product.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                                    <img src={product.image || 'https://via.placeholder.com/50'} alt={product.name} className="w-12 h-12 rounded bg-gray-50 object-cover" />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 text-sm">{product.name}</h4>
                                        <p className="text-xs text-gray-500">{product.price.toFixed(2)} DT • {product.category}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => startEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* ---------------- CATEGORIES TAB ---------------- */}
                {activeTab === 'categories' && (
                     <div className="space-y-8">
                        {/* Form */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-earth-200">
                             <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <FolderOpen size={18} /> {isEditingCategory ? 'Modifier le rayon' : 'Ajouter un rayon'}
                            </h2>
                            <form onSubmit={handleSubmitCategory} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom du rayon</label>
                                    <input required type="text" value={catName} onChange={e => setCatName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-900" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image d'illustration</label>
                                    <div className="flex items-center gap-4">
                                        {catImage && <img src={catImage} alt="Preview" className="w-16 h-16 rounded-full object-cover border" />}
                                        <label className="flex-1 cursor-pointer bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
                                            {uploading ? <Loader className="animate-spin text-bioumi-600" /> : <Upload className="text-gray-400" />}
                                            <span className="text-xs text-gray-500 mt-1">{uploading ? 'Upload en cours...' : 'Cliquez pour choisir une photo'}</span>
                                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    {isEditingCategory && (
                                        <button type="button" onClick={cancelEditCategory} className="px-4 py-2 text-gray-500 bg-gray-100 rounded-lg font-medium">Annuler</button>
                                    )}
                                    <button disabled={isLoading || uploading} type="submit" className="flex-1 bg-bioumi-600 text-white py-2 rounded-lg font-bold shadow-md hover:bg-bioumi-700 transition-colors flex items-center justify-center gap-2">
                                        {isLoading ? <Loader className="animate-spin" size={18} /> : (isEditingCategory ? 'Mettre à jour' : 'Ajouter le rayon')}
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        {/* List */}
                         <div className="space-y-3">
                            <h3 className="font-bold text-gray-700">Rayons existants ({categories.length})</h3>
                             {categories.map(cat => (
                                <div key={cat.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                                    <img 
                                        src={cat.image || `https://ui-avatars.com/api/?name=${cat.name}&background=fde68a&color=92400e`}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${cat.name}&background=fde68a&color=92400e`;
                                        }}
                                        alt={cat.name} 
                                        className="w-12 h-12 rounded-full bg-gray-50 object-cover" 
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 text-sm">{cat.name}</h4>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => startEditCategory(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDeleteCategory(cat.id!)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                         </div>
                     </div>
                )}

                {/* ---------------- ORDERS TAB ---------------- */}
                {activeTab === 'orders' && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Commandes Clients</h2>
                        {orders.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">Aucune commande pour le moment.</div>
                        ) : (
                            orders.map(order => (
                                <div key={order.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-3">
                                        <div>
                                            <div className="font-bold text-lg text-gray-900">Cmd #{order.id.slice(0,6)}</div>
                                            <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString()}</div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {order.status === 'pending' ? 'En Attente' : order.status}
                                        </div>
                                    </div>
                                    
                                    {/* Informations Client Détillées */}
                                    <div className="mb-4 bg-earth-50 p-4 rounded-xl border border-earth-100">
                                        <h4 className="font-bold text-xs uppercase text-earth-800 mb-3 flex items-center gap-2">
                                            <Package size={14} /> Infos Livraison
                                        </h4>
                                        <div className="text-sm space-y-2">
                                            <p className="font-bold text-gray-900">{order.shipping_address?.full_name}</p>
                                            
                                            {/* Numéro de téléphone cliquable */}
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Phone size={14} className="text-bioumi-600" />
                                                <a href={`tel:${order.shipping_address?.phone}`} className="hover:text-bioumi-700 hover:underline font-medium">
                                                    {order.shipping_address?.phone || "Non renseigné"}
                                                </a>
                                            </div>

                                            {/* Email cliquable et mis en évidence */}
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Mail size={14} className="text-bioumi-600" />
                                                <a href={`mailto:${order.shipping_address?.email || ""}`} className="text-bioumi-800 font-bold hover:underline">
                                                    {order.shipping_address?.email || "Email non disponible"}
                                                </a>
                                            </div>

                                            <div className="flex items-start gap-2 text-gray-700">
                                                <MapPin size={14} className="text-bioumi-600 mt-1 flex-shrink-0" />
                                                <p>{order.shipping_address?.address}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                                        <h4 className="font-bold text-xs uppercase text-gray-500 mb-2">Articles</h4>
                                        <ul className="text-sm space-y-1">
                                            {order.items?.map((item: any, i: number) => (
                                                <li key={i} className="flex justify-between">
                                                    <span>{item.quantity}x {item.name}</span>
                                                    <span className="font-medium">{(item.price * item.quantity).toFixed(2)} DT</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between font-bold">
                                            <span>Total</span>
                                            <span className="text-bioumi-700">{order.total_amount?.toFixed(2)} DT</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {order.status === 'pending' && (
                                            <button onClick={() => updateOrderStatus(order.id, 'confirmed')} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700">Confirmer</button>
                                        )}
                                        {order.status === 'confirmed' && (
                                            <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-green-700">Marquer Livré</button>
                                        )}
                                        {(order.status === 'pending' || order.status === 'confirmed') && (
                                            <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50">Annuler</button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;