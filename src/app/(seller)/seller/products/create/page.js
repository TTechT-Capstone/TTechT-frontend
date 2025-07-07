import CreateNewProduct from "@/app/components/product/CreateNewProduct";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SellerCreateProduct() {
  return (
    <main className="min-h-screen p-8 font-roboto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
        <Link href="/seller/products">
          <div className="flex items-center text-secondary cursor-pointer text-sm hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to product list
          </div>
        </Link>
      </div>
      <CreateNewProduct />    
    </main>
  );
}
