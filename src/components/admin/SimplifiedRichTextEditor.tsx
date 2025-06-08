
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
  const [editorReady, setEditorReady] = useState(false);
  const quillRef = useRef<ReactQuill>(null);
  const hasInitialized = useRef(false);

  console.log("SimplifiedRichTextEditor - Rendering with value length:", value?.length || 0);

  // Stable image handler using useCallback
  const imageHandler = useCallback(() => {
    console.log("Image handler called");
    setShowMediaGallery(true);
  }, []);

  // Stable modules configuration
  const modules = useCallback(() => createEditorModules(imageHandler), [imageHandler]);

  // Initialize editor when mounted
  useEffect(() => {
    if (quillRef.current && !hasInitialized.current) {
      const quill = quillRef.current.getEditor();
      if (quill) {
        console.log("SimplifiedRichTextEditor - Editor initialized");
        hasInitialized.current = true;
        setEditorReady(true);
        
        // Set initial content if provided
        if (value && quill.root.innerHTML !== value) {
          console.log("SimplifiedRichTextEditor - Setting initial content");
          quill.root.innerHTML = value;
        }
      }
    }
  }, [value]);

  const insertImage = useCallback((imageUrl: string, caption?: string, width?: string, height?: string, alignment?: string) => {
    console.log("Inserting image with options:", { imageUrl, caption, width, height, alignment });
    
    if (!quillRef.current || !editorReady) {
      console.warn("Quill not ready for image insertion");
      return;
    }

    try {
      const quill = quillRef.current.getEditor();
      if (!quill) {
        console.warn("Quill editor not available");
        return;
      }

      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();
      
      // Create image HTML with proper styling and sizing
      let imageHtml = `<img src="${imageUrl}" alt="${caption || 'Inserted image'}" style="`;
      
      // Add size styling with !important to override CSS
      if (width) {
        imageHtml += `width: ${width} !important; max-width: ${width} !important; `;
      } else {
        imageHtml += `width: 400px !important; max-width: 400px !important; `;
      }
      
      if (height) {
        imageHtml += `height: ${height} !important; `;
      } else {
        imageHtml += `height: auto !important; `;
      }
      
      // Add default styling
      imageHtml += `border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin: 16px 0; display: block;`;
      
      // Add alignment styling
      if (alignment === 'center') {
        imageHtml += ` margin-left: auto; margin-right: auto;`;
      } else if (alignment === 'left') {
        imageHtml += ` float: left; margin-right: 16px; margin-bottom: 8px;`;
      } else if (alignment === 'right') {
        imageHtml += ` float: right; margin-left: 16px; margin-bottom: 8px;`;
      }
      
      imageHtml += `" />`;
      
      // Add caption if provided
      if (caption) {
        const captionAlignment = alignment === 'center' ? 'center' : alignment || 'center';
        imageHtml += `<div style="text-align: ${captionAlignment}; font-style: italic; color: #666; font-size: 14px; margin-top: 8px; margin-bottom: 16px;">${caption}</div>`;
      }
      
      // Insert the HTML
      quill.clipboard.dangerouslyPasteHTML(index, imageHtml);
      quill.setSelection(index + 1, 0);
      
      console.log("Image inserted successfully with sizing");
    } catch (error) {
      console.error("Error inserting image:", error);
    }
    
    setShowMediaGallery(false);
  }, [editorReady]);

  const handleChange = useCallback((content: string) => {
    console.log("Content changed in editor, length:", content?.length || 0);
    onChange(content || '');
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
