
import { getStoredPosts, isPostDeleted, type BlogPost } from "./localStorage";
import { blogPosts } from "@/data/blogPosts";

/**
 * Centralized function to load all posts with proper deletion filtering
 */
export const loadAllPosts = (): BlogPost[] => {
  console.log("PostManager - Loading all posts");
  
  // Get stored posts (custom posts created by user)
  const storedPosts = getStoredPosts();
  console.log("PostManager - Stored posts from localStorage:", storedPosts);
  
  // Get default posts that haven't been deleted
  const availableDefaultPosts = blogPosts
    .filter(post => {
      const isDeleted = isPostDeleted(post.id);
      console.log(`PostManager - Checking default post ${post.id}: deleted=${isDeleted}`);
      return !isDeleted;
    })
    .map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      publishedAt: post.publishedAt,
      readTime: post.readTime,
      category: post.category,
      tags: post.tags,
      featured: post.featured,
      image: post.image,
      seoKeywords: (post as any).seoKeywords || '',
      metaDescription: (post as any).metaDescription || post.excerpt
    }));

  console.log("PostManager - Available default posts:", availableDefaultPosts);

  // Combine: stored posts first, then default posts that don't conflict
  const storedPostIds = new Set(storedPosts.map(p => p.id));
  const nonConflictingDefaultPosts = availableDefaultPosts.filter(p => !storedPostIds.has(p.id));
  
  const allPosts = [...storedPosts, ...nonConflictingDefaultPosts];
  
  console.log("PostManager - Final combined posts:", allPosts);
  
  return allPosts;
};

/**
 * Get posts filtered by category
 */
export const getPostsByCategory = (category: string): BlogPost[] => {
  const allPosts = loadAllPosts();
  return allPosts.filter(
    post => post.category.toLowerCase().replace(/\s+/g, '-') === category
  );
};

/**
 * Get a single post by ID
 */
export const getPostById = (id: string): BlogPost | undefined => {
  const allPosts = loadAllPosts();
  const post = allPosts.find(post => post.id === id);
  
  // Double check that the post isn't deleted
  if (post && isPostDeleted(post.id)) {
    console.log("PostManager - Post found but is deleted:", id);
    return undefined;
  }
  
  return post;
};

/**
 * Force refresh all post data
 */
export const forceRefreshPosts = (): void => {
  console.log("PostManager - Dispatching posts refresh event");
  window.dispatchEvent(new CustomEvent('postsRefreshed'));
};
