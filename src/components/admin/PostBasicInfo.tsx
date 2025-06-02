
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const categories = [
  "Healthcare",
  "PMI Insights", 
  "Industry News",
  "Insure My Health Updates"
];

interface PostBasicInfoProps {
  formData: {
    title: string;
    excerpt: string;
    author: string;
    authorRole: string;
    authorBio: string;
    authorLinkedin: string;
    category: string;
    tags: string;
    readTime: string;
  };
  onChange: (formData: any) => void;
}

export const PostBasicInfo = ({ formData, onChange }: PostBasicInfoProps) => {
  const updateField = (field: string, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <Input
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Enter report title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Excerpt *</label>
          <Textarea
            value={formData.excerpt}
            onChange={(e) => updateField('excerpt', e.target.value)}
            placeholder="Brief description of the report"
            rows={3}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => updateField('category', e.target.value)}
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
              value={formData.readTime}
              onChange={(e) => updateField('readTime', e.target.value)}
              placeholder="e.g., 5 min read"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Author Name</label>
            <Input
              value={formData.author}
              onChange={(e) => updateField('author', e.target.value)}
              placeholder="Author name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Author Role</label>
            <Input
              value={formData.authorRole}
              onChange={(e) => updateField('authorRole', e.target.value)}
              placeholder="e.g., Healthcare Policy Analyst"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Author Bio</label>
          <Textarea
            value={formData.authorBio}
            onChange={(e) => updateField('authorBio', e.target.value)}
            placeholder="Brief author biography"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Author LinkedIn URL</label>
          <Input
            value={formData.authorLinkedin}
            onChange={(e) => updateField('authorLinkedin', e.target.value)}
            placeholder="https://linkedin.com/in/username"
            type="url"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
          <Input
            value={formData.tags}
            onChange={(e) => updateField('tags', e.target.value)}
            placeholder="e.g., Healthcare Policy, Insurance Reform, PMI"
          />
        </div>
      </CardContent>
    </Card>
  );
};
