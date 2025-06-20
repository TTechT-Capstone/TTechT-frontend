import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSideBar";
import "../globals.css";

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AdminHeader />
        {/* Admin Layout with Sidebar and Content */}
        <div className="flex">
          {/* Sidebar */}
          <AdminSidebar />

          {/* Main Content */}
          <section
            className="flex-1 p-6 overflow-auto"
            aria-label="Admin Main Content"
          >
            {children}
          </section>
        </div>
      </body>
    </html>
  );
}
