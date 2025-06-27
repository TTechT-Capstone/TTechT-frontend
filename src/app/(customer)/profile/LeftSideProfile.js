"use client";

import { useRouter } from "next/navigation";
import { Package, User } from "lucide-react";
import useAuth from "@/app/hooks/useAuth";
import { useState } from "react";

export default function LeftSideProfile({ activeSection, setActiveSection }) {
  const router = useRouter();
  const { username, isAuthenticated, userRole, logout, loading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      setIsLoggingOut(true);
      logout();
      router.push("/");
      window.location.reload();
    }
  };

  return (
    <div className="left-side flex flex-col space-y-6 p-4">
      <div className="rounded-sm profile flex items-center space-x-4 bg-white p-4 shadow hover:shadow-lg">
        <div>
          <p className="font-roboto text-lg text-gray-500">Hi,</p>
          <h1 className="font-urbanist font-bold text-2xl text-gray-800">
            {loading ? "Loading..." : username}
          </h1>
        </div>
      </div>

      <div className="navigation flex flex-col space-y-4">
        <button
          onClick={() => setActiveSection(1)}
          className={`nav-item rounded-sm flex items-center space-x-4 p-4 px-6 w-full text-left transition-all duration-300 cursor-pointer 
            ${
              activeSection === 1
                ? "bg-[#4A5A64] text-white font-bold"
                : "bg-white text-secondary hover:bg-[#8E9BA4] hover:text-white font-bold"
            }`}
        >
          <User className="w-6 h-6 stroke-[2]" />
          <p className="font-urbanist text-lg">My Personal Information</p>
        </button>

        <button
          onClick={() => setActiveSection(2)}
          className={`nav-item rounded-sm flex items-center space-x-4 p-4 px-6 w-full text-left transition-all duration-300 cursor-pointer 
            ${
              activeSection === 2
                ? "bg-[#4A5A64] text-white font-bold"
                : "bg-white text-secondary hover:bg-[#8E9BA4] hover:text-white font-bold"
            }`}
        >
          <Package className="w-6 h-6 stroke-[2]" />
          <p className="font-urbanist text-lg">My Orders</p>
        </button>
      </div>

      <div className="flex justify-center items-center">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`nav-item w-full p-4 text-secondary bg-[#F7F7F7] rounded-sm font-roboto shadow ${
            isLoggingOut ? "bg-gray-300 cursor-not-allowed" : "hover:bg-gray-200"
          }`}
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
