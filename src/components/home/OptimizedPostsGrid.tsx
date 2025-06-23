
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Zap } from "lucide-react";
import BlogCard from "@/components/BlogCard";
import { useOptimizedPosts } from "@/hooks/useOptimizedPosts";
import { type BlogPostSummary } from "@/types/blog";

interface OptimizedPostsGridProps {
  selectedCategory: string;
  onClearFilters: () => void;
}

const OptimizedPostsGrid = ({ selectedCategory, onClearFilters }: OptimizedPostsGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 12;
  
  const { data, isLoading, isFetching } = useOptimizedPosts(currentPage, POSTS_PER_PAGE);
  
  // Filter posts by category
  const filteredPosts = data?.posts.filter(post => 
    selectedCategory === "All" || post.category === selectedCategory
  ) || [];

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

  const loadMorePosts = () => {
    setCurrentPage(prev => prev + 1);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-[#20466d]">
          {selectedCategory !== "All" ? `${selectedCategory}` : "Latest"} Reports
        </h2>
        <Badge variant="outline" className="flex items-center gap-1">
          <Zap className="h-3 w-3" />
          Optimized Loading
        </Badge>
      </div>
      
      {isLoading ? (
        <LoadingSkeleton />
      ) : filteredPosts.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          
          {data?.hasMore && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                onClick={loadMorePosts}
                disabled={isFetching}
                className="flex items-center gap-2"
              >
                {isFetching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Load More Posts
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Showing {filteredPosts.length} of {data?.total} total posts
              </p>
            </div>
          )}
        </>
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
