
import { getStoredPosts, getDeletedPostIds, type BlogPost } from "./supabaseStorage";
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
 */
export const getPostById = async (id: string): Promise<BlogPost | undefined> => {
  const allPosts = await loadAllPosts();
  return allPosts.find(post => post.id === id);
};
