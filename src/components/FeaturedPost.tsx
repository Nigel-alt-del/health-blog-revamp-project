
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

interface FeaturedPostProps {
  post: BlogPost;
}

const FeaturedPost = ({ post }: FeaturedPostProps) => {
  const hasCustomImage = post.image && post.image !== "/placeholder.svg";

  // Map categories to display the correct badge labels
  const getCategoryDisplay = (category: string) => {
    switch (category) {
      case "Healthcare":
        return "Healthcare";
      case "PMI Insights":
        return "PMI Insights";
      case "Industry News":
        return "Industry News";
      default:
        return category;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-[#79858D]/20">
      <div className="md:flex">
        <div className="md:w-1/2">
          <div className="h-64 md:h-full overflow-hidden">
            {hasCustomImage ? (
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#22aee1] to-[#20466d] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-[#20466d] font-bold text-lg">IMH</span>
                  </div>
                  <p className="text-white text-lg font-medium">{getCategoryDisplay(post.category)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="md:w-1/2">
          <CardHeader className="pb-4">
            <Badge variant="secondary" className="w-fit bg-[#22aee1] text-white mb-4">
              {getCategoryDisplay(post.category)}
            </Badge>
            <Link to={`/post/${post.id}`}>
              <h2 className="text-2xl md:text-3xl font-bold text-[#20466d] mb-4 hover:text-[#22aee1] transition-colors leading-tight">
                {post.title}
              </h2>
            </Link>
          </CardHeader>
          
          <CardContent className="pt-0">
            <p className="text-[#79858D] mb-6 text-lg leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between text-sm text-[#79858D]">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {post.readTime}
                </span>
                <span>{post.publishedAt}</span>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default FeaturedPost;
