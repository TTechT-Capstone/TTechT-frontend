"use client";

import { useRouter, usePathname } from "next/navigation";
import { Box, ShoppingCart, Ticket, User, X } from "lucide-react";
import useAuth from "@/app/hooks/useAuth";

const sidebarItems = [
  { icon: User, label: "My Profile", path: "/seller/profile" },
  { icon: ShoppingCart, label: "Product Management", path: "/seller/products" },
  { icon: Box, label: "Order Management", path: "/seller/orders" },
  // { icon: Ticket, label: "Promotion Codes", path: "/seller/promotion-codes" },
];

export default function SellerSidebarMobile({ open, onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const { username, logout, loading } = useAuth();

  const handleNavigation = (path) => {
    router.push(path);
    onClose();
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

  return (
    <div className="font-inter">
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-[100]" onClick={onClose} />
      )}

      {/* Bottom Sheet Drawer */}
      <aside
        className={`fixed bottom-0 left-0 w-full bg-[#F4F4F4] shadow-sm px-6 py-8 flex flex-col border-t border-gray-200 font-urbanist z-[150] transform transition-transform duration-300 max-h-[80vh] overflow-y-auto
        ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 rounded hover:bg-gray-200"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Title */}
        <div className="mb-8">
          <h2 className="font-playfair text-md text-secondary font-semibold">
            SELLER DASHBOARD
          </h2>
        </div>

        {/* Sidebar Navigation */}
        <nav className="space-y-3">
          {sidebarItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center gap-3 px-4 py-2 rounded-full text-sm font-semibold transition-all w-full
                  ${
                    isActive
                      ? "bg-secondary text-white"
                      : "text-secondary hover:bg-[#6C7A84] hover:text-white"
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-white" : "text-secondary"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-2">
          <button
            onClick={logoutAccount}
            className="font-inter w-full px-4 py-2 text-xs sm:text-sm shadow-sm text-left bg-cream text-gray-500 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>

      </aside>
    </div>
  );
}
