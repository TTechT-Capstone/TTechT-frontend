import Link from "next/link";
import { Trash2 } from "lucide-react";

const mockCart = [
  {
    id: 1,
    name: "Product's name",
    price: 100000,
    quantity: 5,
    image: "", // or use real image URL
  },
  {
    id: 2,
    name: "Product's name",
    price: 100000,
    quantity: 5,
    image: "",
  },
  {
    id: 3,
    name: "Product's name",
    price: 100000,
    quantity: 5,
    image: "",
  },
  {
    id: 4,
    name: "Product's name",
    price: 100000,
    quantity: 5,
    image: "",
  },
  {
    id: 5,
    name: "Product's name",
    price: 100000,
    quantity: 5,
    image: "",
  },
  {
    id: 6,
    name: "Product's name",
    price: 100000,
    quantity: 5,
    image: "",
  },
];

export default function ShoppingCartPage() {
  const cartTotal = mockCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen w-full bg-[#f5f5f5] text-primary py-10 px-4 font-roboto">
      {/* Heading */}
      <h1 className="text-secondary text-3xl font-bold font-urbanist text-center py-6 ">
        Shopping Cart
      </h1>

      <div className="max-w-7xl mx-auto bg-white overflow-hidden mb-5">
        {/* Table Header */}
        <div className="grid grid-cols-7 px-6 py-3 bg-white text-gray-600 font-semibold text-sm">
          <div>
            <input type="checkbox" />
          </div>
          <div className="col-span-2">Product</div>
          <div className="text-center">Unit Price</div>
          <div className="text-center">Quantity</div>
          <div className="text-center">Subtotal</div>
          <div className="text-center">Actions</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto bg-white overflow-hidden">
        {/* Cart Items */}
        {mockCart.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-7 items-center px-6 py-5 border-b border-[#EDEDED] text-sm"
          >
            {/* Checkbox */}
            <div>
              <input type="checkbox" />
            </div>

            {/* Product Info */}
            <div className="col-span-2 flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <span className="font-medium">{item.name}</span>
            </div>

            {/* Unit Price */}
            <div className="text-center">
              ₫{item.price.toLocaleString("vi-VN")}
            </div>

            {/* Quantity Controls */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center border border-[#EDEDED] overflow-hidden">
                <button className="px-3 py-1   hover:bg-gray-100">-</button>
                <span className="px-3 py-1 border-l border-r border-[#EDEDED]">
                  {item.quantity}
                </span>
                <button className="px-3 py-1 bg-gray-100 hover:bg-gray-800  text-black hover:text-white">
                  +
                </button>
              </div>
              <p className="text-xs text-red-500">Only {item.stock} left</p>
            </div>

            {/* Subtotal */}
            <div className="text-center text-red-500 font-semibold">
              ₫{(item.price * item.quantity).toLocaleString("vi-VN")}
            </div>

            {/* Actions */}
            <div className="text-center text-red-500">
              <button className="items-center hover:text-red-500 text-gray-600">
                <Trash2 className="w-4 h-4 mx-auto" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl sticky bottom-0 bg-white shadow-md mx-auto mt-6 flex flex-col md:flex-row justify-end items-center p-6 gap-4 z-10">
        {/* Cart Total */}
        <div className="text-base font-semibold">
          Total:{" "}
          <span className="text-red-500 text-xl">
            ₫{cartTotal.toLocaleString("vi-VN")}
          </span>
        </div>

        {/* Checkout Buttons */}
        <div className="flex gap-4">
          <Link href="/cart/checkout">
            <button className="px-6 py-2 bg-primary text-white hover:opacity-90">
              Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
