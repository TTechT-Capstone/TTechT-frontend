"use client";
import { Eye, EyeClosed } from "lucide-react";
import React, { useState } from "react";


export default function ChangePasswordForm({ profile, setProfile, error, handleChangePassword }) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  return (
    <div className="mt-5 w-full bg-white shadow-xl p-6 space-y-6 rounded-lg mx-auto">
      <h1 className="font-urbanist text-2xl font-semibold text-primary text-center">
        Change Password
      </h1>
      <form onSubmit={handleChangePassword} className="space-y-6">
        {/* Old Password */}
        <div className="relative">
          <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Old Password
          </label>
          <input
            type={showOldPassword ? "text" : "password"}
            id="oldPassword"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 transition pr-10"
            placeholder="Enter your old password"
            value={profile.oldPassword}
            onChange={(e) => {
              setProfile({ ...profile, oldPassword: e.target.value });
            }}
          />
          <button
            type="button"
            onClick={() => setShowOldPassword(!showOldPassword)}
            className="absolute right-3 top-10 text-gray-500 hover:text-primary focus:outline-none"
            aria-label={showOldPassword ? "Hide old password" : "Show old password"}
          >
            {showOldPassword ? <EyeClosed /> : <Eye />}
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 transition pr-10"
            placeholder="Enter your new password"
            value={profile.newPassword}
            onChange={(e) => {
              setProfile({ ...profile, newPassword: e.target.value });
            }}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-10 text-gray-500 hover:text-primary focus:outline-none"
            aria-label={showNewPassword ? "Hide new password" : "Show new password"}
          >
            {showNewPassword ? <EyeClosed /> : <Eye />}
          </button>
        </div>

        {/* Confirm New Password */}
        <div className="relative">
          <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type={showConfirmNewPassword ? "text" : "password"}
            id="confirmNewPassword"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 transition pr-10"
            placeholder="Enter your new password"
            value={profile.confirmNewPassword}
            onChange={(e) => {
              setProfile({ ...profile, confirmNewPassword: e.target.value });
            }}
          />
          <button
            type="button"
            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
            className="absolute right-3 top-10 text-gray-500 hover:text-primary focus:outline-none"
            aria-label={showConfirmNewPassword ? "Hide confirm new password" : "Show confirm new password"}
          >
            {showConfirmNewPassword ? <EyeClosed /> : <Eye />}
          </button>
        </div>

        {/* Display Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 font-semibold text-white bg-[#6C7A84] rounded-lg hover:bg-[#4A5A64] transition duration-200"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}
