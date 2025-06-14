
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PostBasicInfo } from "./PostBasicInfo";
import { FeaturedImageUpload } from "./FeaturedImageUpload";
import { AdminSidebar } from "./AdminSidebar";
import { SimpleContentEditor } from "./SimpleContentEditor";
import { ReportPreview } from "../ReportPreview";
import { addPostToStorage } from "@/utils/supabaseStorage";

interface CreatePostFormProps {
  onSubmit: (post: any) => void;
  onCancel: () => void;
}

export const CreatePostForm = ({ onSubmit, onCancel }: CreatePostFormProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedDraftId, setSavedDraftId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
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

  const generateId = (title: string): string => {
    const baseId = title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    const timestamp = Date.now();
    return `${baseId}-${timestamp}`;
  };

  const formatPostData = (data: typeof formData, isDraft: boolean = false) => ({
    id: savedDraftId || generateId(data.title),
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    category: data.category,
    tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    image: data.image,
    imageSize: data.imageSize,
    publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readTime: "5 min read",
    featured: false,
    author: "InsureMyHealth Team",
    authorRole: "Healthcare Policy Analyst",
    authorLinkedin: "",
    authorBio: "",
    seoKeywords: '',
    metaDescription: data.excerpt,
    isDraft: isDraft
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
      const draftPost = formatPostData(formData, true);
      console.log("Saving draft to Supabase:", draftPost);
      
      await addPostToStorage(draftPost);
      setSavedDraftId(draftPost.id);
      setLastSaved(new Date());
      
      toast({
        title: "Draft Saved",
        description: "Your draft has been saved successfully and will appear in your admin dashboard."
      });
      
      // Single refresh event - the debounced system will handle it efficiently
      window.dispatchEvent(new CustomEvent('postsRefreshed'));
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
    console.log("Create clicked with data:", formData);
    
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

    const post = formatPostData(formData, false);
    console.log("Submitting new post:", post);
    
    onSubmit(post);
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

  const insertFeaturedImage = () => {
    if (!formData.image) {
      toast({
        title: "No Image",
        description: "Please upload a featured image first",
        variant: "destructive"
      });
      return;
    }

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
  };

  const canPreview = !!(formData.title?.trim());
  const canPublish = !!(formData.title?.trim() && formData.excerpt?.trim());

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

          <SimpleContentEditor
            value={formData.content}
            onChange={(content) => handleFormDataChange({ ...formData, content })}
            placeholder="Paste your report content here from Word, Google Docs, or type directly. You can use HTML tags for formatting."
          />
        </div>

        <AdminSidebar
          onPreview={handlePreview}
          onPublish={handleSubmit}
          onCancel={onCancel}
          onSaveDraft={handleSaveDraft}
          canPreview={canPreview}
          isEditing={false}
          isSaving={isSaving}
          lastSaved={lastSaved}
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
