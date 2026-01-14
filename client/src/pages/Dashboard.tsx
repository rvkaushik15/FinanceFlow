import { useState, useEffect } from 'react';
import api from '../api/axios';
import { DollarSign, TrendingUp, TrendingDown, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';
import { formatCurrency, currencies, EXCHANGE_RATES } from '../utils/currency';
import { motion } from 'framer-motion';
import CountUp from '../components/CountUp';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const Dashboard = () => {
    const { user } = useAuthStore();
    const [metrics, setMetrics] = useState<any>(null);
    const [recentTx, setRecentTx] = useState<any[]>([]);
    const [displayCurrency, setDisplayCurrency] = useState('USD');

    const convertValue = (amount: number) => {
        const rate = EXCHANGE_RATES[displayCurrency] || 1;
        return amount * rate;
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [metricRes, txRes] = await Promise.all([
                    api.get('/analytics/dashboard'),
                    api.get('/transactions?limit=5')
                ]);
                setMetrics(metricRes.data);
                setRecentTx(txRes.data.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDashboardData();
    }, []);

    // Mock data for charts (replace with real API later)
    const chartData = metrics?.chartData || [];

    if (!metrics) return (
        <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
        </div>
    );

    return (
        <div className="space-y-8 pb-10">
            <div>
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2"
                >
                    Welcome back, <span className="gold-text">{user?.name}</span>
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-4"
                >
                    <p className="text-gray-600 dark:text-silver-400">Here's your financial overview for today.</p>
                    <select
                        value={displayCurrency}
                        onChange={(e) => setDisplayCurrency(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-silver-300 focus:border-gold-500/50 outline-none hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        {currencies.map(c => (
                            <option key={c.code} value={c.code}>{c.code}</option>
                        ))}
                    </select>
                </motion.div>
            </div>

            {/* Metrics Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                {/* Total Balance Card */}
                <motion.div variants={item} className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-shadow duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={100} className="text-gold-600 dark:text-gold-400" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-gradient-to-br from-gold-400/20 to-gold-600/20 rounded-xl border border-gold-500/20">
                                <DollarSign size={24} className="text-gold-600 dark:text-gold-400" />
                            </div>
                            <span className="text-gray-600 dark:text-silver-400 font-medium">Total Balance</span>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                            <CountUp value={convertValue(metrics.totalBalance)} currency={displayCurrency} />
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-400/10 w-fit px-2 py-1 rounded-lg border border-green-400/20">
                            <ArrowUpRight size={16} />
                            <span>+12.5% from last month</span>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 to-transparent"></div>
                </motion.div>

                {/* Income Card */}
                <motion.div variants={item} className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-shadow duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={100} className="text-green-600 dark:text-green-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                                <TrendingUp size={24} className="text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-gray-600 dark:text-silver-400 font-medium">Monthly Income</span>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                            <CountUp value={convertValue(metrics.monthlyIncome)} currency={displayCurrency} />
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-silver-500">
                            <span>Recorded this month</span>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-transparent"></div>
                </motion.div>

                {/* Expense Card */}
                <motion.div variants={item} className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] transition-shadow duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingDown size={100} className="text-red-600 dark:text-red-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                                <TrendingDown size={24} className="text-red-600 dark:text-red-400" />
                            </div>
                            <span className="text-gray-600 dark:text-silver-400 font-medium">Monthly Expenses</span>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                            <CountUp value={convertValue(metrics.monthlyExpense)} currency={displayCurrency} />
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-silver-500">
                            <span>Recorded this month</span>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-transparent"></div>
                </motion.div>
            </motion.div>

            {/* Charts Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
                {/* Activity Chart */}
                <div className="glass-card p-6 rounded-2xl hover:border-gold-500/30 transition-colors duration-500">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Activity className="text-gold-600 dark:text-gold-400" size={20} />
                        Financial Activity
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0A0A0A', borderColor: '#333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="income" stroke="#10B981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} animationDuration={2000} />
                                <Area type="monotone" dataKey="expense" stroke="#EF4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} animationDuration={2000} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="glass-card p-6 rounded-2xl hover:border-gold-500/30 transition-colors duration-500">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
                        <button className="text-sm text-gold-600 dark:text-gold-400 hover:text-gold-500 dark:hover:text-gold-300 transition-colors">View All</button>
                    </div>

                    <div className="space-y-4">
                        {recentTx.map((tx, index) => (
                            <motion.div
                                key={tx.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + (index * 0.1) }}
                                whileHover={{ scale: 1.02, x: 10 }}
                                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 transition-colors group cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-full ${tx.category?.type === 'INCOME' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {tx.category?.type === 'INCOME' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-200 transition-colors">{tx.description}</p>
                                        <p className="text-xs text-gray-500 dark:text-silver-500">{format(new Date(tx.date), 'MMM d, yyyy')}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${tx.category?.type === 'INCOME' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {tx.category?.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount, tx.account?.currency)}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-silver-600">{tx.category?.name || 'Uncategorized'}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
