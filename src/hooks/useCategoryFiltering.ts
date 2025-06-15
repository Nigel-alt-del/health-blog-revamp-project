
import { useState, useEffect } from "react";
import { type BlogPost } from "@/utils/supabaseStorage";
import { doesPostMatchCategory, getUniqueDisplayCategories } from "@/utils/categoryManager";

export const useCategoryFiltering = (allPosts: BlogPost[]) => {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredPosts(allPosts);
    } else {
      const filtered = allPosts.filter(post => doesPostMatchCategory(post, selectedCategory));
      setFilteredPosts(filtered);
    }
  }, [selectedCategory, allPosts]);

  const displayCategories = getUniqueDisplayCategories(allPosts);
  const categories = ["All", ...displayCategories];

  return {
    filteredPosts,
    selectedCategory,
    setSelectedCategory,
    categories,
  };
};
