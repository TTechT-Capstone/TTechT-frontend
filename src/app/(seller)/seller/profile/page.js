"use client"

import React, { useState, useEffect } from "react";
import useAuth from "@/app/hooks/useAuth";
import { updatePassword, updateUser } from "@/app/apis/auth.api";
import ChangePasswordForm from "@/app/components/profile/ChangePasswordForm";
import SellerProfileForm from "@/app/components/profile/SellerProfileForm";
import { getSellerByUserId } from "@/app/apis/seller.api";

export default function SellerProfile() {
  const { idToken, user, isAuthenticated, loading } = useAuth();
  const [seller, setSeller] = useState(null);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phoneNumber: "",
    userName: "",
    userRole: "",
    storeName: "",
    storeDescription: "",
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
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL");

  useEffect(() => {
  const fetchSeller = async () => {
    if (!user || !user.id) return;

    try {
      const sellerData = await getSellerByUserId(user.id);
      console.log("Seller data fetched:", sellerData);
      setSeller(sellerData);
    } catch (err) {
      console.error("Failed to fetch seller profile:", err);
    }
  };

  fetchSeller();
}, [user]);


  const filteredOrders = () => {
  if (orderStatusFilter.toUpperCase() === "ALL") return orders;
  return orders.filter(
    (order) => order.orderStatus.toUpperCase() === orderStatusFilter.toUpperCase()
  );
};


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?\d{10,15}$/;

  const validatePhone = () => {
    if (!phoneRegex.test(profile.phoneNumber.replace(/[-\s]/g, ""))) {
      setError("Please enter a valid phone number.");
      return false;
    }
    return true;
  };

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
      await updatePassword(user.id, {
        oldPassword: profile.oldPassword,
        newPassword: profile.newPassword,
        confirmNewPassword: profile.confirmNewPassword,
      });

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
        error?.response?.data?.message || // e.g. { message: "Old password is incorrect" }
        error?.response?.data?.error || // fallback key
        JSON.stringify(error?.response?.data) || // whole response if structure is unknown
        error.message || // JS error fallback
        "An unexpected error occurred.";

      alert(`❌ Failed to change password:\n${detailedMessage}`);
    }
  };

  useEffect(() => {
    if (seller) {
      setProfile((prev) => ({
        ...prev,
        firstName: seller.firstName,
        lastName: seller.lastName,
        email: seller.email,
        address: seller.address || "",
        phoneNumber: seller.phoneNumber,
        userName: seller.username,
        userRole: seller.role || "Seller",
        storeName: seller.storeName || "",
        storeDescription: seller.storeDescription || "",
      }));
      setLoadingProfile(false);
    }
  }, [seller]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile.email || !profile.firstName || !profile.lastName) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!validateEmail()) return;
    if (!validatePhone()) return;
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
        storeName: profile.storeName,
        storeDescription: profile.storeDescription,
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.message || "Failed to update profile.");
    }
  };

  return (
    <div className="p-4 mb-8 max-w-6xl mx-auto">
        <>
          <SellerProfileForm
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
    </div>
  );
}
