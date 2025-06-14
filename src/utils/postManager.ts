import { getStoredPosts, getDeletedPostIds, type BlogPost } from "./localStorage";
import { blogPosts } from "@/data/blogPosts";

/**
 * SIMPLIFIED: localStorage is the boss. Default posts only show if not deleted.
 */
export const loadAllPosts = (): BlogPost[] => {
  console.log("PostManager - Loading all posts (SIMPLIFIED)");
  
  // Step 1: Get all custom/user-created posts from localStorage (THE BOSS)
  // These should always be prioritised and shown unless explicitly deleted
  const userCreatedPosts = getStoredPosts(); 
  console.log("PostManager - User-created posts from localStorage (THE BOSS):", userCreatedPosts);
  
  // Step 2: Get deleted post IDs (both custom and default)
  const deletedIds = getDeletedPostIds();
  console.log("PostManager - Deleted post IDs:", deletedIds);
  
  // Step 3: Filter out any user-created posts that have been explicitly deleted
  const availableUserCreatedPosts = userCreatedPosts.filter(post => !deletedIds.includes(post.id));
  console.log("PostManager - User-created posts AFTER filtering deleted:", availableUserCreatedPosts);

  // Step 4: Get default posts that haven't been deleted AND don't conflict with available user-created posts
  const userCreatedPostIds = new Set(availableUserCreatedPosts.map(p => p.id));
  
  const availableDefaultPosts = blogPosts
    .filter(post => !deletedIds.includes(post.id)) // Filter out default posts that are marked as deleted
    .filter(post => !userCreatedPostIds.has(post.id)) // Filter out default posts if a user-created post with the same ID exists
    .map(post => ({ // Ensure consistency in structure
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

  console.log("PostManager - Available default posts (after all filtering):", availableDefaultPosts);

  // Step 5: Combine available user-created posts first, then the available, non-conflicting default posts
  const finalPosts = [...availableUserCreatedPosts, ...availableDefaultPosts];
  
  console.log("PostManager - FINAL RESULT (should include new and exclude deleted):", finalPosts);
  
  return finalPosts;
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
