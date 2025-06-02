
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import BlogLayout from "@/components/BlogLayout";
import { PostListView } from "./PostListView";
import { CreatePostForm } from "./CreatePostForm";
import { EditPostForm } from "./EditPostForm";
import { blogPosts } from "@/data/blogPosts";

const AdminDashboard = () => {
  console.log("AdminDashboard rendering");
  console.log("Blog posts:", blogPosts);
  
  const [posts, setPosts] = useState(blogPosts);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  console.log("Current posts state:", posts);
  console.log("Is creating:", isCreating);
  console.log("Editing post ID:", editingPostId);

  const handleCreatePost = (newPost: any) => {
    const post = {
      ...newPost,
      id: newPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      authorImage: "/placeholder.svg",
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      featured: false,
      image: newPost.image || "/placeholder.svg"
    };

    setPosts([post, ...posts]);
    setIsCreating(false);
  };

  const handleEditPost = (updatedPost: any) => {
    setPosts(posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
    setEditingPostId(null);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleStartEdit = (postId: string) => {
    setEditingPostId(postId);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
  };

  // Find the post being edited
  const editingPost = editingPostId ? posts.find(post => post.id === editingPostId) : null;

  if (isCreating) {
    return (
      <BlogLayout>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => setIsCreating(false)}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Create New Report</h1>
          </div>

          <CreatePostForm 
            onSubmit={handleCreatePost}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      </BlogLayout>
    );
  }

  if (editingPostId && editingPost) {
    return (
      <BlogLayout>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={handleCancelEdit}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Report: {editingPost.title}</h1>
          </div>

          <EditPostForm 
            post={editingPost}
            onSubmit={handleEditPost}
            onCancel={handleCancelEdit}
          />
        </div>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports Administration</h1>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Report
          </Button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-4">
            Debug Info: {posts.length} posts loaded
          </p>
          <PostListView 
            posts={posts}
            onDeletePost={handleDeletePost}
            onEditPost={handleStartEdit}
          />
        </div>
      </div>
    </BlogLayout>
  );
};

export default AdminDashboard;
