
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Eye, Bold, Italic, Link2, Heading1, Heading2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SimpleContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SimpleContentEditor = ({ value, onChange, placeholder }: SimpleContentEditorProps) => {
  const [uploadedImages, setUploadedImages] = useState<Array<{url: string, caption: string, id: string}>>([]);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      const imageId = `img-${Date.now()}`;
      const newImage = {
        id: imageId,
        url: imageUrl,
        caption: ''
      };
      setUploadedImages(prev => [...prev, newImage]);
      
      toast({
        title: "Image uploaded",
        description: "Image added to your content gallery"
      });
    };
    reader.readAsDataURL(file);
  };

  const insertImage = (imageId: string, position: 'cursor' | 'end' = 'cursor') => {
    const image = uploadedImages.find(img => img.id === imageId);
    if (!image) return;

    const imageHtml = `
<div class="image-container" style="margin: 20px auto; text-align: center; max-width: 600px;">
  <img src="${image.url}" alt="${image.caption || 'Report image'}" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
  ${image.caption ? `<p style="margin-top: 8px; font-style: italic; color: #666; font-size: 14px;">${image.caption}</p>` : ''}
</div>`;

    if (position === 'end') {
      onChange(value + '\n' + imageHtml);
    } else {
      // For cursor position, we'll append at the end for simplicity
      onChange(value + '\n' + imageHtml);
    }
  };

  const updateImageCaption = (imageId: string, caption: string) => {
    setUploadedImages(prev => 
      prev.map(img => img.id === imageId ? { ...img, caption } : img)
    );
  };

  const removeImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const insertFormatting = (format: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let replacement = '';
    switch (format) {
      case 'h1':
        replacement = `<h1>${selectedText || 'Heading 1'}</h1>`;
        break;
      case 'h2':
        replacement = `<h2>${selectedText || 'Heading 2'}</h2>`;
        break;
      case 'bold':
        replacement = `<strong>${selectedText || 'bold text'}</strong>`;
        break;
      case 'italic':
        replacement = `<em>${selectedText || 'italic text'}</em>`;
        break;
      case 'link':
        replacement = `<a href="https://example.com">${selectedText || 'link text'}</a>`;
        break;
    }

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);
  };

  return (
    <div className="space-y-6">
      {/* Content Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Content Editor</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => insertFormatting('h1')}>
              <Heading1 className="h-4 w-4 mr-1" />
              H1
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertFormatting('h2')}>
              <Heading2 className="h-4 w-4 mr-1" />
              H2
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertFormatting('bold')}>
              <Bold className="h-4 w-4 mr-1" />
              Bold
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertFormatting('italic')}>
              <Italic className="h-4 w-4 mr-1" />
              Italic
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertFormatting('link')}>
              <Link2 className="h-4 w-4 mr-1" />
              Link
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="h-4 w-4 mr-1" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showPreview ? (
            <div className="min-h-[400px] border rounded p-4 prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: value }} />
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Paste your content from Word, Google Docs, or type directly. You can use basic HTML tags like &lt;h1&gt;, &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, etc.
              </p>
              <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || "Paste your formatted content here..."}
                className="min-h-[400px] font-mono text-sm"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Management */}
      <Card>
        <CardHeader>
          <CardTitle>Image Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-upload">Upload Image</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1"
              />
            </div>

            {uploadedImages.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Uploaded Images</h4>
                {uploadedImages.map((image) => (
                  <div key={image.id} className="border rounded p-4 space-y-3">
                    <img 
                      src={image.url} 
                      alt={image.caption || 'Uploaded image'} 
                      className="w-32 h-24 object-cover rounded"
                    />
                    <div className="space-y-2">
                      <Input
                        placeholder="Image caption (optional)"
                        value={image.caption}
                        onChange={(e) => updateImageCaption(image.id, e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => insertImage(image.id)}
                        >
                          Insert Image
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => removeImage(image.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
