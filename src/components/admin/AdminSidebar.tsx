
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Save } from "lucide-react";

interface AdminSidebarProps {
  onPreview: () => void;
  onPublish: () => void;
  onCancel: () => void;
  canPreview: boolean;
}

export const AdminSidebar = ({ onPreview, onPublish, onCancel, canPreview }: AdminSidebarProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            onClick={onPreview} 
            variant="outline" 
            className="w-full"
            disabled={!canPreview}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview Report
          </Button>
          <Button onClick={onPublish} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Publish Report
          </Button>
          <Button variant="outline" onClick={onCancel} className="w-full">
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
