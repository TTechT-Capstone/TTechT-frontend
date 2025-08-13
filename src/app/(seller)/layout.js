"use client";

import SellerHeader from "../components/seller/SellerHeader";
import SellerSidebar from "../components/seller/SellerSideBar";
import SellerSidebarMobile from "../components/seller/SellerSideBarMobile";
import "../globals.css";
import useMediaQuery from "../hooks/useMediaQuery";

export default function SellerLayout({ children }) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  return (
    <>
      <SellerHeader />

      {!isMobile ? (
        <div className="flex">
          {/* Sidebar */}
          <SellerSidebar />

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
          <SellerSidebarMobile />

          {/* Main Content */}
          <section
            className="flex-1 p-6 overflow-auto bg-white text-primary font-roboto"
            aria-label="Seller Main Content"
          >
            {children}
          </section>
        </div>
      )}
    </>
  );
}
