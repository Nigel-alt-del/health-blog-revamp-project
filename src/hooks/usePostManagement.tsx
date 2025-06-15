import { useAllPosts } from "./usePostQueries";
import { usePostMutations } from "./usePostMutations";
import { type BlogPost, type BlogPostSummary } from "@/types/blog";
import { blogPosts } from "@/data/blogPosts";
import { logPostSaveAttempt } from "@/services/supabase/postSaveLogs";
import { ToastAction, toast } from "@/components/ui/toast";
import { useCallback } from "react";
import { getPostById } from "@/utils/postManager";

export const usePostManagement = () => {
  const { data: posts = [], isLoading: loading, isError, error } = useAllPosts();
  const {
    createPostMutation,
    updatePostMutation,
    deleteCustomPostMutation,
    addDeletedIdMutation,
    toggleFeatured
  } = usePostMutations();

  const generateId = (title: string): string => {
    const baseId = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    const timestamp = Date.now();
    return `${baseId}-${timestamp}`;
  };

  const handleCreatePost = async (newPost: any) => {
    const post: BlogPost = {
      id: generateId(newPost.title),
      title: newPost.title,
      excerpt: newPost.excerpt,
      content: newPost.content || '',
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: "5 min read",
      category: newPost.category,
      tags: Array.isArray(newPost.tags) ? newPost.tags : (newPost.tags || '').split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag),
      featured: false,
      image: newPost.image || "/placeholder.svg",
      seoKeywords: newPost.seoKeywords || '',
      metaDescription: newPost.metaDescription || newPost.excerpt
    };
    try {
      await createPostMutation.mutateAsync(post);
      await logPostSaveAttempt({
        reportId: post.id,
        action: "create",
        title: post.title,
        status: "success"
      });
    } catch (error: any) {
      await logPostSaveAttempt({
        reportId: post.id,
        action: "create",
        title: post.title,
        status: "fail",
        error: error?.message || String(error),
      });
      toast({
        title: "Failed to Create",
        description: "Could not create report. Please try again.",
        variant: "destructive",
        action: (
          <ToastAction altText="Retry" onClick={() => handleCreatePost(newPost)}>Retry</ToastAction>
        ),
      });
    }
    console.log("📝 POST CREATION PROCESS COMPLETE");
  };

  const handleEditPost = async (updatedPost: any) => {
    const formattedPost: BlogPost = {
      ...updatedPost,
      tags: Array.isArray(updatedPost.tags) ? updatedPost.tags : (updatedPost.tags || '').split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
    };
    try {
      await updatePostMutation.mutateAsync(formattedPost);
      await logPostSaveAttempt({
        reportId: formattedPost.id,
        action: "edit",
        title: formattedPost.title,
        status: "success"
      });
    } catch (error: any) {
      await logPostSaveAttempt({
        reportId: formattedPost.id,
        action: "edit",
        title: formattedPost.title,
        status: "fail",
        error: error?.message || String(error),
      });
      toast({
        title: "Failed to Update",
        description: "Could not update report. Please try again.",
        variant: "destructive",
        action: (
          <ToastAction altText="Retry" onClick={() => handleEditPost(updatedPost)}>Retry</ToastAction>
        ),
      });
    }
    sessionStorage.setItem('cameFromAdmin', 'true');
    console.log("POST EDIT COMPLETE");
  };

  const handleDeletePost = async (postId: string) => {
    const isDefaultPost = blogPosts.some(p => p.id === postId);
    if (isDefaultPost) {
      await addDeletedIdMutation.mutateAsync(postId);
    } else {
      await deleteCustomPostMutation.mutateAsync(postId);
    }
    console.log("🚨 DELETION PROCESS COMPLETE");
  };

  const handleToggleFeatured = async (postId: string) => {
    const postSummaries = posts;
    const postsFull: BlogPost[] = [];
    for (const p of postSummaries) {
      const fullPost = await getPostById(p.id);
      if (fullPost) postsFull.push(fullPost);
    }
    await toggleFeatured(postsFull, postId);
    console.log("FEATURED TOGGLE COMPLETE");
  };

  const forceRefreshPosts = useCallback(() => {
    console.log("[usePostManagement] Forcing post list refresh via invalidateQueries('posts')");
    queryClient.invalidateQueries({ queryKey: ['posts'], refetchType: "active" });
  }, []);

  return {
    posts,
    loading,
    isError,
    error,
    handleCreatePost,
    handleEditPost,
    handleDeletePost,
    handleToggleFeatured,
    forceRefreshPosts,
  };
};
