import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Target, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Budgets = () => {
    const [budgets, setBudgets] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        categoryId: '',
        amount: '',
        period: 'MONTHLY'
    });

    const fetchData = async () => {
        try {
            const [budRes, catRes] = await Promise.all([
                api.get('/budgets'),
                api.get('/categories')
            ]);
            setBudgets(budRes.data);
            setCategories(catRes.data);
        } catch (error: any) {
            console.error('API Error:', error.response || error);
            toast.error(error.response?.data?.message || 'Failed to load budgets');
        } finally {
            // Loading complete
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/budgets', formData);
            toast.success('Budget set');
            setShowModal(false);
            setFormData({ categoryId: '', amount: '', period: 'MONTHLY' });
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to set budget');
        }
    };

    const handleDelete = async (id: string) => {
        // if (!confirm('Remove this budget?')) return;
        toast.info('Deleting budget...');
        try {
            await api.delete(`/budgets/${id}`);
            toast.success('Budget removed');
            fetchData();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to remove budget');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budgets</h1>
                    <p className="text-gray-500 dark:text-silver-400">Manage your spending limits.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-dark-bg font-bold px-4 py-2 rounded-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    Set Budget
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {budgets.map((budget) => {
                    const progress = Math.min((budget.spent / budget.amount) * 100, 100);
                    const isOverBudget = budget.spent > budget.amount;

                    return (
                        <div key={budget.id} className="glass-card p-6 rounded-xl shadow-sm relative group hover:border-gold-500/30 transition-all">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(budget.id);
                                }}
                                className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-red-500 z-50 p-2"
                            >
                                <Trash2 size={18} />
                            </button>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Target size={18} className="text-gold-600 dark:text-gold-400" />
                                        {budget.category?.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-silver-500">{budget.period}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        ${Number(budget.spent).toLocaleString()} <span className="text-gray-400 dark:text-silver-600 text-sm font-normal">/ ${Number(budget.amount).toLocaleString()}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="w-full bg-gray-200 dark:bg-gray-700/50 rounded-full h-2.5 mb-2 overflow-hidden">
                                <div
                                    className={`h-2.5 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-gold-500'}`}
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                                {isOverBudget ? 'Over Budget' : `${Math.round(progress)}% utilized`}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="w-full max-w-md glass-card rounded-xl p-8 transform transition-all animate-slide-up">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white font-heading">Set Budget</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-silver-300">Category</label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-dark-bg/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:border-gold-500/50 outline-none"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.filter(c => c.type === 'EXPENSE').map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-silver-300">Amount Limit</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-dark-bg/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:border-gold-500/50 outline-none"
                                />
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

export default Budgets;
