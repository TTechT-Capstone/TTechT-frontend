'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
//import axios from 'axios';
// import { useDispatch } from 'react-redux';
// import { addItemToCart } from '../../redux/slices/cart.slice';
// import useAuth from '../../hooks/useAuth';
import Link from 'next/link';

import ProductCard from "../../../components/ProductCard";

export default function ProductDetail(){
  const router = useRouter();
  const { skuId } = router.query;

  // const dispatch = useDispatch();
  // const { isAuthenticated, userRole } = useAuth();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // if (!skuId) return;

    // const fetchProduct = async () => {
    //   setLoading(true);
    //   try {
    //     const res = await axios.get(`https://service.dev.grp6asm3.com/products/${skuId}`);
    //     setProduct(res.data);
    //     setMainImage(res.data.imageUrls[0]);
    //   } catch (err) {
    //     const msg = err?.response?.data || err.message || 'Something went wrong';
    //     setError(msg);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchProduct();
  }, [skuId]);

  const handleAddToCart = () => {
    // if (!isAuthenticated || userRole === 'admin') {
    //   setIsModalOpen(true);
    //   return;
    // }

    // const currentCartId = localStorage.getItem('cartId');
    // const newItem = {
    //   skuId,
    //   name: product.name,
    //   stockCode: product.stockCode,
    //   quantity,
    //   price: product.price,
    // };

    // dispatch(addItemToCart({ cartId: currentCartId, newItem }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>No product found</div>;

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 bg-white p-8 gap-6">

        <div className="bg-secondary font-roboto text-white">
          <p>Store name</p> {/* API to take store name */}
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col items-center gap-4">
            <img
              src={mainImage}
              alt="Main Product"
              className="w-full max-w-lg h-auto rounded-lg shadow-md object-cover transform hover:scale-105 transition-transform duration-300"
            />

            <div className="flex gap-4">
              {product.imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Product Thumbnail ${index + 1}`}
                  onClick={() => setMainImage(url)}
                  className={`w-16 h-16 rounded-lg shadow-md object-cover cursor-pointer transform transition-transform duration-300 ${
                    mainImage === url ? 'border-2 border-blue-500' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-start p-4">
            <h1 className="text-4xl font-urbanist font-bold text-gray-800 mb-4">
              {product.name}
            </h1>
            <p className="font-intel text-2xl text-[#D07373] font-semibold mb-4">
              ${product.price.toFixed(2)}
            </p>

            <div className="text-black text-sm leading-relaxed mb-4">
              <h3 className="text-base font-semibold mb-2">Product Description:</h3>
              <p>{product.description}</p>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <label htmlFor="quantity" className="text-black font-semibold text-sm">Quantity:</label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="px-2 py-1 text-sm border rounded-lg focus:ring focus:ring-blue-300"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-[#D07373] text-white font-bold text-sm px-4 py-2 rounded-lg shadow-lg hover:bg-[#B55E5E] transition duration-300 focus:ring-4 focus:ring-blue-300"
            >
              Add to Cart
            </button>

            <div className="font-roboto bg-white text-black mt-4">Description</div>
          </div>
        </section>

        <section className="col-span-2 mt-8">
          <h1 className="font-urbanist font-bold text-primary text-xl">
            SIMILAR PRODUCT FOR YOU
          </h1>
          {/* Replace this with a real map when data is available */}
          <ProductCard />
          <button className="bg-primary font-urbanist text-white hover:bg-white hover:text-primary mt-4 px-4 py-2 rounded-lg border border-primary">
            VIEW MORE
          </button>
        </section>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-sm w-full">
            <div className="flex justify-end">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="h-6 w-6 cursor-pointer"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close Modal"
              >
                <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z" />
              </svg>
            </div>

            <h2 className="font-urbanist text-primary text-[30px] text-center mb-4">Please Log In</h2>
            <p className="font-roboto text-sm text-center mb-6">
              {/* userRole logic placeholder */}
              You need to be logged in to add products to the cart.
            </p>

            <div className="flex justify-center">
              <Link href="/login">
                <button className="font-roboto login-btn bg-primary text-white px-4 py-2 rounded-lg hover:bg-[#B55E5E] transition duration-300">
                  Log In
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
