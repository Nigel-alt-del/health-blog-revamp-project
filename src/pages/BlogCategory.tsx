
import { useParams } from "react-router-dom";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BlogLayout from "@/components/BlogLayout";
import BlogCard from "@/components/BlogCard";
import { blogPosts, categories } from "@/data/blogPosts";

const BlogCategory = () => {
  const { category } = useParams();
  const categoryPosts = blogPosts.filter(
    post => post.category.toLowerCase().replace(/\s+/g, '-') === category
  );
  
  const categoryName = categories.find(
    cat => cat.toLowerCase().replace(/\s+/g, '-') === category
  ) || category;

  return (
    <BlogLayout>
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Filter className="mr-2 h-4 w-4" />
            Category
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {categoryName}
          </h1>
          <p className="text-xl text-gray-600">
            {categoryPosts.length} article{categoryPosts.length !== 1 ? 's' : ''} in this category
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {categoryPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </BlogLayout>
  );
};

export default BlogCategory;
