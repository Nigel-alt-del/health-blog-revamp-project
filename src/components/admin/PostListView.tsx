
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, Star, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  category: string;
  featured: boolean;
}

interface PostListViewProps {
  posts: Post[];
  onDeletePost: (postId: string) => void;
  onEditPost: (postId: string) => void;
  onToggleFeatured: (postId: string) => void;
}

export const PostListView = ({ posts, onDeletePost, onEditPost, onToggleFeatured }: PostListViewProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Temporarily disable featured toggle UI
  const FEATURED_TOGGLE_ENABLED = false;

  useEffect(() => {
    console.log("[PostListView] Render. Posts prop:", posts.map(p => ({ id: p.id, title: p.title, featured: p.featured })));
  }, [posts]);

  const handleDeletePost = (postId: string) => {
    onDeletePost(postId);
    toast({
      title: "Success",
      description: "Report deleted successfully!"
    });
  };

  const handleEditPost = (postId: string) => {
    onEditPost(postId);
  };

  const handleViewPost = (postId: string) => {
    console.log(`Navigating to view post: ${postId}`);
    sessionStorage.setItem('cameFromAdmin', 'true');
    // Invalidate the specific post query to force a refetch for the latest content
    queryClient.invalidateQueries({ queryKey: ['post', postId] });
    // Navigate to the post page in the same tab
    navigate(`/post/${postId}`);
  };

  const handleToggleFeatured = (postId: string) => {
    console.log("PostListView - Toggling featured for:", postId);
    const post = posts.find(p => p.id === postId);
    if (post) {
      onToggleFeatured(postId);
      toast({
        title: "Success",
        description: post.featured ? "Report removed from featured" : "Report set as featured"
      });
    }
  };

  return (
    <div className="grid gap-6">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  {post.featured && <Badge variant="default">Featured</Badge>}
                </div>
                <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                <p className="text-gray-600">{post.excerpt}</p>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewPost(post.id)}
                  title="View latest content (opens in same tab)"
                >
                  View
                </Button>
                {FEATURED_TOGGLE_ENABLED && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleToggleFeatured(post.id)}
                    title={post.featured ? "Remove from featured" : "Set as featured"}
                    className={post.featured ? "text-yellow-600 border-yellow-600" : ""}
                  >
                    {post.featured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditPost(post.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeletePost(post.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span>{post.publishedAt}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
