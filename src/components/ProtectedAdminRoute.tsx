
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem("isAdminAuthenticated");
      const authTime = localStorage.getItem("adminAuthTime");
      
      if (isAuth === "true" && authTime) {
        // Check if authentication is still valid (24 hours)
        const authTimestamp = parseInt(authTime);
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (now - authTimestamp < twentyFourHours) {
          setIsAuthenticated(true);
        } else {
          // Authentication expired
          localStorage.removeItem("isAdminAuthenticated");
          localStorage.removeItem("adminAuthTime");
          navigate("/");
        }
      } else {
        navigate("/");
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20466d] mx-auto mb-4"></div>
          <p className="text-[#79858D]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to home
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
