"use client";

import { User, Package, KeyRound, X } from "lucide-react";
import useAuth from "@/app/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";

const sidebarItems = [
  {
    section: "My Account",
    items: [
      { icon: User, label: "My Profile", path: "/user/account/profile" },
      {
        icon: KeyRound,
        label: "Update Password",
        path: "/user/account/password",
      },
    ],
  },
  {
    section: "My Orders",
    items: [{ icon: Package, label: "My Orders", path: "/user/order" }],
  },
];

export default function ProfileSidebarMobile({ open, onClose }) {
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
        <div className="fixed inset-0 bg-black/50 z-100" onClick={onClose} />
      )}

      {/* Bottom Sheet Drawer */}
      <aside
        className={`fixed bottom-0 left-0 w-full bg-[#F4F4F4] shadow-sm px-6 py-8 flex flex-col border-t border-gray-200 font-urbanist z-150 transform transition-transform duration-300
        ${open ? "translate-y-0" : "translate-y-full"}`}
        style={{ maxHeight: "80vh" }} // so it doesn't cover whole screen
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 rounded hover:bg-gray-200"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Greeting */}
        <div className="mb-8">
          <p className="font-inter text-gray-500 text-sm">Hi,</p>
          <h1 className="font-playfair text-xl font-semibold text-gray-800">
            {loading ? "Loading..." : username}
          </h1>
        </div>

        {/* Sidebar Navigation */}
        <nav className="space-y-6 overflow-y-auto">
          {sidebarItems.map((group, index) => (
            <div key={index}>
              {group.section && (
                <p className="font-inter text-xs font-bold text-gray-500 uppercase mb-3">
                  {group.section}
                </p>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.path);
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <button
                        onClick={() => handleNavigation(item.path)}
                        className={`font-inter w-full flex items-center gap-3 px-4 py-2 rounded-md transition-all text-sm font-medium
                          ${
                            isActive
                              ? "bg-[#4A5A64] text-white font-semibold"
                              : "text-gray-700 hover:bg-[#E6ECEF]"
                          }
                        `}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            isActive ? "text-white" : "text-[#4A5A64]"
                          }`}
                        />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
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
