"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SellerHeader() {
  const [isAuthorized, setAuthorized] = useState(true); // true for testing

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-[#F4F4F4] text-secondary font-urbanist border-b border-gray-300">
      {/* Left Logo */}
      <h1 className="text-4xl font-bold">Origity</h1>

      {/* Right Icons */}
      {isAuthorized ? (
        <div className="relative group">
          <User className="h-6 w-6 cursor-pointer hover:text-primary transition-colors" />

          {/* Dropdown shown on hover */}
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 font-bold rounded-lg shadow-md z-50 opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200">
            <Link href="/seller/profile">
              <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100">
                My Profile
              </button>
            </Link>

            <Link href="/seller/watermark">
              <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100">
                Watermark Image
              </button>
            </Link>

            <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100">
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <button className="text-primary font-medium hover:underline">
            Signup
          </button>
          <div className="w-px h-6 bg-gray-300"></div>
          <button className="text-secondary font-medium hover:underline">
            Login
          </button>
        </div>
      )}
    </header>
  );
}
