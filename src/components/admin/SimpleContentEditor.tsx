
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
      // Clean up Word-specific styles but preserve important formatting
      contentToPaste = contentToPaste
        // Remove Word-specific namespaces and classes
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<o:p\s*\/?>/gi, '')
        .replace(/<\/o:p>/gi, '')
        .replace(/class="[^"]*"/gi, '')
        .replace(/style="[^"]*mso-[^"]*"/gi, '')
        // Replace font-family declarations but preserve other inline styles like bold, italic
        .replace(/font-family:[^;"]*(;|")/g, (match, ending) => {
          return `font-family: "Montserrat", sans-serif${ending}`;
        })
        // Ensure we don't lose bold/italic formatting
        .replace(/<b\b[^>]*>/gi, '<strong>')
        .replace(/<\/b>/gi, '</strong>')
        .replace(/<i\b[^>]*>/gi, '<em>')
        .replace(/<\/i>/gi, '</em>')
        // Convert font-weight style to strong tags
        .replace(/<span[^>]*font-weight:\s*bold[^>]*>(.*?)<\/span>/gi, '<strong>$1</strong>')
        .replace(/<span[^>]*font-weight:\s*700[^>]*>(.*?)<\/span>/gi, '<strong>$1</strong>')
        // Convert font-style italic to em tags
        .replace(/<span[^>]*font-style:\s*italic[^>]*>(.*?)<\/span>/gi, '<em>$1</em>');
      
      // If no font-family was found, wrap content to ensure Montserrat
      if (!contentToPaste.includes('font-family')) {
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
                <p className="font-medium text-blue-800 mb-2">How to use this editor:</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-700">
                  <li>Create your report in Word or Google Docs (including images)</li>
                  <li>Select all content (Ctrl+A) and copy it (Ctrl+C)</li>
                  <li>Click in the content area below and paste (Ctrl+V)</li>
                  <li>Use Preview to see exactly how it will appear</li>
                  <li>Publish when ready</li>
                </ol>
                <p className="mt-2 text-sm">✓ Bold, italic, images and formatting will be preserved with Montserrat font</p>
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
                  Click here and paste your content from Word or Google Docs. All formatting including bold text and images will be preserved with Montserrat font.
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
