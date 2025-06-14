
import { Button } from "@/components/ui/button";
import BlogCard from "@/components/BlogCard";
import { type BlogPost } from "@/utils/supabaseStorage";

interface PostsGridProps {
  posts: BlogPost[];
  selectedCategory: string;
  onClearFilters: () => void;
}

const PostsGrid = ({ posts, selectedCategory, onClearFilters }: PostsGridProps) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-[#20466d] mb-8">
        {selectedCategory !== "All" ? `${selectedCategory}` : "Latest"} Reports
      </h2>
      
      {posts.length > 0 ? (
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
