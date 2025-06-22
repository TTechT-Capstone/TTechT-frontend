"use client";

import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isAuthorized, setAuthorized] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      // Implement search functionality, e.g., navigate to a search results page
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <header className="relative flex items-center justify-between px-6 py-4 bg-white text-secondary font-urbanist border-b border-gray-200">
      {/* Title */}
      <h1 className="text-4xl font-bold font-urbanist">
        <Link href="/" className="hover:text-primary transition-colors">
          Origity
        </Link>
      </h1>

      {/* Right Icons */}
      <div className="absolute right-6 flex items-center space-x-4">
        {!isSearchOpen ? (
          <Search
            className="h-6 w-6 cursor-pointer hover:text-primary transition-colors"
            onClick={() => setSearchOpen(true)}
          />
        ) : (
          <div className="flex items-center rounded-md px-3 py-1 shadow-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent outline-none text-sm px-2"
            />
            <button
              onClick={handleSearch}
              className="text-primary font-medium hover:underline px-2"
            >
              Go
            </button>
            <X
              className="h-5 w-5 cursor-pointer text-gray-500 hover:text-primary transition-colors"
              onClick={() => {
                setSearchQuery("");
                setSearchOpen(false);
              }}
            />
          </div>
        )}

        <Link href="/cart">
          <ShoppingCart className="h-6 w-6 cursor-pointer hover:text-primary transition-colors" />
        </Link>

        {isAuthorized ? (
          <div className="relative group">
            <User className="h-6 w-6 cursor-pointer hover:text-primary transition-colors" />

            {/* Dropdown shown on hover */}
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 font-bold rounded-lg shadow-md z-50 opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200">
            <Link href="/profile">
              <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100">
                My Profile
              </button>
            </Link>

            <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100">
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
      </div>
    </header>
  );
}
