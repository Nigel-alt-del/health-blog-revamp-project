
import { useState } from "react";
import { PostBasicInfo } from "./PostBasicInfo";
import { FeaturedImageUpload } from "./FeaturedImageUpload";
import { AdminSidebar } from "./AdminSidebar";
import { SimpleContentEditor } from "./SimpleContentEditor";
import { ReportPreview } from "../ReportPreview";
import { useToast } from "@/hooks/use-toast";

export const PostForm = ({
  formData,
  handleFormDataChange,
  handleSaveDraft,
  handleSubmit,
  formatPostData,
  onCancel,
  isSaving,
  lastSaved,
  isEditMode,
  isLoading,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const handlePreview = () => {
    if (!formData.title?.trim()) {
      toast({
        title: "Preview Error",
        description: "Please add a title to preview the report",
        variant: "destructive"
      });
      return;
    }
    setShowPreview(true);
  };
  
  const handleContentChange = (content: string) => {
    handleFormDataChange({ content });
  };
  
  const handleImageChange = (image: string) => {
    handleFormDataChange({ image });
  };
  
  const handleImageSizeChange = (size: "small" | "medium" | "large" | "full") => {
    handleFormDataChange({ imageSize: size });
  };

  const canPreview = !!formData.title?.trim();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-lg font-medium">Loading editor...</p>
          <p className="text-sm text-muted-foreground mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PostBasicInfo 
            formData={formData}
            onChange={handleFormDataChange}
          />

          <FeaturedImageUpload
            image={formData.image}
            imageSize={formData.imageSize}
            onImageChange={handleImageChange}
            onImageSizeChange={handleImageSizeChange}
          />

          <SimpleContentEditor
            value={formData.content}
            onChange={handleContentChange}
            placeholder="Edit your report content here. Paste from Word, Google Docs, or type directly. You can use HTML tags for formatting."
          />
        </div>

        <AdminSidebar
          onPreview={handlePreview}
          onPublish={handleSubmit}
          onCancel={onCancel}
          onSaveDraft={handleSaveDraft}
          canPreview={canPreview}
          isEditing={isEditMode}
          isSaving={isSaving}
          lastSaved={lastSaved}
          hasUnsavedChanges={false} // This can be enhanced later if needed
        />
      </div>

      {showPreview && (
        <ReportPreview
          post={formatPostData(formData)}
          onClose={() => setShowPreview(false)}
          onPublish={handleSubmit}
        />
      )}
    </>
  );
};
