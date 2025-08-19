import Loading from "@/app/components/common/Loading";
import SearchContent from "@/app/components/product/SearchContent";
import { Suspense } from "react";

export default function SearchProductPage() {
  return (
    <main className="pt-8 sm:pt-10 min-h-screen bg-white">
      {/* <Suspense fallback={<Loading />}> */}
        <SearchContent />
      {/* </Suspense> */}
    </main>
  );
}

