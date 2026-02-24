import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  username?: string;
  nickname: string;
  email?: string;
  avatar?: string;
  role: 'admin' | 'visitor';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    { name: 'auth-storage' }
  )
);

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout, updateUser } = useAuthStore();

  const checkAuth = async () => {
    if (!token) return false;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (!response.ok) {
        logout();
        return false;
      }

      const userData = await response.json();
      updateUser(userData);
      return true;
    } catch {
      logout();
      return false;
    }
  };

  return { user, token, isAuthenticated, login, logout, updateUser, checkAuth };
};
