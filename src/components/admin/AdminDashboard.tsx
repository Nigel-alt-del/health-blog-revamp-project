
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import BlogLayout from "@/components/BlogLayout";
import { PostListView } from "./PostListView";
import { CreatePostForm } from "./CreatePostForm";
import { EditPostForm } from "./EditPostForm";
import { getStoredPosts, addPostToStorage, updatePostInStorage, deletePostFromStorage } from "@/utils/localStorage";
import { blogPosts } from "@/data/blogPosts";

const AdminDashboard = () => {
  const [posts, setPosts] = useState(blogPosts);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Load posts from localStorage on component mount
  useEffect(() => {
    const storedPosts = getStoredPosts();
    if (storedPosts.length > 0) {
      // Combine stored posts with default posts, prioritizing stored ones
      const defaultPostIds = new Set(blogPosts.map(p => p.id));
      const combinedPosts = [
        ...storedPosts,
        ...blogPosts.filter(p => !storedPosts.some(sp => sp.id === p.id))
      ];
      setPosts(combinedPosts);
    }
  }, []);

  const handleCreatePost = (newPost: any) => {
    const post = {
      ...newPost,
      id: newPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      author: "InsureMyHealth Team",
      authorRole: "Healthcare Policy Analyst",
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      featured: false,
      image: newPost.image || "/placeholder.svg"
    };

    // Save to localStorage
    addPostToStorage(post);
    
    // Update state
    setPosts([post, ...posts]);
    setIsCreating(false);
  };

  const handleEditPost = (updatedPost: any) => {
    // Save to localStorage
    updatePostInStorage(updatedPost);
    
    // Update state
    setPosts(posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
    setEditingPostId(null);
  };

  const handleDeletePost = (postId: string) => {
    // Remove from localStorage
    deletePostFromStorage(postId);
    
    // Update state
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

        <PostListView 
          posts={posts}
          onDeletePost={handleDeletePost}
          onEditPost={handleStartEdit}
        />
      </div>
    </BlogLayout>
  );
};

export default AdminDashboard;
