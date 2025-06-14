
import { useState, useEffect } from "react";
import { addPostToStorage, updatePostInStorage, deletePostFromStorage, addDeletedPostId, type BlogPost } from "@/utils/localStorage";
import { loadAllPosts, forceRefreshPosts } from "@/utils/postManager";
import { blogPosts } from "@/data/blogPosts";

export const usePostManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  const loadPosts = () => {
    console.log("usePostManagement - Loading posts with centralized function");
    const allPosts = loadAllPosts();
    console.log("usePostManagement - Loaded posts:", allPosts);
    setPosts(allPosts);
  };

  useEffect(() => {
    loadPosts();
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
    console.log("Creating new post:", newPost);
    
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

    console.log("Formatted post:", post);
    addPostToStorage(post);
    setPosts(prevPosts => [post, ...prevPosts]);
    
    // Force refresh to ensure consistency
    forceRefreshPosts();
    console.log("Post created successfully");
  };

  const handleEditPost = (updatedPost: any) => {
    console.log("Updating post:", updatedPost);
    
    const formattedPost: BlogPost = {
      ...updatedPost,
      tags: Array.isArray(updatedPost.tags) ? updatedPost.tags : (updatedPost.tags || '').split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
    };

    updatePostInStorage(formattedPost);
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === formattedPost.id ? formattedPost : post
    ));
    
    // Force refresh to ensure consistency
    forceRefreshPosts();
    console.log("Post updated successfully:", formattedPost);
    sessionStorage.setItem('cameFromAdmin', 'true');
  };

  const handleDeletePost = (postId: string) => {
    console.log("usePostManagement - Deleting post:", postId);
    
    const isDefaultPost = blogPosts.some(p => p.id === postId);
    
    if (isDefaultPost) {
      addDeletedPostId(postId);
      console.log("usePostManagement - Marked default post as permanently deleted:", postId);
    } else {
      deletePostFromStorage(postId);
      console.log("usePostManagement - Removed custom post from storage:", postId);
    }
    
    setPosts(prevPosts => {
      const updatedPosts = prevPosts.filter(post => post.id !== postId);
      console.log("usePostManagement - Updated posts after deletion:", updatedPosts.length);
      return updatedPosts;
    });
    
    // CRITICAL: Force refresh to ensure deleted posts don't reappear
    forceRefreshPosts();
    console.log("usePostManagement - Post deletion completed successfully with forced refresh");
  };

  const handleToggleFeatured = (postId: string) => {
    console.log("Toggling featured status for post:", postId);
    
    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(post => {
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
      
      // Force refresh to ensure consistency
      forceRefreshPosts();
      console.log("Featured status updated");
      return updatedPosts;
    });
  };

  return {
    posts,
    handleCreatePost,
    handleEditPost,
    handleDeletePost,
    handleToggleFeatured
  };
};
