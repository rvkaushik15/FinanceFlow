import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Trash2, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import clsx from 'clsx';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';

const Transactions = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        type: 'EXPENSE',
        accountId: '',
        categoryId: ''
    });

    const fetchData = async () => {
        setIsLoading(true);

        // Fetch Categories
        try {
            const catRes = await api.get('/categories');
            setCategories(catRes.data);
        } catch (error) {
            console.error('Failed to load categories', error);
            toast.error('Failed to load categories');
        }

        // Fetch Accounts
        try {
            const accRes = await api.get('/accounts');
            setAccounts(accRes.data);
            if (accRes.data.length > 0 && !formData.accountId) {
                setFormData(prev => ({ ...prev, accountId: accRes.data[0].id }));
            }
        } catch (error) {
            console.error('Failed to load accounts', error);
        }

        // Fetch Transactions (suspected cause of 500)
        try {
            const txRes = await api.get('/transactions');
            if (txRes.data && Array.isArray(txRes.data.data)) {
                setTransactions(txRes.data.data);
            } else {
                setTransactions([]);
            }
        } catch (error: any) {
            console.error('Failed to load transactions', error);
            toast.error(error.response?.data?.message || 'Failed to load transactions');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = async (id: string) => {
        // if (!confirm('Are you sure?')) return;
        toast.info('Deleting transaction...');
        try {
            await api.delete(`/transactions/${id}`);
            toast.success('Transaction deleted');
            fetchData();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/transactions', formData);

            // Success Effect
            if (formData.type === 'INCOME') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#D4AF37', '#C0C0C0', '#F9F1D8']
                });
            } else {
                // Expense Animation: "Loss" / "Blood" / "Burning"
                // Symbolizes money leaving, heavier gravity, red colors
                confetti({
                    particleCount: 50,
                    angle: 270, // Downwards
                    spread: 100,
                    origin: { y: 0.4 }, // Start higher
                    colors: ['#EF4444', '#7F1D1D', '#030712'], // Red-500, Red-900, Dark-bg
                    gravity: 1.5, // Fall faster
                    scalar: 0.8, // Smaller pieces
                    shapes: ['square'], // Harsher shape
                    ticks: 100
                });
            }

            toast.success('Transaction added');
            setShowModal(false);
            setFormData({
                amount: '',
                description: '',
                date: format(new Date(), 'yyyy-MM-dd'),
                type: 'EXPENSE',
                accountId: accounts[0]?.id || '',
                categoryId: ''
            });
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add transaction');
        }
    };

    const filteredCategories = categories.filter(c => c.type === formData.type);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white mb-2">Transactions</h1>
                    <p className="text-silver-400">Track every penny.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-dark-bg font-bold px-6 py-3 rounded-xl hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    Add Transaction
                </button>
            </div>

            {/* Glass Table Container */}
            <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-silver-400 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Description</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">Account</th>
                                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {transactions.map((tx, index) => (
                                    <motion.tr
                                        key={tx.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-silver-300 whitespace-nowrap">
                                            {format(new Date(tx.date), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-white">
                                            {tx.description}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={clsx(
                                                "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold tracking-wide",
                                                tx.type === 'INCOME'
                                                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                                            )}>
                                                {tx.category?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-silver-400">
                                            {tx.account?.name}
                                        </td>
                                        <td className={clsx(
                                            "px-6 py-4 text-right font-bold text-base",
                                            tx.type === 'INCOME' ? 'text-green-400' : 'text-red-400'
                                        )}>
                                            {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount, tx.account?.currency)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(tx.id);
                                                }}
                                                className="p-2 text-silver-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>

                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-silver-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <Filter className="w-12 h-12 text-white/10" />
                                            <p>No transactions found. Start spending (or saving)!</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md glass-card rounded-2xl p-8 border border-gold-500/30 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                    >
                        <h2 className="text-2xl font-bold mb-6 text-white font-heading">Add Transaction</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Type Toggle */}
                            <div className="bg-dark-bg/50 p-1 rounded-xl flex border border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'EXPENSE', categoryId: '' })}
                                    className={clsx(
                                        "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                                        formData.type === 'EXPENSE' ? "bg-red-500 text-white shadow-lg" : "text-silver-500 hover:text-white"
                                    )}
                                >
                                    Expense
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'INCOME', categoryId: '' })}
                                    className={clsx(
                                        "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                                        formData.type === 'INCOME' ? "bg-green-500 text-white shadow-lg" : "text-silver-500 hover:text-white"
                                    )}
                                >
                                    Income
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-silver-300">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-silver-500">
                                        {/* Dynamic symbol based on selected account could be complex, keeping generic or mapped if possible */}
                                        {formData.accountId ? getCurrencySymbol(accounts.find(a => a.id === formData.accountId)?.currency) : '$'}
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="w-full bg-dark-bg/50 border border-white/10 text-white rounded-xl pl-8 pr-4 py-3 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 outline-none text-lg font-bold"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-silver-300">Description</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-dark-bg/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 outline-none"
                                    placeholder="What was this for?"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-silver-300">Category</label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        className="w-full bg-dark-bg/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-gold-500/50 outline-none appearance-none"
                                    >
                                        <option value="">Select...</option>
                                        {filteredCategories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-silver-300">Account</label>
                                    <select
                                        value={formData.accountId}
                                        onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                                        className="w-full bg-dark-bg/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-gold-500/50 outline-none appearance-none"
                                        required
                                    >
                                        <option value="">Select...</option>
                                        {accounts.map(a => (
                                            <option key={a.id} value={a.id}>{a.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-silver-300">Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full bg-dark-bg/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-gold-500/50 outline-none"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 border border-white/10 text-silver-300 rounded-xl hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gold-500 text-dark-bg font-bold rounded-xl hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20"
                                >
                                    Save Transaction
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
