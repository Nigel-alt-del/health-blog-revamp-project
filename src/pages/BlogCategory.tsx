import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BlogLayout from "@/components/BlogLayout";
import BlogCard from "@/components/BlogCard";
import { type BlogPost } from "@/utils/supabaseStorage";
import { loadAllPosts } from "@/utils/postManager";

const BlogCategory = () => {
  const { category: categorySlug } = useParams<{ category: string }>();

  // Map URL slugs to category names and handle variations
  const getCategoryNameFromSlug = (slug: string = '') => {
    switch (slug) {
      case 'pmi-insights':
        return 'PMI Insights';
      case 'healthcare':
        return 'Healthcare';
      case 'digital-health':
        return 'Digital Health';
      case 'mental-health':
        return 'Mental Health';
      default:
        return slug;
    }
  };

  const categoryName = getCategoryNameFromSlug(categorySlug);

  // Enhanced category matching function
  const doesPostMatchCategory = (post: BlogPost, targetCategory: string): boolean => {
    const postCategory = post.category.toLowerCase().trim();
    const target = targetCategory.toLowerCase();

    console.log("BlogCategory - Checking post category:", postCategory, "against target:", target);

    // Direct match
    if (postCategory === target) {
      return true;
    }

    // Handle category variations
    switch (target) {
      case 'pmi insights':
        return postCategory.includes('pmi') || 
               postCategory.includes('insurance') || 
               postCategory === 'insurance tips';
      
      case 'healthcare':
        return postCategory.includes('healthcare') || 
               postCategory.includes('health policy') || 
               postCategory === 'health' ||
               postCategory.includes('mental health') ||
               postCategory.includes('workplace wellbeing');
      
      case 'digital health':
        return postCategory.includes('digital') || 
               postCategory.includes('benefits technology') || 
               postCategory === 'digital transformation';
      
      case 'mental health':
        return postCategory.includes('mental health') || 
               postCategory.includes('workplace wellbeing') || 
               postCategory.includes('employee support');
      
      default:
        return false;
    }
  };

  const { data: allPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ['posts'],
    queryFn: loadAllPosts,
  });

  const categoryPosts = allPosts.filter(post => doesPostMatchCategory(post, categoryName));

  const getHeroTitle = () => {
    if (categorySlug === 'pmi-insights') return 'PMI Insights';
    if (categorySlug === 'healthcare') return 'Healthcare Intelligence';
    if (categorySlug === 'digital-health') return 'Digital Health';
    if (categorySlug === 'mental-health') return 'Mental Health';
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
