
import { getStoredPosts, isPostDeleted, type BlogPost } from "./localStorage";
import { blogPosts } from "@/data/blogPosts";

/**
 * Centralized function to load all posts with proper deletion filtering
 * This ensures consistent behavior across all components
 */
export const loadAllPosts = (): BlogPost[] => {
  console.log("PostManager - Loading all posts with deletion filtering");
  
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
    // Combine stored posts with unmodified default posts
    // CRITICAL: Only include default posts that haven't been modified/stored AND aren't deleted
    const storedPostIds = storedPosts.map(p => p.id);
    const unmodifiedDefaultPosts = filteredDefaultPosts.filter(p => !storedPostIds.includes(p.id));
    combinedPosts = [...storedPosts, ...unmodifiedDefaultPosts];
  } else {
    combinedPosts = filteredDefaultPosts;
  }
  
  console.log("PostManager - Final combined posts:", combinedPosts);
  console.log("PostManager - Total posts loaded:", combinedPosts.length);
  
  return combinedPosts;
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
