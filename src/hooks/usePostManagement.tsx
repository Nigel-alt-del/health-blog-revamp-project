
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addPostToStorage, updatePostInStorage, deletePostFromStorage } from "@/services/supabase/posts";
import { addDeletedPostId } from "@/services/supabase/deletedPosts";
import { type BlogPost, type BlogPostSummary } from "@/types/blog";
import { loadAllPosts, getPostById } from "@/utils/postManager";
import { blogPosts } from "@/data/blogPosts";
import { toast } from "@/components/ui/use-toast";
import { logPostSaveAttempt } from "@/services/supabase/postSaveLogs";
import { ToastAction } from "@/components/ui/toast";
import { useCallback } from "react";

export const usePostManagement = () => {
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading: loading, isError, error } = useQuery<BlogPostSummary[], Error>({
    queryKey: ['posts'],
    queryFn: async () => {
      console.log("[usePostManagement] Fetching posts (from React Query 'posts' key)");
      const result = await loadAllPosts();
      console.log("[usePostManagement] Post fetch result:", result.map(p => ({ id: p.id, title: p.title, featured: p.featured })));
      return result;
    },
    staleTime: 5 * 60 * 1000,
  });

  const generateId = (title: string): string => {
    const baseId = title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    const timestamp = Date.now();
    return `${baseId}-${timestamp}`;
  };

  const mutationOptions = {
    onSuccess: (...args: any[]) => {
      console.log("[usePostManagement] Mutation success! Invalidating posts queries...", args);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
    },
    onError: (error: Error) => {
      console.error("Mutation failed:", error);
      toast({
        title: "Error",
        description: `An error occurred: ${error.message}`,
        variant: "destructive",
      });
    },
  };

  const createPostMutation = useMutation({
    mutationFn: async (post: BlogPost) => {
      console.log("[usePostManagement] Creating post...", post);
      return addPostToStorage(post);
    },
    ...mutationOptions,
  });

  const updatePostMutation = useMutation({
    mutationFn: async (post: BlogPost) => {
      console.log("[usePostManagement] Updating post...", post);
      return updatePostInStorage(post);
    },
    ...mutationOptions,
  });

  const deleteCustomPostMutation = useMutation({
    mutationFn: async (postId: string) => {
      console.log("[usePostManagement] Deleting custom post...", postId);
      return deletePostFromStorage(postId);
    },
    ...mutationOptions,
  });
  
  const addDeletedIdMutation = useMutation({
    mutationFn: async (postId: string) => {
      console.log("[usePostManagement] Adding deleted ID for default post...", postId);
      return addDeletedPostId(postId);
    },
    ...mutationOptions,
  });

  const handleCreatePost = async (newPost: any) => {
    console.log("📝 Starting creation process for:", newPost.title);
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
    console.log("Editing post:", updatedPost);
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
    console.log("🚨 DELETION - STARTING FOR POST:", postId);
    const isDefaultPost = blogPosts.some(p => p.id === postId);
    if (isDefaultPost) {
      await addDeletedIdMutation.mutateAsync(postId);
    } else {
      await deleteCustomPostMutation.mutateAsync(postId);
    }
    console.log("🚨 DELETION PROCESS COMPLETE");
  };

  const handleToggleFeatured = async (postId: string) => {
    const postSummary = posts.find(p => p.id === postId);
    if (!postSummary) return;

    const newFeaturedState = !postSummary.featured;

    const postsToUpdate = posts.filter(p => p.featured || p.id === postId);

    console.log("[usePostManagement] Toggling featured for:", postId, "New state:", newFeaturedState, "Posts affected:", postsToUpdate.map(p => p.id));

    const updatePromises = postsToUpdate.map(async p => {
        const fullPost = await getPostById(p.id);
        if (fullPost) {
            const updatedPost = { ...fullPost, featured: p.id === postId ? newFeaturedState : false };
            return updatePostMutation.mutateAsync(updatedPost);
        }
    });

    await Promise.all(updatePromises);
    console.log("FEATURED TOGGLE COMPLETE");
  };

  // Diagnostic method to force refetch of posts
  const forceRefreshPosts = useCallback(() => {
    console.log("[usePostManagement] Forcing post list refresh via invalidateQueries('posts')");
    queryClient.invalidateQueries({ queryKey: ['posts'], refetchType: "active" });
  }, [queryClient]);

  return {
    posts,
    loading,
    isError,
    error,
    handleCreatePost,
    handleEditPost,
    handleDeletePost,
    handleToggleFeatured,
    forceRefreshPosts, // exposed for UI refresh button
  };
};

