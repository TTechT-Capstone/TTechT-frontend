
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getAllUsersAPI } from "@/app/apis/user.api";
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ChevronDown, Search, Pencil, Trash2, SquarePen } from "lucide-react";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import Loading from "@/app/components/common/Loading";

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { idToken, user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortUser, setSortUser] = useState("desc");
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!idToken) return;
        const data = await getAllUsersAPI(idToken);
        //console.log("Fetched users:", data);
        setUsers(data.result);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [idToken]);

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = [...users];

    // 🔍 Filter by id or username
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          String(u.id).toLowerCase().includes(term) ||
          u.username.toLowerCase().includes(term)
      );
    }

    // 🔽 Sort
    filtered.sort((a, b) => {
      // Special case: role
      if (sortBy === "role") {
        const roleA = a.roles?.[0]?.name || "";
        const roleB = b.roles?.[0]?.name || "";
        return sortUser === "asc"
          ? roleA.localeCompare(roleB)
          : roleB.localeCompare(roleA);
      }

      const valA = a[sortBy];
      const valB = b[sortBy];

      if (sortBy === "createdAt") {
        return sortUser === "asc"
          ? new Date(valA) - new Date(valB)
          : new Date(valB) - new Date(valA);
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return sortUser === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return sortUser === "asc" ? valA - valB : valB - valA;
      }

      return 0;
    });

    return filtered;
  }, [users, searchTerm, sortBy, sortUser]);

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

  if (loading) {
    return <Loading />;
  }

  return !isMobile ? (
    <main className="font-inter p-4 min-h-screen">
      {/* Header */}
      <div className="flex flex-row justify-between mb-4">
        <h1 className="font-playfair font-bold text-xl sm:text-2xl">
          User Management
        </h1>

        {/* <button className="bg-secondary text-white px-4 py-2 rounded-md font-inter text-xs sm:text-sm font-semibold">
          Create new user
        </button> */}
      </div>

      {/* Sort and Create */}
      <div className="flex flex-row justify-between mb-4">
        <div className="flex flex-row items-center space-x-2 font-inter font-semibold">
          <label>SORT BY</label>
          {/* <ChevronDown className="h-5 w-5" /> */}
          <select
            className="border rounded px-2 py-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="id">User ID</option>
            <option value="username">User Name</option>
            <option value="role">Role</option>
          </select>

          <button
            onClick={() =>
              setSortUser((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="text-sm underline"
          >
            {sortUser.toUpperCase()}
          </button>
        </div>

        <div className="flex flex-row items-center space-x-2 font-inter font-semibold">
          <label>SEARCH</label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Username or UserID"
            className="border px-2 py-1 rounded"
          />
          {/* <Search className="h-5 w-5" /> */}
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
        filteredAndSortedUsers.map((user, index) => (
          <div
            key={index}
            className={`grid grid-cols-4 justify-items-center items-center text-xs sm:text-sm px-4 py-3 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            }`}
          >
            <div className="font-medium">{user.id}</div>
            <div>{user.username}</div>
            <div>{user.roles[0]?.name}</div>

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
  ):(
    <main className="font-inter p-4 min-h-screen">
      {/* Header */}
      <div className="flex flex-row justify-between mb-4">
        <h1 className="font-playfair font-bold text-xl sm:text-2xl">
          User Management
        </h1>

        {/* <button className="bg-secondary text-white px-4 py-2 rounded-md font-inter text-xs sm:text-sm font-semibold">
          Create new user
        </button> */}
      </div>

      {/* Sort and Create */}
      <div className="flex flex-col space-y-3 text-xs mb-4">
        <div className="flex flex-row items-center space-x-2 font-inter font-semibold">
          <label>SORT BY</label>
          {/* <ChevronDown className="h-5 w-5" /> */}
          <select
            className="border rounded px-2 py-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="id">User ID</option>
            <option value="username">User Name</option>
            <option value="role">Role</option>
          </select>

          <button
            onClick={() =>
              setSortUser((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="text-sm underline"
          >
            {sortUser.toUpperCase()}
          </button>
        </div>

        <div className="flex flex-row items-center space-x-2 font-inter font-semibold">
          <label>SEARCH</label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Username or UserID"
            className="border px-2 py-1 rounded"
          />
          {/* <Search className="h-5 w-5" /> */}
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
        filteredAndSortedUsers.map((user, index) => (
          <div
            key={index}
            className={`grid grid-cols-4 justify-items-center items-center text-xs sm:text-sm px-4 py-3 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            }`}
          >
            <div className="font-medium">{user.id}</div>
            <div className="break-all">{user.username}</div>
            <div>{user.roles[0]?.name}</div>

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
