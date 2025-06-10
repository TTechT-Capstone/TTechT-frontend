"use client";
import Link from "next/link";
import { useState } from "react";

export default function SignUp() {
  const [role, setRole] = useState("Customer"); 
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [signUpError, setSignUpError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !firstname ||
      !lastname ||
      !phonenumber ||
      !address ||
      !username ||
      !password ||
      (role === "Seller" && (!storeName || !storeDescription))
    ) {
      setSignUpError("Please fill in all the required fields.");
      return;
    }

    try {
      setSignUpError(""); // Clear previous errors
      // Simulate API call
      window.location.href = "/auth/login"; 
    } catch (error) {
      console.error("Signup error:", error);
      setSignUpError(error.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="h-screen w-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-center items-center bg-white px-8">
        <form
          className="w-full max-w-lg flex flex-col space-y-4"
          onSubmit={handleSubmit}
        >
          <Link href="/">
            <h1 className="font-urbanist text-secondary text-xl font-bold cursor-pointer">
              Origity
            </h1>
          </Link>

          <h1 className="font-urbanist font-bold text-2xl text-primary">
            Sign up
          </h1>

          <div className="mt-2">
            <label htmlFor="role">Role:</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`py-2 px-4 rounded ${
                  role === "Customer"
                    ? "bg-secondary text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setRole("Customer")}
              >
                Customer
              </button>
              <button
                type="button"
                className={`py-2 px-4 rounded ${
                  role === "Seller"
                    ? "bg-secondary text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setRole("Seller")}
              >
                Seller
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstname">First Name:</label>
              <input
                type="text"
                id="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="border rounded p-2 w-full"
                placeholder="Enter your firstname"
              />
            </div>
            <div>
              <label htmlFor="lastname">Last Name:</label>
              <input
                type="text"
                id="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="border rounded p-2 w-full"
                placeholder="Enter your lastname"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="phonenumber">Phone Number:</label>
              <input
                type="text"
                id="phonenumber"
                value={phonenumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border rounded p-2 w-full"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border rounded p-2 w-full"
                placeholder="Enter your address"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border rounded p-2 w-full"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded p-2 w-full"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {role === "Seller" && (
            <div className="space-y-4">
              <div>
                <label htmlFor="storename">Store Name:</label>
                <input
                  type="text"
                  id="storename"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="border rounded p-2 w-full"
                  placeholder="Enter your store name"
                />
              </div>
              <div>
                <label htmlFor="storedescription">Store Description:</label>
                <textarea
                  id="storedescription"
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  className="border rounded p-2 w-full"
                  placeholder="Enter your store description"
                ></textarea>
              </div>
            </div>
          )}

          {signUpError && <div className="text-red-500">{signUpError}</div>}

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded text-white bg-secondary hover:bg-gray-600 transition"
            >
              Create Account
            </button>
          </div>

          <p className="flex justify-center mt-2 font-roboto">
            Already have an account?
            <Link
              href="/auth/login"
              className="text-primary font-bold hover:underline ml-2"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block">
        <img
          src="/herobanner.jpg"
          alt="Sign Up Image"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
