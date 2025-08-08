"use client";

import useAuth from "@/app/hooks/useAuth";
import { Search, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const logoutAccount = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  // Open drawer: mount + animate
  const openSearch = () => {
    setSearchOpen(true);
  };

  // Close drawer: animate + unmount after delay
  const closeSearch = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setSearchOpen(false);
    }, 300); // animation duration
  };

  // When drawer mounts, trigger animation in next frame
  useEffect(() => {
    if (isSearchOpen) {
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    }
  }, [isSearchOpen]);

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      const encoded = encodeURIComponent(searchQuery.trim());
      router.push(`/search?query=${encoded}`);
      closeSearch();
    }
  };

  return (
    <>
      <header className="relative flex items-center justify-between px-6 py-4 bg-white text-secondary font-urbanist border-b border-gray-200">
        <h1 className="text-4xl font-bold font-urbanist">
          <Link href="/" className="hover:text-primary transition-colors">
            Origity
          </Link>
        </h1>

        <div className="absolute right-6 flex items-center space-x-4">
          <Search
            className="h-6 w-6 cursor-pointer hover:text-primary transition-colors"
            onClick={openSearch}
          />

          {isAuthenticated ? (
            <>
              <Link href="/cart">
                <ShoppingCart className="h-6 w-6 cursor-pointer hover:text-primary transition-colors" />
              </Link>

              <div className="relative group">
                <User className="h-6 w-6 cursor-pointer hover:text-primary transition-colors" />

                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 font-bold rounded-lg shadow-md z-50 opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200">
                  <Link href="/user/account/profile">
                    <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100">
                      My Profile
                    </button>
                  </Link>

                  <button
                    onClick={logoutAccount}
                    className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
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

      {isSearchOpen && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
              isAnimating ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={closeSearch}
          ></div>

          {/* Drawer */}
          <div
            className={`fixed inset-y-0 right-0 w-full sm:w-1/3 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
              isAnimating ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center p-4 border-b border-gray-200">
              <Search className="h-5 w-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search..."
                className="flex-1 px-3 outline-none text-gray-800"
                autoFocus
              />
              <X
                className="h-6 w-6 cursor-pointer text-gray-500 hover:text-primary transition-colors"
                onClick={() => {
                  setSearchQuery("");
                  closeSearch();
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
