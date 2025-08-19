"use client";

import { getUserByIdAPI } from "@/app/apis/user.api";
import Loading from "@/app/components/common/Loading";
import ChangePasswordForm from "@/app/components/profile/ChangePasswordForm";
import useAuth from "@/app/hooks/useAuth";
import { useEffect, useState } from "react";

export default function AdminProfile() {
  const { idToken, user, isAuthenticated, loading } = useAuth();
  const [profile, setProfile] = useState({
    username: "",
    role: ""
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      if (!user || !user.id) return;
      try {
        const response = await getUserByIdAPI(user.id);
        setProfile({
          username: response.result.username || "",
          role: response.result.roles?.[0]?.name || "",
        });
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchAdmin();
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated profile:", profile);
    // TODO: Send profile data to backend
  };

  if (loadingProfile) {
    return <Loading />;
  }

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
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="userName"
                className="input-field"
                value={profile.username}
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
    </>
  );
}
