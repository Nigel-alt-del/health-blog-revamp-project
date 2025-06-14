
import { useState, useEffect } from "react";
import { type BlogPost } from "@/utils/supabaseStorage";

export const useCategoryFiltering = (allPosts: BlogPost[]) => {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Map categories to display the correct labels
  const getCategoryDisplay = (category: string) => {
    const normalizedCategory = category.toLowerCase();
    switch (normalizedCategory) {
      case "pmi insights":
      case "insurance tips":
      case "insurance":
      case "pmi":
        return "PMI Insights";
      case "healthcare":
      case "health policy":
      case "health":
      case "mental health":
      case "workplace wellbeing":
      case "employee support":
        return "Healthcare";
      case "digital health":
      case "digital transformation":
      case "benefits technology":
        return "Digital Health";
      default:
        return category;
    }
  };

  // Enhanced category matching function
  const doesPostMatchCategory = (post: BlogPost, targetCategory: string): boolean => {
    const postCategory = post.category.toLowerCase().trim();
    const target = targetCategory.toLowerCase();

    // Direct match
    if (postCategory === target) {
      return true;
    }

    // Handle category variations
    switch (target) {
      case 'pmi insights':
        return postCategory.includes('pmi') || 
               postCategory.includes('insurance') || 
               postCategory === 'insurance tips';
      
      case 'healthcare':
        return postCategory.includes('healthcare') || 
               postCategory.includes('health policy') || 
               postCategory === 'health' ||
               postCategory.includes('mental health') ||
               postCategory.includes('workplace wellbeing') ||
               postCategory.includes('employee support');
      
      case 'digital health':
        return postCategory.includes('digital') || 
               postCategory.includes('benefits technology') || 
               postCategory === 'digital transformation';
      
      default:
        return false;
    }
  };

  useEffect(() => {
    let filtered = allPosts;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(post => {
        return doesPostMatchCategory(post, selectedCategory);
      });
    }

    setFilteredPosts(filtered);
  }, [selectedCategory, allPosts]);

  // Get unique display categories for filter buttons
  const displayCategories = Array.from(new Set(allPosts.map(post => getCategoryDisplay(post.category))));
  const categories = ["All", ...displayCategories];

  return {
    filteredPosts,
    selectedCategory,
    setSelectedCategory,
    categories,
    getCategoryDisplay
  };
};
