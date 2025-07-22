"use client";

import React, { useEffect, useState } from "react";
import { getAllUsersAPI } from "@/app/apis/user.api";
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ChevronDown, Search, Pencil, Trash2, SquarePen } from "lucide-react";

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { idToken, user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!idToken) return;
        const data = await getAllUsersAPI(idToken);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [idToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleEditUser = (user) => {
    router.push(`/admin/users/${user.id}`);
  };
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      // await deleteUserAPI(userId); // Uncomment when delete API is implemented
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };  

  return (
    <main className="font-roboto p-4 min-h-screen">
      {/* Header */}
      <div className="flex flex-row justify-between mb-4">
        <h1 className="font-urbanist font-bold text-2xl">User Management</h1>

        <button className="bg-secondary text-white px-4 py-2 rounded-md font-urbanist font-bold">
          Create new user
        </button>
      </div>

      {/* Sort and Create */}
      <div className="flex flex-row justify-between mb-4">
        <div className="flex flex-row items-center space-x-2 font-urbanist font-bold">
          <span>SORT BY</span>
          <ChevronDown className="h-5 w-5" />
        </div>

        <div className="flex flex-row items-center space-x-2 font-urbanist font-bold">
          <span>SEARCH</span>
          <Search className="h-5 w-5" />
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 justify-items-center font-urbanist font-bold bg-gray-100 px-4 py-3 rounded-t-lg">
        <div>User ID</div>
        <div>Username</div>
        <div>Role</div>
        <div>Action</div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500 font-urbanist col-span-6">
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8 text-gray-500 font-urbanist col-span-6">
          No users found.
        </div>
      ) : (
        users.map((user, index) => (
          <div
            key={index}
            className={`grid grid-cols-4 justify-items-center items-center px-4 py-3 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            }`}
          >
            <div className="font-medium">{user.id}</div>
            <div>{user.name}</div>
            <div>{user.role}</div>

            <div className="flex space-x-3">
              <SquarePen
                className="text-gray-600 hover:text-primary cursor-pointer"
                onClick={() => handleEditUser(user)}
              />
              <Trash2
                className="text-red-600 hover:text-red-800 cursor-pointer"
                onClick={() => handleDeleteUser(user.id)}
              />
            </div>
          </div>
        ))
      )}
    </main>
  );
}
