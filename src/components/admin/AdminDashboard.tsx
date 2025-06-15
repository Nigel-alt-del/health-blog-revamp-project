
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BlogLayout from "@/components/BlogLayout";
import { AdminDashboardView } from "./AdminDashboardView";
import { AdminCreateView } from "./AdminCreateView";
import { AdminEditView } from "./AdminEditView";
import { usePostManagement } from "@/hooks/usePostManagement";
import { getPostById } from "@/utils/postManager";
import AdminLogout from "../AdminLogout";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";

const AdminDashboard = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  
  const {
    posts,
    loading,
    isError,
    error,
    handleCreatePost,
    handleEditPost,
    handleDeletePost,
    handleToggleFeatured
  } = usePostManagement();

  const {
    data: editingPost,
    isLoading: isEditingPostLoading,
    isError: isEditingPostError
  } = useQuery({
    queryKey: ['post', editingPostId],
    queryFn: () => getPostById(editingPostId!),
    enabled: !!editingPostId,
    staleTime: 5 * 60 * 1000,
  });

  const onCreatePost = (newPost: any) => {
    handleCreatePost(newPost);
    setIsCreating(false);
  };

  const onEditPost = (updatedPost: any) => {
    handleEditPost(updatedPost);
    setEditingPostId(null);
  };

  const onStartEdit = (postId: string) => {
    console.log("Starting edit for post:", postId);
    setEditingPostId(postId);
  };

  const onCancelEdit = () => {
    setEditingPostId(null);
  };

  if (loading) {
    return (
      <BlogLayout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#20466d]">Admin Dashboard</h1>
          <AdminLogout />
        </div>
        <div className="space-y-4 p-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </BlogLayout>
    );
  }

  if (isError) {
    return (
      <BlogLayout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#20466d]">Admin Dashboard</h1>
          <AdminLogout />
        </div>
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Loading Reports</AlertTitle>
          <AlertDescription>
            There was a problem fetching the reports. Please try again later.
            <pre className="mt-2 text-xs bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-200 p-2 rounded-md overflow-x-auto">
              <code>{error?.message}</code>
            </pre>
          </AlertDescription>
        </Alert>
      </BlogLayout>
    );
  }

  if (isCreating) {
    return (
      <BlogLayout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#20466d]">Create New Post</h1>
          <AdminLogout />
        </div>
        <AdminCreateView
          onSubmit={onCreatePost}
          onCancel={() => setIsCreating(false)}
        />
      </BlogLayout>
    );
  }

  if (editingPostId) {
    if (isEditingPostLoading) {
      return (
        <BlogLayout>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#20466d]">Edit Post</h1>
            <AdminLogout />
          </div>
          <div className="space-y-4 p-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </BlogLayout>
      );
    }

    if (isEditingPostError || !editingPost) {
      return (
        <BlogLayout>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#20466d]">Edit Post</h1>
            <AdminLogout />
          </div>
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error Loading Report for Editing</AlertTitle>
            <AlertDescription>
              There was a problem fetching the report. Please go back and try again.
              <Button onClick={onCancelEdit} variant="link" className="ml-2">
                Go Back
              </Button>
            </AlertDescription>
          </Alert>
        </BlogLayout>
      );
    }
    
    return (
      <BlogLayout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#20466d]">Edit Post</h1>
          <AdminLogout />
        </div>
        <AdminEditView
          post={editingPost}
          onSubmit={onEditPost}
          onCancel={onCancelEdit}
        />
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#20466d]">Admin Dashboard</h1>
        <AdminLogout />
      </div>
      <AdminDashboardView
        posts={posts}
        onCreateNew={() => setIsCreating(true)}
        onDeletePost={handleDeletePost}
        onEditPost={onStartEdit}
        onToggleFeatured={handleToggleFeatured}
      />
    </BlogLayout>
  );
};

export default AdminDashboard;
