import React, { useState, useEffect } from 'react';
// import useAuth from '../../../hooks/useAuth.js';
// import { changePassword } from "../../../aws/cognitoService.js";
// import { listOrdersAPI, cancelOrderAPI, getOrderDetailAPI } from '../../../apis/order.api.js';
// import { getProfileDetailAPI, updateProfileAPI } from '../../../apis/profile.api.js';


export default function RightSide ({ setActiveSection }) {
    //const { idToken, accessToken } = useAuth(); // Ensure accessToken is available
    const [profile, setProfile] = useState({
        customerId: '',
        firstName: '',
        lastName: '',
        email: '',
        userName: '',
        oldPassword: '', // Initialize oldPassword
        newPassword: '', // Initialize newPassword
    });
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [orderDetails, setOrderDetails] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [orderStatusFilter, setOrderStatusFilter] = useState('all'); // Default to 'all'

    const filteredOrders = () => {
        if (orderStatusFilter === 'all') {
            return orders; // Return all orders if 'all' is selected
        }
        return orders.filter(order => order.status === orderStatusFilter); // Filter by selected status
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isValidPassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/;
        return passwordRegex.test(password);
    };

    const validateEmail = () => {
        if (!emailRegex.test(profile.email)) {
            setError("Please enter a valid email address.");
            return false;
        }
        return true;
    };

    const validatePassword = () => {
        const passwordErrorMessage = "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.";

        // Validate new password
        if (profile.newPassword && !isValidPassword(profile.newPassword)) {
            setError(passwordErrorMessage);
            return false;
        }

        // Clear error if the new password is valid
        setError(null);
        return true;
    };

    useEffect(() => {
        // const fetchProfile = async () => {
        //     setLoadingProfile(true);
        //     setError(null);
        //     try {
        //         const profileData = await getProfileDetailAPI();
        //         setProfile({
        //             customerId: profileData.customerId,
        //             firstName: profileData.firstName,
        //             lastName: profileData.lastName,
        //             email: profileData.email,
        //             userName: profileData.userName,
        //         });
        //     } catch (err) {
        //         setError(err.message);
        //     } finally {
        //         setLoadingProfile(false);
        //     }
        // };

        //fetchProfile();
    }, []);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!validatePassword()) return;

        // Ensure accessToken is available
        if (!accessToken) {
            alert('Access token is not available. Please log in again.');
            return;
        }

        try {
            await changePassword(accessToken, profile.oldPassword, profile.newPassword);
            alert('Password updated successfully!');
            // Clear password fields after updating
            setProfile(prevProfile => ({ ...prevProfile, oldPassword: '', newPassword: '' }));
        } catch (error) {
            console.error('Error changing password:', error);
            alert(error.message); // Display the specific error message
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!profile.email || !profile.firstName || !profile.lastName) {
            alert('Please fill in all required fields.');
            return;
        }

        if (!validateEmail()) return;

        try {
            // Update profile details
            const updatedProfile = await updateProfileAPI({
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
            });

            // Update local state with the new profile data
            setProfile(prevProfile => ({
                ...prevProfile,
                firstName: updatedProfile.firstName || 'Not Provided',
                lastName: updatedProfile.lastName || 'Not Provided',
                email: updatedProfile.email || prevProfile.email,
            }));
            alert('Profile updated successfully!');

        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.message); // Display the specific error message
        }
    };

    // useEffect(() => {
    //     if (setActiveSection === 2 && idToken) {
    //         const fetchOrders = async () => {
    //             setLoadingOrders(true);
    //             try {
    //                 const data = await listOrdersAPI();
    //                 setOrders(data);
    //             } catch (error) {
    //                 console.error('Error fetching orders:', error);
    //                 setOrders([]);
    //             } finally {
    //                 setLoadingOrders(false);
    //             }
    //         };

    //         fetchOrders();
    //     }
    // }, [setActiveSection, idToken]);

    const handleCancelOrder = async (orderId) => {
        if (!cancelReason) {
            alert("Please provide a reason for canceling the order.");
            return;
        }

        try {
            await cancelOrderAPI(orderId, cancelReason);
            alert('Order canceled successfully!');
            setOrders((prevOrders) =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: 'cancelled' } : order
                )
            );
            setIsCancelModalOpen(false); // Close the modal after successful cancellation
            setCancelReason(''); // Reset the reason
        } catch (error) {
            console.error('Error canceling order:', error);
            alert('Failed to cancel order. Please try again later.');
        }
    };

    const renderOrderFilter = () => (
        <div className="mb-4">
            <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700">Filter by Order Status:</label>
            <select
                id="orderStatus"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
            >
                <option value="all">All Orders</option>
                <option value="new">New</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
            </select>
        </div>
    );

    const handleOrderClick = async (orderId) => {
        if (selectedOrderId === orderId) {
            setSelectedOrderId(null);
            setOrderDetails(null);
        } else {
            try {
                const details = await getOrderDetailAPI(orderId);
                setOrderDetails(details);
                setSelectedOrderId(orderId);
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        }
    };

    const renderPersonalInfo = () => (
        <div className="w-full bg-white shadow-xl p-6 space-y-6 rounded-lg max-w-5xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 text-center">My Personal Information</h1>
            {loadingProfile ? (
                <p className="text-lg text-gray-600 text-center">Loading profile...</p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            id="userName"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="Enter your username"
                            value={profile.userName}
                            onChange={(e) => setProfile({ ...profile, userName: e.target.value })}
                            readOnly
                        />
                    </div>

                    {/* Firstname and Lastname */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">Firstname</label>
                            <input
                                type="text"
                                id="firstName"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="Enter your firstname"
                                value={profile.firstName}
                                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                            />
                        </div>

                        <div>
                            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Lastname</label>
                            <input
                                type="text"
                                id="lastName"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue- 500 transition"
                                placeholder="Enter your lastname"
                                value={profile.lastName}
                                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="Enter your email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex">
                        <button
                            type="submit"
                            className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Update Profile
                        </button>
                    </div>
                </form>
            )}
        </div>
    );

    const renderChangePassword = () => (
        <div className="mt-5 w-full bg-white shadow-xl p-6 space-y-6 rounded-lg max-w-5xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 text-center">Change Password</h1>
            <form onSubmit={handleChangePassword} className="space-y-6">
                {/* Old Password */}
                <div>
                    <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Old Password</label>
                    <input
                        type="password"
                        id="oldPassword"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Enter your old password"
                        value={profile.oldPassword}
                        onChange={(e) => {
                            setProfile({ ...profile, oldPassword: e.target.value });
                            setError(null); // Clear error when typing
                        }}
                    />
                </div>

                {/* New Password */}
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Enter your new password"
                        value={profile.newPassword}
                        onChange={(e) => {
                            setProfile({ ...profile, newPassword: e.target.value });
                            setError(null); // Clear error when typing
                        }}
                    />
                </div>

                {/* Display Error Message */}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Action Buttons */}
                <div className="flex">
                    <button
                        type="submit"
                        className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Change Password
                    </button>
                </div>
            </form>
        </div>
    );

    const renderOrders = () => (
        <div className="w-full space-y-4">
            <div className="bg-white p-4 shadow rounded-lg">
                <h1 className="text-2xl font-semibold text-gray-800 text-center">My Orders</h1>
                {renderOrderFilter()}
            </div>
            {loadingOrders ? (
                <p className="text-lg text-gray-600 text-center">Loading orders...</p>
            ) : filteredOrders().length > 0 ? (
                <div className="space-y-4">
                    {filteredOrders().map((order) => (
                        <div key={order.id} className="bg-white shadow-lg p-4 rounded-xl space-y-2 cursor-pointer" onClick={() => handleOrderClick(order.id)}>
                            <div className="flex justify-between items-center">
                                <p className="text-lg font-semibold text-gray-600">Order Number:</p>
                                <p className="text-lg font-bold text-green-600">{order.orderNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Order Status: <span className="font-medium">{order.status}</span></p>
                                <p className="text-sm text-gray-500">Order Date: <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                                <p className="text-sm text-gray-500">
                                    Total Amount:
                                    <span className={`font-medium ${order.discountAmount ? 'text-green-600' : ''}`}>
                                        {order.discountAmount
                                            ? ` $${order.discountAmount.toFixed(2)} (discount applied: $${(order.totalAmount - order.discountAmount).toFixed(2)})`
                                            : ` $${order.totalAmount.toFixed(2)}`}
                                    </span>
                                </p>
                            </div>
                            {selectedOrderId === order.id && orderDetails && (
                                <div className="mt-2">
                                    <h2 className="text-lg font-semibold">Order Items:</h2>
                                    <ul className="list-disc pl-5">
                                        {orderDetails.orderItems.map(item => (
                                            <li key={item.id} className="text-sm text-gray-600">
                                                {item.productName} - Quantity: {item.quantity} - Price: $
                                                {item.discountPrice
                                                    ? item.discountPrice + ` (Previous price: $` + item.productPrice + `)`
                                                    : item.productPrice}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {order.status === 'new' && (
                                <div className="flex justify-end">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsCancelModalOpen(true); // Open the cancel modal
                                            setSelectedOrderId(order.id); // Set the selected order ID
                                        }}
                                        className="mt-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
                                    >
                                        Cancel Order
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-lg text-gray-600 text-center">No orders found.</p>
            )}
        </div>
    );

    const renderCancelModal = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Cancel Order</h2>
                <p>Please provide a reason for canceling the order:</p>
                <textarea
                    className="w-full border border-gray-300 rounded-lg p-2 mt-2"
                    rows="4"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Enter your reason here..."
                />
                <div className="flex justify-end mt-4">
                    <button
                        onClick={() => setIsCancelModalOpen(false)}
                        className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleCancelOrder(selectedOrderId)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
                    >
                        Confirm Cancel
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {setActiveSection === 1 && (
                <>
                    {renderPersonalInfo()}
                    {renderChangePassword()}
                </>
            )}
            {setActiveSection === 2 && renderOrders()}
            {isCancelModalOpen && renderCancelModal()}
        </div>
    );
};
