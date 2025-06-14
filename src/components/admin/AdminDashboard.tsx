
import { useState } from "react";
import BlogLayout from "@/components/BlogLayout";
import { AdminDashboardView } from "./AdminDashboardView";
import { AdminCreateView } from "./AdminCreateView";
import { AdminEditView } from "./AdminEditView";
import { usePostManagement } from "@/hooks/usePostManagement";

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
