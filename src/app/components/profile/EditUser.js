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
  const { user } = useAuth();

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
                  User Name
                </label>
                <input
                  name="name"
                  value={users.name}
                  onChange={(e) =>
                    setUsers({ ...users, name: e.target.value })
                  }
                  className="input-field"
                />
              </div>

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
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-1">
                  Role
                </label>
                <input
                  name="role"
                  value={users.role}
                  className="input-field cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary mr-4"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}