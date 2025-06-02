
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Send, X } from "lucide-react";

interface AdminSidebarProps {
  onPreview: () => void;
  onPublish: () => void;
  onCancel: () => void;
  canPreview: boolean;
  isEditing?: boolean;
}

export const AdminSidebar = ({ 
  onPreview, 
  onPublish, 
  onCancel, 
  canPreview, 
  isEditing = false 
}: AdminSidebarProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isEditing ? 'Update Report' : 'Publish Report'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={onPreview}
            variant="outline"
            className="w-full"
            disabled={!canPreview}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          
          <Button
            onClick={onPublish}
            className="w-full"
            disabled={!canPreview}
          >
            <Send className="mr-2 h-4 w-4" />
            {isEditing ? 'Update Report' : 'Publish Report'}
          </Button>
          
          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Publishing Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Ensure title and excerpt are descriptive</li>
            <li>• Add relevant tags for better discovery</li>
            <li>• Choose appropriate category</li>
            <li>• {isEditing ? 'Review changes carefully' : 'Preview before publishing'}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
