import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Wallet, CreditCard, Landmark, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { currencies, formatCurrency } from '../utils/currency';

const Accounts = () => {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        type: 'BANK',
        balance: '',
        currency: 'USD'
    });

    const fetchData = async () => {
        try {
            const res = await api.get('/accounts');
            setAccounts(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/accounts', formData);
            toast.success('Account created');
            setShowModal(false);
            setFormData({ name: '', type: 'BANK', balance: '', currency: 'USD' });
            fetchData();
        } catch (error) {
            toast.error('Failed to create account');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will delete all transactions associated with this account.')) return;
        try {
            await api.delete(`/accounts/${id}`);
            toast.success('Account deleted');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete account');
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'BANK': return Landmark;
            case 'CREDIT_CARD': return CreditCard;
            default: return Wallet;
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">My Accounts</h1>
                    <p className="text-gray-600 dark:text-silver-400">Manage your liquid assets and credit.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-dark-bg font-bold px-6 py-3 rounded-xl hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    Add Account
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((acc) => {
                    const Icon = getIcon(acc.type);
                    return (
                        <div key={acc.id} className="glass-card p-6 rounded-2xl relative group hover:border-gold-500/30 transition-all duration-300">
                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDelete(acc.id)}
                                    className="p-2 bg-red-100 text-red-500 dark:bg-red-500/10 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-500/20"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10 rounded-2xl border border-gray-200 dark:border-white/10 shadow-inner">
                                    <Icon size={28} className="text-gold-600 dark:text-gold-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">{acc.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-silver-500 font-medium">{acc.type.replace('_', ' ')}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-white/5">
                                <p className="text-sm text-gray-500 dark:text-silver-400 mb-1">Current Balance</p>
                                <div className="flex items-baseline gap-1">
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                        {formatCurrency(acc.balance, acc.currency)}
                                    </p>
                                    <span className="text-sm text-gray-500 dark:text-silver-600">{acc.currency}</span>
                                </div>
                            </div>

                            {/* Decorative glow */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gold-500/0 group-hover:bg-gold-500/50 blur-sm transition-all duration-500"></div>
                        </div>
                    );
                })}

                {accounts.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-300 dark:border-white/10 rounded-2xl">
                        <Wallet className="mx-auto h-12 w-12 text-gray-300 dark:text-silver-700 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No accounts found</h3>
                        <p className="text-gray-500 dark:text-silver-500">Add your first account to get started.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="w-full max-w-md glass-card rounded-2xl p-8 transform transition-all animate-slide-up">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white font-heading">Add Account</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-silver-300">Account Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-dark-bg/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 outline-none transition-all"
                                    placeholder="e.g. Chase Checkings"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-silver-300">Metadata</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-dark-bg/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:border-gold-500/50 outline-none"
                                    >
                                        <option value="BANK">Bank</option>
                                        <option value="CASH">Cash</option>
                                        <option value="CREDIT_CARD">Credit Card</option>
                                        <option value="WALLET">Wallet</option>
                                        <option value="INVESTMENT">Investment</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.balance}
                                        onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-dark-bg/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:border-gold-500/50 outline-none"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-silver-300">Currency</label>
                                <select
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-dark-bg/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:border-gold-500/50 outline-none"
                                >
                                    {currencies.map(c => (
                                        <option key={c.code} value={c.code}>{c.code} - {c.name} ({c.symbol})</option>
                                    ))}
                                </select>
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
                                    Create Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Accounts;
