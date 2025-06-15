
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
      
      // Enhanced cleanup that better preserves Word document formatting
      contentToPaste = contentToPaste
        // Remove Word-specific comments and XML tags
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<\?xml[^>]*>/g, '')
        .replace(/<o:p\s*\/?>/gi, '')
        .replace(/<\/o:p>/gi, '')
        
        // Remove Word-specific styling classes but keep inline styles
        .replace(/class="[^"]*Mso[^"]*"/gi, '')
        .replace(/class="[^"]*Word[^"]*"/gi, '')
        
        // Preserve and enhance font sizes - convert pt to px more accurately
        .replace(/font-size:\s*(\d+(?:\.\d+)?)pt/gi, (match, size) => {
          const ptSize = parseFloat(size);
          // Preserve larger font sizes more accurately
          if (ptSize >= 14) {
            return `font-size: ${Math.round(ptSize * 1.33)}px; font-weight: bold`;
          } else if (ptSize >= 12) {
            return `font-size: ${Math.round(ptSize * 1.33)}px`;
          } else {
            return `font-size: ${Math.round(ptSize * 1.33)}px`;
          }
        })
        
        // Handle explicit font-size in px and preserve bold
        .replace(/font-size:\s*(\d+)px/gi, (match, size) => {
          const pxSize = parseInt(size);
          if (pxSize >= 18) {
            return `font-size: ${pxSize}px; font-weight: bold`;
          }
          return match;
        })
        
        // Better detection and preservation of headings (H1, H2, etc)
        .replace(/<h([1-6])([^>]*)>(.*?)<\/h[1-6]>/gi, (match, level, attrs, content) => {
          const fontSize = level === '1' ? '24px' : level === '2' ? '20px' : '18px';
          return `<h${level} style="font-size: ${fontSize}; font-weight: bold; font-family: 'Montserrat', sans-serif; margin: 20px 0 16px 0; line-height: 1.4;">${content}</h${level}>`;
        })
        
        // Preserve paragraphs with font-weight bold as headings
        .replace(/<p([^>]*style="[^"]*font-weight:\s*(?:bold|700)[^"]*")([^>]*)>(.*?)<\/p>/gi, (match, style1, style2, content) => {
          // Check if this looks like a heading (short text, no punctuation at end)
          const isHeading = content.length < 100 && !content.trim().endsWith('.') && !content.trim().endsWith(',');
          if (isHeading) {
            return `<h3 style="font-size: 18px; font-weight: bold; font-family: 'Montserrat', sans-serif; margin: 20px 0 16px 0; line-height: 1.4;">${content}</h3>`;
          }
          return `<p style="font-weight: bold; font-family: 'Montserrat', sans-serif; line-height: 1.6; margin: 16px 0;">${content}</p>`;
        })
        
        // Better bullet point handling - preserve various bullet styles
        .replace(/<p[^>]*>\s*[·•▪▫◦‣⁃]\s*(.*?)<\/p>/gi, '<li style="font-family: \'Montserrat\', sans-serif; line-height: 1.6; margin: 8px 0;">$1</li>')
        .replace(/<p[^>]*>\s*\d+\.\s*(.*?)<\/p>/gi, '<li style="font-family: \'Montserrat\', sans-serif; line-height: 1.6; margin: 8px 0;">$1</li>')
        
        // Convert bold/italic tags consistently
        .replace(/<b\b[^>]*>/gi, '<strong>')
        .replace(/<\/b>/gi, '</strong>')
        .replace(/<i\b[^>]*>/gi, '<em>')
        .replace(/<\/i>/gi, '</em>')
        
        // Handle font-weight and font-style in spans - preserve as bold
        .replace(/<span([^>]*style="[^"]*font-weight:\s*(?:bold|700)[^"]*")([^>]*)>(.*?)<\/span>/gi, '<strong style="font-family: \'Montserrat\', sans-serif;">$3</strong>')
        .replace(/<span([^>]*style="[^"]*font-style:\s*italic[^"]*")([^>]*)>(.*?)<\/span>/gi, '<em style="font-family: \'Montserrat\', sans-serif;">$3</em>')
        
        // Preserve line breaks and spacing - convert double <br> or <p></p> to proper paragraphs
        .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '</p><p style="font-family: \'Montserrat\', sans-serif; line-height: 1.6; margin: 16px 0;">')
        .replace(/<p[^>]*>\s*<\/p>/gi, '<p style="font-family: \'Montserrat\', sans-serif; line-height: 1.6; margin: 16px 0;">&nbsp;</p>')
        
        // Wrap consecutive list items properly
        .replace(/(<li[^>]*>.*?<\/li>\s*)+/gs, (match) => {
          const listItems = match.trim();
          if (!listItems.includes('<ul>') && !listItems.includes('<ol>')) {
            return `<ul style="margin: 16px 0; padding-left: 24px;">${listItems}</ul>`;
          }
          return match;
        })
        
        // Apply Montserrat font to paragraphs while preserving existing styles
        .replace(/<p([^>]*style="[^"]*")([^>]*)>/gi, (match, style, rest) => {
          if (!style.includes('font-family')) {
            return match.replace(/style="([^"]*)"/, 'style="$1; font-family: \'Montserrat\', sans-serif;"');
          }
          return match;
        })
        .replace(/<p(?![^>]*style=)([^>]*)>/gi, '<p$1 style="font-family: \'Montserrat\', sans-serif; line-height: 1.6; margin: 16px 0;">')
        
        // Clean up empty elements but preserve intentional spacing
        .replace(/<span[^>]*>\s*<\/span>/gi, '')
        
        // Remove extra whitespace but preserve intentional line breaks
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><');
      
      console.log('Enhanced processed content:', contentToPaste);
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
                  <li>Font sizes, bold headings, line spacing, and formatting will be preserved</li>
                  <li>Use Preview to see exactly how it will appear</li>
                </ol>
                <p className="mt-2 text-sm">✓ Now preserves: Large headings (H1), font size 14+ bold text, line spacing, bullet points</p>
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
                  Click here and paste your content from Word or Google Docs. Large headings, font size 14+ bold text, and line spacing will be preserved with Montserrat font.
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
