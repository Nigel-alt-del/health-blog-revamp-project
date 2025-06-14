import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BlogLayout from "@/components/BlogLayout";
import BlogCard from "@/components/BlogCard";
import { type BlogPost } from "@/utils/localStorage";
import { getPostsByCategory } from "@/utils/postManager";
import { categories } from "@/data/blogPosts";

const BlogCategory = () => {
  const { category } = useParams();
  const [categoryPosts, setCategoryPosts] = useState<BlogPost[]>([]);

  // Load posts using centralized function
  useEffect(() => {
    const loadCategoryPosts = async () => {
      if (category) {
        console.log("BlogCategory - Loading posts for category:", category);
        const posts = await getPostsByCategory(category);
        console.log("BlogCategory - Filtered posts for category:", category, posts);
        setCategoryPosts(posts);
      }
    };
    
    loadCategoryPosts();
  }, [category]);
  
  const categoryName = categories.find(
    cat => cat.toLowerCase().replace(/\s+/g, '-') === category
  ) || category;

  const getHeroTitle = () => {
    if (category === 'pmi-insights') return 'PMI Insights';
    if (category === 'healthcare') return 'Healthcare Intelligence';
    if (category === 'digital-health') return 'Digital Health';
    if (category === 'mental-health') return 'Mental Health';
    return `${categoryName} Intelligence`;
  };

  return (
    <BlogLayout>
      {/* Banner Section */}
      <section 
        className="relative py-20 px-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(32, 70, 109, 0.8), rgba(32, 70, 109, 0.8)), url('/lovable-uploads/b61ae919-b75e-409d-a884-8437e2befc15.png')`
        }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <Badge variant="secondary" className="mb-4 bg-[#22aee1] text-white">
            <Filter className="mr-2 h-4 w-4" />
            Category
          </Badge>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            {getHeroTitle()}
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {categoryPosts.length} insight{categoryPosts.length !== 1 ? 's' : ''} in this category
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
              <p className="text-[#79858D] text-lg">No insights found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </BlogLayout>
  );
};

export default BlogCategory;
