"use client";

import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isAuthorized, setAuthorized] = useState(false);

  return (
    <header className="relative flex items-center px-6 py-4 bg-white text-secondary font-urbanist">
      {/* Menu Icon */}
      <div className="absolute left-6 flex items-center">
        <Menu className="h-6 w-6 cursor-pointer hover:text-primary transition-colors" />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold font-urbanist mx-auto">Origity</h1>

      {/* Right Icons */}
      <div className="absolute right-6 flex items-center space-x-4">
        <Search className="h-6 w-6 cursor-pointer hover:text-primary transition-colors" />
        <ShoppingCart className="h-6 w-6 cursor-pointer hover:text-primary transition-colors" />

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
