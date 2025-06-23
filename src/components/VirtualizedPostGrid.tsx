
import React, { useRef, useEffect } from 'react';
import { useVirtualizedPosts } from '@/hooks/useVirtualizedPosts';
import { useMemoryOptimization } from '@/hooks/useMemoryOptimization';
import BlogCard from '@/components/BlogCard';
import { type BlogPostSummary } from '@/types/blog';

interface VirtualizedPostGridProps {
  posts: BlogPostSummary[];
  itemHeight?: number;
  containerHeight?: number;
}

export const VirtualizedPostGrid = ({ 
  posts, 
  itemHeight = 300, 
  containerHeight = 600 
}: VirtualizedPostGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { addCleanupTask } = useMemoryOptimization();

  const {
    visiblePosts,
    totalHeight,
    handleScroll,
    offsetY
  } = useVirtualizedPosts(posts, {
    itemHeight,
    containerHeight,
    overscan: 3
  });

  useEffect(() => {
    addCleanupTask(() => {
      // Cleanup any cached elements when component unmounts
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    });
  }, [addCleanupTask]);

  return (
    <div
      ref={containerRef}
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visiblePosts.map((post) => (
              <div
                key={post.id}
                style={{ height: itemHeight }}
                className="flex flex-col"
              >
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
