// /app/hooks/useAuth.js
import { useEffect } from "react";
import useUserStore from "../stores/userStore";

const useAuth = () => {
  const { user, idToken, fetchUser, loading, logout } = useUserStore();

  useEffect(() => {
    if (!user) fetchUser(); // fetch if not already loaded
  }, [user, fetchUser]);

  return {
    user,
    username: user?.username || "Unknown",
    fullName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
    userRole: user?.roles?.[0]?.name || "Unknown",
    isAuthenticated: !!user,
    loading,
    logout,
    idToken,
  };
};

export default useAuth;
