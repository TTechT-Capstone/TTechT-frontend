"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, CircleX, Eye, EyeClosed } from "lucide-react";
import { loginAsUser } from "@/app/apis/auth.api";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import ErrorPopup from "@/app/components/pop-up/ErrorPopUp";

export default function Login() {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Show popup if loginError changes on mobile
    if (isMobile && loginError) {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  }, [loginError, isMobile]);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
        setLoginError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  // Disable button if username or password is empty (trimmed)
  const isSubmitDisabled = !username.trim() || !password.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required.";
    if (!password.trim()) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setErrors({});
      setLoginError("");

      const res = await loginAsUser({ username, password });
      const { token, role, authenticated } = res?.result || {};

      if (!token || !authenticated) {
        setLoginError(
          "Login failed. Invalid credentials or no token received."
        );
        return;
      }

      localStorage.setItem("idToken", token);
      localStorage.setItem("userRole", role || "");

      // ✅ Redirect based on role
      switch (role) {
        case "USER":
          router.push("/");
          break;
        case "SELLER":
          router.push("/seller/products");
          break;
        case "ADMIN":
          router.push("/admin/products");
          break;
        default:
          setLoginError("Unknown user role. Cannot redirect.");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please try again.";
      setLoginError(errorMsg);
    }
  };

  return !isMobile ? (
    <div className="h-screen w-screen grid grid-cols-2">
      {/* Left - Form Section */}
      <div className="flex flex-col justify-center items-center bg-white px-8">
        <form
          className="w-full max-w-lg mx-auto flex flex-col space-y-6 p-6 border-0 rounded-2xl bg-white"
          onSubmit={handleSubmit}
        >
          {/* Logo */}
          <Link href="/" aria-label="Home">
            <h1 className="font-playfair text-secondary text-xl sm:text-2xl font-bold cursor-pointer text-center">
              Origity
            </h1>
          </Link>

          {/* Title */}
          <h2 className="font-inter font-semibold text:xl sm:text-3xl text-primary text-center">
            Welcome back
          </h2>

          {/* Error Message */}
          {loginError && (
            <div className="border border-red-300 bg-red-50 flex flex-row px-2 py-4 text-center">
              <CircleX className="text-red-400 inline-block mr-2" />
              <div className="text-black">{loginError}</div>
            </div>
          )}

          {/* Inputs */}
          <div className="font-inter text-sm sm:text-md text-primary space-y-4">
            <div>
              <label htmlFor="username" className="block font-medium mb-2">
                Username: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border rounded-lg p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="Enter your username"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block font-medium mb-2">
                Password: <span className="text-red-500">*</span>
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
                className="absolute right-3 top-[38px] text-sm text-gray-500 hover:text-primary focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeClosed /> : <Eye />}
              </button>

              <div className="text-right mt-2">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`w-full py-3 px-4 text-sm sm:text-md rounded-lg text-white bg-secondary transition shadow-lg font-bold ${
              isSubmitDisabled
                ? "opacity-50 cursor-not-allowed hover:bg-secondary"
                : "hover:bg-[#6C7A84]"
            }`}
          >
            Login
          </button>

          {/* Sign Up Redirect */}
          <p className="flex justify-center text-sm sm:text-md font-inter text-gray-600">
            Don’t have an account?
            <Link
              href="/auth/signup"
              className="text-primary text-sm sm:text-md font-bold hover:underline ml-2"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>

      {/* Right - Image Section */}
      <div className="block">
        <img
          src="/herobanner.jpg"
          alt="Login Image"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  ) : (
    // Mobile View
    <>
      <div
        className="fixed text-primary font-semibold z-50 w-full bg-white border-b-1 border-gray-300 px-4 py-2"
        onClick={() => router.push("/")} 
      >
        <div className="font-inter text-sm sm:text-md flex flex-row items-center gap-2 text-black">
          <ArrowLeft />
          Back to Origity
        </div>
        
      </div>
      <div className="h-screen flex flex-col justify-center items-center bg-white px-8">
        <form
          className="w-full max-w-lg mx-auto flex flex-col space-y-6 p-6 rounded-2xl bg-white"
          onSubmit={handleSubmit}
        >
          {/* Logo */}
          <Link href="/" aria-label="Home">
            <h1 className="font-playfair text-secondary text-xl sm:text-2xl font-bold cursor-pointer text-center">
              Origity
            </h1>
          </Link>

          {/* Title */}
          <h2 className="font-inter font-semibold text-xl sm:text-3xl text-primary text-center">
            Welcome back
          </h2>

          {/* Inputs */}
          <div className="font-inter text-primary text-sm sm:text-md space-y-4">
            <div>
              <label htmlFor="username" className="block font-medium mb-2">
                Username: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border rounded-lg p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="Enter your username"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block font-medium mb-2">
                Password: <span className="text-red-500">*</span>
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
                className="absolute right-3 top-[38px] text-sm text-gray-500 hover:text-primary focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeClosed /> : <Eye />}
              </button>

              <div className="text-right mt-2">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`w-full py-3 px-4 text-sm sm:text-md rounded-lg text-white bg-secondary transition shadow-lg font-bold ${
              isSubmitDisabled
                ? "opacity-50 cursor-not-allowed hover:bg-secondary"
                : "hover:bg-[#6C7A84]"
            }`}
          >
            Login
          </button>

          {/* Sign Up Redirect */}
          <p className="flex justify-center text-sm sm:text-md font-inter text-gray-600">
            Don’t have an account?
            <Link
              href="/auth/signup"
              className="text-primary text-sm sm:text-md font-bold hover:underline ml-2"
            >
              Register here
            </Link>
          </p>
        </form>

        {/* Popup error for mobile */}
        {showPopup && (
          <ErrorPopup
            message={loginError}
            onClose={() => {
              setShowPopup(false);
              setLoginError("");
            }}
          />
        )}
      </div>
    </>
  );
}
