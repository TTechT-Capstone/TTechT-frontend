import SellerHeader from "../components/seller/SellerHeader";
import SellerSidebar from "../components/seller/SellerSideBar";
import "../globals.css";

export default function SellerLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SellerHeader />

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
      </body>
    </html>
  );
}
