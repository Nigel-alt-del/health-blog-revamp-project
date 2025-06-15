
import { useState, useMemo } from "react";
import { type BlogPost } from "@/types/blog";
import { doesPostMatchCategory, getUniqueDisplayCategories } from "@/utils/categoryManager";

export const useCategoryFiltering = (allPosts: BlogPost[]) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const displayCategories = getUniqueDisplayCategories(allPosts);
    return ["All", ...displayCategories];
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "All") {
      return allPosts;
    }
    const filtered = allPosts.filter(post => doesPostMatchCategory(post, selectedCategory));
    return filtered;
  }, [selectedCategory, allPosts]);

  return {
    filteredPosts,
    selectedCategory,
    setSelectedCategory,
    categories,
  };
};
