
import { useState, useEffect, useMemo } from 'react';

/**
 * Hook for chunking large content and streaming it progressively
 */

interface ContentChunk {
  id: string;
  content: string;
  order: number;
  loaded: boolean;
}

export const useContentChunking = (content: string, chunkSize: number = 2000) => {
  const [loadedChunks, setLoadedChunks] = useState<Set<number>>(new Set([0]));
  const [loadingProgress, setLoadingProgress] = useState(0);

  const chunks = useMemo(() => {
    if (!content) return [];
    
    const chunks: ContentChunk[] = [];
    let currentPosition = 0;
    let chunkIndex = 0;

    while (currentPosition < content.length) {
      const chunkContent = content.slice(currentPosition, currentPosition + chunkSize);
      chunks.push({
        id: `chunk-${chunkIndex}`,
        content: chunkContent,
        order: chunkIndex,
        loaded: chunkIndex === 0 // First chunk loaded by default
      });
      
      currentPosition += chunkSize;
      chunkIndex++;
    }

    return chunks;
  }, [content, chunkSize]);

  const visibleContent = useMemo(() => {
    return chunks
      .filter(chunk => loadedChunks.has(chunk.order))
      .sort((a, b) => a.order - b.order)
      .map(chunk => chunk.content)
      .join('');
  }, [chunks, loadedChunks]);

  const loadNextChunk = () => {
    const nextChunkIndex = Math.max(...Array.from(loadedChunks)) + 1;
    if (nextChunkIndex < chunks.length) {
      setLoadedChunks(prev => new Set([...prev, nextChunkIndex]));
      setLoadingProgress((nextChunkIndex + 1) / chunks.length * 100);
    }
  };

  const loadAllChunks = () => {
    const allIndices = chunks.map((_, index) => index);
    setLoadedChunks(new Set(allIndices));
    setLoadingProgress(100);
  };

  const hasMoreChunks = loadedChunks.size < chunks.length;

  // Auto-load chunks when user scrolls near bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (scrollPosition > documentHeight * 0.8 && hasMoreChunks) {
        loadNextChunk();
      }
    };

    if (hasMoreChunks) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [hasMoreChunks, loadedChunks]);

  return {
    visibleContent,
    loadingProgress,
    hasMoreChunks,
    loadNextChunk,
    loadAllChunks,
    totalChunks: chunks.length,
    loadedChunks: loadedChunks.size
  };
};
