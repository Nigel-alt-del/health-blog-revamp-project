
import React from 'react';
import { useContentChunking } from '@/hooks/useContentChunking';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronDown, Download } from 'lucide-react';

interface ChunkedContentProps {
  content: string;
  chunkSize?: number;
  showProgress?: boolean;
}

export const ChunkedContent = ({ 
  content, 
  chunkSize = 2000, 
  showProgress = true 
}: ChunkedContentProps) => {
  const {
    visibleContent,
    loadingProgress,
    hasMoreChunks,
    loadNextChunk,
    loadAllChunks,
    totalChunks,
    loadedChunks
  } = useContentChunking(content, chunkSize);

  return (
    <div className="space-y-4">
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: visibleContent }}
      />
      
      {hasMoreChunks && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          {showProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Content loaded: {loadedChunks}/{totalChunks} sections</span>
                <span>{Math.round(loadingProgress)}%</span>
              </div>
              <Progress value={loadingProgress} className="h-2" />
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadNextChunk}
              className="flex items-center gap-2"
            >
              <ChevronDown className="h-4 w-4" />
              Load Next Section
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={loadAllChunks}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Load All Content
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
