"use client";
import { useRouter, usePathname } from "next/navigation";
import { Box, ShoppingCart } from "lucide-react";

const sidebarItems = [
  { icon: <ShoppingCart />, label: "Product Management", path: "/seller/products" },
  { icon: <Box />, label: "Order Management", path: "/seller/orders" },
];

export default function SellerSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <aside className="bg-[#F4F4F4] h-screen w-64 p-4 flex flex-col font-urbanist">
      <h2 className="text-md text-secondary font-semibold mb-3">SELLER DASHBOARD</h2>

      <nav className="flex flex-col gap-3">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <div
              key={item.path} // Use path as key instead of index
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center gap-3 px-4 py-2 rounded-full text-sm cursor-pointer transition-colors duration-200 ${
                isActive
                  ? "bg-secondary text-white font-semibold"
                  : "text-secondary hover:bg-[#6C7A84] hover:text-white font-semibold"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
