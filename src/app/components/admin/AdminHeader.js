"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useAuth from "@/app/hooks/useAuth";

export default function AdminHeader() {
  const [isAuthorized, setAuthorized] = useState(false); 
  const { username, isAuthenticated, userRole, logout, loading } = useAuth();


  return (
    <header className="flex justify-between items-center px-6 py-4 bg-[#F4F4F4] text-secondary font-urbanist border-b border-gray-300">
      {/* Left Logo */}
      <Link href="/admin">
      <h1 className="text-4xl font-bold">Origity</h1>
      </Link>
      

      {/* Right Icons */}
      {isAuthorized ? (
        <div className="relative group">
          <User className="h-6 w-6 cursor-pointer hover:text-primary transition-colors" />

          {/* Dropdown shown on hover */}
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 font-bold rounded-lg shadow-md z-50 opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200">
            <Link href="/admin/profile">
              <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100">
                My Profile
              </button>
            </Link>

            <button 
              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
              onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
            <Link href="/auth/signup">
              <button className="text-primary font-medium hover:underline">
                Signup
              </button>
            </Link>
            <div className="w-px h-6 bg-gray-300"></div>
            <Link href="/auth/login">
              <button className="text-secondary font-medium hover:underline">
                Login
              </button>
            </Link>
          </div>
      )}
    </header>
  );
}
