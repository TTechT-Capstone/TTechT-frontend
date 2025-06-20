import AdminHeader from "../components/admin/AdminHeader";
import SellerSidebar from "../components/seller/SellerSideBar";
import "../globals.css";

export default function SellerLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AdminHeader />

        <div className="flex">
          {/* Sidebar */}
          <SellerSidebar />

          {/* Main Content */}
          <section
            className="flex-1 p-6 overflow-auto"
            aria-label="Seller Main Content"
          >
            {children}
          </section>
        </div>
      </body>
    </html>
  );
}
