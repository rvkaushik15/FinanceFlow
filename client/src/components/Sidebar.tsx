import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Home, PieChart, CreditCard, Settings, LogOut, Wallet, Target, Tag, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const { pathname } = useLocation();
    const { logout } = useAuthStore();

    const links = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Accounts', href: '/accounts', icon: Wallet },
        { name: 'Transactions', href: '/transactions', icon: CreditCard },
        { name: 'Budgets', href: '/budgets', icon: PieChart },
        { name: 'Goals', href: '/goals', icon: Target },
        { name: 'Categories', href: '/categories', icon: Tag },
    ];

    return (
        <div className="fixed left-0 top-0 h-full w-64 bg-white/80 dark:bg-dark-card/90 backdrop-blur-xl border-r border-gray-200 dark:border-white/5 flex flex-col z-50">
            <div className="p-8">
                <Link to="/dashboard" className="flex items-center gap-2 group">
                    <div className="p-2 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-all duration-300">
                        <TrendingUp className="text-dark-bg" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        <span className="text-gray-900 dark:text-white">Finance</span>
                        <span className="text-gold-600 dark:text-gold-400">Flow</span>
                    </h1>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2 py-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            to={link.href}
                            className={clsx(
                                'flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group',
                                isActive
                                    ? 'nav-item-active'
                                    : 'text-silver-400 hover:text-white hover:bg-white/5'
                            )}
                        >
                            <Icon size={20} className={clsx(
                                "transition-colors duration-300",
                                isActive ? "text-gold-600 dark:text-gold-400" : "text-gray-500 dark:text-silver-600 group-hover:text-gold-600 dark:group-hover:text-gold-200"
                            )} />
                            <span className={clsx(
                                "transition-colors",
                                isActive ? "text-gold-600 dark:text-gold-400" : "text-gray-600 dark:text-silver-400 group-hover:text-gray-900 dark:group-hover:text-white"
                            )}>
                                {link.name}
                            </span>
                            {isActive && (
                                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-gold-600 dark:bg-gold-400 shadow-[0_0_10px_#D4AF37]"></div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mx-4 mb-4 border-t border-white/5">
                <Link
                    to="/settings"
                    className={clsx(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 mb-2 group',
                        pathname === '/settings'
                            ? 'nav-item-active'
                            : 'text-silver-400 hover:text-white hover:bg-white/5'
                    )}
                >
                    <Settings size={20} className="group-hover:text-silver-200 transition-colors" />
                    Settings
                </Link>
                <button
                    onClick={() => logout()}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>

            {/* Ambient Background Glow for Sidebar */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-gold-900/10 to-transparent pointer-events-none" />
        </div>
    );
};

export default Sidebar;
