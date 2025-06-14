
import { getStoredPosts, getDeletedPostIds, type BlogPost } from "./localStorage";
import { blogPosts } from "@/data/blogPosts";

/**
 * SIMPLIFIED: localStorage is the boss. Default posts only show if not deleted.
 */
export const loadAllPosts = (): BlogPost[] => {
  console.log("PostManager - Loading all posts (SIMPLIFIED)");
  
  // Step 1: Get all stored posts (these are the boss)
  const storedPosts = getStoredPosts();
  console.log("PostManager - Stored posts (THE BOSS):", storedPosts);
  
  // Step 2: Get deleted post IDs
  const deletedIds = getDeletedPostIds();
  console.log("PostManager - Deleted post IDs:", deletedIds);
  
  // Step 3: Get default posts that haven't been deleted
  const availableDefaultPosts = blogPosts
    .filter(post => !deletedIds.includes(post.id))
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

  // Step 4: SIMPLE COMBINATION - stored posts first, then non-conflicting defaults
  const storedPostIds = new Set(storedPosts.map(p => p.id));
  const finalDefaultPosts = availableDefaultPosts.filter(p => !storedPostIds.has(p.id));
  
  const allPosts = [...storedPosts, ...finalDefaultPosts];
  console.log("PostManager - FINAL RESULT:", allPosts);
  
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
  return allPosts.find(post => post.id === id);
};

/**
 * EUREKA! Force refresh all post data
 */
export const forceRefreshPosts = (): void => {
  console.log("PostManager - EUREKA! Dispatching posts refresh event");
  window.dispatchEvent(new CustomEvent('postsRefreshed'));
};
