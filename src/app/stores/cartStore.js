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
import { getProductByIdAPI } from "../apis/product.api";

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
      // loadCart: async () => {
      //   const userId = localStorage.getItem("userId");
      //   if (!userId) return;

      //   try {
      //     const cart = await getCartAPI(userId);
      //     if (cart?.id) {
      //       const items = cart.cartItems || [];
      //       const totals = calculateCartTotals(items);
      //       set({
      //         cartId: cart.id,
      //         cart: items,
      //         totalQuantity: totals.totalQuantity,
      //         totalPrice: totals.totalPrice,
      //         status: "succeeded",
      //       });
      //       localStorage.setItem("cartId", String(cart.id));
      //     }
      //   } catch (err) {
      //     console.error("❌ Failed to load cart:", err);
      //     set({ status: "failed", error: err.message });
      //   }
      // },
      loadCart: async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        try {
          const cart = await getCartAPI(userId);
          if (cart?.id) {
            let items = cart.cartItems || [];

            // Enrich each cart item with image, color, and size if missing
            items = await Promise.all(
              items.map(async (item) => {
                if (item.image && item.color && item.size) return item;

                const productData = await getProductByIdAPI(item.productId);

                return {
                  ...item,
                  // image:
                  //   item.image || productData.mainImage || "/placeholder.png",
                  // color: item.color || item.selectedColor || "",
                  // size: item.size || item.selectedSize || "",
                };
              })
            );

            // Print cart items to console for debugging
            console.log("✅ Loaded cart items:", items);

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

      // // Add item to cart
      // addToCart: async (newItem) => {
      //   try {
      //     set({ status: "loading" });
      //     let { cartId, cart } = get();

      //     if (!cartId) {
      //       const userId = localStorage.getItem("userId");
      //       if (!userId) throw new Error("User ID not found");

      //       const newCart = await createNewCart(userId);
      //       cartId = newCart.id;
      //       set({ cartId });
      //       localStorage.setItem("cartId", String(cartId));
      //     }

      //     if (!newItem?.productId || !newItem?.quantity) {
      //       throw new Error(
      //         "Invalid item: productId and quantity are required"
      //       );
      //     }

      //     const existingItem = cart.find(
      //       (item) => item.productId === newItem.productId
      //     );

      //     let updatedCart;

      //     if (existingItem) {
      //       // 🛠 Call update API instead of add
      //       const updatedQuantity = existingItem.quantity + newItem.quantity;
      //       await updateItemQuantityAPI(
      //         cartId,
      //         existingItem.id,
      //         updatedQuantity
      //       );

      //       updatedCart = cart.map((item) =>
      //         item.productId === newItem.productId
      //           ? { ...item, quantity: updatedQuantity }
      //           : item
      //       );
      //     } else {
      //       // 🛠 Call add API for new items only
      //       const response = await addItemToCartAPI(cartId, newItem);
      //       const newCartItem = response.result;

      //       updatedCart = [...cart, newCartItem];
      //     }

      //     const totals = calculateCartTotals(updatedCart);

      //     set({
      //       cart: updatedCart,
      //       totalQuantity: totals.totalQuantity,
      //       totalPrice: totals.totalPrice,
      //       status: "succeeded",
      //     });
      //   } catch (err) {
      //     console.error("❌ Failed to add item to cart:", err);
      //     set({ status: "failed", error: err.message });
      //   }
      // },

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

          // Remove the strict image check
          if (
            !newItem?.productId ||
            !newItem?.quantity ||
            !newItem.color ||
            !newItem.size
          ) {
            throw new Error(
              "Invalid item: productId, quantity, color, and size are required"
            );
          }

          console.log("✅ Added cart item:", newItem);

          const existingItem = cart.find(
            (item) =>
              item.productId === newItem.productId &&
              item.color === newItem.color &&
              item.size === newItem.size
          );

          let updatedCart;

          if (existingItem) {
            const updatedQuantity = existingItem.quantity + newItem.quantity;
            await updateItemQuantityAPI(
              cartId,
              existingItem.id,
              updatedQuantity
            );

            updatedCart = cart.map((item) =>
              item.productId === newItem.productId &&
              item.color === newItem.color &&
              item.size === newItem.size
                ? { ...item, quantity: updatedQuantity }
                : item
            );
          } else {
            const response = await addItemToCartAPI(cartId, newItem);
            const newCartItem = response.result;

            updatedCart = [...cart, newCartItem];
          }

          const totals = calculateCartTotals(updatedCart);

          set({
            cart: updatedCart,
            totalQuantity: totals.totalQuantity,
            totalPrice: totals.totalPrice,
            status: "succeeded",
          });
        } catch (err) {
          console.error("❌ Failed to add item to cart:", err);
          set({ status: "failed", error: err.message });
        }
      },

      // Remove item from cart
      removeItemFromCart: async (productId) => {
        const { cartId, loadCart } = get();
        if (!cartId) return;

        try {
          await removeItemFromCartAPI(cartId, productId);
          await loadCart(); // loadCart already updates the store

          set({ status: "succeeded", error: null });
        } catch (err) {
          console.error("❌ Remove error:", err);
          set({
            status: "failed",
            error: err.message || "Error removing item",
          });
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
      // submitCart: async () => {
      //   const { cartId } = get();
      //   if (!cartId) throw new Error("Cart ID not found");

      //   try {
      //     set({ status: "loading" });
      //     const response = await submitCartAPI(cartId);

      //     // Assume successful response means order is placed
      //     set({
      //       cart: [],
      //       totalQuantity: 0,
      //       totalPrice: 0,
      //       cartId: null,
      //       status: "succeeded",
      //     });

      //     localStorage.removeItem("cartId");
      //     console.log("✅ Cart submitted successfully:", response);
      //     return response; // Useful if UI wants to redirect or show confirmation
      //   } catch (err) {
      //     console.error("❌ Failed to submit cart:", err);
      //     set({ status: "failed", error: err.message });
      //     throw err;
      //   }
      // },
      submitCart: async () => {
        const { cartId, cart, selectedItems } = get();
        if (!cartId) throw new Error("Cart ID not found");

        try {
          set({ status: "loading" });

          // Only submit selected items
          const selectedCartItems = cart.filter((item) =>
            selectedItems.includes(item.productId)
          );

          if (selectedCartItems.length === 0) {
            throw new Error("No items selected for checkout.");
          }

          const payload = {
            cartId,
            items: selectedCartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          };

          const response = await submitCartAPI(payload);

          // Remove only submitted items from cart
          const remainingCart = cart.filter(
            (item) => !selectedItems.includes(item.productId)
          );

          const newTotalQuantity = remainingCart.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          set({
            cart: remainingCart,
            totalQuantity: newTotalQuantity,
            selectedItems: [],
            status: "succeeded",
          });

          // Optional: remove cartId if cart is now empty
          if (remainingCart.length === 0) {
            set({ cartId: null });
            localStorage.removeItem("cartId");
          }

          console.log("✅ Cart submitted successfully:", response);
          return response;
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

      selectedItems: [],

      setSelectedItems: (items) => set({ selectedItems: items }),

      toggleItemSelection: (productId) => {
        const { selectedItems } = get();
        if (selectedItems.includes(productId)) {
          set({
            selectedItems: selectedItems.filter((id) => id !== productId),
          });
        } else {
          set({ selectedItems: [...selectedItems, productId] });
        }
      },

      toggleAllItems: () => {
        const { selectedItems, cart } = get();
        const allIds = cart.map((item) => item.productId);
        if (selectedItems.length === cart.length) {
          set({ selectedItems: [] });
        } else {
          set({ selectedItems: allIds });
        }
      },

      calculatePriceOfSelectedItems: () => {
        const { cart, selectedItems } = get();

        const selectedCartItems = cart.filter((item) =>
          selectedItems.includes(item.productId)
        );

        return selectedCartItems.reduce((sum, item) => {
          const price = parseFloat(item.price || 0);
          const qty = parseInt(item.quantity, 10);
          return sum + price * qty;
        }, 0);
      },
    }),
    {
      name: "cart-store",
      partialize: (state) => ({
        cartId: state.cartId,
        cart: state.cart,
        totalQuantity: state.totalQuantity,
        selectedItems: state.selectedItems,
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
