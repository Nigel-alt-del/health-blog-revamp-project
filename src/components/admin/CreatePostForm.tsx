
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PostBasicInfo } from "./PostBasicInfo";
import { FeaturedImageUpload } from "./FeaturedImageUpload";
import { AdminSidebar } from "./AdminSidebar";
import { SectionManager } from "../SectionManager";
import RichTextEditor from "../RichTextEditor";
import { ReportPreview } from "../ReportPreview";

interface Section {
  id: string;
  title: string;
  content: string;
  type: 'introduction' | 'key-findings' | 'analysis' | 'conclusion' | 'custom';
  collapsed: boolean;
}

interface CreatePostFormProps {
  onSubmit: (post: any) => void;
  onCancel: () => void;
}

export const CreatePostForm = ({ onSubmit, onCancel }: CreatePostFormProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
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

  const compileSections = () => {
    return sections.map(section => section.content).join('\n\n');
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.excerpt) {
      toast({
        title: "Error",
        description: "Please fill in title and excerpt",
        variant: "destructive"
      });
      return;
    }

    const finalContent = sections.length > 0 ? compileSections() : formData.content;
    const postData = {
      ...formData,
      content: finalContent,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    onSubmit(postData);
    toast({
      title: "Success",
      description: "Report created successfully!"
    });
  };

  const currentPostForPreview = {
    ...formData,
    content: sections.length > 0 ? compileSections() : formData.content,
    tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
  };

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

          <SectionManager
            sections={sections}
            onSectionsChange={setSections}
            onSectionContentChange={(sectionId, content) => {
              setSections(sections.map(section =>
                section.id === sectionId ? { ...section, content } : section
              ));
            }}
          />

          <RichTextEditor
            value={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder="Write your report content here..."
          />
        </div>

        <AdminSidebar
          onPreview={() => setShowPreview(true)}
          onPublish={handleSubmit}
          onCancel={onCancel}
          canPreview={!!(formData.title && formData.excerpt)}
        />
      </div>

      {showPreview && (
        <ReportPreview
          post={currentPostForPreview}
          onClose={() => setShowPreview(false)}
          onPublish={handleSubmit}
        />
      )}
    </>
  );
};
