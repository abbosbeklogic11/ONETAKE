import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_URL } from './api';

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  theme: 'dark' | 'light';
  login: (user: any, token: string) => void;
  logout: () => void;
  fetchUserData: () => Promise<void>;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      theme: 'dark',
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      setTheme: (theme) => set({ theme }),
      fetchUserData: async () => {
        const { token } = get();
        if (!token) return;
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const user = await res.json();
            set({ user });
          }
        } catch (e) {
          console.error(e);
        }
      }
    }),
    {
      name: 'auth-storage-v2', // Changed name to force reset or just use version
      version: 1,
    }
  )
);
