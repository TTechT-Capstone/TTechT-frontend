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
          className="w-full max-w-lg flex flex-col space-y-4"
          onSubmit={handleSubmit}
        >
          <Link href="/">
            <h1 className="font-urbanist text-secondary text-xl font-bold cursor-pointer">
              Origity
            </h1>
          </Link>

          <h1 className="font-urbanist font-bold text-2xl text-primary">
            Welcome back
          </h1>

          <div className="font-roboto text-primary">
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border rounded p-2 w-full"
                placeholder= "Enter your username"
              />
            </div>

            <div className="mt-2">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded p-2 w-full"
                placeholder= "Enter your password"
              />
            </div>
          </div>

          {loginError && (
            <div className="text-red-500">{loginError}</div>
          )}

          <div className="font-roboto font-bold">
            <button
              type="submit"
              className="w-full py-2 px-4 rounded text-white bg-secondary hover:bg-gray-600 transition"
            >
              Login
            </button>
          </div>

          <p className="flex justify-center mt-4 font-roboto">
            Don't have an account?
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
