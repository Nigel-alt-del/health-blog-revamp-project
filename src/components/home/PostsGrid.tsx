
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BlogCard from "@/components/BlogCard";
import { type BlogPost } from "@/types/blog";

interface PostsGridProps {
  posts: BlogPost[];
  selectedCategory: string;
  onClearFilters: () => void;
  isLoading?: boolean;
}

const PostsGrid = ({ posts, selectedCategory, onClearFilters, isLoading = false }: PostsGridProps) => {
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

  return (
    <div>
      <h2 className="text-3xl font-bold text-[#20466d] mb-8">
        {selectedCategory !== "All" ? `${selectedCategory}` : "Latest"} Reports
      </h2>
      
      {isLoading ? (
        <LoadingSkeleton />
      ) : posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
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

export default PostsGrid;
