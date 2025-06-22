// hooks/useAuth.js
import { useEffect, useState } from "react";
import { getProfileDetailAPI } from "../apis/profile.api"; 

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("idToken");
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      const userData = await getProfileDetailAPI();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth error:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("idToken");
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = "/"; // Redirect to home page
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    logout,
  };
}
