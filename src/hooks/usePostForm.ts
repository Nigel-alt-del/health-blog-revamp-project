
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { type BlogPost } from "@/types/blog";
import { addPostToStorage, updatePostInStorage } from "@/services/supabase/posts";

interface UsePostFormProps {
  initialPost?: BlogPost | null;
  onSubmit: (post: any) => void;
}

export const usePostForm = ({ initialPost, onSubmit }: UsePostFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Healthcare",
    tags: "",
    image: "",
    imageSize: "medium" as "small" | "medium" | "large" | "full"
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [savedDraftId, setSavedDraftId] = useState<string | null>(initialPost?.id || null);
  const { toast } = useToast();

  const isEditMode = !!initialPost?.id;

  useEffect(() => {
    if (isEditMode && initialPost) {
      try {
        const tagsString = Array.isArray(initialPost.tags) ? initialPost.tags.join(', ') : (initialPost.tags || "");
        setFormData({
          title: initialPost.title || "",
          excerpt: initialPost.excerpt || "",
          content: initialPost.content || "",
          category: initialPost.category || "Healthcare",
          tags: tagsString,
          image: initialPost.image || "",
          imageSize: (initialPost as any).imageSize || "medium"
        });
        setIsLoading(false);
      } catch (error) {
        console.error("usePostForm - Error loading post data:", error);
        toast({
          title: "Loading Error",
          description: "Error loading post data. Please try again.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [initialPost, isEditMode, toast]);

  const generateId = (title: string): string => {
    const baseId = title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    const timestamp = Date.now();
    return `${baseId}-${timestamp}`;
  };

  const formatPostData = useCallback((data: typeof formData, isDraft: boolean = false) => {
    const commonData = {
      id: savedDraftId || (isEditMode ? initialPost.id : generateId(data.title)),
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      image: data.image,
      imageSize: data.imageSize,
      metaDescription: data.excerpt,
      isDraft: isDraft
    };

    if (isEditMode) {
      return {
        ...commonData,
        publishedAt: initialPost.publishedAt,
        readTime: initialPost.readTime || "5 min read",
        featured: initialPost.featured || false,
        author: initialPost.author || "InsureMyHealth Team",
        authorRole: initialPost.authorRole || "Healthcare Policy Analyst",
        authorLinkedin: initialPost.authorLinkedin || "",
        authorBio: initialPost.authorBio || "",
        seoKeywords: (initialPost as any).seoKeywords || '',
      };
    }

    return {
      ...commonData,
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: "5 min read",
      featured: false,
      author: "InsureMyHealth Team",
      authorRole: "Healthcare Policy Analyst",
      authorLinkedin: "",
      authorBio: "",
      seoKeywords: '',
    };
  }, [initialPost, isEditMode, savedDraftId]);

  const handleFormDataChange = useCallback((newFormData: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...newFormData }));
  }, []);

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
    const draftPost = formatPostData(formData, true);
    
    try {
      if (savedDraftId) {
        await updatePostInStorage(draftPost as BlogPost);
      } else {
        await addPostToStorage(draftPost as BlogPost);
        setSavedDraftId(draftPost.id);
      }
      setLastSaved(new Date());
      toast({
        title: "Draft Saved",
        description: "Your changes have been saved successfully."
      });
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
    if (!formData.title?.trim() || !formData.excerpt?.trim()) {
      toast({
        title: "Error",
        description: "Please add a title and excerpt.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const updatedPost = formatPostData(formData);
      onSubmit(updatedPost);
      toast({
        title: "Success",
        description: `Report ${isEditMode ? 'updated' : 'created'} successfully!`
      });
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} post:`, error);
      toast({
        title: "Failed",
        description: `Failed to ${isEditMode ? 'update' : 'create'} report. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    handleFormDataChange,
    handleSaveDraft,
    handleSubmit,
    formatPostData,
    isSaving,
    isLoading,
    lastSaved,
    isEditMode,
  };
};
