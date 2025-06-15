
import { useState, useMemo } from "react";
import { type BlogPost, type BlogPostSummary } from "@/types/blog";
import { doesPostMatchCategory, getUniqueDisplayCategories } from "@/utils/categoryManager";

export const useCategoryFiltering = (allPosts: BlogPostSummary[]) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const displayCategories = getUniqueDisplayCategories(allPosts as BlogPost[]);
    return ["All", ...displayCategories];
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "All") {
      return allPosts;
    }
    const filtered = allPosts.filter(post => doesPostMatchCategory(post as BlogPost, selectedCategory));
    return filtered;
  }, [selectedCategory, allPosts]);

  return {
    filteredPosts,
    selectedCategory,
    setSelectedCategory,
    categories,
  };
};
