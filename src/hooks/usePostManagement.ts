
import { useState, useEffect } from "react";
import { addPostToStorage, updatePostInStorage, deletePostFromStorage, addDeletedPostId, type BlogPost } from "@/utils/localStorage";
import { loadAllPosts, forceRefreshPosts } from "@/utils/postManager";
import { blogPosts } from "@/data/blogPosts";

export const usePostManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  const refreshPosts = () => {
    console.log("usePostManagement - Refreshing posts");
    const allPosts = loadAllPosts();
    console.log("usePostManagement - Setting posts to:", allPosts);
    setPosts(allPosts);
  };

  useEffect(() => {
    console.log("usePostManagement - Initial load");
    refreshPosts();
    
    // Listen for refresh events
    const handlePostsRefreshed = () => {
      console.log("usePostManagement - Handling refresh event");
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
    console.log("usePostManagement - Creating new post:", newPost);
    
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

    console.log("usePostManagement - Formatted post:", post);
    
    // Save to localStorage
    addPostToStorage(post);
    
    // IMMEDIATE UI update - add the new post to current state
    setPosts(prevPosts => {
      const updatedPosts = [post, ...prevPosts];
      console.log("usePostManagement - Immediately updating UI with:", updatedPosts);
      return updatedPosts;
    });
    
    // Also trigger refresh for other components
    setTimeout(() => {
      forceRefreshPosts();
    }, 100);
    
    console.log("usePostManagement - Post creation completed");
  };

  const handleEditPost = (updatedPost: any) => {
    console.log("usePostManagement - Updating post:", updatedPost);
    
    const formattedPost: BlogPost = {
      ...updatedPost,
      tags: Array.isArray(updatedPost.tags) ? updatedPost.tags : (updatedPost.tags || '').split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
    };

    updatePostInStorage(formattedPost);
    
    // IMMEDIATE UI update
    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(post => 
        post.id === formattedPost.id ? formattedPost : post
      );
      console.log("usePostManagement - Immediately updating edited post in UI");
      return updatedPosts;
    });
    
    // Trigger refresh for other components
    setTimeout(() => {
      forceRefreshPosts();
    }, 100);
    
    console.log("usePostManagement - Post update completed");
    sessionStorage.setItem('cameFromAdmin', 'true');
  };

  const handleDeletePost = (postId: string) => {
    console.log("usePostManagement - Deleting post:", postId);
    
    const isDefaultPost = blogPosts.some(p => p.id === postId);
    
    if (isDefaultPost) {
      addDeletedPostId(postId);
      console.log("usePostManagement - Marked default post as deleted:", postId);
    } else {
      deletePostFromStorage(postId);
      console.log("usePostManagement - Removed custom post from storage:", postId);
    }
    
    // IMMEDIATE UI update - remove from current state
    setPosts(prevPosts => {
      const updatedPosts = prevPosts.filter(post => post.id !== postId);
      console.log("usePostManagement - Immediately removing post from UI");
      return updatedPosts;
    });
    
    // Trigger refresh for other components
    setTimeout(() => {
      forceRefreshPosts();
    }, 100);
    
    console.log("usePostManagement - Post deletion completed");
  };

  const handleToggleFeatured = (postId: string) => {
    console.log("usePostManagement - Toggling featured for post:", postId);
    
    const updatedPosts = posts.map(post => {
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
    
    // Trigger refresh for other components
    setTimeout(() => {
      forceRefreshPosts();
    }, 100);
    
    console.log("usePostManagement - Featured toggle completed");
  };

  return {
    posts,
    handleCreatePost,
    handleEditPost,
    handleDeletePost,
    handleToggleFeatured
  };
};
