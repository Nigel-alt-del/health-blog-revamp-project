
import { type BlogPost } from "@/types/blog";

const categoryMappings: { [key: string]: string } = {
  "pmi insights": "PMI Insights",
  "insurance tips": "PMI Insights",
  "insurance": "PMI Insights",
  "pmi": "PMI Insights",
  "healthcare": "Healthcare",
  "health policy": "Healthcare",
  "health": "Healthcare",
  "digital health": "Digital Health",
  "digital transformation": "Digital Health",
  "benefits technology": "Digital Health",
  "mental health": "Mental Health",
  "workplace wellbeing": "Mental Health",
  "employee support": "Mental Health",
};

/**
 * Returns the standardized display name for a post's raw category.
 * @param rawCategory The raw category string from the post data.
 * @returns A user-friendly, standardized category name.
 */
export const getCategoryDisplay = (rawCategory: string): string => {
  const normalized = rawCategory.toLowerCase().trim();
  return categoryMappings[normalized] || rawCategory;
};

/**
 * Checks if a post matches a given *display* category.
 * A post can match multiple categories (e.g., a "Mental Health" post also matches "Healthcare").
 * @param post The blog post object.
 * @param displayCategory The user-facing category name to check against (e.g., "Healthcare").
 * @returns True if the post matches the category.
 */
export const doesPostMatchCategory = (post: BlogPost, displayCategory: string): boolean => {
  const postDisplayCategory = getCategoryDisplay(post.category);

  if (postDisplayCategory === displayCategory) {
    return true;
  }

  // Special rule: "Mental Health" posts are also part of the "Healthcare" category.
  if (displayCategory === "Healthcare" && postDisplayCategory === "Mental Health") {
    return true;
  }

  return false;
};

/**
 * Gets a sorted list of unique display categories from a list of posts.
 * @param posts An array of blog posts.
 * @returns A sorted array of unique, user-facing category names.
 */
export const getUniqueDisplayCategories = (posts: BlogPost[]): string[] => {
  const categories = new Set<string>();
  posts.forEach(post => {
    categories.add(getCategoryDisplay(post.category));
  });
  return Array.from(categories).sort();
};

/**
 * Maps a display category name to its URL-friendly slug.
 * @param category The user-facing category name.
 * @returns A URL-friendly slug.
 */
export const categoryToSlug = (category: string): string => {
  return category.toLowerCase().replace(/\s+/g, '-');
};

/**
 * Maps a URL slug back to its display category name.
 * @param slug The URL slug.
 * @returns The user-facing category name.
 */
export const slugToCategory = (slug: string = ''): string => {
  switch (slug) {
    case 'pmi-insights': return 'PMI Insights';
    case 'healthcare': return 'Healthcare';
    case 'digital-health': return 'Digital Health';
    case 'mental-health': return 'Mental Health';
    default: return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
};
