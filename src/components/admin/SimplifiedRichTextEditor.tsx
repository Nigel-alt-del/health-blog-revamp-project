
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';
import { MediaGallery } from '../MediaGallery';

interface SimplifiedRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SimplifiedRichTextEditor = ({ value, onChange, placeholder }: SimplifiedRichTextEditorProps) => {
  const [showMediaGallery, setShowMediaGallery] = useState(false);

  // Simple ReactQuill configuration with basic formatting
  const modules = {
    toolbar: [
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'font', 'size', 'bold', 'italic', 'underline',
    'color', 'background', 'list', 'bullet', 'align', 'link'
  ];

  const insertImage = (imageUrl: string, caption?: string) => {
    const imageHtml = `<div class="image-container" style="margin: 20px 0; text-align: center;"><img src="${imageUrl}" alt="${caption || 'Report image'}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />${caption ? `<p style="margin-top: 8px; font-style: italic; color: #666; font-size: 14px;">${caption}</p>` : ''}</div>`;
    const currentValue = value || '';
    onChange(currentValue + imageHtml);
    setShowMediaGallery(false);
  };

  const handleChange = (content: string) => {
    onChange(content || '');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Editor</CardTitle>
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMediaGallery(true)}
          >
            <Image className="mr-2 h-4 w-4" />
            Add Image
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ReactQuill
          theme="snow"
          value={value || ''}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{ minHeight: '400px' }}
        />
        
        {showMediaGallery && (
          <MediaGallery
            onInsert={insertImage}
            onClose={() => setShowMediaGallery(false)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SimplifiedRichTextEditor;
