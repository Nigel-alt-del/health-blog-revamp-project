
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
    const contentToPaste = htmlData || textData;
    
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
                <p className="mt-2 text-sm">✓ Images and formatting will be preserved automatically</p>
              </div>
            </div>
          </div>

          {showPreview ? (
            <div className="space-y-2">
              <Label>Preview (exactly how it will appear on your website):</Label>
              <div className="min-h-[400px] border rounded-lg p-6 bg-white prose prose-lg max-w-none overflow-auto">
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
                className="min-h-[400px] border rounded-lg p-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 prose prose-lg max-w-none overflow-auto"
                contentEditable
                onPaste={handlePaste}
                onInput={handleDirectEdit}
                dangerouslySetInnerHTML={{ __html: value }}
                style={{ minHeight: '400px' }}
              />
              {!value && (
                <p className="text-sm text-gray-500 mt-2">
                  Click here and paste your content from Word or Google Docs. All formatting and images will be preserved.
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
