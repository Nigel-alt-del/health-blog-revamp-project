
import React, { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User, Eye, ExternalLink } from 'lucide-react';

interface ReportPreviewProps {
  post: {
    title: string;
    excerpt: string;
    content: string;
    author: string;
    authorRole: string;
    authorBio?: string;
    authorLinkedin?: string;
    category: string;
    tags: string[];
    readTime: string;
    image: string;
  };
  onClose: () => void;
  onPublish: () => void;
}

export const ReportPreview = ({ post, onClose, onPublish }: ReportPreviewProps) => {
  const processedContent = useMemo(() => {
    // This function handles placeholders in the content. Memoizing it prevents
    // unnecessary re-processing when the preview is opened.
    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, 'text/html');
    const chartElements = doc.querySelectorAll('.chart-placeholder');
    
    let contentString = post.content;
    chartElements.forEach((element) => {
      const chartId = element.getAttribute('data-chart-id');
      contentString = contentString.replace(
        element.outerHTML,
        `<div id="chart-${chartId}" class="chart-container"></div>`
      );
    });
    
    return contentString;
  }, [post.content]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Report Preview
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">{post.category}</Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
            
            {/* Featured Image */}
            {post.image && (
              <img
                src={post.image}
                alt="Featured image"
                className="w-full max-h-64 object-cover rounded-lg mb-6"
              />
            )}
          </div>

          {/* Author & Meta Information */}
          <Card>
            <CardContent className="pt-6">
              {/* Author Info */}
              {post.author && (
                <div className="flex items-start gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{post.author}</span>
                      {post.authorLinkedin && (
                        <a 
                          href={post.authorLinkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    {post.authorRole && <p className="text-sm text-gray-600 mb-2">{post.authorRole}</p>}
                    {post.authorBio && <p className="text-sm text-gray-700">{post.authorBio}</p>}
                  </div>
                </div>
              )}
              
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
              
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardContent className="pt-6">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
