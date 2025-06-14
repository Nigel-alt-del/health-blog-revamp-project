
import { useState, useEffect, useCallback, useRef } from "react";
import { addPostToStorage, updatePostInStorage, deletePostFromStorage, addDeletedPostId, type BlogPost } from "@/utils/supabaseStorage";
import { loadAllPosts, forceRefreshPosts } from "@/utils/postManager";
import { blogPosts } from "@/data/blogPosts";

export const usePostManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  // Debounced refresh to prevent multiple simultaneous refreshes
  const debouncedRefresh = useCallback(async () => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(async () => {
      if (isRefreshingRef.current) return;
      
      console.log("usePostManagement - DEBOUNCED REFRESH (SUPABASE)");
      isRefreshingRef.current = true;
      
      try {
        setLoading(true);
        const allPosts = await loadAllPosts();
        console.log("usePostManagement - NEW POSTS STATE:", allPosts);
        setPosts(allPosts);
      } catch (error) {
        console.error("usePostManagement - Error refreshing posts:", error);
      } finally {
        setLoading(false);
        isRefreshingRef.current = false;
      }
    }, 300); // 300ms debounce
  }, []);

  // Optimized refresh function
  const refreshPosts = useCallback(async () => {
    await debouncedRefresh();
  }, [debouncedRefresh]);

  useEffect(() => {
    console.log("usePostManagement - INITIAL LOAD (SUPABASE)");
    refreshPosts();
    
    const handlePostsRefreshed = () => {
      console.log("usePostManagement - HANDLING REFRESH EVENT");
      refreshPosts();
    };

    window.addEventListener('postsRefreshed', handlePostsRefreshed);
    
    return () => {
      window.removeEventListener('postsRefreshed', handlePostsRefreshed);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [refreshPosts]);

  const generateId = (title: string): string => {
    const baseId = title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    const timestamp = Date.now();
    return `${baseId}-${timestamp}`;
  };

  const handleCreatePost = async (newPost: any) => {
    console.log("📝 SUPABASE SAVE - Starting creation process for:", newPost.title);
    console.log("📝 TIME:", new Date().toISOString());
    
    try {
      // Generate the new post data
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

      console.log("📝 NEW POST DATA CREATED:", post);
      console.log("📝 SAVING TO SUPABASE...");
      
      await addPostToStorage(post);
      
      console.log("📝 ✅ POST SUCCESSFULLY SAVED TO SUPABASE");
      
      // Optimized refresh - only refresh once
      await refreshPosts();
      
      console.log("📝 POST CREATION PROCESS COMPLETE");
    } catch (error) {
      console.error("📝 ❌ ERROR CREATING POST:", error);
      throw error;
    }
  };

  const handleEditPost = async (updatedPost: any) => {
    console.log("usePostManagement - EDITING POST:", updatedPost);
    
    try {
      const formattedPost: BlogPost = {
        ...updatedPost,
        tags: Array.isArray(updatedPost.tags) ? updatedPost.tags : (updatedPost.tags || '').split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
      };

      await updatePostInStorage(formattedPost);
      console.log("usePostManagement - UPDATED IN SUPABASE");
      
      // Optimized refresh - only refresh once
      await refreshPosts();
      
      console.log("usePostManagement - POST EDIT COMPLETE");
      sessionStorage.setItem('cameFromAdmin', 'true');
    } catch (error) {
      console.error("usePostManagement - Error editing post:", error);
      throw error;
    }
  };

  const handleDeletePost = async (postId: string) => {
    console.log("🚨 SUPABASE DELETION - STARTING FOR POST:", postId);
    console.log("🚨 TIME:", new Date().toISOString());
    
    try {
      const isDefaultPost = blogPosts.some(p => p.id === postId);
      console.log("🚨 IS DEFAULT POST?", isDefaultPost);
      
      if (isDefaultPost) {
        console.log("🚨 MARKING DEFAULT POST AS DELETED IN SUPABASE");
        await addDeletedPostId(postId);
      } else {
        console.log("🚨 DELETING CUSTOM POST FROM SUPABASE");
        await deletePostFromStorage(postId);
      }
      
      console.log("🚨 ✅ DELETION COMPLETED IN SUPABASE");
      
      // Optimized refresh - only refresh once
      await refreshPosts();
      
      console.log("🚨 DELETION PROCESS COMPLETE");
    } catch (error) {
      console.error("🚨 ❌ ERROR DELETING POST:", error);
      throw error;
    }
  };

  const handleToggleFeatured = async (postId: string) => {
    console.log("usePostManagement - TOGGLING FEATURED FOR POST:", postId);
    
    try {
      // Get current post
      const currentPost = posts.find(p => p.id === postId);
      if (!currentPost) {
        console.error("usePostManagement - Post not found:", postId);
        return;
      }

      console.log("usePostManagement - Current featured state:", currentPost.featured);
      const newFeaturedState = !currentPost.featured;
      
      // Update the clicked post and unfeature all others in Supabase
      const postsToUpdate = posts.filter(post => 
        post.id === postId || post.featured
      );
      
      // Batch update all posts that need changes in Supabase
      const updatePromises = postsToUpdate.map(post => {
        const updatedPost = {
          ...post,
          featured: post.id === postId ? newFeaturedState : false
        };
        
        console.log("usePostManagement - Updating post in Supabase:", post.id, "featured:", updatedPost.featured);
        return updatePostInStorage(updatedPost);
      });
      
      await Promise.all(updatePromises);
      
      console.log("usePostManagement - All Supabase updates complete, refreshing UI");
      
      // Single refresh after all updates are complete
      await refreshPosts();
      
      console.log("usePostManagement - FEATURED TOGGLE COMPLETE");
    } catch (error) {
      console.error("usePostManagement - Error toggling featured:", error);
      throw error;
    }
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
