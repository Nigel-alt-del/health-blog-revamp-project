
import { useState, useEffect } from "react";

interface AuthData {
  authenticated: boolean;
  timestamp: number;
  expires: number;
}

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const authDataString = localStorage.getItem("adminAuth");
      
      if (!authDataString) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const authData: AuthData = JSON.parse(authDataString);
      const now = Date.now();

      // Check if authentication has expired
      if (now > authData.expires) {
        localStorage.removeItem("adminAuth");
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      setIsAuthenticated(authData.authenticated);
    } catch (error) {
      console.error("Error checking auth status:", error);
      localStorage.removeItem("adminAuth");
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    logout,
    checkAuthStatus
  };
};
