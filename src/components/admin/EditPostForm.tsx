
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { PostBasicInfo } from "./PostBasicInfo";
import { FeaturedImageUpload } from "./FeaturedImageUpload";
import { AdminSidebar } from "./AdminSidebar";
import SimplifiedRichTextEditor from "./SimplifiedRichTextEditor";
import { ReportPreview } from "../ReportPreview";
import { updatePostInStorage, type BlogPost } from "@/utils/localStorage";

interface EditPostFormProps {
  post: any;
  onSubmit: (updatedPost: any) => void;
  onCancel: () => void;
}

export const EditPostForm = ({ post, onSubmit, onCancel }: EditPostFormProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Healthcare",
    tags: "",
    image: "",
    imageSize: "medium" as "small" | "medium" | "large" | "full"
  });

  // Load existing post data when component mounts or post changes
  useEffect(() => {
    console.log("EditPostForm - Loading post data:", post);
    if (post && post.id) {
      try {
        const tagsString = Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || "");
        
        const newFormData = {
          title: post.title || "",
          excerpt: post.excerpt || "",
          content: post.content || "",
          category: post.category || "Healthcare",
          tags: tagsString,
          image: post.image || "",
          imageSize: post.imageSize || "medium"
        };
        
        console.log("EditPostForm - Setting form data:", newFormData);
        setFormData(newFormData);
        
        // Allow time for the editor to initialize before marking as loaded
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
        
      } catch (error) {
        console.error("EditPostForm - Error loading post data:", error);
        toast({
          title: "Loading Error",
          description: "Error loading post data. Please try again.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    } else {
      console.error("EditPostForm - No valid post received:", post);
      setIsLoading(false);
    }
  }, [post, toast]);

  const formatPostData = (data: typeof formData) => ({
    id: post.id,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    category: data.category,
    tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    image: data.image,
    imageSize: data.imageSize,
    publishedAt: post.publishedAt,
    readTime: post.readTime || "5 min read",
    featured: post.featured || false,
    author: post.author || "InsureMyHealth Team",
    authorRole: post.authorRole || "Healthcare Policy Analyst",
    authorLinkedin: post.authorLinkedin || "",
    authorBio: post.authorBio || "",
    seoKeywords: post.seoKeywords || '',
    metaDescription: data.excerpt
  });

  const handleSaveDraft = async () => {
    if (!formData.title?.trim()) {
      toast({
        title: "Cannot Save Draft",
        description: "Please add a title before saving draft",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const updatedPost = formatPostData(formData);
      updatePostInStorage(updatedPost);
      
      toast({
        title: "Draft Saved",
        description: "Your changes have been saved successfully."
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save draft. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.title?.trim()) {
      toast({
        title: "Error",
        description: "Please add a title",
        variant: "destructive"
      });
      return;
    }

    if (!formData.excerpt?.trim()) {
      toast({
        title: "Error", 
        description: "Please add an excerpt",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    try {
      const updatedPost = formatPostData(formData);
      updatePostInStorage(updatedPost);
      onSubmit(updatedPost);
      
      toast({
        title: "Success",
        description: "Report updated successfully!"
      });
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

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

  const handleFormDataChange = (newFormData: any) => {
    console.log("EditPostForm - Form data changing:", newFormData);
    setFormData(newFormData);
  };

  const insertFeaturedImage = () => {
    if (!formData.image) {
      toast({
        title: "No Image",
        description: "Please upload a featured image first",
        variant: "destructive"
      });
      return;
    }

    try {
      const sizeStyles = {
        small: { width: "200px", height: "auto" },
        medium: { width: "400px", height: "auto" },
        large: { width: "600px", height: "auto" },
        full: { width: "100%", height: "auto" }
      };

      const size = sizeStyles[formData.imageSize];
      const imageHtml = `<div style="text-align: center; margin: 20px 0;"><img src="${formData.image}" alt="Featured image" style="width: ${size.width}; height: ${size.height}; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" /></div>`;
      
      const newContent = formData.content + imageHtml;
      setFormData({ ...formData, content: newContent });

      toast({
        title: "Image Inserted",
        description: "Featured image has been added to your content"
      });
    } catch (error) {
      console.error("Error inserting featured image:", error);
      toast({
        title: "Insert Failed",
        description: "Failed to insert image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const canPreview = !!(formData.title?.trim());
  const canPublish = !!(formData.title?.trim() && formData.excerpt?.trim());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-lg font-medium">Loading post data...</p>
          <p className="text-sm text-muted-foreground mt-2">Please wait while we load your content</p>
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
            onImageChange={(image) => handleFormDataChange({ ...formData, image })}
            onImageSizeChange={(size) => handleFormDataChange({ ...formData, imageSize: size })}
            onInsertToContent={insertFeaturedImage}
          />

          <SimplifiedRichTextEditor
            value={formData.content}
            onChange={(content) => handleFormDataChange({ ...formData, content })}
            placeholder="Edit your report content here. Use the formatting tools above to style your text. Click the image button in the toolbar to insert images directly at your cursor position..."
            hideImageButton={false}
          />
        </div>

        <AdminSidebar
          onPreview={handlePreview}
          onPublish={handleSubmit}
          onCancel={onCancel}
          onSaveDraft={handleSaveDraft}
          canPreview={canPreview}
          isEditing={true}
          isSaving={isSaving}
          lastSaved={null}
          hasUnsavedChanges={false}
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
