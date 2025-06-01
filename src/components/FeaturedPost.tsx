
import { Link } from "react-router-dom";
import { Clock, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  authorImage: string;
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
  image: string;
}

interface FeaturedPostProps {
  post: BlogPost;
}

const FeaturedPost = ({ post }: FeaturedPostProps) => {
  return (
    <Card className="overflow-hidden border-0 shadow-2xl">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Image */}
        <div className="relative h-64 md:h-full bg-gradient-to-br from-blue-100 to-indigo-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">IH</span>
              </div>
              <p className="text-blue-700 font-medium">Featured Article</p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <CardContent className="p-8 flex flex-col justify-center">
          <div className="mb-4">
            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          </div>
          
          {/* Author and Meta */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{post.author}</p>
                <p className="text-sm text-gray-500">{post.authorRole}</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {post.readTime}
              </span>
              <span>{post.publishedAt}</span>
            </div>
          </div>
          
          <Link to={`/post/${post.id}`}>
            <Button className="w-full group">
              Read Full Article
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardContent>
      </div>
    </Card>
  );
};

export default FeaturedPost;
