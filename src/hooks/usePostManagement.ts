

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addPostToStorage, updatePostInStorage, deletePostFromStorage } from "@/services/supabase/posts";
import { addDeletedPostId } from "@/services/supabase/deletedPosts";
import { type BlogPost } from "@/types/blog";
import { loadAllPosts } from "@/utils/postManager";
import { blogPosts } from "@/data/blogPosts";
import { toast } from "@/components/ui/use-toast";

export const usePostManagement = () => {
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading: loading } = useQuery<BlogPost[]>({
    queryKey: ['posts'],
    queryFn: loadAllPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes. Ensures data is fresh and not re-fetched unnecessarily
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] }); // Invalidate single post queries too
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
    mutationFn: (post: BlogPost) => addPostToStorage(post),
    ...mutationOptions,
  });

  const updatePostMutation = useMutation({
    mutationFn: (post: BlogPost) => updatePostInStorage(post),
    ...mutationOptions,
  });

  const deleteCustomPostMutation = useMutation({
    mutationFn: (postId: string) => deletePostFromStorage(postId),
    ...mutationOptions,
  });
  
  const addDeletedIdMutation = useMutation({
    mutationFn: (postId: string) => addDeletedPostId(postId),
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
    await createPostMutation.mutateAsync(post);
    console.log("📝 POST CREATION PROCESS COMPLETE");
  };

  const handleEditPost = async (updatedPost: any) => {
    console.log("Editing post:", updatedPost);
    const formattedPost: BlogPost = {
      ...updatedPost,
      tags: Array.isArray(updatedPost.tags) ? updatedPost.tags : (updatedPost.tags || '').split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
    };
    await updatePostMutation.mutateAsync(formattedPost);
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
    const currentPost = posts.find(p => p.id === postId);
    if (!currentPost) return;

    const newFeaturedState = !currentPost.featured;

    // Unfeature all other posts and feature the selected one
    const updatePromises = posts
      .filter(p => p.featured || p.id === postId)
      .map(p => {
        const updatedPost = { ...p, featured: p.id === postId ? newFeaturedState : false };
        return updatePostMutation.mutateAsync(updatedPost);
      });

    await Promise.all(updatePromises);
    console.log("FEATURED TOGGLE COMPLETE");
  };

  return {
    posts,
    loading,
    handleCreatePost,
    handleEditPost,
    handleDeletePost,
    handleToggleFeatured
  };
};
