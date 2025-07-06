"use client";

import { useState } from "react";

export default function AdminProfile() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    userName: "admin_user",
    role: "Admin",
    oldPassword: "",
    newPassword: "",
  });

  const [error, setError] = useState(null); // ← Needed for password errors

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated profile:", profile);
    // TODO: Send profile data to backend
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (!profile.oldPassword || !profile.newPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (profile.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    // TODO: Send password update request to backend
    console.log("Changing password...", {
      oldPassword: profile.oldPassword,
      newPassword: profile.newPassword,
    });

    // Reset fields
    setProfile({
      ...profile,
      oldPassword: "",
      newPassword: "",
    });
    setError(null);
  };

  return (
    <>
      <section className="font-roboto bg-[#F4F4F4] p-6 rounded-md mb-4">
        <div className="flex mb-4">
          <h1 className="font-urbanist font-bold text-2xl">
            Personal Information
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Firstname
              </label>
              <input
                type="text"
                id="firstName"
                className="input-field"
                placeholder="Enter your firstname"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Lastname
              </label>
              <input
                type="text"
                id="lastName"
                className="input-field"
                placeholder="Enter your lastname"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              />
            </div>
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="input-field"
                placeholder="Enter your email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                className="input-field"
                placeholder="Enter your phone number"
                value={profile.phoneNumber}
                onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              className="input-field"
              placeholder="Enter your address"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            />
          </div>

          {/* Username (readonly) */}
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="userName"
              className="input-field"
              value={profile.userName}
              readOnly
            />
          </div>

          {/* Role (readonly) */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <input
              type="text"
              id="role"
              className="input-field"
              value={profile.role}
              readOnly
            />
          </div>

          <div className="flex">
            <button
              type="submit"
              className="w-full py-3 font-semibold text-white bg-[#6C7A84] rounded-lg hover:bg-[#4A5A64] transition duration-200"
            >
              Update Profile
            </button>
          </div>
        </form>
      </section>

      {/* Change Password Section */}
      <section className="font-roboto bg-[#F4F4F4] p-6 rounded-md">
        <h1 className="font-urbanist text-2xl font-semibold text-primary text-center">
          Change Password
        </h1>

        <form onSubmit={handleChangePassword} className="space-y-6">
          {/* Old Password */}
          <div className="font-roboto">
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
              Old Password
            </label>
            <input
              type="password"
              id="oldPassword"
              className="input-field"
              placeholder="Enter your old password"
              value={profile.oldPassword}
              onChange={(e) => {
                setProfile({ ...profile, oldPassword: e.target.value });
                setError(null);
              }}
            />
          </div>

          {/* New Password */}
          <div className="font-roboto">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="input-field"
              placeholder="Enter your new password"
              value={profile.newPassword}
              onChange={(e) => {
                setProfile({ ...profile, newPassword: e.target.value });
                setError(null);
              }}
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex">
            <button
              type="submit"
              className="w-full py-3 font-semibold text-white bg-[#6C7A84] rounded-lg hover:bg-[#4A5A64] transition duration-200"
            >
              Change Password
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
