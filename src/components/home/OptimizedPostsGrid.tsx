
import { useQuery } from "@tanstack/react-query";
import { VirtualizedPostGrid } from "@/components/VirtualizedPostGrid";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { loadOptimizedPostSummaries } from "@/services/supabase/optimizedPosts";
import { useCategoryFiltering } from "@/hooks/useCategoryFiltering";
import { useMemoryOptimization } from "@/hooks/useMemoryOptimization";
import { type BlogPostSummary } from "@/types/blog";

interface OptimizedPostsGridProps {
  selectedCategory: string;
  onClearFilters: () => void;
}

const OptimizedPostsGrid = ({ selectedCategory, onClearFilters }: OptimizedPostsGridProps) => {
  const { getMemoryStats } = useMemoryOptimization();

  const { data: allPosts = [], isLoading } = useQuery<BlogPostSummary[]>({
    queryKey: ['posts-optimized'],
    queryFn: loadOptimizedPostSummaries,
    staleTime: 15 * 60 * 1000, // 15 minutes cache
  });

  const { filteredPosts } = useCategoryFiltering(allPosts);

  // Filter by selected category
  const displayPosts = selectedCategory === "All" 
    ? filteredPosts 
    : filteredPosts.filter(post => 
        post.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory.toLowerCase()
      );

  const LoadingSkeleton = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );

  // Debug memory usage
  const memStats = getMemoryStats();
  console.log('Memory usage:', memStats ? `${Math.round(memStats.usedJSHeapSize / 1024 / 1024)}MB` : 'N/A');

  return (
    <div>
      <h2 className="text-3xl font-bold text-[#20466d] mb-8">
        {selectedCategory !== "All" ? `${selectedCategory}` : "Latest"} Reports
      </h2>
      
      {isLoading ? (
        <LoadingSkeleton />
      ) : displayPosts.length > 0 ? (
        <VirtualizedPostGrid 
          posts={displayPosts}
          itemHeight={320}
          containerHeight={800}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-[#79858D] text-lg">No reports found matching your criteria.</p>
          {selectedCategory !== "All" && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="mt-4"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default OptimizedPostsGrid;
