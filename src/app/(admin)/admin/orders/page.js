"use client";

import { ChevronDown, Search, Pencil, Trash2, SquarePen } from "lucide-react";

const orders = [
  { orderId: "Name", quantity: 1, date: "100.000₫", status: "Pending" },
  { orderId: "Name", quantity: 1, date: "100.000₫", status: "Shipped" },
  { orderId: "Name", quantity: 1, date: "100.000₫", status: "Delivered" },
  { orderId: "Name", quantity: 1, date: "100.000₫", status: "Cancelled" },
];

export default function AdminOrders() {
  return (
    <main className="font-roboto p-4 min-h-screen">
      {/* Header */}
      <div className="flex mb-4">
        <h1 className="font-urbanist font-bold text-2xl">Order Management</h1>
        
      </div>

      {/* Sort and Create */}
      <div className="flex flex-row justify-between mb-4">
        <div className="flex flex-row items-center space-x-2 font-urbanist font-bold">
          <span>SORT BY</span>
          <ChevronDown className="h-5 w-5" />
        </div>
<div className="flex flex-row items-center space-x-2 font-urbanist font-bold">
          <span>SEARCH</span>
          <Search className="h-5 w-5" />
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-6 font-urbanist font-bold bg-gray-100 px-4 py-3 rounded-t-lg">
        <div>Order ID</div>
        <div>Quantity</div>
        <div>Order Date</div>
        <div>Status</div>
        <div>Action</div>
      </div>

      {/* Table Rows */}
      {orders.map((order, index) => (
        <div
          key={index}
          className={`grid grid-cols-6 items-center px-4 py-3 ${
            index % 2 === 0 ? "bg-white" : "bg-gray-50"
          }`}
        >
          <div className="font-medium">{order.orderId}</div>
          <div>{order.quantity}</div>
          <div>{order.date}</div>
          <div>{order.status}</div>
          
          <div className="flex space-x-3">
            <SquarePen className="text-gray-600 hover:text-primary cursor-pointer" />
            <Trash2 className="text-red-600 hover:text-red-800 cursor-pointer" />
          </div>
        </div>
      ))}
    </main>
  );
}
