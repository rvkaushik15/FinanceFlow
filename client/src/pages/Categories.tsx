import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Tag, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';

const Categories = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        type: 'EXPENSE',
        color: '#3b82f6', // blue-500
        icon: ''
    });

    const fetchData = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (error: any) {
            console.error('API Error:', error.response || error);
            toast.error(error.response?.data?.message || 'Failed to load categories');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/categories', formData);
            toast.success('Category created');
            setShowModal(false);
            setFormData({ name: '', type: 'EXPENSE', color: '#3b82f6', icon: '' });
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create category');
        }
    };

    const handleDelete = async (id: string) => {
        console.log('Attempting to delete category:', id);
        toast.info(`Attempting to delete ${id}...`);
        // if (!confirm('Delete this category?')) return; 
        try {
            console.log('Sending DELETE request...');
            await api.delete(`/categories/${id}`);
            console.log('DELETE success');
            toast.success('Category deleted');
            fetchData();
        } catch (error: any) {
            console.error('DELETE error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete category');
        }
    };

    const addDefaults = async () => {
        const defaults = [
            { name: 'Salary', type: 'INCOME', color: '#10b981' },
            { name: 'Food', type: 'EXPENSE', color: '#ef4444' },
            { name: 'Rent', type: 'EXPENSE', color: '#3b82f6' },
            { name: 'Transport', type: 'EXPENSE', color: '#f59e0b' },
            { name: 'Entertainment', type: 'EXPENSE', color: '#8b5cf6' },
            { name: 'Shopping', type: 'EXPENSE', color: '#ec4899' },
        ];

        try {
            await Promise.all(defaults.map(cat => api.post('/categories', cat)));
            toast.success('Default categories added');
            fetchData();
        } catch (error) {
            toast.error('Failed to add default categories');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">Categories</h1>
                    <p className="text-gray-600 dark:text-silver-400">Organize your financial life.</p>
                </div>
                <div className="flex gap-3">
                    {categories.length === 0 && (
                        <button
                            onClick={addDefaults}
                            className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-silver-300 px-4 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all border border-gray-200 dark:border-white/5"
                        >
                            <RefreshCw size={18} />
                            Add Defaults
                        </button>
                    )}
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-dark-bg font-bold px-6 py-3 rounded-xl hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-y-0.5"
                    >
                        <Plus size={20} />
                        Add Category
                    </button>
                </div>
            </div>

            {categories.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10">
                    <Tag className="mx-auto h-16 w-16 text-gray-300 dark:text-white/20 mb-6" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No categories found</h3>
                    <p className="text-gray-500 dark:text-silver-500 mb-8 max-w-sm mx-auto">Create custom categories to track your spending habits effectively.</p>
                    <button
                        onClick={addDefaults}
                        className="text-gold-600 dark:text-gold-400 hover:text-gold-500 dark:hover:text-gold-300 font-medium hover:underline"
                    >
                        Auto-generate default categories
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                        <div key={cat.id} className="glass-card p-6 rounded-2xl relative group flex items-center gap-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300">
                            <div className="absolute top-4 right-4 z-50">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent card click
                                        handleDelete(cat.id);
                                    }}
                                    className="p-2 bg-white/80 rounded-full text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors shadow-sm"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                                style={{ backgroundColor: cat.color || '#ccc' }}
                            >
                                <Tag size={24} />
                            </div>

                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{cat.name}</h3>
                                <span className={clsx(
                                    "text-xs px-2.5 py-1 rounded-full font-medium tracking-wide uppercase",
                                    cat.type === 'INCOME' ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20 border" : "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 border"
                                )}>
                                    {cat.type}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="w-full max-w-md glass-card rounded-2xl p-8 transform transition-all animate-slide-up">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white font-heading">Add Category</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-silver-300">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-dark-bg/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 outline-none transition-all"
                                    placeholder="e.g. Groceries"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-silver-300">Type</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
                                        className={clsx(
                                            "py-2 rounded-xl text-sm font-medium transition-all",
                                            formData.type === 'EXPENSE' ? "bg-red-500 text-white shadow-md transform scale-105" : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-silver-500 hover:bg-gray-200 dark:hover:bg-white/10"
                                        )}
                                    >
                                        Expense
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'INCOME' })}
                                        className={clsx(
                                            "py-2 rounded-xl text-sm font-medium transition-all",
                                            formData.type === 'INCOME' ? "bg-green-500 text-white shadow-md transform scale-105" : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-silver-500 hover:bg-gray-200 dark:hover:bg-white/10"
                                        )}
                                    >
                                        Income
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-silver-300">Color</label>
                                <div className="flex gap-3 flex-wrap">
                                    {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'].map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color })}
                                            className={`w-10 h-10 rounded-full transition-all transform hover:scale-110 ${formData.color === color ? 'ring-2 ring-gray-400 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-black scale-110 shadow-lg' : 'opacity-80 hover:opacity-100'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-silver-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gold-500 text-dark-bg font-bold rounded-xl hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
