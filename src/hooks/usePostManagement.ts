
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

    addPostToStorage(post);
    console.log("usePostManagement - SAVED TO LOCALSTORAGE");
    
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

    updatePostInStorage(formattedPost);
    console.log("usePostManagement - UPDATED IN LOCALSTORAGE");
    
    refreshPosts();
    forceRefreshPosts();
    
    console.log("usePostManagement - POST EDIT COMPLETE");
    sessionStorage.setItem('cameFromAdmin', 'true');
  };

  const handleDeletePost = (postId: string) => {
    console.log("🗑️ DELETION DIAGNOSIS - Starting deletion for post ID:", postId);
    
    // STEP 1: Check what's in localStorage BEFORE deletion
    const postsBeforeDeletion = JSON.parse(localStorage.getItem('blog_posts') || '[]');
    console.log("🗑️ POSTS IN LOCALSTORAGE BEFORE DELETION:", postsBeforeDeletion);
    
    const isDefaultPost = blogPosts.some(p => p.id === postId);
    console.log("🗑️ IS DEFAULT POST?", isDefaultPost);
    
    if (isDefaultPost) {
      // Mark default post as deleted
      addDeletedPostId(postId);
      console.log("🗑️ DEFAULT POST MARKED AS DELETED:", postId);
      
      // Check deleted IDs list
      const deletedIds = JSON.parse(localStorage.getItem('deleted_post_ids') || '[]');
      console.log("🗑️ DELETED IDS LIST AFTER MARKING:", deletedIds);
    } else {
      // Remove custom post from storage
      deletePostFromStorage(postId);
      console.log("🗑️ CUSTOM POST REMOVAL ATTEMPTED");
      
      // STEP 2: Check what's in localStorage AFTER deletion
      const postsAfterDeletion = JSON.parse(localStorage.getItem('blog_posts') || '[]');
      console.log("🗑️ POSTS IN LOCALSTORAGE AFTER DELETION:", postsAfterDeletion);
      
      // Verify the post was actually removed
      const postStillExists = postsAfterDeletion.some((p: BlogPost) => p.id === postId);
      console.log("🗑️ POST STILL EXISTS IN LOCALSTORAGE?", postStillExists);
    }
    
    // STEP 3: Force immediate refresh and check what loadAllPosts returns
    console.log("🗑️ FORCING REFRESH - BEFORE");
    const postsFromLoadFunction = loadAllPosts();
    console.log("🗑️ POSTS FROM LOADALLPOSTS AFTER DELETION:", postsFromLoadFunction);
    
    // Check if deleted post is still in the loaded posts
    const deletedPostStillInList = postsFromLoadFunction.some(p => p.id === postId);
    console.log("🗑️ DELETED POST STILL IN LOADED LIST?", deletedPostStillInList);
    
    // STEP 4: Update the UI state
    setPosts(postsFromLoadFunction);
    forceRefreshPosts();
    
    console.log("🗑️ DELETION DIAGNOSIS COMPLETE - UI STATE UPDATED");
  };

  const handleToggleFeatured = (postId: string) => {
    console.log("usePostManagement - TOGGLING FEATURED:", postId);
    
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
