
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EditPostForm } from "./EditPostForm";
import { type BlogPost } from "@/utils/localStorage";

interface AdminEditViewProps {
  post: BlogPost;
  onSubmit: (post: any) => void;
  onCancel: () => void;
}

export const AdminEditView = ({
  post,
  onSubmit,
  onCancel
}: AdminEditViewProps) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Report: {post.title}</h1>
      </div>

      <EditPostForm 
        post={post}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </div>
  );
};
