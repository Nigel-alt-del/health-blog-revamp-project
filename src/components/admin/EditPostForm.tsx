import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { PostBasicInfo } from "./PostBasicInfo";
import { FeaturedImageUpload } from "./FeaturedImageUpload";
import { AdminSidebar } from "./AdminSidebar";
import SimplifiedRichTextEditor from "./SimplifiedRichTextEditor";
import { ReportPreview } from "../ReportPreview";

interface EditPostFormProps {
  post: any;
  onSubmit: (updatedPost: any) => void;
  onCancel: () => void;
}

export const EditPostForm = ({ post, onSubmit, onCancel }: EditPostFormProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    authorRole: "",
    authorBio: "",
    authorLinkedin: "",
    category: "Healthcare",
    tags: "",
    readTime: "5 min read",
    image: ""
  });

  // Load existing post data when component mounts or post changes
  useEffect(() => {
    console.log("Loading post data:", post);
    if (post) {
      setFormData({
        title: post.title || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        author: post.author || "",
        authorRole: post.authorRole || "",
        authorBio: post.authorBio || "",
        authorLinkedin: post.authorLinkedin || "",
        category: post.category || "Healthcare",
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ""),
        readTime: post.readTime || "5 min read",
        image: post.image || ""
      });
    }
  }, [post]);

  const formatPostData = (data: typeof formData) => ({
    ...post, // Keep original post properties like id, publishedAt, etc.
    ...data,
    tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
  });

  const handleSubmit = () => {
    console.log("Update clicked with data:", formData);
    
    if (!formData.title || !formData.excerpt) {
      toast({
        title: "Error",
        description: "Please fill in title and excerpt",
        variant: "destructive"
      });
      return;
    }

    const updatedPost = formatPostData(formData);

    console.log("Submitting updated post:", updatedPost);
    onSubmit(updatedPost);
    toast({
      title: "Success",
      description: "Report updated successfully!"
    });
  };

  const handlePreview = () => {
    console.log("Preview clicked");
    setShowPreview(true);
  };

  const canPreview = !!(formData.title && formData.excerpt);
  console.log("Can preview:", canPreview);

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PostBasicInfo 
            formData={formData}
            onChange={setFormData}
          />

          <FeaturedImageUpload
            image={formData.image}
            onImageChange={(image) => setFormData({ ...formData, image })}
          />

          <SimplifiedRichTextEditor
            value={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder="Edit your report content here. Use the section templates above to add new sections..."
          />
        </div>

        <AdminSidebar
          onPreview={handlePreview}
          onPublish={handleSubmit}
          onCancel={onCancel}
          canPreview={canPreview}
          isEditing={true}
        />
      </div>

      {showPreview && (
        <ReportPreview
          post={formatPostData(formData)}
          onClose={() => setShowPreview(false)}
          onPublish={handleSubmit}
        />
      )}
    </>
  );
};
