"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditPromotionCode() {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiry, setExpiry] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submit logic here
    console.log({ code, discount, expiry });
  };

  return (
    <main className="">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
            placeholder="E.g. SUMMER10"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Discount</label>
          <input
            type="text"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
            placeholder="E.g. 10% or Free Shipping"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Expiry Date</label>
          <input
            type="date"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-secondary text-white px-6 py-2 rounded-md font-bold w-max self-end"
        >
          Save Promotion Code
        </button>
      </form>
    </main>
  );
}
