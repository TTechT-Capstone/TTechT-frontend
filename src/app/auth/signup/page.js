"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed } from "lucide-react";
import { registerUser } from "@/app/apis/auth.api";
import { createSeller } from "@/app/apis/seller.api";
import useUserStore from "@/app/stores/userStore";

export default function SignUp() {
  const [errors, setErrors] = useState({});
  const [role, setRole] = useState("Customer");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  //const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const route = useRouter();

  const { setSellerId } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,15}$/;

    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!phoneRegex.test(phoneNumber.trim())) {
      newErrors.phoneNumber = "Invalid phone number format.";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Invalid email format.";
    }

    if (!username.trim()) newErrors.username = "Username is required.";
    if (!password.trim()) newErrors.password = "Password is required.";
    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Confirm password is required.";

    if (role === "Seller" && !storeName.trim()) {
      newErrors.storeName = "Store name is required."; // and unique
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
      return;
    }

    try {
      setErrors({}); // Clear field-level errors
      setSignUpError(""); // Clear general errors

      console.log("Signup payload:");
      const payload = {
        firstName,
        lastName,
        phoneNumber,
        email,
        username,
        password,
        role: role.toUpperCase(), // "CUSTOMER" or "SELLER"
        ...(role === "Seller"
          ? {
              storeName,
              storeDescription,
            }
          : {}),
      };

      let response;
      if (role === "Seller") {
        response = await createSeller({
          ...payload,
          storeName,
          storeDescription,
        });

      } else {
        response = await registerUser(payload);
      }

     route.push("/auth/login");
    } catch (error) {
      console.error("Signup error:", error);

      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Signup failed. Please try again.";

      setSignUpError(errorMsg);
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
              <label htmlFor="firstName" className="block font-medium mb-2">
                First Name:
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block font-medium mb-2">
                Last Name:
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="Enter your last name"
              />
              {errors.lastname && (
                <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phoneNumber" className="block font-medium mb-2">
                Phone Number:
              </label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="Enter your phone number"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* <div>
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
            </div> */}

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
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="">
            <div>
              <label htmlFor="username" className="block font-medium mb-2">
                Username:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>
          </div>

          <div className="">
            <div className="relative">
              <label htmlFor="password" className="block font-medium mb-2">
                Password:
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary pr-10"
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
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
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
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
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
                {errors.storeName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.storeName}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="storeDescription"
                  className="block font-medium mb-2"
                >
                  Store Description:
                </label>
                <input
                  id="storeDescription"
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  className="border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                  placeholder="Enter your store description"
                />
                {errors.storeDescription && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.storeDescription}
                  </p>
                )}
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
            className="w-full py-3 px-4 rounded-xl text-white bg-secondary hover:bg-[#6C7A84] transition shadow-lg"
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
