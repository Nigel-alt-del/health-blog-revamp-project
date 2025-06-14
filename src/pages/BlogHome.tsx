
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

  const heroSubtitle = `Introducing The Health Compass – Your Strategic Edge in Healthcare Insight

In a world where healthcare landscapes shift fast and compliance pressures grow by the day, staying ahead isn't just an advantage — it's a necessity. The Health Compass is your go-to source for clear, actionable insights designed specifically for SME owners, HR professionals, directors, and those working within the private medical insurance sector.

We cut through the noise to deliver research that matters — data-driven, expertly analysed, and directly relevant to the challenges you face. Whether it's navigating policy changes, optimising employee health benefits, or benchmarking against industry trends, we give you the intelligence you need to act confidently and lead decisively.

You don't need to be a healthcare expert. That's why we are here.`;

  return (
    <BlogLayout>
      <HeroSection
        title="The Health Compass"
        subtitle={heroSubtitle}
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
