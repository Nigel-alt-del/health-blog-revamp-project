
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPostToStorage, updatePostInStorage, deletePostFromStorage } from "@/services/supabase/posts";
import { addDeletedPostId } from "@/services/supabase/deletedPosts";
import { logPostSaveAttempt } from "@/services/supabase/postSaveLogs";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { type BlogPost } from "@/types/blog";
import { blogPosts } from "@/data/blogPosts";
import { getPostById } from "@/utils/postManager";

export function usePostMutations() {
  const queryClient = useQueryClient();

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `An error occurred: ${error.message}`,
        variant: "destructive",
      });
    },
  };

  const createPostMutation = useMutation({
    mutationFn: async (post: BlogPost) => addPostToStorage(post),
    ...mutationOptions,
  });

  const updatePostMutation = useMutation({
    mutationFn: async (post: BlogPost) => updatePostInStorage(post),
    ...mutationOptions,
  });

  const deleteCustomPostMutation = useMutation({
    mutationFn: async (postId: string) => deletePostFromStorage(postId),
    ...mutationOptions,
  });

  const addDeletedIdMutation = useMutation({
    mutationFn: async (postId: string) => addDeletedPostId(postId),
    ...mutationOptions,
  });

  // Helper for feature toggle logic
  const toggleFeatured = async (posts: BlogPost[], postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const newFeaturedState = !post.featured;
    const postsToUpdate = posts.filter(p => p.featured || p.id === postId);
    const updatePromises = postsToUpdate.map(async p => {
      const updated = { ...p, featured: p.id === postId ? newFeaturedState : false };
      return updatePostMutation.mutateAsync(updated);
    });
    await Promise.all(updatePromises);
  };

  return {
    createPostMutation,
    updatePostMutation,
    deleteCustomPostMutation,
    addDeletedIdMutation,
    toggleFeatured,
  };
}

