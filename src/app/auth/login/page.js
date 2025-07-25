"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { loginAsUser } from "@/app/apis/auth.api";

export default function Login() {
  const [errors, setErrors] = useState({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required.";
    if (!password.trim()) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      //setLoginError("Please correct the errors above.");
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
      console.log(role);

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

  return (
    <div className="h-screen w-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left - Form Section */}
      <div className="flex flex-col justify-center items-center bg-white px-8">
        <form
          className="w-full max-w-lg mx-auto flex flex-col space-y-6 p-6 border md:border-0 md:shadow-none shadow-lg rounded-2xl bg-white"
          onSubmit={handleSubmit}
        >
          {/* Logo */}
          <Link href="/" aria-label="Home">
            <h1 className="font-urbanist text-secondary text-2xl font-bold cursor-pointer text-center">
              Origity
            </h1>
          </Link>

          {/* Title */}
          <h2 className="font-urbanist font-bold text-3xl text-primary text-center">
            Welcome back
          </h2>

          {/* Inputs */}
          <div className="font-roboto text-primary space-y-4">
            <div>
              <label htmlFor="username" className="block font-medium mb-2">
                Username:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border rounded-lg p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

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
              
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}

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

          {/* Error Message */}
          {loginError && (
            <div className="text-red-500 text-center font-medium">
              {loginError}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg text-white bg-secondary hover:bg-[#6C7A84] transition shadow-lg font-bold"
          >
            Login
          </button>

          {/* Sign Up Redirect */}
          <p className="flex justify-center mt-2 font-roboto text-gray-600">
            Don’t have an account?
            <Link
              href="/auth/signup"
              className="text-primary font-bold hover:underline ml-2"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>

      {/* Right - Image Section */}
      <div className="hidden md:block">
        <img
          src="/herobanner.jpg"
          alt="Login Image"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
