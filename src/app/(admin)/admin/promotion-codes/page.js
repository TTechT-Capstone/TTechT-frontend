"use client";

import { ChevronDown, Search, SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";

const promotions = [
  {
    code: "SUMMER2025",
    discount: "20%",
    expires: "2025-09-01",
    usage: "12 / 100",
  },
  {
    code: "WELCOME10",
    discount: "10%",
    expires: "2025-12-31",
    usage: "87 / 100",
  },
];

export default function AdminPromotionCodes() {
  return (
    <main className="font-roboto p-4 min-h-screen">
      {/* Header */}
      <div className="flex flex-row justify-between mb-4">
        <h1 className="font-urbanist font-bold text-2xl">Promotion Codes</h1>

        <Link href="/admin/promotion-codes/create">
          <button className="bg-secondary text-white px-4 py-2 rounded-md font-urbanist font-bold">
            Create new Promotion Code
          </button>
        </Link>
      </div>

      {/* Sort and Create */}
      <div className="flex flex-row justify-between mb-4">
        <div className="flex flex-row items-center space-x-2 font-urbanist font-bold">
          <span>SORT BY</span>
          <ChevronDown className="h-5 w-5" />
        </div>
        <div className="flex flex-row items-center space-x-2 font-urbanist font-bold">
          <span>SEARCH</span>
          <Search className="h-5 w-5" />
        </div>
      </div>


      {/* Table Header */}
      <div className="grid grid-cols-5 justify-items-center font-urbanist font-bold bg-gray-100 px-4 py-3 rounded-t-lg">
        <div>Code</div>
        <div>Discount</div>
        <div>Expires</div>
        <div>Usage</div>
        <div>Action</div>
      </div>

      {/* Table Rows */}
      {promotions.map((promo, index) => (
        <div
          key={index}
          className={`grid grid-cols-5 justify-items-center items-center px-4 py-3 ${
            index % 2 === 0 ? "bg-white" : "bg-gray-50"
          }`}
        >
          <div className="font-medium">{promo.code}</div>
          <div>{promo.discount}</div>
          <div>{promo.expires}</div>
          <div>{promo.usage}</div>
          <div className="flex space-x-3">
            <SquarePen className="text-gray-600 hover:text-primary cursor-pointer" />
            <Trash2 className="text-red-600 hover:text-red-800 cursor-pointer" />
          </div>
        </div>
      ))}
    </main>
  );
}
