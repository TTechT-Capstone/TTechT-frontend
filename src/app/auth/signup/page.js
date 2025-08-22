"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CircleX, Eye, EyeClosed } from "lucide-react";
import { registerUser } from "@/app/apis/auth.api";
import { createSeller } from "@/app/apis/seller.api";
import useUserStore from "@/app/stores/userStore";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import ErrorPopup from "@/app/components/pop-up/ErrorPopUp";
import { createWatermarkAPI, uploadImageAPI } from "@/app/apis/watermark.api";

const generateWatermarkImage = (storeName) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const width = 400;
    const height = 200;
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);

    // Text
    ctx.fillStyle = "#333";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"; // Center text vertically
    ctx.fillText(storeName, width / 2, height / 2);

    // Convert the canvas to a Blob, then to a File object
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas to blob conversion failed."));
        return;
      }
      // Create a File object from the blob
      const file = new File([blob], `${storeName}_watermark.png`, {
        type: "image/png",
      });
      resolve(file);
    }, "image/png");
  });
};

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [role, setRole] = useState("Customer");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isMobile = useMediaQuery("(max-width: 767px)");
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Show popup if signUpError changes on mobile
    if (isMobile && signUpError) {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  }, [signUpError, isMobile]);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
        setSignUpError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const emailRegex = /^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const phoneRegex = /^\d{10,15}$/;

  const isSubmitDisabled =
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !email ||
    !username ||
    !password ||
    !confirmPassword ||
    (role === "Seller" && !storeName);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Basic field validation
    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (phoneNumber.trim().length < 10) {
      newErrors.phoneNumber = "Phone number must be at least 10 digits.";
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
      newErrors.storeName = "Store name is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    }

    if (password.length < 6) {
      const msg = "Password must be at least 6 characters.";
      setErrors({ password: msg });
      setSignUpError(msg);
      return;
    }

    if (password !== confirmPassword) {
      const msg = "Passwords do not match.";
      setErrors((prev) => ({ ...prev, confirmPassword: msg }));
      setSignUpError(msg);
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      setSignUpError("");

      const payload = {
        firstName,
        lastName,
        phoneNumber,
        email,
        username,
        password,
        role: role.toUpperCase(),
        ...(role === "Seller" ? { storeName, storeDescription } : {}),
      };

      let response;
      if (role === "Seller") {
        //console.log("Attempting to create a new seller account.");
        response = await createSeller(payload);
        //console.log("✅ Seller account created successfully:", response);

        // Generate the watermark image and get the Base64 data URL
        //console.log("Initiating watermark image generation...");
        const watermarkImage = await generateWatermarkImage(storeName);
        //console.log("✅ Watermark image generated:", watermarkImage);

        const uploadResponseURL = await uploadImageAPI(watermarkImage);
        const watermarkCloudinaryUrl = uploadResponseURL.data.url;
        //console.log("✅ Watermark image uploaded to Cloudinary:", watermarkCloudinaryUrl);

        const watermarkPayload = {
          store_name: storeName,
          watermark_url_image: watermarkCloudinaryUrl,
        };
        //console.log("Prepared watermark payload:", watermarkPayload);

        // Call the API to save the watermark.
        //console.log("Attempting to send watermark data to API...");
        await createWatermarkAPI(watermarkPayload);
        //console.log("✅ Watermark data sent to API successfully.");

      } else {
        response = await registerUser(payload);
      }

      router.push("/auth/login");
    } catch (error) {
      console.error("Signup error:", error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Signup failed. Please try again.";
      setSignUpError(errorMsg); // Will show popup on mobile
    } finally {
      setIsLoading(false); 
    }
  };

  return !isMobile ? (
    <div className="h-screen w-screen grid grid-cols-2">
      <div className="flex flex-col justify-center items-center bg-white text-secondary px-8">
        <form
          className="w-full max-w-lg mx-auto flex flex-col space-y-6 p-6 border md:border-0 md:shadow-none shadow-lg rounded-2xl bg-white"
          onSubmit={handleSubmit}
        >
          <Link href="/" aria-label="Home">
            <h1 className="font-playfair text-secondary text-xl sm:text-2xl font-bold cursor-pointer text-center">
              Origity
            </h1>
          </Link>

          <h2 className="font-inter font-semibold text-xl sm:text-3xl text-primary text-center">
            Sign up
          </h2>

          {/* Error Message */}
          {signUpError && (
            <div className="border border-red-300 bg-red-50 flex flex-row px-2 py-4 text-center">
              <CircleX className="text-red-400 inline-block mr-2" />
              <div className="text-black">{signUpError}</div>
            </div>
          )}

          <div className="font-inter text-sm sm:text-md ">
            <label htmlFor="role" className="block font-medium mb-2">
              Role: <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4 text-sm sm:text-md">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-inter text-sm sm:text-md">
            <div>
              <label htmlFor="firstName" className="block font-medium mb-2">
                First Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block font-medium mb-2">
                Last Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-inter text-sm sm:text-md">
            <div>
              <label htmlFor="phoneNumber" className="block font-medium mb-2">
                Phone Number: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="email" className="block font-medium mb-2">
                Email: <span className="text-red-500">*</span>
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
          </div>

          <div className="font-inter text-sm sm:text-md ">
            <div>
              <label htmlFor="username" className="block font-medium mb-2">
                Username: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div className="font-inter text-sm sm:text-md ">
            <div className="relative">
              <label htmlFor="password" className="block font-medium mb-2">
                Password: <span className="text-red-500">*</span>
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
                className="absolute right-3 top-[38px] text-sm text-gray-500 hover:text-primary focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeClosed /> : <Eye />}
              </button>
            </div>
          </div>

          <div>
            <div className="relative font-inter text-sm sm:text-md">
              <label
                htmlFor="confirmPassword"
                className="block font-medium mb-2"
              >
                Confirm Password: <span className="text-red-500">*</span>
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
                className="absolute right-3 top-[38px] text-sm text-gray-500 hover:text-primary focus:outline-none"
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
            <div className="font-inter text-sm sm:text-md">
              <div className="mb-4">
                <label htmlFor="storename" className="block font-medium mb-2">
                  Store Name: <span className="text-red-500">*</span>
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
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`w-full py-3 px-4 rounded-xl text-sm sm:text-md font-inter text-white transition shadow-lg ${
              isSubmitDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-secondary hover:bg-[#6C7A84]"
            }`}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-gray-600 font-inter text-sm sm:text-md ">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-bold text-sm sm:text-md hover:underline"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
      <div className="block">
        <img
          src="/herobanner.jpg"
          alt="Sign Up Image"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  ) : (
    // Mobile View
    <>
      <div
        className="fixed text-primary font-inter font-semibold z-50 w-full border-b bg-white border-gray-300 px-4 py-2"
        onClick={() => router.push("/")}
      >
        <div className="flex flex-row items-center gap-2 text-sm sm:text-md text-black">
          <ArrowLeft />
          Sign Up
        </div>
      </div>

      <div className="min-h-screen flex flex-col justify-center items-center bg-white text-secondary px-4 sm:px-8 py-6">
        <form
          className="w-full max-w-md mx-auto flex flex-col space-y-3 p-6 bg-white font-inter"
          onSubmit={handleSubmit}
        >
          <Link href="/" aria-label="Home">
            <h1 className="font-playfair text-secondary text-xl sm:text-2xl font-bold cursor-pointer text-center">
              Origity
            </h1>
          </Link>

          <h2 className="font-inter font-bold text-xl sm:text-3xl text-primary text-center">
            Sign up
          </h2>

          <div className="text-sm sm:text-md">
            <label htmlFor="role" className="block font-medium mb-2">
              Role: 
            </label>
            <div className="grid grid-cols-2 gap-4 text-sm sm:text-md">
              {["Customer", "Seller"].map((roleType) => (
                <button
                  key={roleType}
                  type="button"
                  className={`py-3 px-4 rounded-xl font-medium text-sm sm:text-base ${
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

          <div className="grid grid-cols-2 gap-6 text-sm sm:text-md">
            <div>
              <label htmlFor="firstName" className="block font-medium mb-2">
                First Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="First name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block font-medium mb-2">
                Last Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm sm:text-md">
            <div>
              <label htmlFor="phoneNumber" className="block font-medium mb-2">
                Phone Number: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="Phone number"
              />
            </div>

            <div>
              <label htmlFor="email" className="block font-medium mb-2">
                Email: <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
                placeholder="Email"
              />
            </div>
          </div>

          <div className="text-sm sm:text-md">
            <label htmlFor="username" className="block font-medium mb-2">
              Username: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary"
              placeholder="Username"
            />
          </div>

          <div className="relative text-sm sm:text-md">
            <label htmlFor="password" className="block font-medium mb-2">
              Password: <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary pr-10"
              placeholder="Your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-sm text-gray-500 hover:text-primary focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeClosed /> : <Eye />}
            </button>
          </div>

          <div className="relative text-sm sm:text-md">
            <label htmlFor="confirmPassword" className="block font-medium mb-2">
              Confirm Password: <span className="text-red-500">*</span>
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border rounded-xl p-3 w-full shadow-sm focus:ring-secondary focus:border-secondary pr-10"
              placeholder="Re-enter your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[38px] text-sm text-gray-500 hover:text-primary focus:outline-none"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? <EyeClosed /> : <Eye />}
            </button>
          </div>

          {role === "Seller" && (
            <>
              <div className="text-sm sm:text-md">
                <label htmlFor="storename" className="block font-medium mb-2">
                  Store Name: <span className="text-red-500">*</span>
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
              <div className="text-sm sm:text-md">
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
              </div>
            </>
          )}
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`w-full text-sm sm:text-md py-3 px-4 mt-2 rounded-xl text-white transition shadow-lg ${
              isSubmitDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-secondary hover:bg-[#6C7A84]"
            }`}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-gray-600 text-sm sm:text-md">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-bold hover:underline"
            >
              Login here
            </Link>
          </p>
        </form>

        {/* Popup error for mobile */}
        {showPopup && (
          <ErrorPopup
            message={signUpError}
            onClose={() => {
              setShowPopup(false);
              setSignUpError("");
            }}
          />
        )}
      </div>
    </>
  );
}
