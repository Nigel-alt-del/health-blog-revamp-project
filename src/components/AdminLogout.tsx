
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    localStorage.removeItem("adminAuthTime");
    navigate("/");
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      size="sm"
      className="flex items-center space-x-2"
    >
      <LogOut className="h-4 w-4" />
      <span>Logout</span>
    </Button>
  );
};

export default AdminLogout;
