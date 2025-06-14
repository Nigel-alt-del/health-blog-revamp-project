
import { Link } from "react-router-dom";
import { ArrowLeft, Share2, BookmarkPlus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type BlogPost } from "@/utils/localStorage";

interface BlogPostHeaderProps {
  post: BlogPost;
  cameFromAdmin: boolean;
  onShare: () => void;
  onBookmark: () => void;
}

export const BlogPostHeader = ({ post, cameFromAdmin, onShare, onBookmark }: BlogPostHeaderProps) => {
  return (
    <div className="mb-8">
      {cameFromAdmin ? (
        <Link 
          to="/admin" 
          className="inline-flex items-center text-[#22aee1] hover:text-[#20466d] mb-6"
          onClick={() => sessionStorage.removeItem('cameFromAdmin')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin
        </Link>
      ) : (
        <Link to="/" className="inline-flex items-center text-[#22aee1] hover:text-[#20466d] mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reports
        </Link>
      )}
      
      <Badge variant="secondary" className="mb-4 bg-[#22aee1] text-white">
        {post.category}
      </Badge>
      
      <h1 className="text-4xl font-bold text-[#20466d] mb-6 leading-tight">
        {post.title}
      </h1>
      
      <div className="flex items-center space-x-6 text-sm text-[#79858D] mb-8">
        <span className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {post.readTime}
        </span>
        <span>{post.publishedAt}</span>
      </div>
      
      <div className="flex items-center space-x-4 mb-8">
        <Button 
          variant="outline" 
          size="sm" 
          className="border-[#22aee1] text-[#22aee1] hover:bg-[#22aee1] hover:text-white"
          onClick={onShare}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-[#22aee1] text-[#22aee1] hover:bg-[#22aee1] hover:text-white"
          onClick={onBookmark}
        >
          <BookmarkPlus className="h-4 w-4 mr-2" />
          Bookmark
        </Button>
      </div>
    </div>
  );
};
