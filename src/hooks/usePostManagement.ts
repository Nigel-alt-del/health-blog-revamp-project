
import { useState, useEffect } from "react";
import { addPostToStorage, updatePostInStorage, deletePostFromStorage, addDeletedPostId, type BlogPost } from "@/utils/localStorage";
import { loadAllPosts, forceRefreshPosts } from "@/utils/postManager";
import { blogPosts } from "@/data/blogPosts";

export const usePostManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  const refreshPosts = () => {
    console.log("usePostManagement - REFRESHING POSTS");
    const allPosts = loadAllPosts();
    console.log("usePostManagement - NEW POSTS STATE:", allPosts);
    setPosts(allPosts);
  };

  useEffect(() => {
    console.log("usePostManagement - INITIAL LOAD");
    refreshPosts();
    
    const handlePostsRefreshed = () => {
      console.log("usePostManagement - HANDLING REFRESH EVENT");
      refreshPosts();
    };

    window.addEventListener('postsRefreshed', handlePostsRefreshed);
    
    return () => {
      window.removeEventListener('postsRefreshed', handlePostsRefreshed);
    };
  }, []);

  const generateId = (title: string): string => {
    const baseId = title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    const timestamp = Date.now();
    return `${baseId}-${timestamp}`;
  };

  const handleCreatePost = (newPost: any) => {
    console.log("usePostManagement - CREATING NEW POST:", newPost);
    
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

    // SAVE TO LOCALSTORAGE (THE BOSS)
    addPostToStorage(post);
    console.log("usePostManagement - SAVED TO LOCALSTORAGE");
    
    // IMMEDIATE REFRESH - NO DELAYS
    refreshPosts();
    forceRefreshPosts();
    
    console.log("usePostManagement - POST CREATION COMPLETE");
  };

  const handleEditPost = (updatedPost: any) => {
    console.log("usePostManagement - EDITING POST:", updatedPost);
    
    const formattedPost: BlogPost = {
      ...updatedPost,
      tags: Array.isArray(updatedPost.tags) ? updatedPost.tags : (updatedPost.tags || '').split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
    };

    // UPDATE IN LOCALSTORAGE (THE BOSS)
    updatePostInStorage(formattedPost);
    console.log("usePostManagement - UPDATED IN LOCALSTORAGE");
    
    // IMMEDIATE REFRESH - NO DELAYS
    refreshPosts();
    forceRefreshPosts();
    
    console.log("usePostManagement - POST EDIT COMPLETE");
    sessionStorage.setItem('cameFromAdmin', 'true');
  };

  const handleDeletePost = (postId: string) => {
    console.log("usePostManagement - RUTHLESS DELETION:", postId);
    
    const isDefaultPost = blogPosts.some(p => p.id === postId);
    
    if (isDefaultPost) {
      // Mark default post as deleted
      addDeletedPostId(postId);
      console.log("usePostManagement - DEFAULT POST MARKED AS DELETED:", postId);
    } else {
      // Remove custom post from storage
      deletePostFromStorage(postId);
      console.log("usePostManagement - CUSTOM POST REMOVED FROM STORAGE:", postId);
    }
    
    // IMMEDIATE REFRESH - NO DELAYS
    refreshPosts();
    forceRefreshPosts();
    
    console.log("usePostManagement - RUTHLESS DELETION COMPLETE");
  };

  const handleToggleFeatured = (postId: string) => {
    console.log("usePostManagement - TOGGLING FEATURED:", postId);
    
    // Load fresh data
    const currentPosts = loadAllPosts();
    
    const updatedPosts = currentPosts.map(post => {
      if (post.id === postId) {
        const updatedPost = { ...post, featured: !post.featured };
        updatePostInStorage(updatedPost);
        return updatedPost;
      } else if (post.featured) {
        const updatedPost = { ...post, featured: false };
        updatePostInStorage(updatedPost);
        return updatedPost;
      }
      return post;
    });
    
    setPosts(updatedPosts);
    forceRefreshPosts();
    
    console.log("usePostManagement - FEATURED TOGGLE COMPLETE");
  };

  return {
    posts,
    handleCreatePost,
    handleEditPost,
    handleDeletePost,
    handleToggleFeatured
  };
};
