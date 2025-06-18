"use client";

import { User } from "lucide-react";
import { useState } from "react";

export default function AdminHeader() {
  const [isAuthorized, setAuthorized] = useState(false);

  return (
    <header className="relative flex items-center px-6 py-4 bg-[F4F4F4] text-secondary font-urbanist">
      {/* Title */}
      <h1 className="text-4xl font-bold font-urbanist mx-auto">Origity</h1>

      {/* Right Icons */}
      <div className="absolute right-6 flex items-center space-x-4">
        {isAuthorized ? (
          // Display User Icon when authorized
          <User className="h-6 w-6 cursor-pointer hover:text-primary transition-colors" />
        ) : (
          // Display Signup/Login buttons when not authorized
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
      </div>
    </header>

  );
}
