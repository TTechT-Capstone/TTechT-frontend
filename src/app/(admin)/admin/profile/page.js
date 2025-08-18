"use client";

import ChangePasswordForm from "@/app/components/profile/ChangePasswordForm";
import { useState } from "react";

export default function AdminProfile() {
  const [profile, setProfile] = useState({
    userName: "admin_user",
    role: "Admin",
    oldPassword: "",
    newPassword: "",
  });

  const [error, setError] = useState(null);

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
      <section className="font-inter bg-white p-6 rounded-lg shadow-xl mb-4">
        <div className="flex mb-4">
          <h1 className="font-playfair font-bold text-2xl">
            Personal Information
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username (readonly) */}
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-700"
              >
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
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
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
          </div>
        </form>
      </section>

      {/* Change Password Section */}
      <section className="font-inter mt-6 rounded-md">
        <ChangePasswordForm
          profile={profile}
          setProfile={setProfile}
          error={error}
          handleChangePassword={handleChangePassword}
        />
      </section>
    </>
  );
}
