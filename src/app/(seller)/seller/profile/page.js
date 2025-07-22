// "use client";

// import { useState } from "react";

// export default function SellerProfile() {
//   const [profile, setProfile] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phoneNumber: "",
//     address: "",
//     userName: "admin_user",
//     role: "Admin",
//     oldPassword: "",
//     newPassword: "",
//   });

//   const [error, setError] = useState(null); // ← Needed for password errors

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Updated profile:", profile);
//     // TODO: Send profile data to backend
//   };

//   const handleChangePassword = (e) => {
//     e.preventDefault();

//     if (!profile.oldPassword || !profile.newPassword) {
//       setError("Please fill in both password fields.");
//       return;
//     }

//     if (profile.newPassword.length < 6) {
//       setError("New password must be at least 6 characters.");
//       return;
//     }

//     // TODO: Send password update request to backend
//     console.log("Changing password...", {
//       oldPassword: profile.oldPassword,
//       newPassword: profile.newPassword,
//     });

//     // Reset fields
//     setProfile({
//       ...profile,
//       oldPassword: "",
//       newPassword: "",
//     });
//     setError(null);
//   };

//   return (
//     <>
//       <section className="font-roboto bg-[#F4F4F4] p-6 rounded-md mb-4">
//         <div className="flex mb-4">
//           <h1 className="font-urbanist font-bold text-2xl">
//             Personal Information
//           </h1>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Name Fields */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
//                 Firstname
//               </label>
//               <input
//                 type="text"
//                 id="firstName"
//                 className="input-field"
//                 placeholder="Enter your firstname"
//                 value={profile.firstName}
//                 onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
//               />
//             </div>

//             <div>
//               <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
//                 Lastname
//               </label>
//               <input
//                 type="text"
//                 id="lastName"
//                 className="input-field"
//                 placeholder="Enter your lastname"
//                 value={profile.lastName}
//                 onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
//               />
//             </div>
//           </div>

//           {/* Email and Phone */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 className="input-field"
//                 placeholder="Enter your email"
//                 value={profile.email}
//                 onChange={(e) => setProfile({ ...profile, email: e.target.value })}
//               />
//             </div>

//             <div>
//               <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
//                 Phone Number
//               </label>
//               <input
//                 type="tel"
//                 id="phoneNumber"
//                 className="input-field"
//                 placeholder="Enter your phone number"
//                 value={profile.phoneNumber}
//                 onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
//               />
//             </div>
//           </div>

//           {/* Address */}
//           <div>
//             <label htmlFor="address" className="block text-sm font-medium text-gray-700">
//               Address
//             </label>
//             <input
//               type="text"
//               id="address"
//               className="input-field"
//               placeholder="Enter your address"
//               value={profile.address}
//               onChange={(e) => setProfile({ ...profile, address: e.target.value })}
//             />
//           </div>

//           {/* Username (readonly) */}
//           <div>
//             <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
//               Username
//             </label>
//             <input
//               type="text"
//               id="userName"
//               className="input-field"
//               value={profile.userName}
//               readOnly
//             />
//           </div>

//           {/* Role (readonly) */}
//           <div>
//             <label htmlFor="role" className="block text-sm font-medium text-gray-700">
//               Role
//             </label>
//             <input
//               type="text"
//               id="role"
//               className="input-field"
//               value={profile.role}
//               readOnly
//             />
//           </div>

//           <div className="flex">
//             <button
//               type="submit"
//               className="w-full py-3 font-semibold text-white bg-[#6C7A84] rounded-lg hover:bg-[#4A5A64] transition duration-200"
//             >
//               Update Profile
//             </button>
//           </div>
//         </form>
//       </section>

//       {/* Change Password Section */}
//       <section className="font-roboto bg-[#F4F4F4] p-6 rounded-md">
//         <h1 className="font-urbanist text-2xl font-semibold text-primary text-center">
//           Change Password
//         </h1>

//         <form onSubmit={handleChangePassword} className="space-y-6">
//           {/* Old Password */}
//           <div className="font-roboto">
//             <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
//               Old Password
//             </label>
//             <input
//               type="password"
//               id="oldPassword"
//               className="input-field"
//               placeholder="Enter your old password"
//               value={profile.oldPassword}
//               onChange={(e) => {
//                 setProfile({ ...profile, oldPassword: e.target.value });
//                 setError(null);
//               }}
//             />
//           </div>

//           {/* New Password */}
//           <div className="font-roboto">
//             <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
//               New Password
//             </label>
//             <input
//               type="password"
//               id="newPassword"
//               className="input-field"
//               placeholder="Enter your new password"
//               value={profile.newPassword}
//               onChange={(e) => {
//                 setProfile({ ...profile, newPassword: e.target.value });
//                 setError(null);
//               }}
//             />
//           </div>

//           {/* Error Message */}
//           {error && <p className="text-red-500 text-sm">{error}</p>}

//           <div className="flex">
//             <button
//               type="submit"
//               className="w-full py-3 font-semibold text-white bg-[#6C7A84] rounded-lg hover:bg-[#4A5A64] transition duration-200"
//             >
//               Change Password
//             </button>
//           </div>
//         </form>
//       </section>
//     </>
//   );
// }
"use client"

import React, { useState, useEffect } from "react";
import useAuth from "@/app/hooks/useAuth";
import { updatePassword, updateUser } from "@/app/apis/auth.api";
import ChangePasswordForm from "@/app/components/profile/ChangePasswordForm";
import SellerProfileForm from "@/app/components/profile/SellerProfileForm";

export default function SellerProfile() {
  const { idToken, user, isAuthenticated, loading } = useAuth();
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

  const filteredOrders = () => {
  if (orderStatusFilter.toUpperCase() === "ALL") return orders;
  return orders.filter(
    (order) => order.orderStatus.toUpperCase() === orderStatusFilter.toUpperCase()
  );
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
        userRole: user.role || "Seller",
        storeName: user.storeName || "",
        storeDescription: user.storeDescription || "",
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
