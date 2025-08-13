"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SellerDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/seller/products");
  }, [router]);

  return null; // nothing is shown while redirecting
}
