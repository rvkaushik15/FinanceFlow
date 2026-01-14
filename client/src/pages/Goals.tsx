import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Trophy, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const Goals = () => {
    const [goals, setGoals] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        targetAmount: '',
        currentAmount: '',
        deadline: ''
    });

    const fetchData = async () => {
        try {
            const res = await api.get('/goals');
            setGoals(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            // Loading complete
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setFormData({ name: '', targetAmount: '', currentAmount: '', deadline: '' });
        setIsEditing(false);
        setEditId(null);
    };

    const handleEdit = (goal: any) => {
        setFormData({
            name: goal.name,
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            deadline: goal.deadline ? goal.deadline.split('T')[0] : ''
        });
        setEditId(goal.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && editId) {
                await api.put(`/goals/${editId}`, formData);
                toast.success('Goal updated');
            } else {
                await api.post('/goals', formData);
                toast.success('Goal created');
            }
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            toast.error('Failed to save goal');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this goal?')) return;
        try {
            await api.delete(`/goals/${id}`);
            toast.success('Goal deleted');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete goal');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Savings Goals</h1>
                    <p className="text-gray-500 dark:text-silver-400">Save for your dreams.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-dark-bg font-bold px-4 py-2 rounded-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    New Goal
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map((goal) => {
                    const progress = Math.min((Number(goal.currentAmount) / Number(goal.targetAmount)) * 100, 100);

                    return (
                        <div key={goal.id} className="glass-card p-6 rounded-xl shadow-sm relative group hover:border-gold-500/30 transition-all">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(goal)}
                                    className="text-gray-400 hover:text-blue-500"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(goal.id)}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg text-yellow-600 dark:text-yellow-400">
                                    <Trophy size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{goal.name}</h3>
                                    {goal.deadline && (
                                        <p className="text-xs text-gray-500">Target: {format(new Date(goal.deadline), 'MMM d, yyyy')}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mb-2 flex justify-between items-end">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ${Number(goal.currentAmount).toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-500 mb-1">
                                    of ${Number(goal.targetAmount).toLocaleString()}
                                </span>
                            </div>

                            <div className="w-full bg-gray-200 dark:bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="h-2.5 rounded-full bg-gold-500"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="w-full max-w-md glass-card rounded-xl p-8 transform transition-all animate-slide-up">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white font-heading">
                            {isEditing ? 'Edit Goal' : 'New Goal'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-silver-300">Goal Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-dark-bg/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:border-gold-500/50 outline-none"
                                    placeholder="e.g. New Car"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-silver-300">Target Amount</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.targetAmount}
                                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-dark-bg/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:border-gold-500/50 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-silver-300">Current Saved (Optional)</label>
                                <input
                                    type="number"
                                    value={formData.currentAmount}
                                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-dark-bg/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:border-gold-500/50 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-silver-300">Deadline (Optional)</label>
                                <input
                                    type="date"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
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

export default Goals;
