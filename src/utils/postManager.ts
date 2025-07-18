
import { getStoredPosts, getPostFromStorage } from "@/services/supabase/posts";
import { getDeletedPostIds, isPostDeleted } from "@/services/supabase/deletedPosts";
import { type BlogPost, type BlogPostSummary } from "@/types/blog";
import { blogPosts } from "@/data/blogPosts";

// Diagnostic utility to log post IDs/status
function logPostArray(label: string, arr: any[]) {
  console.log(`[PostManager] ${label} count: ${arr.length}`, arr.map(p => ({ id: p.id, title: p.title, featured: p.featured })));
}

/**
 * OPTIMIZED SUPABASE POWERED: Fetch all posts from Supabase and merge with local data.
 * This is now the single source of truth for data fetching, to be used with React Query.
 */
export const loadAllPosts = async (): Promise<BlogPostSummary[]> => {
  console.log("PostManager - Loading all posts (React Query optimized)");

  try {
    // Parallel fetch for better performance
    const [userCreatedPosts, deletedIds] = await Promise.all([
      getStoredPosts(),
      getDeletedPostIds()
    ]);
    logPostArray("Got user created posts", userCreatedPosts);

    // Use Sets for O(1) lookups, which is much faster than array.includes()
    const deletedIdSet = new Set(deletedIds);

    // Filter and process in one pass for better performance
    const availableUserCreatedPosts = userCreatedPosts.filter(post => !deletedIdSet.has(post.id));
    const userCreatedPostIds = new Set(availableUserCreatedPosts.map(p => p.id));
    
    const availableDefaultPosts = blogPosts
      .filter(post => !deletedIdSet.has(post.id) && !userCreatedPostIds.has(post.id))
      .map(post => {
        const { content, ...summary } = post;
        return {
          ...summary,
          seoKeywords: (post as any).seoKeywords || '',
          metaDescription: (post as any).metaDescription || post.excerpt
        } as BlogPostSummary;
      });

    logPostArray("Default posts available", availableDefaultPosts);

    const finalPosts: BlogPostSummary[] = [...availableUserCreatedPosts, ...availableDefaultPosts];
    logPostArray("FINAL OPTIMIZED RESULT (to be returned)", finalPosts);
    return finalPosts;
  } catch (error) {
    console.error("PostManager - Error loading posts:", error);
    return [];
  }
};

export const getPostsByCategory = async (category: string): Promise<BlogPostSummary[]> => {
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
    console.log(`[PostManager] Found post in Supabase: ${id}`);
    return postFromSupabase;
  }

  // 2. If not in Supabase, check the default posts array.
  const postFromDefaults = blogPosts.find(post => post.id === id);
  if (!postFromDefaults) {
    console.warn(`[PostManager] Post not found by ID: ${id}`);
    return undefined;
  }

  // 3. It's a default post. Check if it has been deleted.
  const deleted = await isPostDeleted(id);
  if (deleted) {
    console.log(`[PostManager] Post is marked deleted: ${id}`);
    return undefined;
  }

  // Map to ensure consistent object structure, same as in loadAllPosts
  const mapped = {
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
  console.log(`[PostManager] Returning mapped default post for ${id}:`, mapped);
  return mapped;
};

