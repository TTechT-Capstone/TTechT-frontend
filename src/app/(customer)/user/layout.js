import ProfileSidebar from "@/app/components/profile/UserSideBar";
import "@/app/globals.css";

export default function UserLayout({ children }) {
  return (
    <div className="flex bg-[#F4F4F4] min-h-screen">
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
  );
}
