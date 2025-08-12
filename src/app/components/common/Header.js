"use client";

import useAuth from "@/app/hooks/useAuth";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import { getAllCategoriesAPI } from "@/app/apis/category.api";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isSearchAnimating, setSearchAnimating] = useState(false);
  const [isMenuAnimating, setMenuAnimating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategoriesAPI(0, 100);
        setCategories(res);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    router.push(`/products/category/${categoryId}`);
  };

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

  const openMenu = () => {
    setMenuOpen(true);
  };

  // Close drawer: animate + unmount after delay
  const closeSearch = () => {
    setSearchAnimating(false);
    setTimeout(() => {
      setSearchOpen(false);
    }, 300); // animation duration
  };

  const closeMenu = () => {
    setMenuAnimating(false);
    setTimeout(() => {
      setMenuOpen(false);
    }, 300); // animation duration
  };

  // When drawer mounts, trigger animation in next frame
  useEffect(() => {
    if (isSearchOpen) {
      requestAnimationFrame(() => {
        setSearchAnimating(true);
      });
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      requestAnimationFrame(() => {
        setMenuAnimating(true);
      });
    }
  }, [isMenuOpen]);

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      const encoded = encodeURIComponent(searchQuery.trim());
      router.push(`/search?query=${encoded}`);
      closeSearch();
    }
  };

  return (
    <header className="fixed top-0 w-full z-100">
      <div className="relative flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 bg-white text-secondary font-inter border-b border-gray-200">
        <h1 className="text-2xl sm:text-4xl font-bold font-playfair">
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
                <Link href="/user/account/profile">
                  <User className="h-6 w-6 cursor-pointer hover:text-primary transition-colors" />
                </Link>

                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 font-bold rounded-lg shadow-md z-50 opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200">
                  <Link href="/user/account/profile">
                    <button className="w-full px-4 py-2 text-xs sm:text-sm text-left hover:bg-gray-100">
                      My Profile
                    </button>
                  </Link>

                  <button
                    onClick={logoutAccount}
                    className="w-full px-4 py-2 text-xs sm:text-sm text-left hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/auth/signup">
                <button className="text-primary text-xs sm:text-sm font-regular hover:underline">
                  Signup
                </button>
              </Link>
              <div className="w-px h-6 bg-gray-300"></div>
              <Link href="/auth/login">
                <button className="text-secondary text-xs sm:text-sm font-regular hover:underline">
                  Login
                </button>
              </Link>
            </div>
          )}

          {pathname !== "/" && (
            <Menu
              className="h-6 w-6 cursor-pointer hover:text-primary transition-colors"
              onClick={openMenu}
            />
          )}
        </div>
      </div>

      {isSearchOpen && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
              isSearchAnimating ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={closeSearch}
          ></div>

          {/* Drawer */}
          <div
            className={`fixed inset-y-0 right-0 w-full sm:w-1/3 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
              isSearchAnimating ? "translate-x-0" : "translate-x-full"
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

      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
              isMenuAnimating ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={closeMenu}
          ></div>

          {/* Drawer */}
          <div
            className={`fixed inset-y-0 right-0 w-full sm:w-1/3 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
              isMenuAnimating ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-end p-4">
              <X
                className="h-6 w-6 cursor-pointer text-gray-500 hover:text-primary transition-colors"
                onClick={() => {
                  closeMenu();
                }}
              />
            </div>

            <div className="p-4 space-y-3">
              {categories.map((cat) => (
                <button
                  key={cat.categoryId}
                  className="px-4 py-2 w-full text-left font-inter text-black hover:text-gray-400 transition-colors"
                  onClick={() => {
                    handleCategoryClick(cat.categoryId);
                    closeMenu();
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
