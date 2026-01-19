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
            category: "Backend & Cloud",
            icon: <Database size={24} className="text-green-400" />,
            items: ["Node.js", "Express", "Prisma ORM", "Supabase (PostgreSQL)", "Vercel", "JWT Auth"]
        },
        {
            category: "Architecture",
            icon: <Layers size={24} className="text-purple-400" />,
            items: ["REST API", "MVC Pattern", "Client-Side Rendering", "Responsive Design"]
        }
    ];

    return (
        <div className="space-y-10 animate-fade-in max-w-5xl mx-auto pb-12">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/settings" className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-silver-400 hover:text-white group">
                    <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                </Link>
                <div>
                    <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-white via-silver-200 to-silver-400 text-transparent bg-clip-text">
                        About FinanceFlow
                    </h1>
                    <p className="text-silver-400 mt-1">The technology empowering your wealth.</p>
                </div>
            </div>

            {/* Project Overview */}
            <div className="glass-card p-8 rounded-2xl border border-white/10 bg-dark-card/60 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-32 bg-gold-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-gold-500/10 transition-colors duration-700"></div>

                <div className="flex items-start gap-8 relative z-10">
                    <div className="p-5 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl shadow-lg shadow-gold-500/20 hidden md:block transform rotate-3 group-hover:rotate-6 transition-transform duration-500">
                        <Cpu size={40} className="text-dark-bg" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Engineering Excellence</h2>
                        <p className="text-silver-300 leading-relaxed mb-4 text-lg">
                            FinanceFlow is a premium, personal finance tracking application designed for the modern capitalist.
                            It focuses on providing a clean, "executive" aesthetic while delivering powerful insights into your financial health.
                        </p>
                        <p className="text-silver-300 leading-relaxed text-lg">
                            Built with performance and scalability in mind, the application leverages a modern full-stack architecture
                            to ensure real-time responsiveness and secure data handling.
                        </p>

                        {/* Mock Status Indicators */}
                        <div className="flex gap-6 mt-6 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-xs font-mono text-green-400">SYSTEM ONLINE</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={14} className="text-gold-500" />
                                <span className="text-xs font-mono text-gold-500">AES-256 ENCRYPTION</span>
                            </div>
                        </div>
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
                        className="glass-card p-6 rounded-2xl border border-white/5 bg-dark-card/60 hover:border-gold-500/30 hover:bg-dark-card/80 transition-all duration-300 group hover:-translate-y-1"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:bg-gold-500/10 group-hover:border-gold-500/20 transition-colors">
                                {stack.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white">{stack.category}</h3>
                        </div>
                        <ul className="space-y-3">
                            {stack.items.map((item) => (
                                <li key={item} className="flex items-center gap-3 text-sm text-silver-400 group-hover:text-silver-200 transition-colors">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500/50 group-hover:bg-gold-400 group-hover:shadow-[0_0_8px_rgba(212,175,55,0.6)] transition-all"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>

            {/* Key Features */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Core Capabilities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { icon: Repeat, color: "text-gold-500", bg: "bg-gold-500/10", title: "Global Currency Engine", desc: "Real-time conversion for USD, INR, EUR, JPY and more." },
                        { icon: BarChart3, color: "text-blue-500", bg: "bg-blue-500/10", title: "Institutional Analytics", desc: "Interactive visualizations to track net worth and cash flow." },
                        { icon: ShieldCheck, color: "text-green-500", bg: "bg-green-500/10", title: "Enterprise Security", desc: "JWT-based auth and secure session management." },
                        { icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10", title: "Intelligent Automation", desc: "Smart categorization and seamless data organization." }
                    ].map((feature, i) => (
                        <div key={i} className="glass-card p-6 rounded-xl border border-white/5 bg-dark-card/40 flex items-start gap-4 hover:bg-white/5 transition-colors">
                            <div className={`p-3 ${feature.bg} ${feature.color} rounded-lg shrink-0`}>
                                <feature.icon size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                                <p className="text-sm text-silver-400">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-10 border-t border-white/5">
                <p className="text-silver-500">
                    Designed & Developed by <span className="text-gold-500 font-bold">Koushik</span>
                </p>
                <p className="text-silver-700 text-xs mt-2 uppercase tracking-widest">Executive Edition • v1.0.0</p>
            </div>
        </div>
    );
};

export default About;
