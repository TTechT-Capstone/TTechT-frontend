"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, Search, Pencil, Trash2, SquarePen } from "lucide-react";
import { getOrdersByUserIdAPI } from "@/app/apis/order.api";
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function SellerOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { idToken, user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!idToken || !user?.id) return;

    const fetchOrders = async () => {
      try {
        const data = await getOrdersByUserIdAPI(user.id);
        setOrders(data.result || []);
        //console.log(data.result);
      } catch (error) {
        console.error("Error loading orders:", error.message);
        setOrders([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  const handleEditOrder = (order) => {
  router.push(`/seller/orders/${order.id}`);
};

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
      <div className="grid grid-cols-7 justify-items-center font-urbanist font-bold bg-gray-100 px-4 py-3 rounded-t-lg">
        <div className="col-span-2">Order ID</div>
        <div>Customer Name</div>
        <div>Quantity</div>
        <div>Order Date</div>
        <div>Status</div>
        <div>Action</div>
      </div>

      {/* Table Rows */}
      {loading ? (
        <div className="text-center py-8 text-gray-500 font-urbanist col-span-6">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500 font-urbanist col-span-6">
          No orders found.
        </div>
      ) : (
        orders.map((order, index) => (
          <div
            key={order.id}
            className={`grid grid-cols-7 justify-items-center items-center px-4 py-3 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            }`}
          >
            <div className="col-span-2 font-medium">{order.orderNumber}</div>
            <div>{order.contactName}</div>
            <div>{order.orderItems?.length || 0}</div>
            <div>{new Date(order.createdAt).toLocaleDateString()}</div>
            <div>{order.orderStatus}</div>
            <div className="flex space-x-3">
              <SquarePen 
              className="text-gray-600 hover:text-primary cursor-pointer" 
              onClick={() => handleEditOrder(order)}
              />
              <Trash2 className="text-red-600 hover:text-red-800 cursor-pointer" />
            </div>
          </div>
        ))
      )}
    </main>
  );
}
