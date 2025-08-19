"use client";

import Loading from "@/app/components/common/Loading";
import NotFound from "@/app/components/common/NotFound";
import ProfileSidebar from "@/app/components/profile/ProfileSideBar";
import ProfileSidebarMobile from "@/app/components/profile/ProfileSiderBarMobile";
import "@/app/globals.css";
import useAuth from "@/app/hooks/useAuth";
import useMediaQuery from "@/app/hooks/useMediaQuery";

export default function UserLayout({ children }) {
  const { loading, isAuthenticated, userRole } = useAuth();
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Step 1: Handle the loading state while authentication is being checked
  if (loading) {
    return <Loading />;
  }

  // Step 2: Handle authorization after loading is complete
  if (!isAuthenticated || userRole !== "USER") {
    return <NotFound />;
  }

  // Step 3: Render the layout only if the user is an authorized USER
  const SidebarComponent = isMobile ? ProfileSidebarMobile : ProfileSidebar;

  return (
    <>
      <div className="pt-8 flex bg-[#F4F4F4] min-h-screen">
        <SidebarComponent />
        {/* Main Content */}
        <section
          className="flex-1 p-4 overflow-auto bg-[#F4F4F4] text-primary font-roboto border border-gray-200"
          aria-label="User Main Content"
        >
          {children}
        </section>
      </div>
    </>
  );
}
