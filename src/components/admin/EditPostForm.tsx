
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { PostBasicInfo } from "./PostBasicInfo";
import { FeaturedImageUpload } from "./FeaturedImageUpload";
import { AdminSidebar } from "./AdminSidebar";
import SimplifiedRichTextEditor from "./SimplifiedRichTextEditor";
import { ReportPreview } from "../ReportPreview";

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
    author: "",
    authorRole: "",
    authorLinkedin: "",
    category: "Healthcare",
    tags: "",
    readTime: "5 min read",
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
        author: post.author || "",
        authorRole: post.authorRole || "",
        authorLinkedin: post.authorLinkedin || "",
        category: post.category || "Healthcare",
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ""),
        readTime: post.readTime || "5 min read",
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
    ...post, // Keep original post properties like id, publishedAt, etc.
    ...data,
    tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
  });

  const handleSaveDraft = async () => {
    setIsSaving(true);
    
    try {
      // Simulate saving draft (in real app, this would call an API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      toast({
        title: "Draft Saved",
        description: "Your changes have been saved automatically."
      });
    } catch (error) {
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

    const updatedPost = formatPostData(formData);

    console.log("Submitting updated post:", updatedPost);
    onSubmit(updatedPost);
    setHasUnsavedChanges(false);
    toast({
      title: "Success",
      description: "Report updated successfully!"
    });
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
            placeholder="Edit your report content here. Use the section templates above to add new sections..."
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
