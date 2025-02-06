import { create } from 'zustand';

const useAuthStore = create((set) => ({
  role: localStorage.getItem('role') || '', // Load from localStorage
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true', // Check if already authenticated

  setAuth: (role) => {
    set({ role, isAuthenticated: true });
    localStorage.setItem('role', role); // Save to localStorage
    localStorage.setItem('isAuthenticated', 'true'); // Save to localStorage
  },
  clearAuth: () => {
    set({ role: '', isAuthenticated: false });
    localStorage.removeItem('role');
    localStorage.removeItem('isAuthenticated');
  },
}));

export default useAuthStore;
