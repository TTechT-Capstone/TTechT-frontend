import { create } from 'zustand';
import { getProfile } from "@/app/apis/auth.api";
import { getSellerById } from '@/app/apis/seller.api';

const useUserStore = create((set, get) => ({
  user: null,
  idToken: null,
  sellerId: null,
  seller: null,
  loading: false,
  error: null,

  fetchUser: async () => {
    if (typeof window === "undefined") return;

    set({ loading: true, error: null });
    try {
      const data = await getProfile(); // returns user profile
      const userId = data.result.id;

      localStorage.setItem("userId", userId);

      set({ user: data.result, loading: false });

      const sellerId = localStorage.getItem("sellerId");
      if (sellerId) {
        get().fetchSeller(sellerId);
      }
    } catch (err) {
      set({ error: "Failed to fetch profile", loading: false });
    }
  },

  fetchSeller: async (sellerId) => {
    if (typeof window === "undefined") return;
    try {
      const data = await getSellerById(sellerId);
      set({ user: data.result, loading: false, sellerId: data.result.id });
      localStorage.setItem("sellerId", data.result.id);
    } catch (err) {
      set({ error: "Failed to fetch seller info" });
    }
  },

  setSellerId: (id) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sellerId", id.toString());
    }
    set({ sellerId: id });
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
      localStorage.removeItem('sellerId');
    }
    set({ user: null, idToken: null, sellerId: null });
  },

  initializeToken: () => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("idToken");
      const storedSellerId = localStorage.getItem("sellerId");
      set({ idToken: storedToken, sellerId: storedSellerId });
    }
  }
}));

export default useUserStore;
