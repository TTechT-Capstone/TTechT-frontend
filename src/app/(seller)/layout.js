"use client";

import Loading from "../components/common/Loading";
import NotFound from "../components/common/NotFound";
import SellerHeader from "../components/seller/SellerHeader";
import SellerSidebar from "../components/seller/SellerSideBar";
import SellerSidebarMobile from "../components/seller/SellerSideBarMobile";
import "../globals.css";
import useAuth from "../hooks/useAuth";
import useMediaQuery from "../hooks/useMediaQuery";

export default function SellerLayout({ children }) {
  const { loading, isAuthenticated, userRole } = useAuth();
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Step 1: Handle the loading state while authentication is being checked
  if (loading) {
    return <Loading />;
  }

  // Step 2: Handle authorization after loading is complete
  if (!isAuthenticated || userRole !== "SELLER") {
    return <NotFound />;
  }

  // Step 3: Render the layout only if the user is an authorized SELLER
  const SidebarComponent = isMobile ? SellerSidebarMobile : SellerSidebar;

  return (
    <>
      <SellerHeader />
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
