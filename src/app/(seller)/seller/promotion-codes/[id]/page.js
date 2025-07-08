import EditPromotionCode from "@/app/components/promotion-codes/EditPromotionCode";
import { ArrowLeft} from "lucide-react";
import Link from "next/link";

export default function SellerEditPromotion() {
  return (
    <main className="min-h-screen p-8 font-roboto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Edit Promotion Code</h1>
        <Link href ="/seller/promotion-codes">
          <div className="flex items-center text-secondary cursor-pointer text-sm hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to promotion list
          </div>
        </Link>
      </div>
      <EditPromotionCode />
    </main>
  );
}
