
import React, { useState, useRef, useEffect } from 'react';
import { createProgressiveImageLoader } from '@/utils/advancedImageOptimization';
import { useMemoryOptimization } from '@/hooks/useMemoryOptimization';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  enableBackgroundRemoval?: boolean;
}

export const ProgressiveImage = ({
  src,
  alt,
  className = '',
  placeholder,
  enableBackgroundRemoval = false
}: ProgressiveImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getCachedImage, optimizeImageCache, addCleanupTask } = useMemoryOptimization();

  useEffect(() => {
    if (!containerRef.current || !src) return;

    // Check cache first
    const cachedImage = getCachedImage(src);
    if (cachedImage) {
      containerRef.current.appendChild(cachedImage.cloneNode() as HTMLImageElement);
      setIsLoaded(true);
      return;
    }

    const { img, cleanup } = createProgressiveImageLoader(
      containerRef.current,
      src,
      { placeholder, blurAmount: 2 }
    );

    img.onload = () => {
      setIsLoaded(true);
      optimizeImageCache(src, img);
    };

    img.onerror = () => {
      setError('Failed to load image');
      setIsLoaded(true);
    };

    addCleanupTask(cleanup);

    return cleanup;
  }, [src, placeholder, getCachedImage, optimizeImageCache, addCleanupTask]);

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight: '200px' }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
    </div>
  );
};
