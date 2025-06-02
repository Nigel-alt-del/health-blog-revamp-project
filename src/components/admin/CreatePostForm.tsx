
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PostBasicInfo } from "./PostBasicInfo";
import { FeaturedImageUpload } from "./FeaturedImageUpload";
import { AdminSidebar } from "./AdminSidebar";
import SimplifiedRichTextEditor from "./SimplifiedRichTextEditor";
import { ReportPreview } from "../ReportPreview";

interface CreatePostFormProps {
  onSubmit: (post: any) => void;
  onCancel: () => void;
}

export const CreatePostForm = ({ onSubmit, onCancel }: CreatePostFormProps) => {
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

  const handleSubmit = () => {
    console.log("Submit clicked with data:", formData);
    
    if (!formData.title || !formData.excerpt) {
      toast({
        title: "Error",
        description: "Please fill in title and excerpt",
        variant: "destructive"
      });
      return;
    }

    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    console.log("Submitting post data:", postData);
    onSubmit(postData);
    toast({
      title: "Success",
      description: "Report created successfully!"
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
            placeholder="Write your report content here. Use the section templates above to get started..."
          />
        </div>

        <AdminSidebar
          onPreview={handlePreview}
          onPublish={handleSubmit}
          onCancel={onCancel}
          canPreview={canPreview}
        />
      </div>

      {showPreview && (
        <ReportPreview
          post={formData}
          onClose={() => setShowPreview(false)}
          onPublish={handleSubmit}
        />
      )}
    </>
  );
};
