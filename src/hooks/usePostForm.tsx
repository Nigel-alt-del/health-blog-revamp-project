
import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { type BlogPost } from "@/types/blog";
import { addPostToStorage, updatePostInStorage } from "@/services/supabase/posts";
import { logPostSaveAttempt } from "@/services/supabase/postSaveLogs";
import { ToastAction } from "@/components/ui/toast";
import { useGeneratePostId } from "./useGeneratePostId";
import { useFormatPostData } from "./useFormatPostData";

interface UsePostFormProps {
  initialPost?: BlogPost | null;
  onSubmit: (post: any) => void;
}

// Pure default form data
const defaultFormData = {
  title: "",
  excerpt: "",
  content: "",
  category: "Healthcare",
  tags: "",
  image: "",
  imageSize: "medium" as "small" | "medium" | "large" | "full",
};

export const usePostForm = ({ initialPost, onSubmit }: UsePostFormProps) => {
  const [formData, setFormData] = useState({ ...defaultFormData });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [savedDraftId, setSavedDraftId] = useState<string | null>(initialPost?.id || null);
  const submitLockRef = useRef(false);
  const { toast } = useToast();

  const isEditMode = !!initialPost?.id;
  const generateId = useGeneratePostId();
  const formatPostData = useFormatPostData({
    savedDraftId,
    isEditMode,
    initialPost,
    generateId,
  });

  // Hydrate form fields if editing
  useEffect(() => {
    if (isEditMode && initialPost) {
      try {
        const tagsString = Array.isArray(initialPost.tags)
          ? initialPost.tags.join(", ")
          : initialPost.tags || "";
        setFormData({
          title: initialPost.title || "",
          excerpt: initialPost.excerpt || "",
          content: initialPost.content || "",
          category: initialPost.category || "Healthcare",
          tags: tagsString,
          image: initialPost.image || "",
          imageSize: (initialPost as any).imageSize || "medium",
        });
        setIsLoading(false);
      } catch (error) {
        console.error("usePostForm - Error loading post data:", error);
        toast({
          title: "Loading Error",
          description: "Error loading post data. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [initialPost, isEditMode, toast]);

  const handleFormDataChange = useCallback((newFormData: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...newFormData }));
  }, []);

  // Save draft handler  
  const handleSaveDraft = async () => {
    if (!formData.title?.trim()) {
      toast({
        title: "Cannot Save Draft",
        description: "Please add a title before saving draft",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    const draftPost = formatPostData(formData, true);
    try {
      if (savedDraftId) {
        await updatePostInStorage(draftPost as BlogPost);
        await logPostSaveAttempt({
          reportId: draftPost.id,
          action: "edit",
          title: draftPost.title,
          status: "success",
        });
      } else {
        await addPostToStorage(draftPost as BlogPost);
        setSavedDraftId(draftPost.id);
        await logPostSaveAttempt({
          reportId: draftPost.id,
          action: "create",
          title: draftPost.title,
          status: "success",
        });
      }
      setLastSaved(new Date());
      toast({
        title: "Draft Saved",
        description: "Your changes have been saved successfully.",
      });
      window.dispatchEvent(new CustomEvent("postsRefreshed"));
    } catch (error: any) {
      await logPostSaveAttempt({
        reportId: draftPost.id,
        action: savedDraftId ? "edit" : "create",
        title: draftPost.title,
        status: "fail",
        error: error?.message || String(error),
      });
      toast({
        title: "Save Failed",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
        action: (
          <ToastAction altText="Retry" onClick={handleSaveDraft}>Retry</ToastAction>
        ),
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Prevent double-publishing robustly with a persistent/ref-based lock
  const handleSubmit = async () => {
    if (!formData.title?.trim() || !formData.excerpt?.trim()) {
      toast({
        title: "Error",
        description: "Please add a title and excerpt.",
        variant: "destructive",
      });
      return;
    }
    if (submitLockRef.current) {
      toast({
        title: "Please wait",
        description: "The report is already being published.",
        variant: "default",
      });
      return;
    }
    submitLockRef.current = true;
    setIsSaving(true);
    try {
      const updatedPost = formatPostData(formData);
      await Promise.resolve(onSubmit(updatedPost)); // Ensure always async
      await logPostSaveAttempt({
        reportId: updatedPost.id,
        action: isEditMode ? "edit" : "create",
        title: updatedPost.title,
        status: "success",
      });
      toast({
        title: "Success",
        description: `Report ${isEditMode ? "updated" : "created"} successfully!`,
      });
    } catch (error: any) {
      const reportId =
        savedDraftId || (isEditMode ? initialPost?.id : generateId(formData.title));
      await logPostSaveAttempt({
        reportId: reportId,
        action: isEditMode ? "edit" : "create",
        title: formData.title,
        status: "fail",
        error: error?.message || String(error),
      });
      toast({
        title: "Failed",
        description: `Failed to ${isEditMode ? "update" : "create"} report. Please try again.`,
        variant: "destructive",
        action: (
          <ToastAction altText="Retry" onClick={handleSubmit}>Retry</ToastAction>
        ),
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        submitLockRef.current = false;
      }, 1100); // Add slight buffer vs. 1000ms, more robust against clicks
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
