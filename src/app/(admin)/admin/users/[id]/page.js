"use client";
import React, { useState, useEffect } from "react";
import useAuth from "@/app/hooks/useAuth";
import EditOrder from "@/app/components/order/EditOrder";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { updateOrderStatusAPI, getOrderByIdAPI } from "@/app/apis/order.api";
import { useParams, useSearchParams } from "next/navigation";
import { getUserByIdAPI } from "@/app/apis/user.api";
import { updateUser } from "@/app/apis/auth.api";
import EditUser from "@/app/components/profile/EditUser";

export default function AdminEditUser() {
  const { idToken, user, isAuthenticated, loading } = useAuth();

    const [users, setUsers] = useState({
    name: "",
    email: "",
    role: "",
    id: "",
    });

  const params = useParams();
  const userId = params.id;

  const [error, setError] = useState(null);
  //const [users, setUsers] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId || !idToken) return;

      try {
        const response = await getUserByIdAPI(userId, idToken);
        //console.log(response.result);
        setUsers(response.result);
      } catch (err) {
        setError("Failed to fetch user");
        console.error(err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [userId, idToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!users.name || !users.email || !users.role) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!users || !user.id) {
      alert("User not found or not authenticated.");
      return;
    }

    try {
      await updateUser(users.id, users, idToken);

      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert(error.message || "Failed to update user.");
    }
  };

  return (
    <main className="min-h-screen p-8 font-roboto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Edit User</h1>
        <Link href="/admin/users">
          <div className="flex items-center text-secondary cursor-pointer text-sm hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to user list
          </div>
        </Link>
      </div>
      <EditUser
        users={users}
        setUsers={setUsers}
        handleSubmit={handleSubmit}
        loadingUser={loadingUser}
      />
    </main>
  );
}
