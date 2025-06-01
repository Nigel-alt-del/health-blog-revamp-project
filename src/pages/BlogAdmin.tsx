
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Save, ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import BlogLayout from "@/components/BlogLayout";
import RichTextEditor from "@/components/RichTextEditor";
import { SectionManager } from "@/components/SectionManager";
import { ReportPreview } from "@/components/ReportPreview";
import { blogPosts, categories } from "@/data/blogPosts";

interface Section {
  id: string;
  title: string;
  content: string;
  type: 'introduction' | 'key-findings' | 'analysis' | 'conclusion' | 'custom';
  collapsed: boolean;
}

const BlogAdmin = () => {
  const [posts, setPosts] = useState(blogPosts);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    authorRole: "",
    category: "Insurance Tips",
    tags: "",
    readTime: "5 min read",
    image: ""
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setNewPost({ ...newPost, image: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setNewPost({ ...newPost, image: "" });
  };

  const compileSections = () => {
    return sections.map(section => section.content).join('\n\n');
  };

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.excerpt) {
      toast({
        title: "Error",
        description: "Please fill in title and excerpt",
        variant: "destructive"
      });
      return;
    }

    const finalContent = sections.length > 0 ? compileSections() : newPost.content;

    const post = {
      id: newPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      title: newPost.title,
      excerpt: newPost.excerpt,
      content: finalContent,
      author: newPost.author,
      authorRole: newPost.authorRole,
      authorImage: "/placeholder.svg",
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: newPost.readTime,
      category: newPost.category,
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      featured: false,
      image: newPost.image || "/placeholder.svg"
    };

    setPosts([post, ...posts]);
    resetForm();
    setIsCreating(false);

    toast({
      title: "Success",
      description: "Report created successfully!"
    });
  };

  const resetForm = () => {
    setNewPost({
      title: "",
      excerpt: "",
      content: "",
      author: "",
      authorRole: "",
      category: "Insurance Tips",
      tags: "",
      readTime: "5 min read",
      image: ""
    });
    setSections([]);
    setShowPreview(false);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
    toast({
      title: "Success",
      description: "Report deleted successfully!"
    });
  };

  const currentPostForPreview = {
    ...newPost,
    content: sections.length > 0 ? compileSections() : newPost.content,
    tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
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

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <Input
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="Enter report title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Excerpt *</label>
                    <Input
                      value={newPost.excerpt}
                      onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                      placeholder="Brief description of the report"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        value={newPost.category}
                        onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Read Time</label>
                      <Input
                        value={newPost.readTime}
                        onChange={(e) => setNewPost({ ...newPost, readTime: e.target.value })}
                        placeholder="e.g., 5 min read"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Author</label>
                      <Input
                        value={newPost.author}
                        onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                        placeholder="Author name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Author Role</label>
                      <Input
                        value={newPost.authorRole}
                        onChange={(e) => setNewPost({ ...newPost, authorRole: e.target.value })}
                        placeholder="e.g., Healthcare Policy Analyst"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                    <Input
                      value={newPost.tags}
                      onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                      placeholder="e.g., ACA, Healthcare Policy, Insurance Reform"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Featured Image</label>
                    <div className="space-y-4">
                      {newPost.image ? (
                        <div className="relative inline-block">
                          <img src={newPost.image} alt="Preview" className="w-full max-w-md h-48 object-cover rounded-lg" />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={removeImage}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="max-w-xs mx-auto"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section Manager */}
              <SectionManager
                sections={sections}
                onSectionsChange={setSections}
                onSectionContentChange={(sectionId, content) => {
                  setSections(sections.map(section =>
                    section.id === sectionId ? { ...section, content } : section
                  ));
                }}
              />

              {/* Rich Text Editor */}
              <RichTextEditor
                value={newPost.content}
                onChange={(content) => setNewPost({ ...newPost, content })}
                placeholder="Write your report content here..."
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    onClick={() => setShowPreview(true)} 
                    variant="outline" 
                    className="w-full"
                    disabled={!newPost.title || !newPost.excerpt}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Report
                  </Button>
                  <Button onClick={handleCreatePost} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Publish Report
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreating(false)} className="w-full">
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {showPreview && (
          <ReportPreview
            post={currentPostForPreview}
            onClose={() => setShowPreview(false)}
            onPublish={handleCreatePost}
          />
        )}
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

        <div className="grid gap-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      {post.featured && <Badge variant="default">Featured</Badge>}
                    </div>
                    <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                    <p className="text-gray-600">{post.excerpt}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Link to={`/post/${post.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingPost(post.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span>By {post.author}</span>
                  <span>•</span>
                  <span>{post.publishedAt}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </BlogLayout>
  );
};

export default BlogAdmin;
