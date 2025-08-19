"use client";
import { useState } from "react";
import Link from "next/link";
import SuccessPopUp from "@/app/components/pop-up/SuccessPopUp";
import ErrorPopUp from "@/app/components/pop-up/ErrorPopUp";
import { forgotPassword } from "@/app/apis/user.api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address.");
      setShowError(true);
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setShowError(true);
      return;
    }

    try {
      setError("");
      await forgotPassword({ email });
      setSent(true);
      setShowSuccess(true);
    } catch (err) {
      const message = err?.message || "Failed to send reset link.";
      setError(message);
      setShowError(true);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50 text-primary px-4">
      <div className="w-full max-w-md bg-white p-8 shadow-md rounded-xl font-roboto">
        <Link href="/">
          <h1 className="font-playfair text-secondary text-xl sm:text-2xl font-bold text-center mb-4">
            Origity
          </h1>
        </Link>

        <h2 className="font-inter text-xl sm:text-2xl font-semibold text-center text-primary mb-6">
          Forgot Password
        </h2>

        {sent && showSuccess && (
          <SuccessPopUp
            message="A password reset link has been sent to your email."
            onClose={() => setShowSuccess(false)}
          />
        )}
        {showError && error && (
          <ErrorPopUp
            message={error}
            onClose={() => setShowError(false)}
          />
        )}
        {!sent && (
          <form onSubmit={handleSubmit} className="space-y-5 text-sm sm:text-md font-inter">
            <div>
              <label htmlFor="email" className="block mb-2 font-medium">
                Email Address <span className="text-red-500">*</span>
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

            <button
              type="submit"
              className="w-full py-3 text-sm sm:text-md bg-secondary text-white font-bold rounded-lg hover:bg-secondary-dark transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!email}
            >
              Send Reset Link
            </button>

            <p className="text-center text-sm sm:text-md text-gray-600">
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
