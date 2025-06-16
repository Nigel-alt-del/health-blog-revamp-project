
import { useQuery } from "@tanstack/react-query";
import BlogLayout from "@/components/BlogLayout";
import HeroSection from "@/components/home/HeroSection";
import IntroSection from "@/components/home/IntroSection";
import CategoryButtons from "@/components/home/CategoryButtons";
import OptimizedPostsGrid from "@/components/home/OptimizedPostsGrid";
import { type BlogPostSummary } from "@/types/blog";
import { loadOptimizedPostSummaries } from "@/services/supabase/optimizedPosts";
import { useCategoryFiltering } from "@/hooks/useCategoryFiltering";

const BlogHome = () => {
  const { data: allPosts = [], isLoading } = useQuery<BlogPostSummary[]>({
    queryKey: ['posts-optimized'],
    queryFn: loadOptimizedPostSummaries,
    staleTime: 10 * 60 * 1000, // 10 minutes - longer cache for better performance
  });

  const {
    filteredPosts,
    selectedCategory,
    setSelectedCategory,
    categories
  } = useCategoryFiltering(allPosts);

  console.log("BlogHome - Optimized render. isLoading:", isLoading, "Posts count:", allPosts.length);

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

        <OptimizedPostsGrid
          selectedCategory={selectedCategory}
          onClearFilters={() => setSelectedCategory("All")}
        />
      </div>
    </BlogLayout>
  );
};

export default BlogHome;
