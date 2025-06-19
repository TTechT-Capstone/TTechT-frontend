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
];

export default function ShoppingCartPage() {
  const cartTotal = mockCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen w-full bg-[#F5F5F5] py-10 px-4 font-roboto">
      <h1 className="font-urbanist text-3xl font-bold text-center mb-8">
        SHOPPING CART
      </h1>

      <div className="bg-white rounded-xl shadow-md max-w-5xl mx-auto p-6 space-y-6">
        {mockCart.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row md:items-center justify-between pb-6 gap-4"
          >
            {/* Image & Info */}
            <div className="flex items-center gap-4 flex-1">
              <div className="w-24 h-24 bg-gray-200 rounded-md" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Unit Price: ${item.price.toLocaleString("en-US")}
                </p>
                <p className="text-sm text-gray-800 font-medium mt-1">
                  Total: ${(item.price * item.quantity).toLocaleString("en-US")}
                </p>
              </div>
              <div className="flex-2 flex-col justify-end flex items-end gap-4">
                <button className="hover:text-red-500 text-gray-600">
                  <Trash2 className="w-5 h-5" />
                </button>
                {/* Quantity Selector */}
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 rounded border hover:bg-gray-100">
                    -
                  </button>
                  <span className="text-sm font-medium">{item.quantity}</span>
                  <button className="px-3 py-1 rounded border hover:bg-gray-100 bg-gray-800 text-white">
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Cart Total */}
        <div className="text-right text-lg font-semibold pt-4 border-t">
          Total Cart: ${cartTotal.toLocaleString("en-US")}
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4">
          <Link href="/">
            <button className="px-6 py-2 border border-black text-black hover:bg-gray-100 rounded-md">
              Continue Shopping
            </button>
          </Link>
          <Link href="/checkout">
            <button className="px-6 py-2 bg-primary text-white hover:opacity-90 rounded-md">
              Purchase
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
