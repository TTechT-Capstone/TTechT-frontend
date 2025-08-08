"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ChevronDown, Search, Pencil, Trash2, SquarePen } from "lucide-react";
import { deleteProductAPI, getAllProductsAPI } from "@/app/apis/product.api";

export default function SellerProducts() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const { idToken, user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortProduct, setSortProduct] = useState("desc");

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        //setLoading(true);
        const data = await getAllProductsAPI();
        console.log(data.content);
        setProducts(data.content || []);
      } catch (error) {
        console.error("Error loading products:", error.message);
        setProducts([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEditProduct = (productId) => {
    router.push(`/seller/products/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await deleteProductAPI(productId);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Error deleting product:", error.message);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.productId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];

      if (sortBy === "createdAt") {
        return sortProduct === "asc"
          ? new Date(valA) - new Date(valB)
          : new Date(valB) - new Date(valA);
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return sortProduct === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return sortProduct === "asc" ? valA - valB : valB - valA;
      }

      return 0;
    });

    return filtered;
  }, [products, searchTerm, sortBy, sortProduct]);

  return (
    <main className="font-roboto p-4 min-h-screen">
      {/* Header */}
      <div className="flex flex-row justify-between mb-4">
        <h1 className="font-urbanist font-bold text-2xl">Product Management</h1>

        <Link href="/seller/products/create">
          <button className="bg-secondary text-white px-4 py-2 rounded-md font-urbanist font-bold">
            Create new product
          </button>
        </Link>
      </div>

      {/* Sort and Create */}
      <div className="flex flex-row justify-between mb-4">
        <div className="flex flex-row items-center space-x-2 font-urbanist font-bold">
          <label>SORT BY</label>
          {/* <ChevronDown className="h-5 w-5" /> */}
          <select
            className="border rounded px-2 py-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="productId">Product ID</option>
            <option value="name">Product Name</option>
            <option value="createdAt">Created At</option>
            <option value="categoryName">Category</option>
          </select>

          <button
            onClick={() =>
              setSortProduct((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="text-sm underline"
          >
            {sortProduct.toUpperCase()}
          </button>
        </div>

        <div className="flex flex-row items-center space-x-2 font-urbanist font-bold">
          <label>SEARCH</label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Product ID or Name"
            className="border px-2 py-1 rounded"
          />
          {/* <Search className="h-5 w-5" /> */}
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-6 justify-items-center font-urbanist font-bold bg-gray-100 px-4 py-3 rounded-t-lg">
        <div>Product</div>
        <div>Quantity</div>
        <div>Retail Price</div>
        <div>Sizes</div>
        <div>Colors</div>
        <div>Action</div>
      </div>

      {/* Table Rows */}
      {filteredAndSortedProducts.map((product, index) => (
        <div
          key={index}
          className={`grid grid-cols-6 justify-items-center items-center px-4 py-3 ${
            index % 2 === 0 ? "bg-white" : "bg-gray-50"
          }`}
        >
          <div className="font-medium">{product.name}</div>
          <div>{product.stockQuantity}</div>
          <div>{product.price}</div>
          <div>{product.sizes?.length || 0}</div>
          <div>{product.colors?.length || 0}</div>
          <div className="flex space-x-3">
            <SquarePen
              className="text-gray-600 hover:text-primary cursor-pointer"
              onClick={() => {console.log("Editing product:", product); handleEditProduct(product.productId)}}
            />
            <Trash2
              className="text-red-600 hover:text-red-800 cursor-pointer"
              onClick={() => handleDeleteProduct(product.productId)}
            />
          </div>
        </div>
      ))}
    </main>
  );
}
