"use client";

import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSideBar";
import AdminSidebarMobile from "../components/admin/AdminSideBarMobile";
import Loading from "../components/common/Loading";
import NotFound from "../components/common/NotFound";
import "../globals.css";
import useAuth from "../hooks/useAuth";
import useMediaQuery from "../hooks/useMediaQuery";

export default function AdminLayout({ children }) {
  const { loading, isAuthenticated, userRole } = useAuth();
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Step 1: Handle the loading state while authentication is being checked
  if (loading) {
    return <Loading />;
  }

  // Step 2: Handle authorization after loading is complete
  if (!isAuthenticated || userRole !== "ADMIN") {
    return <NotFound />;
  }

  // Step 3: Render the layout only if the user is an authorized ADMIN
  const SidebarComponent = isMobile ? AdminSidebarMobile : AdminSidebar;

  return (
   <>
      <AdminHeader />
      <div className="flex">
        <SidebarComponent />
        <section
          className="flex-1 p-6 overflow-auto bg-white text-primary font-roboto"
          aria-label="Admin Main Content"
        >
          {children}
        </section>
      </div>
    </>
  );
}
