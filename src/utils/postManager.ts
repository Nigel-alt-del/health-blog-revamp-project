
import { getStoredPosts, isPostDeleted, type BlogPost } from "./localStorage";
import { blogPosts } from "@/data/blogPosts";

/**
 * Centralized function to load all posts with proper deletion filtering
 * This ensures consistent behavior across all components
 */
export const loadAllPosts = (): BlogPost[] => {
  console.log("PostManager - Loading all posts with deletion filtering");
  
  // Force clear any cached data by checking timestamp
  const lastClearTime = localStorage.getItem('lastPostClear');
  const currentTime = Date.now();
  
  const storedPosts = getStoredPosts();
  console.log("PostManager - Stored posts:", storedPosts);
  
  // Convert and filter default posts - CRITICAL: Always filter out deleted ones
  const filteredDefaultPosts = blogPosts
    .filter(post => {
      const isDeleted = isPostDeleted(post.id);
      if (isDeleted) {
        console.log("PostManager - Filtering out deleted default post:", post.id);
      }
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

  let combinedPosts: BlogPost[] = [];

  if (storedPosts.length > 0) {
    // Filter stored posts to ensure no deleted ones slip through
    const validStoredPosts = storedPosts.filter(post => !isPostDeleted(post.id));
    
    // Combine valid stored posts with unmodified default posts
    const storedPostIds = validStoredPosts.map(p => p.id);
    const unmodifiedDefaultPosts = filteredDefaultPosts.filter(p => !storedPostIds.includes(p.id));
    combinedPosts = [...validStoredPosts, ...unmodifiedDefaultPosts];
  } else {
    combinedPosts = filteredDefaultPosts;
  }
  
  // Final safety check - remove any posts that might have been marked as deleted
  const finalFilteredPosts = combinedPosts.filter(post => !isPostDeleted(post.id));
  
  console.log("PostManager - Final combined posts:", finalFilteredPosts);
  console.log("PostManager - Total posts loaded:", finalFilteredPosts.length);
  
  return finalFilteredPosts;
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
 * Force refresh all post data - clears any cached state
 */
export const forceRefreshPosts = (): void => {
  console.log("PostManager - Force refreshing all post data");
  localStorage.setItem('lastPostClear', Date.now().toString());
  
  // Clear any component-level caches by dispatching a custom event
  window.dispatchEvent(new CustomEvent('postsRefreshed'));
};
