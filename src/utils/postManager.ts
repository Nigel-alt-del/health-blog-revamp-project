
import { getStoredPosts, getDeletedPostIds, type BlogPost, getPostFromStorage, isPostDeleted } from "./supabaseStorage";
import { blogPosts } from "@/data/blogPosts";

/**
 * OPTIMIZED SUPABASE POWERED: Fetch all posts from Supabase and merge with local data.
 * This is now the single source of truth for data fetching, to be used with React Query.
 */
export const loadAllPosts = async (): Promise<BlogPost[]> => {
  console.log("PostManager - Loading all posts (React Query optimized)");

  try {
    // Parallel fetch for better performance
    const [userCreatedPosts, deletedIds] = await Promise.all([
      getStoredPosts(),
      getDeletedPostIds()
    ]);
    
    // Use Sets for O(1) lookups, which is much faster than array.includes()
    const deletedIdSet = new Set(deletedIds);

    // Filter and process in one pass for better performance
    const availableUserCreatedPosts = userCreatedPosts.filter(post => !deletedIdSet.has(post.id));
    const userCreatedPostIds = new Set(availableUserCreatedPosts.map(p => p.id));
    
    const availableDefaultPosts = blogPosts
      .filter(post => !deletedIdSet.has(post.id) && !userCreatedPostIds.has(post.id))
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
    
    console.log("PostManager - FINAL OPTIMIZED RESULT:", finalPosts.length, "posts");
    return finalPosts;
  } catch (error) {
    console.error("PostManager - Error loading posts:", error);
    // In case of error, return an empty array. React Query will handle the error state.
    return [];
  }
};

/**
 * Get posts filtered by category.
 */
export const getPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  const allPosts = await loadAllPosts();
  return allPosts.filter(
    post => post.category.toLowerCase().replace(/\s+/g, '-') === category
  );
};

/**
 * Get a single post by ID.
 * OPTIMIZED to fetch a single record instead of all posts.
 */
export const getPostById = async (id: string): Promise<BlogPost | undefined> => {
  console.log(`PostManager - Getting post by ID (Optimized): ${id}`);

  // 1. Check Supabase first for user-created or updated posts.
  const postFromSupabase = await getPostFromStorage(id);
  if (postFromSupabase) {
    return postFromSupabase;
  }

  // 2. If not in Supabase, check the default posts array.
  const postFromDefaults = blogPosts.find(post => post.id === id);
  if (!postFromDefaults) {
    return undefined; // Not found anywhere.
  }

  // 3. It's a default post. Check if it has been deleted.
  const deleted = await isPostDeleted(id);
  if (deleted) {
    return undefined;
  }

  // Map to ensure consistent object structure, same as in loadAllPosts
  return {
    id: postFromDefaults.id,
    title: postFromDefaults.title,
    excerpt: postFromDefaults.excerpt,
    content: postFromDefaults.content,
    publishedAt: postFromDefaults.publishedAt,
    readTime: postFromDefaults.readTime,
    category: postFromDefaults.category,
    tags: postFromDefaults.tags,
    featured: postFromDefaults.featured,
    image: postFromDefaults.image,
    seoKeywords: (postFromDefaults as any).seoKeywords || '',
    metaDescription: (postFromDefaults as any).metaDescription || postFromDefaults.excerpt
  };
};
