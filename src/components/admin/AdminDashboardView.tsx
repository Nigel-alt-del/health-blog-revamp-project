
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PostListView } from "./PostListView";
import { type BlogPost } from "@/utils/localStorage";

interface AdminDashboardViewProps {
  posts: BlogPost[];
  onCreateNew: () => void;
  onDeletePost: (postId: string) => void;
  onEditPost: (postId: string) => void;
  onToggleFeatured: (postId: string) => void;
}

export const AdminDashboardView = ({
  posts,
  onCreateNew,
  onDeletePost,
  onEditPost,
  onToggleFeatured
}: AdminDashboardViewProps) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports Administration</h1>
        <Button onClick={onCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Report
        </Button>
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
