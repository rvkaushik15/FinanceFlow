import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();
    const { login } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const res = await api.post('/auth/signup', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            login(res.data);
            navigate('/dashboard');
            toast.success('Account created successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-dark-bg relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.2] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-silver-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md glass-card p-8 rounded-2xl relative z-10 animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold font-heading mb-2 text-white">
                        Join <span className="text-gold-400">FinanceFlow</span>
                    </h1>
                    <p className="text-silver-400">Start your journey to financial freedom</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-silver-300 mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-dark-bg border border-dark-border text-white rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-silver-300 mb-2">Email</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-dark-bg border border-dark-border text-white rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all"
                            placeholder="name@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-silver-300 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-dark-bg border border-dark-border text-white rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-silver-300 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full bg-dark-bg border border-dark-border text-white rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-dark-bg font-bold py-3.5 rounded-xl shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 transform hover:-translate-y-0.5 transition-all duration-200 mt-2"
                    >
                        Create Account
                    </button>

                    <p className="text-center text-silver-500 text-sm mt-4">
                        Already have an account?{' '}
                        <Link to="/login" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
