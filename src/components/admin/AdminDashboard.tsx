
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import BlogLayout from "@/components/BlogLayout";
import { PostListView } from "./PostListView";
import { CreatePostForm } from "./CreatePostForm";
import { EditPostForm } from "./EditPostForm";
import { getStoredPosts, addPostToStorage, updatePostInStorage, deletePostFromStorage, type BlogPost } from "@/utils/localStorage";
import { blogPosts } from "@/data/blogPosts";

const AdminDashboard = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Load posts from localStorage on component mount
  useEffect(() => {
    console.log("Loading posts in AdminDashboard");
    const storedPosts = getStoredPosts();
    console.log("Stored posts:", storedPosts);
    
    // Convert blogPosts to match our simplified BlogPost interface
    const simplifiedBlogPosts = blogPosts.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      publishedAt: post.publishedAt,
      readTime: post.readTime,
      category: post.category,
      tags: post.tags,
      featured: post.featured,
      image: post.image,
      seoKeywords: post.seoKeywords,
      metaDescription: post.metaDescription
    }));

    if (storedPosts.length > 0) {
      // Combine stored posts with default posts, prioritizing stored ones
      const combinedPosts = [
        ...storedPosts,
        ...simplifiedBlogPosts.filter(p => !storedPosts.some(sp => sp.id === p.id))
      ];
      setPosts(combinedPosts);
    } else {
      setPosts(simplifiedBlogPosts);
    }
  }, []);

  const generateId = (title: string): string => {
    const baseId = title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    // Add timestamp to ensure uniqueness
    const timestamp = Date.now();
    return `${baseId}-${timestamp}`;
  };

  const handleCreatePost = (newPost: any) => {
    console.log("Creating new post:", newPost);
    
    const post: BlogPost = {
      id: generateId(newPost.title),
      title: newPost.title,
      excerpt: newPost.excerpt,
      content: newPost.content || '',
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: "5 min read",
      category: newPost.category,
      tags: Array.isArray(newPost.tags) ? newPost.tags : (newPost.tags || '').split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag),
      featured: false,
      image: newPost.image || "/placeholder.svg",
      seoKeywords: newPost.seoKeywords || '',
      metaDescription: newPost.metaDescription || newPost.excerpt
    };

    console.log("Formatted post:", post);

    // Save to localStorage
    addPostToStorage(post);
    
    // Update state
    setPosts(prevPosts => [post, ...prevPosts]);
    setIsCreating(false);
    
    console.log("Post created successfully");
  };

  const handleEditPost = (updatedPost: any) => {
    console.log("Updating post:", updatedPost);
    
    const formattedPost: BlogPost = {
      ...updatedPost,
      tags: Array.isArray(updatedPost.tags) ? updatedPost.tags : (updatedPost.tags || '').split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
    };

    // Save to localStorage
    updatePostInStorage(formattedPost);
    
    // Update state
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === formattedPost.id ? formattedPost : post
    ));
    setEditingPostId(null);
    
    console.log("Post updated successfully");
  };

  const handleDeletePost = (postId: string) => {
    console.log("Deleting post:", postId);
    
    // Remove from localStorage
    deletePostFromStorage(postId);
    
    // Update state
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    
    console.log("Post deleted successfully");
  };

  const handleStartEdit = (postId: string) => {
    console.log("Starting edit for post:", postId);
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
            <h1 ="text-3xl font-bold text-gray-900">Edit Report: {editingPost.title}</h1>
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
