
import { useState } from "react";
import { Link } from "react-router-dom";
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
    // CRITICAL FIX: Set multiple flags to ensure fresh data load and indicate admin origin
    sessionStorage.setItem('cameFromAdmin', 'true');
    sessionStorage.setItem('forceRefresh', 'true');
    sessionStorage.setItem('viewFromAdmin', postId); // Track which post was viewed from admin
    
    // Add timestamp to force fresh load and prevent caching
    const timestamp = Date.now();
    const url = `/post/${postId}?from=admin&t=${timestamp}&refresh=true`;
    
    console.log("Opening post from admin:", url);
    window.open(url, '_blank');
  };

  const handleToggleFeatured = (postId: string, currentFeatured: boolean) => {
    onToggleFeatured(postId);
    toast({
      title: "Success",
      description: currentFeatured ? "Report removed from featured" : "Report set as featured"
    });
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
                  title="View latest content (opens in new tab)"
                >
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleToggleFeatured(post.id, post.featured)}
                  title={post.featured ? "Remove from featured" : "Set as featured"}
                >
                  {post.featured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                </Button>
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
