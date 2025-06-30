"use client";
import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/app/apis/auth.api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setError("");
      await forgotPassword({ email });
      setSent(true);
    } catch (err) {
      const message = err?.message || "Failed to send reset link.";
      setError(message);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50 text-primary px-4">
      <div className="w-full max-w-md bg-white p-8 shadow-md rounded-xl font-roboto">
        <Link href="/">
          <h1 className="font-urbanist text-secondary text-2xl font-bold text-center mb-4">
            Origity
          </h1>
        </Link>

        <h2 className="font-urbanist text-2xl font-semibold text-center text-primary mb-6">
          Forgot Password
        </h2>

        {sent ? (
          <p className="text-green-600 text-center font-medium">
            ✅ A password reset link has been sent to your email.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block mb-2 font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded-lg p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="you@example.com"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-secondary text-white font-bold rounded-lg hover:bg-secondary-dark transition"
            >
              Send Reset Link
            </button>

            <p className="text-center text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                href="/auth/login"
                className="text-primary font-semibold hover:underline"
              >
                Go back to login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
