
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
    console.log("🚨 ENHANCED DELETION DIAGNOSIS - STARTING FOR POST:", postId);
    console.log("🚨 TIME:", new Date().toISOString());
    
    // STEP 1: What do we have before deletion?
    const currentPosts = loadAllPosts();
    const currentLocalStorage = JSON.parse(localStorage.getItem('blog_posts') || '[]');
    const currentDeletedIds = JSON.parse(localStorage.getItem('deleted_post_ids') || '[]');
    
    console.log("🚨 CURRENT UI POSTS (what you see):", currentPosts.length, "posts");
    currentPosts.forEach(p => console.log("  - UI POST:", p.id, p.title));
    
    console.log("🚨 CURRENT LOCALSTORAGE:", currentLocalStorage.length, "posts");
    currentLocalStorage.forEach((p: any) => console.log("  - STORAGE POST:", p.id, p.title));
    
    console.log("🚨 CURRENT DELETED IDS:", currentDeletedIds);
    
    // STEP 2: Is this the post we're trying to delete?
    const postToDelete = currentPosts.find(p => p.id === postId);
    console.log("🚨 POST TO DELETE:", postToDelete ? postToDelete.title : "NOT FOUND!");
    
    const isDefaultPost = blogPosts.some(p => p.id === postId);
    console.log("🚨 IS DEFAULT POST?", isDefaultPost);
    
    // STEP 3: Perform the deletion
    if (isDefaultPost) {
      console.log("🚨 MARKING DEFAULT POST AS DELETED");
      addDeletedPostId(postId);
    } else {
      console.log("🚨 DELETING CUSTOM POST FROM STORAGE");
      deletePostFromStorage(postId);
    }
    
    // STEP 4: What do we have after deletion?
    setTimeout(() => {
      const afterPosts = loadAllPosts();
      const afterLocalStorage = JSON.parse(localStorage.getItem('blog_posts') || '[]');
      const afterDeletedIds = JSON.parse(localStorage.getItem('deleted_post_ids') || '[]');
      
      console.log("🚨 AFTER DELETION - UI POSTS:", afterPosts.length, "posts");
      afterPosts.forEach(p => console.log("  - AFTER UI POST:", p.id, p.title));
      
      console.log("🚨 AFTER DELETION - LOCALSTORAGE:", afterLocalStorage.length, "posts");
      afterLocalStorage.forEach((p: any) => console.log("  - AFTER STORAGE POST:", p.id, p.title));
      
      console.log("🚨 AFTER DELETION - DELETED IDS:", afterDeletedIds);
      
      // STEP 5: The smoking gun - is the post still there?
      const postStillInUI = afterPosts.some(p => p.id === postId);
      const postStillInStorage = afterLocalStorage.some((p: any) => p.id === postId);
      const postInDeletedList = afterDeletedIds.includes(postId);
      
      console.log("🚨 SMOKING GUN RESULTS:");
      console.log("  - Post still in UI?", postStillInUI ? "YES - PROBLEM!" : "No - Good");
      console.log("  - Post still in localStorage?", postStillInStorage ? "YES - PROBLEM!" : "No - Good");
      console.log("  - Post in deleted list?", postInDeletedList ? "Yes - Good" : "NO - PROBLEM for default posts!");
      
      if (postStillInUI) {
        console.log("🚨 CONCLUSION: The post is still visible! The deletion failed.");
        if (isDefaultPost && !postInDeletedList) {
          console.log("🚨 ROOT CAUSE: Default post not added to deleted list properly");
        } else if (!isDefaultPost && postStillInStorage) {
          console.log("🚨 ROOT CAUSE: Custom post not removed from localStorage properly");
        } else {
          console.log("🚨 ROOT CAUSE: UI refresh failed - storage is correct but UI didn't update");
        }
      } else {
        console.log("🚨 CONCLUSION: Deletion worked! Post is gone.");
      }
      
      // STEP 6: Force refresh and check again
      refreshPosts();
      forceRefreshPosts();
      
      console.log("🚨 DELETION DIAGNOSIS COMPLETE");
    }, 100);
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
