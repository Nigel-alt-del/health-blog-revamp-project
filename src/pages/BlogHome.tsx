
import { useState, useEffect } from "react";
import BlogLayout from "@/components/BlogLayout";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { type BlogPost } from "@/utils/supabaseStorage";
import { loadAllPosts } from "@/utils/postManager";

const BlogHome = () => {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const refreshPosts = async () => {
    console.log("BlogHome - CRYSTAL CLEAR REFRESH");
    const posts = await loadAllPosts();
    console.log("BlogHome - LOADED POSTS:", posts);
    setAllPosts(posts);
    setFilteredPosts(posts);
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

  useEffect(() => {
    let filtered = allPosts;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(post => {
        // Map categories to display values for filtering
        const getCategoryDisplay = (category: string) => {
          const normalizedCategory = category.toLowerCase();
          switch (normalizedCategory) {
            case "pmi insights":
            case "insurance tips":
            case "insurance":
            case "pmi":
              return "PMI Insights";
            case "healthcare":
            case "health policy":
            case "health":
              return "Healthcare";
            case "digital health":
            case "digital transformation":
            case "benefits technology":
              return "Digital Health";
            case "mental health":
            case "workplace wellbeing":
            case "employee support":
              return "Mental Health";
            default:
              return category;
          }
        };
        
        return getCategoryDisplay(post.category) === selectedCategory;
      });
    }

    setFilteredPosts(filtered);
  }, [selectedCategory, allPosts]);

  // Map categories for display in filter buttons
  const getCategoryDisplay = (category: string) => {
    const normalizedCategory = category.toLowerCase();
    switch (normalizedCategory) {
      case "pmi insights":
      case "insurance tips":
      case "insurance":
      case "pmi":
        return "PMI Insights";
      case "healthcare":
      case "health policy":
      case "health":
        return "Healthcare";
      case "digital health":
      case "digital transformation":
      case "benefits technology":
        return "Digital Health";
      case "mental health":
      case "workplace wellbeing":
      case "employee support":
        return "Mental Health";
      default:
        return category;
    }
  };

  // Get unique display categories for filter buttons
  const displayCategories = Array.from(new Set(allPosts.map(post => getCategoryDisplay(post.category))));
  const categories = ["All", ...displayCategories];

  const categoryButtons = [
    { name: "PMI Insights", slug: "pmi-insights", color: "bg-blue-500 hover:bg-blue-600" },
    { name: "Healthcare", slug: "healthcare", color: "bg-green-500 hover:bg-green-600" },
    { name: "Digital Health", slug: "digital-health", color: "bg-purple-500 hover:bg-purple-600" },
    { name: "Mental Health", slug: "mental-health", color: "bg-teal-500 hover:bg-teal-600" }
  ];

  console.log("BlogHome - All posts count:", filteredPosts.length);

  return (
    <BlogLayout>
      {/* Hero Section with Background */}
      <section 
        className="relative py-20 px-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(32, 70, 109, 0.8), rgba(32, 70, 109, 0.8)), url('/lovable-uploads/b61ae919-b75e-409d-a884-8437e2befc15.png')`
        }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            InsureMyHealth <span className="text-[#22aee1]">Reports</span>
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
            Stay informed with the latest insights on healthcare policy, insurance trends, 
            and industry analysis. Our expert team delivers comprehensive reports to help 
            you navigate the complex world of health insurance.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Category Navigation Buttons */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#20466d] mb-8 text-center">
            Explore Our Categories
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryButtons.map((category) => (
              <Link key={category.slug} to={`/category/${category.slug}`}>
                <Button 
                  className={`w-full h-24 text-lg font-semibold text-white ${category.color} transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-between`}
                >
                  <span>{category.name}</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedCategory === category
                    ? "bg-[#22aee1] text-white"
                    : "border-[#22aee1] text-[#22aee1] hover:bg-[#22aee1] hover:text-white"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Latest Reports */}
        <div>
          <h2 className="text-3xl font-bold text-[#20466d] mb-8">
            {selectedCategory !== "All" ? `${selectedCategory}` : "Latest"} Reports
          </h2>
          
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#79858D] text-lg">No reports found matching your criteria.</p>
              {selectedCategory !== "All" && (
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory("All")}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </BlogLayout>
  );
};

export default BlogHome;
