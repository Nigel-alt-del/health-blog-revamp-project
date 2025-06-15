
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, FileText, Copy } from 'lucide-react';

interface SimpleContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SimpleContentEditor = ({ value, onChange, placeholder }: SimpleContentEditorProps) => {
  const [showPreview, setShowPreview] = useState(false);

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    // Get HTML content from clipboard (preserves formatting from Word/Google Docs)
    const htmlData = event.clipboardData.getData('text/html');
    const textData = event.clipboardData.getData('text/plain');
    
    // Use HTML if available (from Word/Google Docs), otherwise use plain text
    let contentToPaste = htmlData || textData;
    
    if (contentToPaste && htmlData) {
      console.log('Original pasted content:', contentToPaste);
      
      // Enhanced cleanup that preserves more formatting
      contentToPaste = contentToPaste
        // Remove Word-specific comments and namespaces
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<o:p\s*\/?>/gi, '')
        .replace(/<\/o:p>/gi, '')
        // Remove Word-specific classes but preserve structure
        .replace(/class="[^"]*Mso[^"]*"/gi, '')
        .replace(/class="[^"]*Word[^"]*"/gi, '')
        // Preserve font sizes - extract and convert to inline styles
        .replace(/font-size:\s*(\d+(?:\.\d+)?)pt/gi, (match, size) => {
          const pxSize = Math.round(parseFloat(size) * 1.33); // Convert pt to px
          return `font-size: ${pxSize}px`;
        })
        // Preserve existing pixel font sizes
        .replace(/font-size:\s*(\d+)px/gi, 'font-size: $1px')
        // Convert Word bullet lists to proper HTML lists
        .replace(/<p[^>]*>(\s*[·•▪▫◦‣⁃]\s*)(.*?)<\/p>/gi, '<li>$2</li>')
        .replace(/<p[^>]*>(\s*\d+\.\s*)(.*?)<\/p>/gi, '<li>$2</li>')
        // Wrap consecutive list items in ul/ol tags
        .replace(/(<li>.*?<\/li>)/gs, (match) => {
          // Check if it's already wrapped in a list
          if (!match.includes('<ul>') && !match.includes('<ol>')) {
            return `<ul>${match}</ul>`;
          }
          return match;
        })
        // Clean up multiple consecutive ul/ol tags
        .replace(/<\/ul>\s*<ul>/gi, '')
        .replace(/<\/ol>\s*<ol>/gi, '')
        // Preserve bold/italic formatting
        .replace(/<b\b[^>]*>/gi, '<strong>')
        .replace(/<\/b>/gi, '</strong>')
        .replace(/<i\b[^>]*>/gi, '<em>')
        .replace(/<\/i>/gi, '</em>')
        // Convert font-weight and font-style to proper tags
        .replace(/<span[^>]*font-weight:\s*bold[^>]*>(.*?)<\/span>/gi, '<strong>$1</strong>')
        .replace(/<span[^>]*font-weight:\s*700[^>]*>(.*?)<\/span>/gi, '<strong>$1</strong>')
        .replace(/<span[^>]*font-style:\s*italic[^>]*>(.*?)<\/span>/gi, '<em>$1</em>')
        // Preserve headings with their font sizes
        .replace(/<h([1-6])[^>]*style="[^"]*font-size:\s*(\d+)px[^"]*"[^>]*>/gi, 
          '<h$1 style="font-size: $2px; font-family: \'Montserrat\', sans-serif;">')
        // Ensure paragraphs have Montserrat font but preserve other styles
        .replace(/<p([^>]*)>/gi, (match, attributes) => {
          if (attributes.includes('style=')) {
            // Add font-family to existing style
            return match.replace(/style="([^"]*)"/, 'style="$1; font-family: \'Montserrat\', sans-serif;"');
          } else {
            // Add style attribute with font-family
            return `<p${attributes} style="font-family: 'Montserrat', sans-serif;">`;
          }
        })
        // Ensure spans preserve their font-size while adding Montserrat
        .replace(/<span([^>]*style="[^"]*font-size:[^"]*")([^>]*)>/gi, (match, style, rest) => {
          if (style.includes('font-family:')) {
            return match.replace(/font-family:[^;"]*(;|")/, 'font-family: "Montserrat", sans-serif$1');
          } else {
            return match.replace(/style="([^"]*)"/, 'style="$1; font-family: \'Montserrat\', sans-serif;"');
          }
        })
        // Remove empty paragraphs and spans
        .replace(/<p[^>]*>\s*<\/p>/gi, '')
        .replace(/<span[^>]*>\s*<\/span>/gi, '');
      
      console.log('Processed content:', contentToPaste);
      
      // If no existing font-family was preserved, wrap in a div with Montserrat
      if (!contentToPaste.includes('font-family') && !contentToPaste.includes('Montserrat')) {
        contentToPaste = `<div style="font-family: 'Montserrat', sans-serif;">${contentToPaste}</div>`;
      }
    }
    
    if (contentToPaste) {
      onChange(value + contentToPaste);
    }
  };

  const handleDirectEdit = (event: React.FormEvent<HTMLDivElement>) => {
    const content = event.currentTarget.innerHTML;
    onChange(content);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Document Content
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="h-4 w-4 mr-1" />
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Copy className="h-4 w-4 mt-0.5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800 mb-2">Enhanced Copy & Paste Editor:</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-700">
                  <li>Create your report in Word or Google Docs with formatting</li>
                  <li>Select all content (Ctrl+A) and copy it (Ctrl+C)</li>
                  <li>Click in the content area below and paste (Ctrl+V)</li>
                  <li>Font sizes, bullet points, and formatting will be preserved</li>
                  <li>Use Preview to see exactly how it will appear</li>
                </ol>
                <p className="mt-2 text-sm">✓ Now preserves: Font sizes, bullet points, numbered lists, bold, italic formatting</p>
              </div>
            </div>
          </div>

          {showPreview ? (
            <div className="space-y-2">
              <Label>Preview (exactly how it will appear on your website):</Label>
              <div className="min-h-[400px] border rounded-lg p-6 bg-white prose prose-lg max-w-none overflow-auto font-montserrat">
                <div dangerouslySetInnerHTML={{ __html: value }} />
                {!value && (
                  <p className="text-gray-400 italic">Your pasted content will appear here...</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Paste your formatted document here:</Label>
              <div
                className="min-h-[400px] border rounded-lg p-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 prose prose-lg max-w-none overflow-auto font-montserrat"
                contentEditable
                onPaste={handlePaste}
                onInput={handleDirectEdit}
                dangerouslySetInnerHTML={{ __html: value }}
                style={{ 
                  minHeight: '400px',
                  fontFamily: '"Montserrat", sans-serif'
                }}
              />
              {!value && (
                <p className="text-sm text-gray-500 mt-2">
                  Click here and paste your content from Word or Google Docs. Font sizes, bullet points, and all formatting will be preserved with Montserrat font.
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
