import { ArrowLeft, Layers, Database, Cpu, Globe, Zap, ShieldCheck, BarChart3, Repeat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const About = () => {
    const techStack = [
        {
            category: "Frontend",
            icon: <Globe size={24} className="text-blue-400" />,
            items: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Recharts", "Lucide React", "Vite"]
        },
        {
            category: "Backend",
            icon: <Database size={24} className="text-green-400" />,
            items: ["Node.js", "Express", "Prisma ORM", "SQLite", "JWT Auth", "Bcrypt"]
        },
        {
            category: "Architecture",
            icon: <Layers size={24} className="text-purple-400" />,
            items: ["REST API", "MVC Pattern", "Client-Side Rendering", "Responsive Design"]
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/settings" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-silver-400 hover:text-white">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">About FinanceFlow</h1>
                    <p className="text-gray-500 dark:text-silver-400">The technology behind your wealth management.</p>
                </div>
            </div>

            {/* Project Overview */}
            <div className="glass-card p-8 rounded-2xl border border-gray-200 dark:border-white/5 bg-white/50 dark:bg-dark-card/60">
                <div className="flex items-start gap-6">
                    <div className="p-4 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl shadow-lg shadow-gold-500/20 hidden md:block">
                        <Cpu size={32} className="text-dark-bg" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Project Overview</h2>
                        <p className="text-gray-600 dark:text-silver-300 leading-relaxed mb-4">
                            FinanceFlow is a premium, personal finance tracking application designed for the modern capitalist.
                            It focuses on providing a clean, "executive" aesthetic while delivering powerful insights into your financial health.
                            From multi-currency support to interactive charts, every pixel is crafted to make managing money feel like a luxury experience.
                        </p>
                        <p className="text-gray-600 dark:text-silver-300 leading-relaxed">
                            Built with performance and scalability in mind, the application leverages a modern full-stack architecture
                            to ensure real-time responsiveness and secure data handling.
                        </p>
                    </div>
                </div>
            </div>

            {/* Tech Stack Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {techStack.map((stack, index) => (
                    <motion.div
                        key={stack.category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white/50 dark:bg-dark-card/60 hover:border-gold-500/30 transition-colors duration-300"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                                {stack.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{stack.category}</h3>
                        </div>
                        <ul className="space-y-2">
                            {stack.items.map((item) => (
                                <li key={item} className="flex items-center gap-2 text-sm text-gray-600 dark:text-silver-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500/50"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>

            {/* Key Features */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Core Capabilities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-card p-5 rounded-xl border border-white/5 bg-white/5 dark:bg-dark-card/40 flex items-start gap-4">
                        <div className="p-3 bg-gold-500/10 text-gold-500 rounded-lg shrink-0">
                            <Repeat size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-1">Multi-Currency Engine</h3>
                            <p className="text-sm text-silver-400">Track accounts in USD, INR, EUR, JPY and more with seamless conversion to your preferred display currency.</p>
                        </div>
                    </div>

                    <div className="glass-card p-5 rounded-xl border border-white/5 bg-white/5 dark:bg-dark-card/40 flex items-start gap-4">
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg shrink-0">
                            <BarChart3 size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-1">Advanced Analytics</h3>
                            <p className="text-sm text-silver-400">Interactive charts and visualizations to track income streams, expense patterns, and net worth growth over time.</p>
                        </div>
                    </div>

                    <div className="glass-card p-5 rounded-xl border border-white/5 bg-white/5 dark:bg-dark-card/40 flex items-start gap-4">
                        <div className="p-3 bg-green-500/10 text-green-500 rounded-lg shrink-0">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-1">Enterprise Security</h3>
                            <p className="text-sm text-silver-400">JWT-based authentication, bcrypt password hashing, and secure session management keep your financial data private.</p>
                        </div>
                    </div>

                    <div className="glass-card p-5 rounded-xl border border-white/5 bg-white/5 dark:bg-dark-card/40 flex items-start gap-4">
                        <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg shrink-0">
                            <Zap size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-1">Smart Automation</h3>
                            <p className="text-sm text-silver-400">Intelligent categorization, default category seeding, and seamless data export functionality for external analysis.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-8 border-t border-white/5">
                <p className="text-silver-500 text-sm">
                    Designed & Developed by <span className="text-gold-500">Antigravity</span>
                </p>
                <p className="text-silver-600 text-xs mt-2">v1.0.0 • Executive Edition</p>
            </div>
        </div>
    );
};

export default About;
