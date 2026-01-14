import { create } from 'zustand';
import api from '../api/axios';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: any) => Promise<void>;
    signup: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>; // To persist auth on reload (not fully implemented yet in backend /me endpoint)
}

export const useAuthStore = create<AuthState>((set) => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isAuthenticated: !!localStorage.getItem('user'),
    isLoading: false,

    login: async (credentials) => {
        set({ isLoading: true });
        try {
            const res = await api.post('/auth/login', credentials);
            set({ user: res.data, isAuthenticated: true, isLoading: false });
            localStorage.setItem('user', JSON.stringify(res.data));
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    signup: async (data) => {
        set({ isLoading: true });
        try {
            const res = await api.post('/auth/signup', data);
            set({ user: res.data, isAuthenticated: true, isLoading: false });
            localStorage.setItem('user', JSON.stringify(res.data));
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
            set({ user: null, isAuthenticated: false });
            localStorage.removeItem('user');
        } catch (error) {
            console.error(error);
        }
    },

    checkAuth: async () => {
        // Placeholder for /me or similar check
    }
}));
