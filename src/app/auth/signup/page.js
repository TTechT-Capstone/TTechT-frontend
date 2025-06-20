"use client";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

export default function SignUp() {
  const [role, setRole] = useState("Customer");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      <div className="flex flex-col justify-center items-center bg-white text-secondary px-8">
        <form
          className="w-full max-w-lg mx-auto flex flex-col space-y-6 p-6 border md:border-0 md:shadow-none shadow-lg rounded-2xl bg-white"
          onSubmit={handleSubmit}
        >
          <Link href="/" aria-label="Home">
            <h1 className="font-urbanist text-secondary text-2xl font-bold cursor-pointer text-center">
              Origity
            </h1>
          </Link>

          <h2 className="font-urbanist font-bold text-3xl text-primary text-center">
            Sign up
          </h2>

          <div>
            <label htmlFor="role" className="block font-medium mb-2">
              Role:
            </label>
            <div className="grid grid-cols-2 gap-4">
              {["Customer", "Seller"].map((roleType) => (
                <button
                  key={roleType}
                  type="button"
                  className={`py-3 px-4 rounded-xl font-medium ${
                    role === roleType
                      ? "bg-secondary text-white shadow-lg"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  onClick={() => setRole(roleType)}
                  aria-pressed={role === roleType}
                >
                  {roleType}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstname" className="block font-medium mb-2">
                First Name:
              </label>
              <input
                type="text"
                id="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label htmlFor="lastname" className="block font-medium mb-2">
                Last Name:
              </label>
              <input
                type="text"
                id="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phonenumber" className="block font-medium mb-2">
                Phone Number:
              </label>
              <input
                type="text"
                id="phonenumber"
                value={phonenumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="address" className="block font-medium mb-2">
                Address:
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="Enter your address"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block font-medium mb-2">
                Email:
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="username" className="block font-medium mb-2">
                Username:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative">
              <label htmlFor="password" className="block font-medium mb-2">
                Password:
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded-lg p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[46px] text-sm text-gray-500 hover:text-primary focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeClosed /> : <Eye />}
              </button>
            </div>

            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block font-medium mb-2"
              >
                Confirm Password:
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border rounded-lg p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary pr-10"
                placeholder="Re-enter your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-[46px] text-sm text-gray-500 hover:text-primary focus:outline-none"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? <EyeClosed /> : <Eye />}
              </button>
            </div>
          </div>

          {role === "Seller" && (
            <div>
              <div className="mb-4">
                <label htmlFor="storename" className="block font-medium mb-2">
                  Store Name:
                </label>
                <input
                  type="text"
                  id="storename"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                  placeholder="Enter your store name"
                />
              </div>
              <div>
                <label
                  htmlFor="storedescription"
                  className="block font-medium mb-2"
                >
                  Store Description:
                </label>
                <textarea
                  id="storedescription"
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  className="border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                  placeholder="Enter your store description"
                ></textarea>
              </div>
            </div>
          )}

          {signUpError && (
            <div className="text-red-500 text-center font-medium">
              {signUpError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl text-white bg-secondary hover:bg-secondary-dark transition shadow-lg"
          >
            Create Account
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-bold hover:underline"
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
