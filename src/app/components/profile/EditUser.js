"use client";

import useAuth from "@/app/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditUser({
  users,
  setUsers,
  handleSubmit,
  loadingUser,
}) {
  const router = useRouter();
  const { idToken, user, isAuthenticated, loading } = useAuth();
  const roleName = users.roles?.[0]?.name;

  const handleCancel = () => {
    router.push("/admin/users");
  };

  return (
    <>
      {loadingUser ? (
        <p className="font-roboto text-lg text-gray-600 text-center">
          Loading user...
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-6"
        >
          <div className="w-full bg-[#F4F4F4] p-6 rounded-2xl shadow space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-1">
                  User ID
                </label>
                <input
                  name="id"
                  value={users.id}
                  onChange={(e) => setUsers({ ...users, id: e.target.value })}
                  className="input-field cursor-not-allowed"
                  readOnly
                />
              </div>

              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-1">
                  User Name
                </label>
                <input
                  name="name"
                  value={users.username}
                  onChange={(e) => setUsers({ ...users, name: e.target.value })}
                  className="input-field cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>

            {roleName !== "ADMIN" && (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={users.firstName}
                    onChange={(e) =>
                      setUsers({ ...users, firstName: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    value={users.lastName}
                    onChange={(e) =>
                      setUsers({ ...users, lastName: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
              </div>
            )}

            {roleName !== "ADMIN" && (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Email
                  </label>
                  <input
                    name="email"
                    value={users.email}
                    onChange={(e) =>
                      setUsers({ ...users, email: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={users.phoneNumber}
                    onChange={(e) =>
                      setUsers({ ...users, phone: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
              </div>
            )}

            {roleName !== "ADMIN" && roleName !== "SELLER" && (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Address
                  </label>
                  <input
                    name="address"
                    value={users.address}
                    onChange={(e) =>
                      setUsers({ ...users, address: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-1">
                  Role
                </label>
                <input
                  name="role"
                  value={users.roles[0]?.name}
                  className="input-field cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full px-6 py-2 bg-[#FFFFFD] text-gray-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full px-6 py-2 bg-secondary text-white rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
