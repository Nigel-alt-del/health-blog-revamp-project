
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  image?: string;
}

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const hasCustomImage = post.image && post.image !== "/placeholder.svg";

  // Map categories to display the correct badge labels
  const getCategoryDisplay = (category: string) => {
    // Map any legacy categories to the three main ones
    switch (category.toLowerCase()) {
      case "healthcare":
      case "health policy":
      case "health":
        return "Healthcare";
      case "pmi insights":
      case "insurance tips":
      case "insurance":
      case "pmi":
        return "PMI Insights";
      case "industry news":
      case "news":
        return "Industry News";
      default:
        return "Healthcare"; // Default fallback
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 group border-[#79858D]/20">
      <CardHeader className="pb-4">
        <div className="w-full h-48 rounded-lg mb-4 overflow-hidden">
          {hasCustomImage ? (
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#22aee1] to-[#20466d] flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-[#20466d] font-bold">IMH</span>
                </div>
                <p className="text-white text-sm font-medium">{getCategoryDisplay(post.category)}</p>
              </div>
            </div>
          )}
        </div>
        <Badge variant="secondary" className="w-fit bg-[#22aee1] text-white">
          {getCategoryDisplay(post.category)}
        </Badge>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Link to={`/post/${post.id}`} className="block">
          <h3 className="text-xl font-bold text-[#20466d] mb-3 group-hover:text-[#22aee1] transition-colors leading-tight">
            {post.title}
          </h3>
          <p className="text-[#79858D] mb-4 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </Link>
        
        <div className="flex items-center justify-between text-sm text-[#79858D]">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {post.readTime}
            </span>
            <span>{post.publishedAt}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
