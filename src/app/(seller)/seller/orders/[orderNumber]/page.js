"use client";
import React, { useState, useEffect } from "react";
import useAuth from "@/app/hooks/useAuth";
import EditOrder from "@/app/components/order/EditOrder";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { updateOrderStatusAPI, getOrderByIdAPI } from "@/app/apis/order.api";
import { useParams, useSearchParams } from "next/navigation";

export default function SellerEditOrder() {
  const { idToken, user, isAuthenticated, loading } = useAuth();
  const [order, setOrder] = useState({
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    deliveryAddress: "",
    orderNumber: "",
    promotionCode: "",
    orderStatus: "",
    createdAt: "",
    totalAmount: "",
    orderItems: [],
  });

  const params = useParams();
  const orderId = params.orderNumber;

  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrder, setLoadingOrder] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || !idToken) return;

      try {
        const response = await getOrderByIdAPI(orderId, idToken);
        //console.log(response.result);
        setOrder(response.result); 
      } catch (err) {
        setError("Failed to fetch order");
        console.error(err);
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrder();
  }, [orderId, idToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!order.contactEmail || !order.contactName || !order.deliveryAddress) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!user || !user.id) {
      alert("User not found or not authenticated.");
      return;
    }

    try {
      await updateOrderStatusAPI(order.id, order.orderStatus);

      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert(error.message || "Failed to update order status.");
    }
  };

  return (
    <main className="min-h-screen p-8 font-roboto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Edit Order</h1>
        <Link href="/seller/orders">
          <div className="flex items-center text-secondary cursor-pointer text-sm hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to order list
          </div>
        </Link>
      </div>
      <EditOrder
        order={order}
        setOrder={setOrder}
        handleSubmit={handleSubmit}
        loadingOrder={loadingOrder}
      />
    </main>
  );
}
