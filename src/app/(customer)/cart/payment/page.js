import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
// import { getPayDataAPI, getPaymentAPI } from '../../../apis/cart.api.js';
// import { submitCart, loadCartFromAPI, clearCart } from '../../../redux/slices/cart.slice.js';
// import { loadStripe } from '@stripe/stripe-js';
//import { useStripe, useElements, Elements, EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';

//const testKey = import.meta.env.VITE_TEST_KEY;
//const stripePromise = loadStripe(testKey);

const Payment = () => {
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { email, firstName, lastName, address, contactPhone, promotionCode, updatedCartItems } = location.state || {};

    const [paymentError, setPaymentError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState(null);
    const [loadingClientSecret, setLoadingClientSecret] = useState(true);
    const [sessionId, setSessionId] = useState(null);
    const [loadingSessionId, setLoadingSessionId] = useState(true);
    const [showEmbeddedCheckout, setShowEmbeddedCheckout] = useState(false);
    const [isPayButtonClicked, setIsPayButtonClicked] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const stripe = useStripe();
    const elements = useElements();

    const cartItems = useSelector((state) => state.cart.items || []);
    const cartId = localStorage.getItem("cartId");

    const fetchPaymentData = useCallback(async () => {
        if (!cartId) return;
        try {
            const response = await getPayDataAPI(cartId);

            if (response.clientSecret) {
                setClientSecret(response.clientSecret);
            } else {
                setPaymentError("Client secret is missing.");
            }

            if (response.sessionId) {
                setSessionId(response.sessionId);
            } else {
                setPaymentError("SessionId is missing.");
            }
        } catch (error) {
            setPaymentError("Failed to fetch payment information.");
        } finally {
            setLoadingClientSecret(false);
            setLoadingSessionId(false);
        }
    }, [cartId]);

    useEffect(() => {
        fetchPaymentData();
        if (cartId) {
            dispatch(loadCartFromAPI());
        }
    }, [fetchPaymentData, dispatch, cartId]);

    const getPaymentStatus = async () => {
        try {
            const response = await getPaymentAPI(cartId, sessionId);

            // Log the entire response for debugging
            console.log('Payment Status Response:', response);

            // Check the payment status
            if (response.payment_status === 'paid') {
                console.log('Payment status is paid.');
                return true; // Payment is valid for processing
            } else {
                console.log('Payment status is not paid. Cannot proceed with processing.');
                setPaymentError("Payment is not completed. Please complete the payment before submitting the cart.");
                return false; // Payment is not valid for processing
            }
        } catch (error) {
            console.error('Error fetching payment status:', error);
            setPaymentError("Failed to fetch payment status.");
            return false; // Error occurred
        }
    };

    const totalPrice = updatedCartItems.reduce((total, item) => {
        const price = parseFloat(item.productPrice) || 0;
        const quantity = parseInt(item.quantity, 10) || 0;
        return total + price * quantity;
    }, 0);

    const handleConfirmation = async (event) => {
        event.preventDefault();

        if (!isPayButtonClicked) {
            setPaymentError("Please click the Pay button to proceed with payment.");
            return; // Exit if the pay button has not been clicked
        }

        if (!stripe || !elements || !clientSecret) {
            setPaymentError("Stripe.js has not loaded yet or client secret is missing.");
            return;
        }

        const isPaymentValid = await getPaymentStatus();
        if (!isPaymentValid) {
            console.log('Payment is not valid. Exiting confirmation.');
            return; // Exit if the payment is not valid
        }

        setIsProcessing(true);
        setPaymentError(null);

        try {
            const payload = {
                cartId,
                contactName: `${firstName} ${lastName}`,
                email,
                address,
                contactPhone,
                promotionCode,
            };

            await dispatch(submitCart(payload)).unwrap();
            localStorage.removeItem('cartId');
            localStorage.removeItem("checkoutData");
            dispatch(clearCart());
            setIsModalOpen(true);
        } catch (error) {
            setPaymentError("There was an error processing your payment.");
        } finally {
            setIsProcessing(false);
        }
    };

    // Function to close the modal and redirect
    const handleContinueShopping = () => {
        setIsModalOpen(false);
        navigate("/"); // Navigate back to the homepage
    };

    const handleViewOrder = () => {
        setIsModalOpen(false);
        navigate("/profile");
    };

    const handlePayClick = () => {
        setIsPayButtonClicked(true);
        setShowEmbeddedCheckout(true);
    };

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-[#F5F5F5] p-4">
            <div className="flex w-full max-w-6xl bg-white shadow-lg rounded-lg border border-solid overflow-hidden">
                {/* Left Section */}
                <div className="w-2/3 bg-gray-100 p-8 rounded-lg shadow-md">
                    {/* Payment Information */}
                    <h2 className="text-2xl font-bold mb-4">Payment Information</h2>

                    {/* Contact Section */}
                    <div className="mb-6 p-4 rounded-lg shadow-sm bg-white">
                        <h3 className="text-lg font-semibold mb-2">Contact Details</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email:</label>
                                <input
                                    type="text"
                                    className={`w-full border border-gray-300 p-2 rounded-md bg-gray-50`}
                                    value={email}
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone:</label>
                                <input type="text"
                                    className={`w-full border border-gray-300 p-2 rounded-md bg-gray-50`}
                                    value={contactPhone}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    {/* Delivery Section */}
                    <div className="mb-6 p-4 rounded-lg shadow-sm bg-white">
                        <h3 className="text-lg font-semibold mb-2">Delivery Information</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name:</label>
                                <input
                                    type="text"
                                    className={`w-full border border-gray-300 p-2 rounded-md bg-gray-50`}
                                    value={firstName}
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name:</label>
                                <input
                                    type="text"
                                    className={`w-full border border-gray-300 p-2 rounded-md bg-gray-50`}
                                    value={lastName}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address:</label>
                            <input
                                type="text"
                                className={`w-full border border-gray-300 p-2 rounded-md bg-gray-50`}
                                value={address}
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-6 p-4 rounded-lg shadow-sm bg-white">
                        <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                        {loadingClientSecret ? (
                            <p>Loading payment information...</p>
                        ) : (
                            <>
                                {showEmbeddedCheckout ? (
                                    <EmbeddedCheckoutProvider
                                        stripe={stripePromise}
                                        options={{ clientSecret }}
                                    >
                                        <EmbeddedCheckout />
                                    </EmbeddedCheckoutProvider>
                                ) : (
                                    <button
                                        className="bg-[#E89F71] text-white px-6 py-2 rounded-md hover:bg-orange-500 transition duration-200"
                                        onClick={handlePayClick}
                                    >
                                        Pay
                                    </button>
                                )}
                                {paymentError && <p className="text-red-500 text-sm">{paymentError}</p>}
                            </>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 mt-8">
                        <Link to="/carts/checkout" state={{ email, firstName, lastName, address, contactPhone }}>
                            <button className="border border-[#E89F71] px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-md transition duration-200">
                                Back
                            </button>
                        </Link>
                        <button
                            className="bg-[#E89F71] text-white px-6 py-2 rounded-md hover:bg-orange-500 transition duration-200"
                            onClick={handleConfirmation}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Processing...' : 'Confirm checkout'}
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


                    {/* Modal */}
                    {isModalOpen && (
                        <div
                            className="fixed inset-0 bg-[#F9F1E7] bg-opacity-80 flex justify-center items-center z-50 transition-opacity duration-300"
                            role="dialog"
                            aria-labelledby="modalTitle"
                            aria-hidden={!isModalOpen}
                        >
                            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center justify-center space-y-6 transform transition-transform duration-300">
                                <div>
                                    <img
                                        className="h-24 w-24"
                                        src="/assets/check.png"
                                        alt="Checkmark Icon"
                                    />
                                </div>
                                <h2
                                    id="modalTitle"
                                    className="text-2xl text-[#008080] font-bold text-center"
                                >
                                    Thank You For Your Order
                                </h2>
                                <p className="text-center text-gray-700">
                                    Your order has been successfully placed. You can continue shopping or review your orders.
                                </p>
                                <div className="flex flex-row space-x-4">
                                    <button
                                        onClick={handleContinueShopping}
                                        className="bg-[#E89F71] text-white px-6 py-2 rounded-md hover:bg-orange-500 transition duration-200"
                                    >
                                        Continue Shopping
                                    </button>
                                    <button
                                        onClick={handleViewOrder}
                                        className="bg-[#baa190] text-gray-600 px-6 py-2 rounded-md hover:bg-[#d1b7a0] transition duration-200"
                                    >
                                        View Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default function PaymentWrapper() {
    return (
        <>HI</>
        // <Elements stripe={stripePromise}>
        //     <Payment />
        // </Elements>
    );
}