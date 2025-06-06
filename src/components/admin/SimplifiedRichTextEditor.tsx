import React, { useState, useRef } from 'react';
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
  const quillRef = useRef<ReactQuill>(null);

  console.log("SimplifiedRichTextEditor - current value:", value);

  // Simple ReactQuill configuration with basic formatting including image support
  const modules = {
    toolbar: [
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'font', 'size', 'bold', 'italic', 'underline',
    'color', 'background', 'list', 'bullet', 'align', 'link', 'image'
  ];

  const insertImage = (imageUrl: string, caption?: string, width?: string, height?: string) => {
    console.log("Inserting image:", imageUrl, caption, width, height);
    
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();
      
      // Create the image HTML with proper styling and sizing
      const imageStyle = `max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); ${width ? `width: ${width};` : ''} ${height && height !== 'auto' ? `height: ${height};` : ''}`;
      
      const imageHtml = `<div class="image-container" style="margin: 20px 0; text-align: center;"><img src="${imageUrl}" alt="${caption || 'Report image'}" style="${imageStyle}" />${caption ? `<p style="margin-top: 8px; font-style: italic; color: #666; font-size: 14px;">${caption}</p>` : ''}</div>`;
      
      // Insert the image HTML at the cursor position
      quill.clipboard.dangerouslyPasteHTML(index, imageHtml);
      
      // Move cursor after the inserted content
      const newCursorPosition = index + imageHtml.length;
      quill.setSelection(newCursorPosition, 0);
      
      console.log("Image inserted at position:", index);
    }
    
    setShowMediaGallery(false);
  };

  const handleChange = (content: string) => {
    console.log("Content changed in editor:", content);
    onChange(content || '');
  };

  const handleAddImageClick = () => {
    console.log("Add Image button clicked");
    setShowMediaGallery(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Editor</CardTitle>
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddImageClick}
          >
            <Image className="mr-2 h-4 w-4" />
            Add Image
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ReactQuill
          ref={quillRef}
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
            onClose={() => {
              console.log("MediaGallery closed");
              setShowMediaGallery(false);
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SimplifiedRichTextEditor;
