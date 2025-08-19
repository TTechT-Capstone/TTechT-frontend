"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SearchingProductResult from "@/app/components/product/SearchingProductResult";
import { searchProductsByNameAPI } from "@/app/apis/product.api";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import Loading from "../common/Loading";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("query");

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm?.trim()) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await searchProductsByNameAPI(searchTerm);
        setSearchResults(res);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [searchTerm]);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <section className="flex px-8 py-8 font-playfair text-black flex-col">
        <h1 className="font-normal text-black text-lg sm:text-xl uppercase">
          Search Results
        </h1>
        <p className="mt-2 text-2xl sm:text-3xl font-bold">{searchTerm}</p>

        {!loading && searchResults?.length === 0 && (
          <p className="font-inter mt-4 text-gray-500 text-sm sm:text-base">
            We found no results. Please try again with a different word.
          </p>
        )}
      </section>
      <section className="flex flex-row px-8 py-4 pb-15 items-start">
        <SearchingProductResult products={searchResults} loading={loading} />
      </section>
    </>
  );
}