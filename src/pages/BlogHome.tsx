
import { useState, useEffect } from "react";
import BlogLayout from "@/components/BlogLayout";
import HeroSection from "@/components/home/HeroSection";
import IntroSection from "@/components/home/IntroSection";
import CategoryButtons from "@/components/home/CategoryButtons";
import PostsGrid from "@/components/home/PostsGrid";
import { type BlogPost } from "@/utils/supabaseStorage";
import { loadAllPosts, preloadPosts } from "@/utils/postManager";
import { useCategoryFiltering } from "@/hooks/useCategoryFiltering";

const BlogHome = () => {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshPosts = async (useCache = true) => {
    console.log("BlogHome - OPTIMIZED REFRESH");
    try {
      const posts = await loadAllPosts(useCache);
      console.log("BlogHome - LOADED POSTS:", posts.length);
      setAllPosts(posts);
    } catch (error) {
      console.error("BlogHome - Error loading posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("BlogHome - INITIAL LOAD WITH OPTIMIZATION");
    
    // Start preloading immediately
    preloadPosts();
    
    // Load posts with cache
    refreshPosts(true);

    const handlePostsRefreshed = () => {
      console.log("BlogHome - HANDLING REFRESH EVENT");
      refreshPosts(false); // Force fresh data on refresh events
    };

    window.addEventListener('postsRefreshed', handlePostsRefreshed);
    
    return () => {
      window.removeEventListener('postsRefreshed', handlePostsRefreshed);
    };
  }, []);

  // Optimized visibility change handler with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("BlogHome - PAGE VISIBLE, OPTIMIZED REFRESH");
        // Debounce the refresh to avoid multiple rapid calls
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          refreshPosts(true); // Use cache for visibility changes
        }, 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(timeoutId);
    };
  }, []);

  const {
    filteredPosts,
    selectedCategory,
    setSelectedCategory,
    categories
  } = useCategoryFiltering(allPosts);

  console.log("BlogHome - Filtered posts count:", filteredPosts.length);

  return (
    <BlogLayout>
      <HeroSection
        title="The Health Compass"
        subtitle="Actionable Healthcare Insights for SMEs & Private Medical Insurance Professionals"
        backgroundImage="/lovable-uploads/b61ae919-b75e-409d-a884-8437e2befc15.png"
      />

      <IntroSection />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <CategoryButtons />

        <PostsGrid
          posts={filteredPosts}
          selectedCategory={selectedCategory}
          onClearFilters={() => setSelectedCategory("All")}
          isLoading={isLoading}
        />
      </div>
    </BlogLayout>
  );
};

export default BlogHome;
