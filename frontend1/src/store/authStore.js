import { create } from 'zustand';

const useAuthStore = create((set) => ({
  role: '', // "student" or "admin"
  accessToken: null,
  isAuthenticated: false,
  setAuth: (role, token) => set({ role, accessToken: token, isAuthenticated: true }),
  clearAuth: () => set({ role: '', accessToken: null, isAuthenticated: false }),
}));

export default useAuthStore;