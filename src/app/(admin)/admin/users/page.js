"use client";

import { ChevronDown, Search, Pencil, Trash2, SquarePen } from "lucide-react";

const users = [
  { id: "1", name: "John Doe", role: "Admin" },
  { id: "2", name: "Jane Smith", role: "User" },
  { id: "3", name: "Alice Johnson", role: "Seller" },
  { id: "4", name: "Bob Brown", role: "User" },
];

export default function AdminUsers() {
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
        <div>User name</div>
        <div>Role</div>
        <div>Action</div>
      </div>

      {/* Table Rows */}
      {users.map((user, index) => (
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
            <SquarePen className="text-gray-600 hover:text-primary cursor-pointer" />
            <Trash2 className="text-red-600 hover:text-red-800 cursor-pointer" />
          </div>
        </div>
      ))}
    </main>
  );
}
