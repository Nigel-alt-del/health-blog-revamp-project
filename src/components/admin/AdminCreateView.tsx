
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CreatePostForm } from "./CreatePostForm";

interface AdminCreateViewProps {
  onSubmit: (post: any) => void;
  onCancel: () => void;
}

export const AdminCreateView = ({
  onSubmit,
  onCancel
}: AdminCreateViewProps) => {
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
        <h1 className="text-3xl font-bold text-gray-900">Create New Report</h1>
      </div>

      <CreatePostForm 
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </div>
  );
};
