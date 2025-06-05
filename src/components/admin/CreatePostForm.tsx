import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { PostBasicInfo } from "./PostBasicInfo";
import { FeaturedImageUpload } from "./FeaturedImageUpload";
import { AdminSidebar } from "./AdminSidebar";
import SimplifiedRichTextEditor from "./SimplifiedRichTextEditor";
import { ReportPreview } from "../ReportPreview";
import { addPostToStorage, type BlogPost } from "@/utils/localStorage";

interface CreatePostFormProps {
  onSubmit: (post: any) => void;
  onCancel: () => void;
}

export const CreatePostForm = ({ onSubmit, onCancel }: CreatePostFormProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
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

  // Track changes for auto-save
  useEffect(() => {
    // Only set unsaved changes if there's actual content
    if (formData.title || formData.excerpt || formData.content) {
      setHasUnsavedChanges(true);
      
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      // Set new auto-save timer
      autoSaveTimerRef.current = setTimeout(() => {
        handleSaveDraft();
      }, 30000); // Auto-save every 30 seconds
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formData]);

  const generateId = (title: string): string => {
    const baseId = title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    const timestamp = Date.now();
    return `${baseId}-${timestamp}`;
  };

  const formatPostData = (data: typeof formData) => ({
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    category: data.category,
    tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    image: data.image,
    readTime: "5 min read",
    author: "InsureMyHealth Team",
    authorRole: "Healthcare Policy Analyst"
  });

  const formatPostDataForPreview = (data: typeof formData) => ({
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    category: data.category,
    tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    image: data.image,
    readTime: "5 min read",
    author: "InsureMyHealth Team",
    authorRole: "Healthcare Policy Analyst"
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
      
      // Create or update draft
      const draftPost: BlogPost = {
        id: draftId || generateId(formData.title),
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: "5 min read",
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        featured: false,
        image: formData.image || "/placeholder.svg",
        seoKeywords: '',
        metaDescription: formData.excerpt
      };

      // Save to localStorage
      addPostToStorage(draftPost);
      
      if (!draftId) {
        setDraftId(draftPost.id);
      }
      
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      console.log("Draft saved successfully:", draftPost);
      
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
    console.log("Submit clicked with data:", formData);
    
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
      const postData = formatPostData(formData);
      console.log("Submitting post data:", postData);
      
      onSubmit(postData);
      setHasUnsavedChanges(false);
      
      toast({
        title: "Success",
        description: "Report created successfully!"
      });
    } catch (error) {
      console.error("Error submitting post:", error);
      toast({
        title: "Submission Failed",
        description: "Failed to create report. Please try again.",
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
    console.log("Form data changed:", newFormData);
    setFormData(newFormData);
  };

  // Only require title for preview, title + excerpt for publishing
  const canPreview = !!(formData.title?.trim());
  const canPublish = !!(formData.title?.trim() && formData.excerpt?.trim());
  
  console.log("Can preview:", canPreview, "Can publish:", canPublish);

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
            onChange={(content) => {
              console.log("Content changed:", content);
              handleFormDataChange({ ...formData, content });
            }}
            placeholder="Write your report content here. Use the formatting tools above to style your text and add images..."
          />
        </div>

        <AdminSidebar
          onPreview={handlePreview}
          onPublish={handleSubmit}
          onCancel={onCancel}
          onSaveDraft={handleSaveDraft}
          canPreview={canPublish}
          isSaving={isSaving}
          lastSaved={lastSaved}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      </div>

      {showPreview && (
        <ReportPreview
          post={formatPostDataForPreview(formData)}
          onClose={() => setShowPreview(false)}
          onPublish={handleSubmit}
        />
      )}
    </>
  );
};
