"use client";
import React from "react";

export default function ProfileForm({profile, setProfile, handleSubmit, loadingProfile}) {
    return(
        <>
         <div className="w-full bg-white shadow-xl p-6 space-y-6 rounded-lg mx-auto">
      <h1 className="font-urbanist text-2xl font-semibold text-primary text-center">
        My Personal Information
      </h1>
      {loadingProfile ? (
        <p className="font-roboto text-lg text-gray-600 text-center">
          Loading profile...
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Firstname and Lastname */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-gray-700"
              >
                Firstname
              </label>
              <input
                type="text"
                id="firstName"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 transition"
                placeholder="Enter your firstname"
                value={profile.firstName}
                onChange={(e) =>
                  setProfile({ ...profile, firstName: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-700"
              >
                Lastname
              </label>
              <input
                type="text"
                id="lastName"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 transition"
                placeholder="Enter your lastname"
                value={profile.lastName}
                onChange={(e) =>
                  setProfile({ ...profile, lastName: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2  transition"
                placeholder="Enter your email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            </div>
            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 transition"
                placeholder="Enter your phone number"
                value={profile.phoneNumber}
                onChange={(e) =>
                  setProfile({ ...profile, phoneNumber: e.target.value })
                }
              />
            </div>
          </div>
          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 transition"
              placeholder="Enter your address"
              value={profile.address}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
            />
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="userName"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 transition cursor-not-allowed"
              placeholder="Enter your username"
              value={profile.userName}
              onChange={(e) =>
                setProfile({ ...profile, userName: e.target.value })
              }
              readOnly
            />
          </div>

          {/* Action Buttons */}
          <div className="flex">
            <button
              type="submit"
              className="w-full py-3 font-semibold text-white bg-[#6C7A84] rounded-lg hover:bg-[#4A5A64] transition duration-200"
            >
              Update Profile
            </button>
          </div>
        </form>
      )}
    </div>
        </>
    )
}