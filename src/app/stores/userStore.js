// /app/(store)/userStore.js
import { create } from 'zustand';
import { getProfile } from "@/app/apis/auth.api";

const useUserStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getProfile();
      //console.log('Fetched user data:', data);
      set({ user: data.result, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch profile', loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('idToken');
    localStorage.removeItem('userRole');
    set({ user: null });
    window.location.href = "/";
  },
}));

export default useUserStore;
