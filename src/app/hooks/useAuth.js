// /app/hooks/useAuth.js
import { useEffect, useState } from "react";
import useUserStore from "../stores/userStore";

const useAuth = () => {
  const { user, seller, idToken, fetchUser, loading, logout, initializeToken} = useUserStore();

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Only run this on client
    if (typeof window !== "undefined" && !initialized) {
      initializeToken(); // Load token from localStorage
      setInitialized(true);
    }
  }, [initialized, initializeToken]);

  useEffect(() => {
    // Once initialized and token exists, fetch user if not already
    if (initialized && idToken && !user) {
      fetchUser();
    }
  }, [initialized, idToken, user, fetchUser]);

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
