
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Clock, ArrowRight, Calculator, TrendingUp, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BlogLayout from "@/components/BlogLayout";
import FeaturedPost from "@/components/FeaturedPost";
import BlogCard from "@/components/BlogCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { blogPosts } from "@/data/blogPosts";

const BlogHome = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const featuredPost = blogPosts[0];
  const recentPosts = blogPosts.slice(1, 7);
  
  const filteredPosts = recentPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <BlogLayout>
      {/* Hero Section with Brand Banner */}
      <section 
        className="relative py-20 px-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(32, 70, 109, 0.8), rgba(32, 70, 109, 0.8)), url('/lovable-uploads/b61ae919-b75e-409d-a884-8437e2befc15.png')`
        }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            UK Health Insurance <span className="text-[#22aee1]">Intelligence</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Expert analysis, market intelligence, and compliance guidance specifically 
            designed for UK small and medium enterprises
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="bg-[#22aee1] hover:bg-[#20466d] text-white transition-colors">
              <Link to="/calculators">
                <Calculator className="mr-2 h-5 w-5" />
                Try Our Calculators
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-[#22aee1] hover:bg-[#20466d] text-white transition-colors">
              <Link to="/compliance-tools">
                <FileText className="mr-2 h-5 w-5" />
                Compliance Tools
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-200">
            <span>UK Market Analysis</span>
            <span>•</span>
            <span>SME-Focused Intelligence</span>
            <span>•</span>
            <span>Regulatory Guidance</span>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 px-4 bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#79858D] h-5 w-5" />
            <Input
              type="text"
              placeholder="Search UK health insurance insights..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg border-[#79858D] focus:border-[#22aee1] focus:ring-[#22aee1]"
            />
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#20466d] mb-8 text-center">Featured Analysis</h2>
          <FeaturedPost post={featuredPost} />
        </div>
      </section>

      {/* Recent Posts Grid */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#20466d] mb-8 text-center">Latest UK Market Insights</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          {filteredPosts.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <p className="text-[#79858D] text-lg">No insights found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </BlogLayout>
  );
};

export default BlogHome;
