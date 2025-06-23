
import { useState, useEffect, useMemo } from 'react';
import { type BlogPostSummary } from '@/types/blog';

/**
 * Hook for virtualizing large post lists to reduce memory usage
 */

interface VirtualizedPostsOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export const useVirtualizedPosts = (
  posts: BlogPostSummary[],
  options: VirtualizedPostsOptions
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const { itemHeight, containerHeight, overscan = 5 } = options;

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight),
      posts.length
    );

    return {
      start: Math.max(0, start - overscan),
      end: Math.min(posts.length, end + overscan)
    };
  }, [scrollTop, itemHeight, containerHeight, posts.length, overscan]);

  const visiblePosts = useMemo(() => {
    return posts.slice(visibleRange.start, visibleRange.end).map((post, index) => ({
      ...post,
      virtualIndex: visibleRange.start + index
    }));
  }, [posts, visibleRange]);

  const totalHeight = posts.length * itemHeight;

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  };

  return {
    visiblePosts,
    totalHeight,
    visibleRange,
    handleScroll,
    offsetY: visibleRange.start * itemHeight
  };
};
