"use client";
import React, { useState, useEffect } from "react";
import useAuth from "@/app/hooks/useAuth";
import { updatePassword, updateUser } from "@/app/apis/auth.api";
import ProfileForm from "@/app/components/profile/ProfileForm";
import ChangePasswordForm from "@/app/components/profile/ChangePasswordForm";

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

  return (
    <div className="p-4 mb-8 max-w-6xl mx-auto">
        <>
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
