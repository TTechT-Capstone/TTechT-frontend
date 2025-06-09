import { Box, ShoppingCart } from "lucide-react";

const sidebarItems = [
  { icon: <ShoppingCart />, label: "Product Management" },
  { icon: <Box />, label: "Order Management" }
];

export default function SellerSidebar() {
    return (
    <aside className="bg-[#F4F4F4] h-screen w-64 p-4 flex flex-col font-urbanist">
      <h2 className="text-xs text-secondary mb-3">SELLER DASHBOARD</h2>

      <nav className="flex flex-col gap-3">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 px-4 py-2 rounded-full text-sm cursor-pointer ${
              index === 0
                ? "bg-secondary text-white font-medium"
                : "text-secondary hover:bg-secondary"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
    )
}