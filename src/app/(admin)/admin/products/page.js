"use client";

import { ChevronDown, Search, Pencil, Trash2, SquarePen } from "lucide-react";
import Link from "next/link";

const products = [
  { name: "Name", quantity: 1, price: "100.000₫", size: 20, color: "Red" },
  { name: "Name", quantity: 1, price: "100.000₫", size: 20, color: "Red" },
  { name: "Name", quantity: 1, price: "100.000₫", size: 20, color: "Red" },
  { name: "Name", quantity: 1, price: "100.000₫", size: 20, color: "Red" },
];

export default function AdminProducts() {
  return (
    <main className="font-roboto p-4 min-h-screen">
      {/* Header */}
      <div className="flex flex-row justify-between mb-4">
        <h1 className="font-urbanist font-bold text-2xl">Product Management</h1>
        <div className="flex flex-row items-center space-x-2 font-urbanist font-bold">
          <span>SEARCH</span>
          <Search className="h-5 w-5" />
        </div>
      </div>

      {/* Sort and Create */}
      <div className="flex flex-row justify-between mb-4">
        <div className="flex flex-row items-center space-x-2 font-urbanist font-bold">
          <span>SORT BY</span>
          <ChevronDown className="h-5 w-5" />
        </div>
        <Link href="/admin/products/create">
          <button className="bg-secondary text-white px-4 py-2 rounded-md font-urbanist font-bold">
            Create new product
          </button>
        </Link>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-6 font-urbanist font-bold bg-gray-100 px-4 py-3 rounded-t-lg">
        <div>Product</div>
        <div>Quantity</div>
        <div>Retail Price</div>
        <div>Size</div>
        <div>Color</div>
        <div>Action</div>
      </div>

      {/* Table Rows */}
      {products.map((product, index) => (
        <div
          key={index}
          className={`grid grid-cols-6 items-center px-4 py-3 ${
            index % 2 === 0 ? "bg-white" : "bg-gray-50"
          }`}
        >
          <div className="font-medium">{product.name}</div>
          <div>{product.quantity}</div>
          <div>{product.price}</div>
          <div>{product.size}</div>
          <div>{product.color}</div>
          <div className="flex space-x-3">
            <SquarePen className="text-gray-600 hover:text-primary cursor-pointer" />
            <Trash2 className="text-red-600 hover:text-red-800 cursor-pointer" />
          </div>
        </div>
      ))}
    </main>
  );
}
