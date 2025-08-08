"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search, Pencil, Trash2, SquarePen } from "lucide-react";
import { getAllOrdersAPI } from "@/app/apis/order.api";
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { idToken, user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrdersAPI();
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
  }, []);

  const handleEditOrder = (order) => {
    router.push(`/admin/orders/${order.id}`);
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      //await deleteOrderAPI(orderId);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
    } catch (error) {
      console.error("Error deleting order:", error.message);
    }
  };

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...orders];

    // Filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (order) =>
          order.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];

      if (sortBy === "createdAt") {
        return sortOrder === "asc"
          ? new Date(valA) - new Date(valB)
          : new Date(valB) - new Date(valA);
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }

      return 0;
    });

    return filtered;
  }, [orders, searchTerm, sortBy, sortOrder]);

  return (
    <main className="font-roboto p-4 min-h-screen">
      {/* Header */}
      <div className="flex mb-4">
        <h1 className="font-urbanist font-bold text-2xl">Order Management</h1>
      </div>

      {/* Sort and Create */}
      <div className="flex flex-row justify-between mb-4">
        <div
          className="flex flex-row items-center space-x-2 font-urbanist font-bold"
        >
          <label>SORT BY</label>
          {/* <ChevronDown className="h-5 w-5" /> */}
          <select
            className="border rounded px-2 py-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="orderNumber">Order ID</option>
            <option value="contactName">Customer Name</option>
            <option value="createdAt">Order Date</option>
            <option value="orderStatus">Order Status</option>
          </select>

          <button
            onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
            className="text-sm underline"
          >
            {sortOrder.toUpperCase()}
          </button>
        </div>


        <div className="flex flex-row items-center space-x-2 font-urbanist font-bold">
          <label>SEARCH</label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Customer or Order ID"
            className="border px-2 py-1 rounded"
          />
          {/* <Search className="h-5 w-5" /> */}
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
      ) : filteredAndSortedOrders.length === 0 ? (
        <div className="text-center py-8 text-gray-500 font-urbanist col-span-6">
          No orders found.
        </div>
      ) : (
        filteredAndSortedOrders.map((order, index) => (
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
              <Trash2
                className="text-red-600 hover:text-red-800 cursor-pointer"
                onClick={() => handleDeleteOrder(order.id)}
              />
            </div>
          </div>
        ))
      )}
    </main>
  );
}
