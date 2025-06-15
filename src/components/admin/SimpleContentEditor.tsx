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
    
    // Get HTML content from clipboard
    const htmlData = event.clipboardData.getData('text/html');
    const textData = event.clipboardData.getData('text/plain');
    
    let contentToPaste = htmlData || textData;
    
    if (contentToPaste && htmlData) {
      console.log('Original pasted content:', contentToPaste);
      
      // SUPER AGGRESSIVE CLEANUP to convert "fake" headings into real ones
      contentToPaste = contentToPaste
        // Remove Word-specific XML, comments, and classes
        .replace(/<!--[\s\S]*?-->/gi, '')
        .replace(/<\?xml[^>]*>/gi, '')
        .replace(/<o:p\s*\/?>/gi, '')
        .replace(/<\/o:p>/gi, '')
        .replace(/class="[^"]*Mso[^"]*"/gi, '')
        
        // --- HEADING DETECTION LOGIC ---
        // 1. Detect paragraphs that are just bold text and make them H2
        .replace(/<p[^>]*>\s*<(strong|b)[^>]*>(.*?)<\/\1>\s*<\/p>/gi, '<h2>$2</h2>')
        
        // 2. Detect paragraphs with large font sizes (from Word/Docs) and make them H2
        .replace(/<p[^>]*style="[^"]*font-size:\s*(1[4-9]pt|2\dpt|[1-9]\dpt|18px|19px|20px|22px|24px)[^"]*"[^>]*>(.*?)<\/p>/gi, (match, size, content) => {
            return `<h2>${content.replace(/<[^>]+>/g, '').trim()}</h2>`;
        })

        // 3. Detect paragraphs that have bold style and make them H3
        .replace(/<p[^>]*style="[^"]*font-weight:\s*(bold|700)[^"]*"[^>]*>(.*?)<\/p>/gi, (match, style, content) => {
            const cleanContent = content.replace(/<[^>]+>/g, '').trim();
            if (cleanContent.length > 0 && cleanContent.length < 150 && !cleanContent.endsWith('.') && !cleanContent.endsWith(';')) {
                return `<h3>${cleanContent}</h3>`;
            }
            return `<p>${cleanContent}</p>`;
        })

        // 4. Simplify actual H tags and strip their styles
        .replace(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi, (match, level, content) => {
            const cleanContent = content.replace(/<[^>]+>/g, '').trim();
            if (level === '1' || level === '2') return `<h2>${cleanContent}</h2>`;
            return `<h3>${cleanContent}</h3>`;
        })
        
        // Cleanup and normalization
        .replace(/<b\b[^>]*>/gi, '<strong>').replace(/<\/b>/gi, '</strong>')
        .replace(/<i\b[^>]*>/gi, '<em>').replace(/<\/i>/gi, '</em>')
        .replace(/<p[^>]*>\s*(<br\s*\/?>|&nbsp;)\s*<\/p>/gi, '<p><br></p>') // Preserve empty lines
        .replace(/\s+/g, ' ')
        .replace(/> </g, '><');

      console.log('ULTRA-PROCESSED content:', contentToPaste);
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
