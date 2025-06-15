
import { getStoredPosts, getDeletedPostIds, type BlogPost } from "./supabaseStorage";
import { blogPosts } from "@/data/blogPosts";
import { postCache } from "./postCache";

/**
 * OPTIMIZED SUPABASE POWERED: Database with caching for better performance
 */
export const loadAllPosts = async (useCache = true): Promise<BlogPost[]> => {
  console.log("PostManager - Loading all posts (OPTIMIZED SUPABASE)");
  
  // Check cache first
  if (useCache) {
    const cachedPosts = postCache.get('allPosts');
    if (cachedPosts) {
      console.log("PostManager - Returning cached posts");
      return cachedPosts;
    }
  }
  
  try {
    // Parallel fetch for better performance
    const [userCreatedPosts, deletedIds] = await Promise.all([
      getStoredPosts(),
      getDeletedPostIds()
    ]);
    
    console.log("PostManager - User-created posts from Supabase:", userCreatedPosts);
    console.log("PostManager - Deleted post IDs:", deletedIds);
    
    // Filter and process in one pass for better performance
    const availableUserCreatedPosts = userCreatedPosts.filter(post => !deletedIds.includes(post.id));
    const userCreatedPostIds = new Set(availableUserCreatedPosts.map(p => p.id));
    
    const availableDefaultPosts = blogPosts
      .filter(post => !deletedIds.includes(post.id) && !userCreatedPostIds.has(post.id))
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

    const finalPosts = [...availableUserCreatedPosts, ...availableDefaultPosts];
    
    // Cache the result
    if (useCache) {
      postCache.set('allPosts', finalPosts);
    }
    
    console.log("PostManager - FINAL OPTIMIZED RESULT:", finalPosts.length, "posts");
    return finalPosts;
  } catch (error) {
    console.error("PostManager - Error loading posts:", error);
    // Fallback to default posts only
    const fallbackPosts = blogPosts.map(post => ({
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
    
    if (useCache) {
      postCache.set('allPosts', fallbackPosts);
    }
    
    return fallbackPosts;
  }
};

/**
 * Get posts filtered by category (optimized)
 */
export const getPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  const cacheKey = `category:${category}`;
  const cached = postCache.get(cacheKey);
  if (cached) return cached;

  const allPosts = await loadAllPosts();
  const filteredPosts = allPosts.filter(
    post => post.category.toLowerCase().replace(/\s+/g, '-') === category
  );
  
  postCache.set(cacheKey, filteredPosts);
  return filteredPosts;
};

/**
 * Get a single post by ID (optimized with cache)
 */
export const getPostById = async (id: string): Promise<BlogPost | undefined> => {
  const cacheKey = `post:${id}`;
  const cached = postCache.get(cacheKey);
  if (cached) return cached;

  const allPosts = await loadAllPosts();
  const post = allPosts.find(post => post.id === id);
  
  if (post) {
    postCache.set(cacheKey, post);
  }
  
  return post;
};

/**
 * Force refresh all post data and clear cache
 */
export const forceRefreshPosts = (): void => {
  console.log("PostManager - Force refresh: clearing cache and dispatching event");
  postCache.clear(); // Clear cache on refresh
  window.dispatchEvent(new CustomEvent('postsRefreshed'));
};

/**
 * Preload posts for better perceived performance
 */
export const preloadPosts = async (): Promise<void> => {
  console.log("PostManager - Preloading posts");
  try {
    await loadAllPosts(true); // Use cache if available
  } catch (error) {
    console.error("PostManager - Error preloading posts:", error);
  }
};
