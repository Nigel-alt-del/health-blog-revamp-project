
import { useState, useEffect } from "react";
import BlogLayout from "@/components/BlogLayout";
import HeroSection from "@/components/home/HeroSection";
import CategoryButtons from "@/components/home/CategoryButtons";
import FilterBadges from "@/components/home/FilterBadges";
import PostsGrid from "@/components/home/PostsGrid";
import { type BlogPost } from "@/utils/supabaseStorage";
import { loadAllPosts } from "@/utils/postManager";
import { useCategoryFiltering } from "@/hooks/useCategoryFiltering";

const BlogHome = () => {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);

  const refreshPosts = async () => {
    console.log("BlogHome - CRYSTAL CLEAR REFRESH");
    const posts = await loadAllPosts();
    console.log("BlogHome - LOADED POSTS:", posts);
    setAllPosts(posts);
  };

  useEffect(() => {
    console.log("BlogHome - INITIAL LOAD");
    refreshPosts();

    const handlePostsRefreshed = () => {
      console.log("BlogHome - HANDLING REFRESH EVENT");
      refreshPosts();
    };

    window.addEventListener('postsRefreshed', handlePostsRefreshed);
    
    return () => {
      window.removeEventListener('postsRefreshed', handlePostsRefreshed);
    };
  }, []);

  // Also refresh when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("BlogHome - PAGE VISIBLE, REFRESHING");
        refreshPosts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const {
    filteredPosts,
    selectedCategory,
    setSelectedCategory,
    categories
  } = useCategoryFiltering(allPosts);

  console.log("BlogHome - All posts count:", filteredPosts.length);

  return (
    <BlogLayout>
      <HeroSection
        title="The Health Compass"
        subtitle="Stay informed with the latest insights on healthcare policy, insurance trends, and industry analysis. Our expert team delivers comprehensive reports to help you navigate the complex world of health insurance."
        backgroundImage="/lovable-uploads/b61ae919-b75e-409d-a884-8437e2befc15.png"
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <CategoryButtons />
        
        <FilterBadges
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        <PostsGrid
          posts={filteredPosts}
          selectedCategory={selectedCategory}
          onClearFilters={() => setSelectedCategory("All")}
        />
      </div>
    </BlogLayout>
  );
};

export default BlogHome;
