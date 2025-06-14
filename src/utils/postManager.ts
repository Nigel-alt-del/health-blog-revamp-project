
import { getStoredPosts, getDeletedPostIds, type BlogPost } from "./supabaseStorage";
import { blogPosts } from "@/data/blogPosts";

/**
 * SUPABASE POWERED: Database is the boss. Default posts only show if not deleted.
 */
export const loadAllPosts = async (): Promise<BlogPost[]> => {
  console.log("PostManager - Loading all posts (SUPABASE POWERED)");
  
  try {
    // Step 1: Get all custom/user-created posts from Supabase (THE BOSS)
    const userCreatedPosts = await getStoredPosts(); 
    console.log("PostManager - User-created posts from Supabase (THE BOSS):", userCreatedPosts);
    
    // Step 2: Get deleted post IDs (both custom and default)
    const deletedIds = await getDeletedPostIds();
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
  } catch (error) {
    console.error("PostManager - Error loading posts:", error);
    // Fallback to default posts only
    return blogPosts.map(post => ({
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
  }
};

/**
 * Get posts filtered by category
 */
export const getPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  const allPosts = await loadAllPosts();
  return allPosts.filter(
    post => post.category.toLowerCase().replace(/\s+/g, '-') === category
  );
};

/**
 * Get a single post by ID
 */
export const getPostById = async (id: string): Promise<BlogPost | undefined> => {
  const allPosts = await loadAllPosts();
  return allPosts.find(post => post.id === id);
};

/**
 * Force refresh all post data
 */
export const forceRefreshPosts = (): void => {
  console.log("PostManager - Dispatching posts refresh event");
  window.dispatchEvent(new CustomEvent('postsRefreshed'));
};
