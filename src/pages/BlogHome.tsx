
import { useState } from "react";
import { Search, Clock, ArrowRight } from "lucide-react";
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Health Insurance <span className="text-blue-600">Insights</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Expert analysis, industry trends, and thought leadership on navigating 
            the complex world of health insurance
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>Latest insights</span>
            <span>•</span>
            <span>Expert analysis</span>
            <span>•</span>
            <span>Industry trends</span>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 px-4 bg-white border-b">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Article</h2>
          <FeaturedPost post={featuredPost} />
        </div>
      </section>

      {/* Recent Posts Grid */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Latest Insights</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          {filteredPosts.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles found matching "{searchTerm}"</p>
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
