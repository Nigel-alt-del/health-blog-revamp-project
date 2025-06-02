
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Send, X, Save, Clock } from "lucide-react";

interface AdminSidebarProps {
  onPreview: () => void;
  onPublish: () => void;
  onCancel: () => void;
  onSaveDraft?: () => void;
  canPreview: boolean;
  isEditing?: boolean;
  isSaving?: boolean;
  lastSaved?: Date;
  hasUnsavedChanges?: boolean;
}

export const AdminSidebar = ({ 
  onPreview, 
  onPublish, 
  onCancel, 
  onSaveDraft,
  canPreview, 
  isEditing = false,
  isSaving = false,
  lastSaved,
  hasUnsavedChanges = false
}: AdminSidebarProps) => {
  const canPreviewWithTitle = (formData: any) => {
    return !!(formData?.title && formData?.title.trim());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isEditing ? 'Update Report' : 'Publish Report'}
          </CardTitle>
          {(lastSaved || isSaving || hasUnsavedChanges) && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {isSaving ? (
                "Saving..."
              ) : hasUnsavedChanges ? (
                "Unsaved changes"
              ) : lastSaved ? (
                `Saved ${lastSaved.toLocaleTimeString()}`
              ) : null}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={onPreview}
            variant="outline"
            className="w-full"
            disabled={!canPreview}
            title={!canPreview ? "Please add a title to preview" : ""}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          
          {onSaveDraft && (
            <Button
              onClick={onSaveDraft}
              variant="outline"
              className="w-full"
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
          )}
          
          <Button
            onClick={onPublish}
            className="w-full"
            disabled={!canPreview}
            title={!canPreview ? "Please add a title and excerpt to publish" : ""}
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
            <li>• Title is required for preview and publishing</li>
            <li>• Excerpt is required for publishing</li>
            <li>• Add relevant tags for better discovery</li>
            <li>• Choose appropriate category</li>
            <li>• Use font controls to enhance readability</li>
            <li>• {isEditing ? 'Review changes carefully' : 'Preview before publishing'}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
