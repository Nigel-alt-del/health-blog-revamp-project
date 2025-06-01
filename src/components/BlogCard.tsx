
import { Link } from "react-router-dom";
import { Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
}

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
      <CardHeader className="pb-4">
        <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg mb-4 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold">IH</span>
            </div>
            <p className="text-blue-700 text-sm font-medium">{post.category}</p>
          </div>
        </div>
        <Badge variant="secondary" className="w-fit">
          {post.category}
        </Badge>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Link to={`/post/${post.id}`} className="block">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </Link>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-3 w-3 text-gray-600" />
            </div>
            <span className="font-medium">{post.author}</span>
          </div>
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
