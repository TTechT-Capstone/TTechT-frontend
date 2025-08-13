"use client";

import { useRouter, usePathname } from "next/navigation";
import { User, Package, KeyRound } from "lucide-react";
import useAuth from "@/app/hooks/useAuth";
import { useState } from "react";

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

export default function ProfileSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { username, logout, loading } = useAuth();

  const handleNavigation = (path) => router.push(path);

  return (
    <aside className="bg-[#F4F4F4] font-inter shadow-sm min-h-screen w-72 px-6 py-8 flex flex-col justify-between border-r border-gray-200 font-urbanist">
      {/* Top Section */}
      <div>
        {/* Logo or greeting */}
        <div className="mb-8">
          <p className="font-inter text-gray-500 text-sm">Hi,</p>
          <h1 className="font-playfair text-xl font-semibold text-gray-800">
            {loading ? "Loading..." : username}
          </h1>
        </div>

        {/* Sidebar Navigation */}
        <nav className="space-y-6">
          {sidebarItems.map((group, index) => (
            <div key={index}>
              {group.section && (
                <p className="text-xs font-bold text-gray-500 uppercase mb-3">
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
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-md transition-all text-sm font-medium
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
      </div>
    </aside>
  );
}
