"use client";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setLoginError("Please enter both username and password.");
      return;
    }

    try {
      setLoginError("");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="h-screen w-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-center items-center bg-white px-8">
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
            Welcome back
          </h2>

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
            </div>

            <div>
              <label htmlFor="password" className="block font-medium mb-2">
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded-lg p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {loginError && (
            <div className="text-red-500 text-center font-medium">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg text-white bg-secondary hover:bg-secondary-dark transition shadow-lg font-bold"
          >
            Login
          </button>

          <p className="flex justify-center mt-4 font-roboto text-gray-600">
            Don’t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary font-bold hover:underline ml-2"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
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
