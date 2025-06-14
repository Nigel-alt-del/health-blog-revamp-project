
import { useState } from "react";
import BlogLayout from "@/components/BlogLayout";
import { AdminDashboardView } from "./AdminDashboardView";
import { AdminCreateView } from "./AdminCreateView";
import { AdminEditView } from "./AdminEditView";
import { usePostManagement } from "@/hooks/usePostManagement";
import AdminLogout from "../AdminLogout";

const AdminDashboard = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  
  const {
    posts,
    handleCreatePost,
    handleEditPost,
    handleDeletePost,
    handleToggleFeatured
  } = usePostManagement();

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

  const editingPost = editingPostId ? posts.find(post => post.id === editingPostId) : null;

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

  if (editingPostId && editingPost) {
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
