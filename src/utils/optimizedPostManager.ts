
import { getStoredPosts, getPostFromStorage } from "@/services/supabase/posts";
import { getDeletedPostIds, isPostDeleted } from "@/services/supabase/deletedPosts";
import { type BlogPost, type BlogPostSummary } from "@/types/blog";
import { blogPosts } from "@/data/blogPosts";

/**
 * Optimized post manager with pagination and content compression
 */

interface PostPaginationOptions {
  page?: number;
  limit?: number;
  includeContent?: boolean;
}

/**
 * Load posts with pagination and optional content exclusion for better performance
 */
export const loadPostsPaginated = async (options: PostPaginationOptions = {}): Promise<{
  posts: BlogPostSummary[];
  total: number;
  hasMore: boolean;
}> => {
  const { page = 1, limit = 20, includeContent = false } = options;
  
  console.log(`PostManager - Loading paginated posts (page: ${page}, limit: ${limit})`);

  try {
    const [userCreatedPosts, deletedIds] = await Promise.all([
      getStoredPosts(),
      getDeletedPostIds()
    ]);

    const deletedIdSet = new Set(deletedIds);
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

    const allPosts = [...availableUserCreatedPosts, ...availableDefaultPosts];
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = allPosts.slice(startIndex, endIndex);
    
    console.log(`PostManager - Returning ${paginatedPosts.length} posts (page ${page}/${Math.ceil(allPosts.length / limit)})`);
    
    return {
      posts: paginatedPosts,
      total: allPosts.length,
      hasMore: endIndex < allPosts.length
    };
  } catch (error) {
    console.error("PostManager - Error loading paginated posts:", error);
    return { posts: [], total: 0, hasMore: false };
  }
};

/**
 * Load post summaries only (no content) for list views
 */
export const loadPostSummaries = async (): Promise<BlogPostSummary[]> => {
  const result = await loadPostsPaginated({ includeContent: false, limit: 100 });
  return result.posts;
};

/**
 * Get compressed post content size info
 */
export const getPostContentStats = (post: BlogPost): {
  contentSize: number;
  hasLargeContent: boolean;
  compressionRecommended: boolean;
} => {
  const contentSize = new Blob([post.content]).size;
  const hasLargeContent = contentSize > 100000; // 100KB
  const compressionRecommended = contentSize > 50000; // 50KB
  
  return {
    contentSize,
    hasLargeContent,
    compressionRecommended
  };
};
