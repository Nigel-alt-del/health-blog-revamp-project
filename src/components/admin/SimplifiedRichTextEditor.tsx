
import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MediaGallery } from '../MediaGallery';

interface SimplifiedRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hideImageButton?: boolean;
}

const SimplifiedRichTextEditor = ({ 
  value, 
  onChange, 
  placeholder,
  hideImageButton = false 
}: SimplifiedRichTextEditorProps) => {
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  console.log("SimplifiedRichTextEditor - current value:", value);
  console.log("SimplifiedRichTextEditor - hideImageButton:", hideImageButton);

  // Custom image handler for toolbar
  const imageHandler = () => {
    console.log("Custom toolbar image handler called");
    setShowMediaGallery(true);
  };

  // ReactQuill configuration WITH image support and custom toolbar
  const modules = {
    toolbar: {
      container: [
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'font', 'size', 'bold', 'italic', 'underline',
    'color', 'background', 'list', 'bullet', 'align', 'link', 'image'
  ];

  const insertImage = (imageUrl: string, caption?: string, width?: string, height?: string, alignment?: string) => {
    console.log("Inserting image with options:", { imageUrl, caption, width, height, alignment });
    
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();
      
      // Use ReactQuill's native insertEmbed for better persistence
      quill.insertEmbed(index, 'image', imageUrl);
      
      // Move cursor after the image
      quill.setSelection(index + 1, 0);
      
      // If we have additional styling (caption, alignment), we'll enhance this later
      if (caption) {
        quill.insertText(index + 1, '\n');
        quill.insertText(index + 2, caption, { italic: true, color: '#666' });
        quill.insertText(index + 2 + caption.length, '\n');
      }
      
      console.log("Image inserted using insertEmbed method");
    }
    
    setShowMediaGallery(false);
  };

  const handleChange = (content: string) => {
    console.log("Content changed in editor:", content);
    onChange(content || '');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Editor</CardTitle>
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
