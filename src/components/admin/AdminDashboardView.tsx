
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import { PostListView } from "./PostListView";
import { type BlogPostSummary } from "@/types/blog";
import { useEffect } from "react";

interface AdminDashboardViewProps {
  posts: BlogPostSummary[];
  onCreateNew: () => void;
  onDeletePost: (postId: string) => void;
  onEditPost: (postId: string) => void;
  onToggleFeatured: (postId: string) => void;
  forceRefreshPosts?: () => void; // optional for diagnostics
}

export const AdminDashboardView = ({
  posts,
  onCreateNew,
  onDeletePost,
  onEditPost,
  onToggleFeatured,
  forceRefreshPosts
}: AdminDashboardViewProps) => {
  useEffect(() => {
    console.log("[AdminDashboardView] Render. Posts supplied:", posts.map(p => ({ id: p.id, title: p.title, featured: p.featured })));
  }, [posts]);
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports Administration</h1>
        <div className="flex gap-2">
          <Button onClick={onCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Report
          </Button>
          {forceRefreshPosts && (
            <Button variant="outline" onClick={forceRefreshPosts} className="ml-2" title="Force fetch latest reports (diagnostics)">
              <RefreshCcw className="mr-1 h-4 w-4" />
              Force Refresh
            </Button>
          )}
        </div>
      </div>
      <PostListView 
        posts={posts}
        onDeletePost={onDeletePost}
        onEditPost={onEditPost}
        onToggleFeatured={onToggleFeatured}
      />
    </div>
  );
};
