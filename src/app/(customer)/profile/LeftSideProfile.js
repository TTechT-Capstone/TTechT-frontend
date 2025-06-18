'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

// import { getProfileDetailAPI } from '../../../apis/profile.api.js';
// import useAuth from '../../../hooks/useAuth.js';

export default function LeftSideProfile({ setActiveSection }) {
  const [username, setUsername] = useState();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  //const { isAuthenticated, userRole } = useAuth();

  useEffect(() => {
    async function fetchUserProfile() {
      setLoading(true);
    //   setError(null);
    //   try {
    //     const userProfile = await getProfileDetailAPI();
    //     setUsername(userProfile.userName || 'User');
    //   } catch (err) {
    //     setError('Failed to load user profile.');
    //     console.error(err);
    //   } finally {
    //     setLoading(false);
    //   }
    }
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    // if (window.confirm('Are you sure you want to log out?')) {
    //   setIsLoading(true);
    //   ['idToken','accessToken','refreshToken','checkoutData','username']
    //     .forEach(k => localStorage.removeItem(k));
    //   router.push('/');
    //   window.location.reload();
    }

  return (
    <div className="left-side flex flex-col space-y-6 p-4">
      <div className="rounded-sm profile flex items-center space-x-4 bg-white p-4 shadow hover:shadow-lg">
        <div>
          <p className="font-roboto text-lg text-gray-500">Hi,</p>
          <h1 className="font-urbanist font-bold text-2xl text-gray-800">
            {loading ? 'Loading...' : username}
          </h1>
        </div>
      </div>

      <div className="navigation flex flex-col space-y-4">
        <div
          onClick={() => setActiveSection(1)}
          className="nav-item rounded-sm flex items-center space-x-4 p-4 px-6 bg-white shadow hover:bg-gray-100 cursor-pointer"
        >
          {/* SVG and label */}
          <p className="font-urbanist font-bold text-lg text-secondary">My Personal Information</p>
        </div>

        {/*
        userRole && userRole !== 'admin' && 
          <div
            onClick={() => setActiveSection(2)}
            className="nav-item rounded-sm flex items-center space-x-4 p-4 px-6 bg-white shadow hover:bg-gray-100 cursor-pointer"
          >

            <p className="font-intel text-lg text-gray-700">My Orders</p>
          </div>
        */}
        
      </div>

      <div className="flex justify-center items-center">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className={`nav-item w-full p-4 text-gray-700 bg-gray-100 rounded-sm font-intel shadow ${
            isLoading ? 'bg-gray-300 cursor-not-allowed' : 'hover:bg-gray-200'
          }`}
        >
          {isLoading ? 'Logging out...' : 'Logout'}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
