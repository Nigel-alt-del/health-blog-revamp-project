
import { useState, useEffect, useRef } from "react";
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
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Healthcare",
    tags: "",
    image: ""
  });

  // Load existing post data when component mounts or post changes
  useEffect(() => {
    console.log("Loading post data:", post);
    if (post) {
      setFormData({
        title: post.title || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        category: post.category || "Healthcare",
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ""),
        image: post.image || ""
      });
    }
  }, [post]);

  // Track changes for auto-save
  useEffect(() => {
    setHasUnsavedChanges(true);
    
    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    // Set new auto-save timer
    autoSaveTimerRef.current = setTimeout(() => {
      handleSaveDraft();
    }, 30000); // Auto-save every 30 seconds

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formData]);

  const formatPostData = (data: typeof formData) => ({
    id: post.id, // Preserve original ID
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    category: data.category,
    tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    image: data.image,
    // Preserve existing metadata
    publishedAt: post.publishedAt,
    readTime: post.readTime || "5 min read",
    featured: post.featured || false,
    // Preserve or use default author data
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
      console.log("Saving draft with data:", formData);
      console.log("Original post ID:", post.id);
      
      const updatedPost = formatPostData(formData);
      console.log("Formatted post for save:", updatedPost);
      
      // Save to localStorage
      updatePostInStorage(updatedPost);
      
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      console.log("Draft updated successfully:", updatedPost);
      
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
    console.log("Update clicked with data:", formData);
    console.log("Original post:", post);
    
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

    try {
      const updatedPost = formatPostData(formData);
      console.log("Submitting updated post:", updatedPost);

      // Save to localStorage first
      updatePostInStorage(updatedPost);
      
      onSubmit(updatedPost);
      setHasUnsavedChanges(false);
      
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
    }
  };

  const handlePreview = () => {
    console.log("Preview clicked");
    
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
    setFormData(newFormData);
  };

  // Only require title for preview, title + excerpt for publishing
  const canPreview = !!(formData.title?.trim());
  const canPublish = !!(formData.title?.trim() && formData.excerpt?.trim());
  
  console.log("Can preview:", canPreview, "Can publish:", canPublish);
  console.log("Form data content:", formData.content);

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
            onImageChange={(image) => handleFormDataChange({ ...formData, image })}
          />

          <SimplifiedRichTextEditor
            value={formData.content}
            onChange={(content) => handleFormDataChange({ ...formData, content })}
            placeholder="Edit your report content here. Use the formatting tools above to style your text and add images..."
          />
        </div>

        <AdminSidebar
          onPreview={handlePreview}
          onPublish={handleSubmit}
          onCancel={onCancel}
          onSaveDraft={handleSaveDraft}
          canPreview={canPublish}
          isEditing={true}
          isSaving={isSaving}
          lastSaved={lastSaved}
          hasUnsavedChanges={hasUnsavedChanges}
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
