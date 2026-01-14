import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light';

interface ThemeState {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'dark',
            toggleTheme: () => set(() => {
                // Feature removed: always stay in dark mode
                document.documentElement.classList.add('dark');
                return { theme: 'dark' };
            }),
            setTheme: () => set(() => {
                document.documentElement.classList.add('dark');
                return { theme: 'dark' };
            }),
        }),
        {
            name: 'finance-flow-theme',
        }
    )
);

// Initialize theme on load (Force Dark)
export const initTheme = () => {
    document.documentElement.classList.add('dark');
    // Optional: Clear storage to avoid confusion if we ever bring it back, or just overwrite
    localStorage.setItem('finance-flow-theme', JSON.stringify({ state: { theme: 'dark' }, version: 0 }));
};
