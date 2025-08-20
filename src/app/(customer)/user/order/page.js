"use client";
import React, { useState, useEffect } from "react";
import useAuth from "@/app/hooks/useAuth";
import { getOrdersByUserIdAPI, getOrderByIdAPI, cancelOrderAPI } from "@/app/apis/order.api";
import OrdersSection from "@/app/components/order/OrderSection";
import CancelOrderModal from "@/app/components/order/CancelOrderModal";

export default function MyOrder() {
  const { idToken, user, isAuthenticated, loading } = useAuth();
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL");

  const filteredOrders = () => {
    if (orderStatusFilter.toUpperCase() === "ALL") return orders;
    return orders.filter(
      (order) =>
        order.orderStatus.toUpperCase() === orderStatusFilter.toUpperCase()
    );
  };

  useEffect(() => {
    if (!idToken || !user?.id) return;

    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const data = await getOrdersByUserIdAPI(user.id);
        setOrders(data.result || []);
        //console.log(data);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [idToken, user?.id]);

  const handleCancelOrder = async (orderId) => {
    if (!cancelReason) {
      alert("Please provide a reason for canceling the order.");
      return;
    }

    try {
      await cancelOrderAPI(user.id, orderId, cancelReason);
      //alert("Order canceled successfully!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
      setIsCancelModalOpen(false); // Close the modal after successful cancellation
      setCancelReason(""); // Reset the reason
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Failed to cancel order. Please try again later.");
    }
  };

  const handleOrderClick = async (orderId) => {
    if (selectedOrderId === orderId) {
      setSelectedOrderId(null);
      setOrderDetails(null);
    } else {
      try {
        const details = await getOrderByIdAPI(orderId);
        //console.log("Fetched order details:", details);

        const orderItems = details?.result?.orderItems || [];
        //console.log("Order Items:", orderItems);

        setOrderDetails(details.result);
        setSelectedOrderId(orderId);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    }
  };

  return (
    <div className="p-4 mb-8 max-w-6xl mx-auto">
      <OrdersSection
        orders={orders}
        loadingOrders={loadingOrders}
        selectedOrderId={selectedOrderId}
        orderDetails={orderDetails}
        orderStatusFilter={orderStatusFilter}
        setOrderStatusFilter={setOrderStatusFilter}
        handleOrderClick={handleOrderClick}
        setIsCancelModalOpen={setIsCancelModalOpen}
        setSelectedOrderId={setSelectedOrderId}
        filteredOrders={filteredOrders}
      />
      {/* {isCancelModalOpen && renderCancelModal()} */}
      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        selectedOrderId={selectedOrderId}
        onConfirm={handleCancelOrder}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
      />
    </div>
  );
}
