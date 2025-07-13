import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addItemToCartAPI,
  createNewCart,
  getCartAPI,
  removeItemFromCartAPI,
  updateItemQuantityAPI,
  submitCartAPI,
} from "@/app/apis/cart.api";

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      cartId: null,
      totalQuantity: 0,
      totalPrice: 0,
      status: "idle",
      error: null,

      setCartId: (id) => set({ cartId: id }),

      // Load cart by userId
      loadCart: async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        try {
          const cart = await getCartAPI(userId);
          if (cart?.id) {
            const items = cart.cartItems || [];
            const totals = calculateCartTotals(items);
            set({
              cartId: cart.id,
              cart: items,
              totalQuantity: totals.totalQuantity,
              totalPrice: totals.totalPrice,
              status: "succeeded",
            });
            localStorage.setItem("cartId", String(cart.id));
          }
        } catch (err) {
          console.error("❌ Failed to load cart:", err);
          set({ status: "failed", error: err.message });
        }
      },

      // Add item to cart
      addToCart: async (newItem) => {
        try {
          set({ status: "loading" });

          let { cartId, cart } = get();

          if (!cartId) {
            const userId = localStorage.getItem("userId");
            if (!userId) throw new Error("User ID not found");

            const newCart = await createNewCart(userId);
            cartId = newCart.id;
            set({ cartId });
            localStorage.setItem("cartId", String(cartId));
          }

          if (!newItem?.productId || !newItem?.quantity) {
            throw new Error(
              "Invalid item: productId and quantity are required"
            );
          }

          const response = await addItemToCartAPI(cartId, newItem);

          if (!response?.result) {
            throw new Error("Invalid response structure from API");
          }

          const newCartItem = response.result;

          // Merge item with existing cart
          const updatedCart = [...(cart || [])];
          const existingIndex = updatedCart.findIndex(
            (item) => item.productId === newCartItem.productId
          );

          if (existingIndex !== -1) {
            // Update quantity if already exists
            updatedCart[existingIndex].quantity += newCartItem.quantity;
          } else {
            updatedCart.push(newCartItem);
          }

          const totals = calculateCartTotals(updatedCart);

          set({
            cart: updatedCart,
            totalQuantity: totals.totalQuantity,
            totalPrice: totals.totalPrice,
            status: "succeeded",
          });
          console.log("✅ Successfully added to cart:", newCartItem);
        } catch (err) {
          console.error("❌ Failed to add item to cart:", err);
          set({ status: "failed", error: err.message });
        }
      },

      // Remove item from cart
      removeItemFromCart: async (itemId) => {
        const { cartId } = get();
        if (!cartId) return; // Ensure cartId is available

        try {
          // Call the API to remove the item
          const updatedCart = await removeItemFromCartAPI(cartId, itemId);

          // Check if the API response structure is as expected
          const items = updatedCart.result?.cartItems || []; // Use optional chaining for safety

          // Calculate new totals
          const totals = calculateCartTotals(items);

          // Update the state with the new cart data
          set({
            cart: items,
            totalQuantity: totals.totalQuantity,
            totalPrice: totals.totalPrice,
            status: "succeeded",
          });
        } catch (err) {
          console.error("❌ Failed to remove item:", err);
          set({ status: "failed", error: err.message });
          // Optionally, provide user feedback here
        }
      },

      updateQuantity: async (productId, quantity) => {
        const { cartId, cart } = get();
        if (!cartId) return;

        // Prevent setting quantity to zero or negative
        if (quantity <= 0) {
          console.warn("Quantity must be greater than zero.");
          return; // Optionally, you can remove the item here
        }

        const currentItem = cart.find((item) => item.productId === productId);
        if (!currentItem) {
          console.warn("Item not found in cart");
          return;
        }

        // Check stock availability
        if (currentItem.stock && quantity > currentItem.stock) {
          console.warn("Quantity exceeds stock");
          return;
        }

        try {
          // Call the API to update the item quantity
          const data = await updateItemQuantityAPI(
            cartId,
            currentItem.id,
            quantity
          );

          // Check if the response indicates success
          if (data.code === 1000) {
            // Update the local cart state manually
            const updatedCart = cart.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            );

            const totals = calculateCartTotals(updatedCart);

            // Update the cart state
            set({
              cart: updatedCart,
              totalQuantity: totals.totalQuantity,
              totalPrice: totals.totalPrice,
              status: "succeeded",
            });
          } else {
            console.error("Unexpected response structure:", data);
          }
        } catch (err) {
          console.error("❌ Failed to update quantity:", err);
          set({ status: "failed", error: err.message });
        }
      },
      // Submit cart (checkout)
      submitCart: async () => {
        const { cartId } = get();
        if (!cartId) throw new Error("Cart ID not found");

        try {
          set({ status: "loading" });
          const response = await submitCartAPI(cartId);

          // Assume successful response means order is placed
          set({
            cart: [],
            totalQuantity: 0,
            totalPrice: 0,
            cartId: null,
            status: "succeeded",
          });

          localStorage.removeItem("cartId");
          console.log("✅ Cart submitted successfully:", response);
          return response; // Useful if UI wants to redirect or show confirmation
        } catch (err) {
          console.error("❌ Failed to submit cart:", err);
          set({ status: "failed", error: err.message });
          throw err;
        }
      },

      // Clear cart
      clearCart: () => {
        console.log("🧹 Clearing cart...");
        localStorage.removeItem("cartId");
        set({
          cart: [],
          totalQuantity: 0,
          totalPrice: 0,
          cartId: null,
          status: "idle",
          error: null,
        });
      },
    }),
    {
      name: "cart-store",
      partialize: (state) => ({
        cartId: state.cartId,
        cart: state.cart,
        totalQuantity: state.totalQuantity,
      }),
    }
  )
);

// Utility
function calculateCartTotals(cartItems) {
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price || 0);
    const qty = parseInt(item.quantity, 10);
    return sum + price * qty;
  }, 0);

  return { totalQuantity, totalPrice };
}

export default useCartStore;
