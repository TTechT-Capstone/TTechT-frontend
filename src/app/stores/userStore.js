import { create } from 'zustand';
import { getProfile } from "@/app/apis/auth.api";

const useUserStore = create((set, get) => ({
  user: null,
  idToken: null,
  loading: false,
  error: null,

  fetchUser: async () => {
    if (typeof window === "undefined") return; // prevent SSR crash

    set({ loading: true, error: null });
    try {
      const data = await getProfile();

      localStorage.setItem('userId', data.result.id);
      set({ user: data.result, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch profile', loading: false });
    }
  },

  setIdToken: (token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem('idToken', token);
    }
    set({ idToken: token });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('idToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
    }
    set({ user: null, idToken: null });
  },

  initializeToken: () => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem('idToken');
      set({ idToken: storedToken });
    }
  }
}));

export default useUserStore;
