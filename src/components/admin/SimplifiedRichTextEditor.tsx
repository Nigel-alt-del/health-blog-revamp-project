
import React, { useState, useRef, useEffect, useCallback } from 'react';
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

// Stable modules configuration outside component to prevent recreation
const createEditorModules = (imageHandler: () => void) => ({
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
});

const formats = [
  'font', 'size', 'bold', 'italic', 'underline',
  'color', 'background', 'list', 'bullet', 'align', 'link', 'image'
];

const SimplifiedRichTextEditor = ({ 
  value, 
  onChange, 
  placeholder,
  hideImageButton = false 
}: SimplifiedRichTextEditorProps) => {
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  console.log("SimplifiedRichTextEditor - Rendering with value:", value);
  console.log("SimplifiedRichTextEditor - isReady:", isReady);

  // Stable image handler using useCallback
  const imageHandler = useCallback(() => {
    console.log("Image handler called");
    setShowMediaGallery(true);
  }, []);

  // Stable modules configuration
  const modules = useCallback(() => createEditorModules(imageHandler), [imageHandler]);

  // Handle Quill ready state properly
  const handleQuillReady = useCallback(() => {
    console.log("Quill editor is ready");
    setIsReady(true);
  }, []);

  // Initialize editor when it's mounted and ready
  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      if (quill && !isReady) {
        console.log("Initializing Quill editor");
        handleQuillReady();
      }
    }
  }, [isReady, handleQuillReady]);

  const insertImage = useCallback((imageUrl: string, caption?: string, width?: string, height?: string, alignment?: string) => {
    console.log("Inserting image with options:", { imageUrl, caption, width, height, alignment });
    
    if (!quillRef.current || !isReady) {
      console.warn("Quill not ready for image insertion");
      return;
    }

    try {
      const quill = quillRef.current.getEditor();
      if (!quill || !quill.getSelection) {
        console.warn("Quill editor not properly initialized");
        return;
      }

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
      
      // Insert the HTML safely
      if (quill.clipboard && quill.clipboard.dangerouslyPasteHTML) {
        quill.clipboard.dangerouslyPasteHTML(index, imageHtml);
        quill.setSelection(index + 1, 0);
      }
      
      console.log("Image inserted successfully");
    } catch (error) {
      console.error("Error inserting image:", error);
    }
    
    setShowMediaGallery(false);
  }, [isReady]);

  const handleChange = useCallback((content: string) => {
    console.log("Content changed in editor:", content);
    const cleanContent = content || '';
    onChange(cleanContent);
  }, [onChange]);

  const handleCloseMediaGallery = useCallback(() => {
    console.log("MediaGallery closed");
    setShowMediaGallery(false);
  }, []);

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
          modules={modules()}
          formats={formats}
          placeholder={placeholder}
          style={{ minHeight: '400px' }}
        />
        
        {showMediaGallery && (
          <MediaGallery
            onInsert={insertImage}
            onClose={handleCloseMediaGallery}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SimplifiedRichTextEditor;
