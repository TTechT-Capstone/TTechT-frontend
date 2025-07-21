// /app/(store)/userStore.js
import { create } from 'zustand';
import { getProfile } from "@/app/apis/auth.api";

const useUserStore = create((set) => ({
  user: null,
  idToken: localStorage.getItem('idToken'),
  //idToken: nu
  loading: false,
  error: null,

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getProfile();
      //console.log('Fetched user data:', data);

      localStorage.setItem('userId', data.result.id);
      set({ user: data.result, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch profile', loading: false });
    }
  },

  setIdToken: (token) => {
    localStorage.setItem('idToken', token); // Save token to localStorage
    set({ idToken: token }); // Update state
  },

  logout: () => {
    localStorage.removeItem('idToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    set({ user: null });  
  },
}));

export default useUserStore;
