"use client";

import ProfileSidebar from "@/app/components/profile/ProfileSideBar";
import ProfileSidebarMobile from "@/app/components/profile/ProfileSiderBarMobile";
import "@/app/globals.css";
import useMediaQuery from "@/app/hooks/useMediaQuery";

export default function UserLayout({ children }) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return !isMobile ? (
    <div className="pt-8 flex bg-[#F4F4F4] min-h-screen">
      {/* Sidebar */}
      <ProfileSidebar />

      {/* Main Content */}
      <section
        className="flex-1 p-4 overflow-auto bg-[#F4F4F4] text-primary font-roboto border border-gray-200"
        aria-label="User Main Content"
      >
        {children}
      </section>
    </div>
  ) : (
    <div className="pt-5 flex flex-col bg-[#F4F4F4] min-h-screen">
      {/* Sidebar */}
      <ProfileSidebarMobile />

      {/* Main Content */}
      <section
        className="flex-1 p-4 overflow-auto bg-[#F4F4F4] text-primary font-roboto border border-gray-200"
        aria-label="User Main Content"
      >
        {children}
      </section>
    </div>
  );
}