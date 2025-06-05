
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminAccess = () => {
  const navigate = useNavigate();

  const handleAdminAccess = () => {
    // Direct access to admin without password
    navigate("/admin");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-[#79858D] hover:text-[#20466d] transition-colors"
      title="Admin Access"
      onClick={handleAdminAccess}
    >
      <Settings className="h-4 w-4" />
    </Button>
  );
};

export default AdminAccess;
