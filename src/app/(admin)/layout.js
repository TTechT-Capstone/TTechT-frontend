"use client";

import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSideBar";
import AdminSidebarMobile from "../components/admin/AdminSideBarMobile";
import "../globals.css";
import useMediaQuery from "../hooks/useMediaQuery";

export default function AdminLayout({ children }) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <>
      <AdminHeader />

      {!isMobile ? (
        <div className="flex">
          {/* Sidebar */}
          <AdminSidebar />

          {/* Main Content */}
          <section
            className="flex-1 p-6 overflow-auto bg-white text-primary font-roboto"
            aria-label="Seller Main Content"
          >
            {children}
          </section>
        </div>
      ) : (
        <div className="flex">
          {/* Sidebar */}
          <AdminSidebarMobile />

          {/* Main Content */}
          <section
            className="flex-1 p-6 overflow-auto bg-white text-primary font-roboto"
            aria-label="Admin Main Content"
          >
            {children}
          </section>
        </div>
      )}
    </>
  );
}
