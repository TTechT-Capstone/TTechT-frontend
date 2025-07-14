import React, { useState, useEffect } from "react";
import useAuth from "@/app/hooks/useAuth";
import { updatePassword, updateUser } from "@/app/apis/auth.api";
import { getOrdersByUserIdAPI } from "@/app/apis/order.api";
import ProfileForm from "@/app/components/profile/ProfileForm";
import ChangePasswordForm from "@/app/components/profile/ChangePasswordForm";
import OrdersSection from "@/app/components/order/OrderSection";
import CancelOrderModal from "@/app/components/order/CancelOrderModal";

export default function RightSide({ activeSection }) {
  const { idToken, user, isAuthenticated, loading } = useAuth();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phoneNumber: "",
    userName: "",
    oldPassword: "",
    newPassword: "", 
    confirmNewPassword: "", 
  });
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all"); 

  const filteredOrders = () => {
    if (orderStatusFilter === "all") {
      return orders; 
    }
    return orders.filter((order) => order.status === orderStatusFilter); // Filter by selected status
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateEmail = () => {
    if (!emailRegex.test(profile.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    const passwordErrorMessage =
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.";

      const { oldPassword, newPassword, confirmNewPassword } = profile;
    
      // Validate new password
    if (profile.newPassword && !isValidPassword(profile.newPassword)) {
      setError(passwordErrorMessage);
      return false;
    }

    // Check if confirmNewPassword matches newPassword
  if (newPassword !== confirmNewPassword) {
    setError("New password and confirmation do not match.");
    return false;
  }

  // Check if newPassword is the same as oldPassword
  if (oldPassword === newPassword) {
    setError("New password must be different from old password.");
    return false;
  }

    // Clear error if the new password is valid
    setError(null);
    return true;
  };
  
const handleChangePassword = async (e) => {
  e.preventDefault();

  // Validate new password input rules
  if (!validatePassword()) return;

  try {
    await updatePassword(
      user.id,
      {
        oldPassword: profile.oldPassword,
        newPassword: profile.newPassword,
        confirmNewPassword: profile.confirmNewPassword,
      }
    );

    alert("✅ Password updated successfully!");

    // Clear form after success
    setProfile((prevProfile) => ({
      ...prevProfile,
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    }));
  } catch (error) {
    // Print full error to console
    console.error("❌ Error changing password:", error);

    // Extract a detailed error message
    const detailedMessage =
      error?.response?.data?.message ||   // e.g. { message: "Old password is incorrect" }
      error?.response?.data?.error ||     // fallback key
      JSON.stringify(error?.response?.data) || // whole response if structure is unknown
      error.message ||                    // JS error fallback
      "An unexpected error occurred.";

    alert(`❌ Failed to change password:\n${detailedMessage}`);
  }
};


  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        address: user.address || "",
        phoneNumber: user.phoneNumber,
        userName: user.username,
      }));
      setLoadingProfile(false);
    }
  }, [user]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile.email || !profile.firstName || !profile.lastName) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!validateEmail()) return;
    if (!user || !user.id) {
      alert("User not found or not authenticated.");
      return;
    }

    try {
      const updatedProfile = await updateUser(user.id, {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        address: profile.address,
        phoneNumber: profile.phoneNumber,
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.message || "Failed to update profile.");
    }
  };

  useEffect(() => {
      if (activeSection === 2 && idToken) {
          const fetchOrders = async () => {
              setLoadingOrders(true);
              try {
                  const data = await getOrdersByUserIdAPI(user.id);
                  console.log("Fetched orders:", data.result);
                  setOrders(data.result);
              } catch (error) {
                  console.error('Error fetching orders:', error);
                  setOrders([]);
              } finally {
                  setLoadingOrders(false);
              }
          };

          fetchOrders();
      }
  }, [activeSection, idToken]);

  const handleCancelOrder = async (orderId) => {
    if (!cancelReason) {
      alert("Please provide a reason for canceling the order.");
      return;
    }

    try {
      await cancelOrderAPI(orderId, cancelReason);
      alert("Order canceled successfully!");
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

  // const renderOrderFilter = () => (
  //   <div className="mb-4">
  //     <label
  //       htmlFor="orderStatus"
  //       className="block text-sm font-medium text-gray-700"
  //     >
  //       Filter by Order Status:
  //     </label>
  //     <select
  //       id="orderStatus"
  //       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
  //       value={orderStatusFilter}
  //       onChange={(e) => setOrderStatusFilter(e.target.value)}
  //     >
  //       <option value="all">All Orders</option>
  //       <option value="new">New</option>
  //       <option value="completed">Completed</option>
  //       <option value="rejected">Rejected</option>
  //       <option value="cancelled">Cancelled</option>
  //     </select>
  //   </div>
  // );

  const handleOrderClick = async (orderId) => {
    if (selectedOrderId === orderId) {
      setSelectedOrderId(null);
      setOrderDetails(null);
    } else {
      try {
        const details = await getOrderDetailAPI(orderId);
        setOrderDetails(details);
        setSelectedOrderId(orderId);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    }
  };

  // const renderCancelModal = () => (
  //   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
  //     <div className="bg-white p-6 rounded-lg shadow-lg">
  //       <h2 className="text-lg font-semibold mb-4">Cancel Order</h2>
  //       <p>Please provide a reason for canceling the order:</p>
  //       <textarea
  //         className="w-full border border-gray-300 rounded-lg p-2 mt-2"
  //         rows="4"
  //         value={cancelReason}
  //         onChange={(e) => setCancelReason(e.target.value)}
  //         placeholder="Enter your reason here..."
  //       />
  //       <div className="flex justify-end mt-4">
  //         <button
  //           onClick={() => setIsCancelModalOpen(false)}
  //           className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
  //         >
  //           Cancel
  //         </button>
  //         <button
  //           onClick={() => handleCancelOrder(selectedOrderId)}
  //           className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
  //         >
  //           Confirm Cancel
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="p-4 mb-8 max-w-6xl mx-auto">
      {activeSection === 1 && (
        <>
          <ProfileForm
            profile={profile}
            setProfile={setProfile}
            handleSubmit={handleSubmit}
            loadingProfile={loadingProfile}
          />
          <ChangePasswordForm
            profile={profile}
            setProfile={setProfile}
            error={error}
            handleChangePassword={handleChangePassword}
          />
        </>
      )}
      {activeSection === 2 && (
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
      )}
      {/* {isCancelModalOpen && renderCancelModal()} */}
      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelOrder}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
      />
    </div>
  );
}
