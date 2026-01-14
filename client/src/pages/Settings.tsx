import api from '../api/axios';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useAuthStore } from '../store/authStore';
import { Shield, HelpCircle, LogOut, Globe, Database, Download, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Settings = () => {
    const { user, logout } = useAuthStore();

    const handleExport = async () => {
        try {
            const res = await api.get('/transactions?limit=-1');
            const transactions = res.data.data;

            if (!transactions || transactions.length === 0) {
                toast.error('No transactions to export');
                return;
            }

            // Define CSV headers
            const headers = ['Date', 'Description', 'Amount', 'Type', 'Category', 'Account', 'Currency'];
            const rows = transactions.map((t: any) => [
                format(new Date(t.date), 'yyyy-MM-dd'),
                `"${t.description.replace(/"/g, '""')}"`, // Escape quotes
                t.amount,
                t.type,
                t.category?.name || 'Uncategorized',
                t.account?.name || 'Unknown',
                t.account?.currency || 'USD'
            ]);

            // Combine into CSV string
            const csvContent = [
                headers.join(','),
                ...rows.map((row: any[]) => row.join(','))
            ].join('\n');

            // Trigger Download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `finance_tracker_export_${format(new Date(), 'yyyyMMdd')}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success('Export started');
        } catch (error) {
            console.error('Export failed', error);
            toast.error('Failed to export data');
        }
    };



    return (
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
                <p className="text-gray-500 dark:text-silver-400">Manage your preferences and profile.</p>
            </div>

            {/* Profile Card */}
            <div className="glass-card p-8 rounded-2xl flex items-center gap-6 border border-gray-200 dark:border-white/5 bg-white/50 dark:bg-dark-card/60">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-dark-bg font-bold text-3xl shadow-lg shadow-gold-500/20">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                    <p className="text-gray-500 dark:text-silver-400">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-gold-500/10 text-gold-600 dark:text-gold-400 text-xs font-bold rounded-full border border-gold-500/20">
                            PRO MEMBER
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => logout()}
                    className="p-3 text-silver-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                    title="Logout"
                >
                    <LogOut size={24} />
                </button>
            </div>

            {/* Application Preferences */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white/50 dark:bg-dark-card/60"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gold-500/10 text-gold-500 rounded-lg">
                        <Globe size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Preferences</h3>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-silver-400">Default Currency</label>
                        <select className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-gold-500/30">
                            <option>USD - US Dollar ($)</option>
                            <option>INR - Indian Rupee (₹)</option>
                            <option>EUR - Euro (€)</option>
                            <option>GBP - British Pound (£)</option>
                            <option>JPY - Japanese Yen (¥)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-silver-400">Date Format</label>
                        <select className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-gold-500/30">
                            <option>MM/DD/YYYY</option>
                            <option>DD/MM/YYYY</option>
                            <option>YYYY-MM-DD</option>
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Data Management */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white/50 dark:bg-dark-card/60"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                        <Database size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Data Control</h3>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handleExport}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <Download size={18} className="text-gray-500 dark:text-silver-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                            <span className="text-sm font-medium text-gray-700 dark:text-silver-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Export All Data</span>
                        </div>
                    </button>


                </div>
                <p className="text-xs text-silver-500 mt-4 px-1">
                    Exporting data will generate a CSV report.
                </p>
            </motion.div>

            {/* Information Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white/50 dark:bg-dark-card/60"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                        <Info size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Information</h3>
                </div>

                <div className="space-y-3">
                    <Link to="/about" className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-3">
                            <HelpCircle size={18} className="text-gray-500 dark:text-silver-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                            <span className="text-sm font-medium text-gray-700 dark:text-silver-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">About Project</span>
                        </div>
                    </Link>
                </div>
            </motion.div>

            {/* Support & Security */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white/50 dark:bg-dark-card/60 hover:border-gold-500/30 transition-colors cursor-pointer group"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 text-green-500 rounded-xl group-hover:bg-green-500/20 transition-colors">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Security</h3>
                            <p className="text-sm text-gray-500 dark:text-silver-500">2FA and Password settings</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white/50 dark:bg-dark-card/60 hover:border-gold-500/30 transition-colors cursor-pointer group"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                            <HelpCircle size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Help & Support</h3>
                            <p className="text-sm text-gray-500 dark:text-silver-500">Contact our concierge</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Settings;
