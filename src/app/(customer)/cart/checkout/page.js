import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { getPromotionCodeAPI, getListPromotionCodeAPI } from '../../../apis/promotion-code.api.js';
import { updateItemQuantityAPI } from "../../../apis/cart.api.js";

export default function Checkout(){
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [promotionCode, setPromotionCode] = useState('');
  const [promotionError, setPromotionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(true);
  const cartItems = useSelector((state) => state.cart.items || []);
  const cartId = localStorage.getItem("cartId");
  const [updatedCartItems, setUpdatedCartItems] = useState(cartItems);

  useEffect(() => {
    // Load data from local storage
    const savedData = JSON.parse(localStorage.getItem('checkoutData'));
    if (savedData) {
      setEmail(savedData.email);
      setFirstName(savedData.firstName);
      setLastName(savedData.lastName);
      setAddress(savedData.address);
      setContactPhone(savedData.contactPhone);
      setPromotionCode(savedData.promotionCode || ''); // Load promotion code if available
    }
  }, []);

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
    // Save data to local storage
    localStorage.setItem('checkoutData', JSON.stringify({
      email,
      firstName,
      lastName,
      address,
      contactPhone,
      promotionCode
    }));
  };

  const totalPrice = updatedCartItems.reduce((total, item) => {
    const price = parseFloat(item.productPrice) || 0;
    const quantity = parseInt(item.quantity, 10) || 0;
    return total + price * quantity;
  }, 0);

  const validateForm = () => {
    let errorMessages = {};
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      isValid = false;
      errorMessages.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      isValid = false;
      errorMessages.email = "Please enter a valid email address";
    }

    if (!firstName) {
      isValid = false;
      errorMessages.firstName = "First name is required";
    }
    if (!lastName) {
      isValid = false;
      errorMessages.lastName = "Last name is required";
    }
    if (!address) {
      isValid = false;
      errorMessages.address = "Address is required";
    }
    if (!contactPhone) {
      isValid = false;
      errorMessages.phone = "Phone number is required";
    } else if (!/^\d{9}$/.test(contactPhone)) { // Check for a valid 9-digit phone number
      isValid = false;
      errorMessages.phone = "Phone number must be exactly 9 digits";
    }
    setErrors(errorMessages);
    setIsFormValid(isValid);
    return isValid;
  };

  const handleApplyCode = async (code) => {
    if (!code) {
      setPromotionError(''); // Clear any previous error
      return; // No promotion code to apply
    }

    try {
      // Step 1: Get the list of valid promotion codes
      const promotionItems = await getListPromotionCodeAPI();

      // Step 2: Check if the entered code is valid
      if (!promotionItems.includes(code)) {
        setPromotionError('Invalid promotion code. Please try again.');
        setSuccessMessage(''); // Clear success message
        return;
      }

      // Step 3: Call the API to get promotion details
      const promotionDetails = await getPromotionCodeAPI(code);

      // Step 4: Calculate the discount based on promotion details
      const discountPercentage = promotionDetails.discount; // e.g., 0.05 for 5%

      // Step 5: Update product prices based on the discount
      const newCartItems = cartItems.map(item => {
        const originalPrice = parseFloat(item.productPrice) || 0;
        const discountAmount = originalPrice * discountPercentage; // Calculate discount amount
        const newPrice = originalPrice - discountAmount; // Adjust price based on discount
        return {
          ...item,
          productPrice: Math.max(0, newPrice), // Ensure the price does not go below zero
          discountPrice: newPrice // Optionally store the new price as discountPrice
        };
      });

      // Step 6: Call updateItemQuantityAPI for each item
      for (const item of newCartItems) {
        const updatedQuantity = item.quantity;
        const discountPrice = item.productPrice; // Pass the updated price as discountPrice
        await updateItemQuantityAPI(cartId, item.skuId, updatedQuantity, discountPrice); // Ensure skuId is correct
      }

      // Update the state with the new cart items
      setUpdatedCartItems(newCartItems);
      setSuccessMessage('Promotion code applied successfully!'); // Set success message
      setPromotionError(''); // Clear any previous error
    } catch (error) {
      console.error('Failed to apply promotion code:', error.message);
      setPromotionError(`Error applying promotion code: ${error.message}`);
      setSuccessMessage(''); // Clear success message
    }
  };

  const handleMoveToPaymentProcess = (event) => {
    event.preventDefault();

    // Validate the form before proceeding
    if (!validateForm()) return;

    // Navigate to the Payment page with the collected data
    navigate('/carts/checkout/payment', {
      state: {
        email,
        firstName,
        lastName,
        address,
        contactPhone,
        promotionCode,
        updatedCartItems
      },
    });
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#F5F5F5] p-4">
      <div className="flex w-full max-w-6xl bg-white shadow-lg rounded-lg border border-solid overflow-hidden">
        {/* Left Section */}
        <div className="w-2/3 bg-gray-100 p-8">
          {/* Contact Section */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="johndoe@gmail.com"
                className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`}
                value={email}
                onChange={handleInputChange(setEmail)}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              <input
                type="text"
                placeholder="Phone number (9 digits)"
                className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`}
                value={contactPhone}
                onChange={handleInputChange(setContactPhone)}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
          </div>

          {/* Delivery Section */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Delivery Information</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="First name"
                className={`w-full border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`}
                value={firstName}
                onChange={handleInputChange(setFirstName)}
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
              <input
                type="text"
                placeholder="Last name"
                className={`w-full border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`}
                value={lastName}
                onChange={handleInputChange(setLastName)}
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
              <input
                type="text"
                placeholder="Address"
                className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md col-span-2`}
                value={address}
                onChange={handleInputChange(setAddress)}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>
          </div>

          {/* Promotion Method */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Promotion Code</h2>
            <div className="flex items-center justify-between border border-gray-300 p-4 rounded-md bg-white">
              <input
                type="text"
                placeholder="Enter your promotion code"
                className="flex-grow border-none outline-none"
                value={promotionCode}
                onChange={handleInputChange(setPromotionCode)}
              />

              <button
                className="ml-4 px-4 py-2 bg-[#E89F71] text-white hover:bg-orange-500"
                onClick={() => handleApplyCode(promotionCode)}
              >
                Apply
              </button>
            </div>
            {promotionError && <p className="text-red-500 text-sm">{promotionError}</p>}
            {successMessage && <p className="text-green-500 mt-2 text-sm">{successMessage}</p>} {/* Display success message */}
          </div>

          {/* Error Message */}
          {!isFormValid && (
            <div className="text-red-500 mb-4">Please fill out all required fields.</div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <Link to="/carts">
              <button className="border border-[#E89F71] px-6 py-2 text-gray-600 hover:bg-gray-200">
                Cancel
              </button>
            </Link>
            <button
              className="bg-[#E89F71] text-white px-6 py-2 hover:bg-orange-500"
              onClick={handleMoveToPaymentProcess}
            >
              Next: Payment
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/3 p-8 bg-white">
          {/* Cart Items */}
          {updatedCartItems.length > 0 ? (
            updatedCartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <p className="text-sm text-black">{item.productName}</p>
                </div>
                <span className="font-semibold text-gray-800">
                  ${(parseFloat(item.productPrice) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))
          ) : (
            <p>No items in cart.</p>
          )}

          {/* Total Row */}
          <div className="flex justify-between pt-4 border-t">
            <span className="font-semibold text-lg">Total</span>
            <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};