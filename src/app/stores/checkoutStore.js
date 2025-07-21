import { create } from 'zustand';

const useCheckoutStore = create((set) => ({
  // Form Fields
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  deliveryAddress: '',
  promotionCode: '',

  // Methods
  setFormData: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  clearFormData: () =>
    set({
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      deliveryAddress: '',
      promotionCode: '',
    }),
}));

export default useCheckoutStore;
