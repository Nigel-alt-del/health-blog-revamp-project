
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

  // ReactQuill configuration WITHOUT image support
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

  const insertImage = (imageUrl: string, caption?: string, width?: string, height?: string) => {
    console.log("Inserting image with sizing:", imageUrl, caption, width, height);
    
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();
      
      // Create proper CSS styles for sizing
      let imageStyles = 'max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: block; margin: 0 auto;';
      
      if (width && width !== '100%') {
        imageStyles += ` width: ${width} !important;`;
      } else if (width === '100%') {
        imageStyles += ' width: 100% !important;';
      }
      
      if (height && height !== 'auto') {
        imageStyles += ` height: ${height} !important;`;
      }
      
      const imageHtml = `
        <div class="image-container" style="margin: 20px 0; text-align: center;">
          <img src="${imageUrl}" alt="${caption || 'Report image'}" style="${imageStyles}" />
          ${caption ? `<p style="margin-top: 8px; font-style: italic; color: #666; font-size: 14px;">${caption}</p>` : ''}
        </div>
      `;
      
      quill.clipboard.dangerouslyPasteHTML(index, imageHtml);
      const newCursorPosition = index + imageHtml.length;
      quill.setSelection(newCursorPosition, 0);
      
      console.log("Image inserted with styles:", imageStyles);
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
        {!hideImageButton && (
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
        )}
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
        
        {!hideImageButton && showMediaGallery && (
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
