
import { useQuery } from "@tanstack/react-query";
import BlogLayout from "@/components/BlogLayout";
import HeroSection from "@/components/home/HeroSection";
import IntroSection from "@/components/home/IntroSection";
import CategoryButtons from "@/components/home/CategoryButtons";
import FilterBadges from "@/components/home/FilterBadges";
import PostsGrid from "@/components/home/PostsGrid";
import { type BlogPost } from "@/utils/supabaseStorage";
import { loadAllPosts } from "@/utils/postManager";
import { useCategoryFiltering } from "@/hooks/useCategoryFiltering";

const BlogHome = () => {
  const { data: allPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['posts'],
    queryFn: loadAllPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    filteredPosts,
    selectedCategory,
    setSelectedCategory,
    categories
  } = useCategoryFiltering(allPosts);

  console.log("BlogHome - Render. isLoading:", isLoading, "Posts count:", allPosts.length);

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

        <FilterBadges
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

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
