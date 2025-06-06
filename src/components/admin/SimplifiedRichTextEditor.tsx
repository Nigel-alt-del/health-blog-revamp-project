
import React, { useState, useRef, useEffect } from 'react';
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
  const [isReady, setIsReady] = useState(false);

  console.log("SimplifiedRichTextEditor - current value:", value);
  console.log("SimplifiedRichTextEditor - hideImageButton:", hideImageButton);

  // Custom image handler for toolbar
  const imageHandler = () => {
    console.log("Custom toolbar image handler called");
    setShowMediaGallery(true);
  };

  // Wait for component to be ready before setting up modules
  useEffect(() => {
    setIsReady(true);
  }, []);

  // ReactQuill configuration - only when ready
  const modules = isReady ? {
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
  } : {
    toolbar: [
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ]
  };

  const formats = [
    'font', 'size', 'bold', 'italic', 'underline',
    'color', 'background', 'list', 'bullet', 'align', 'link', 'image'
  ];

  const insertImage = (imageUrl: string, caption?: string, width?: string, height?: string, alignment?: string) => {
    console.log("Inserting image with options:", { imageUrl, caption, width, height, alignment });
    
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      if (quill) {
        const range = quill.getSelection();
        const index = range ? range.index : quill.getLength();
        
        // Create image HTML with proper styling and attributes
        let imageHtml = `<img src="${imageUrl}" alt="${caption || 'Inserted image'}" style="`;
        
        // Add size styling
        if (width) imageHtml += `width: ${width}; `;
        if (height) imageHtml += `height: ${height}; `;
        
        // Add default styling
        imageHtml += `max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin: 16px 0;`;
        
        // Add alignment styling
        if (alignment === 'center') {
          imageHtml += ` display: block; margin-left: auto; margin-right: auto;`;
        } else if (alignment === 'left') {
          imageHtml += ` float: left; margin-right: 16px;`;
        } else if (alignment === 'right') {
          imageHtml += ` float: right; margin-left: 16px;`;
        }
        
        imageHtml += `" />`;
        
        // Add caption if provided
        if (caption) {
          imageHtml += `<div style="text-align: ${alignment === 'center' ? 'center' : alignment || 'center'}; font-style: italic; color: #666; font-size: 14px; margin-top: 8px;">${caption}</div>`;
        }
        
        // Insert the HTML
        quill.clipboard.dangerouslyPasteHTML(index, imageHtml);
        
        // Move cursor after the inserted content
        quill.setSelection(index + 1, 0);
        
        console.log("Image inserted successfully");
      }
    }
    
    setShowMediaGallery(false);
  };

  const handleChange = (content: string) => {
    console.log("Content changed in editor:", content);
    onChange(content || '');
  };

  // Don't render ReactQuill until ready
  if (!isReady) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Content Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted rounded flex items-center justify-center">
            <p className="text-muted-foreground">Loading editor...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
