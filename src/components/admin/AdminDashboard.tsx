
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import BlogLayout from "@/components/BlogLayout";
import { PostListView } from "./PostListView";
import { CreatePostForm } from "./CreatePostForm";
import { blogPosts } from "@/data/blogPosts";

const AdminDashboard = () => {
  const [posts, setPosts] = useState(blogPosts);
  const [isCreating, setIsCreating] = useState(false);

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

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

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
        />
      </div>
    </BlogLayout>
  );
};

export default AdminDashboard;
