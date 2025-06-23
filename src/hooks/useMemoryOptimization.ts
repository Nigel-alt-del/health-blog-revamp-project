
import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook for monitoring and optimizing memory usage
 */

interface MemoryStats {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export const useMemoryOptimization = () => {
  const cleanupTasks = useRef<(() => void)[]>([]);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const maxCacheSize = 50;

  const getMemoryStats = (): MemoryStats | null => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }
    return null;
  };

  const addCleanupTask = useCallback((task: () => void) => {
    cleanupTasks.current.push(task);
  }, []);

  const runCleanup = useCallback(() => {
    cleanupTasks.current.forEach(task => {
      try {
        task();
      } catch (error) {
        console.warn('Cleanup task failed:', error);
      }
    });
    cleanupTasks.current = [];
  }, []);

  const optimizeImageCache = useCallback((imageUrl: string, img: HTMLImageElement) => {
    // Remove oldest entries if cache is full
    if (imageCache.current.size >= maxCacheSize) {
      const firstKey = imageCache.current.keys().next().value;
      if (firstKey) {
        const oldImg = imageCache.current.get(firstKey);
        if (oldImg) {
          URL.revokeObjectURL(oldImg.src);
        }
        imageCache.current.delete(firstKey);
      }
    }
    
    imageCache.current.set(imageUrl, img);
  }, []);

  const getCachedImage = useCallback((imageUrl: string): HTMLImageElement | null => {
    return imageCache.current.get(imageUrl) || null;
  }, []);

  const clearImageCache = useCallback(() => {
    imageCache.current.forEach(img => {
      if (img.src.startsWith('blob:')) {
        URL.revokeObjectURL(img.src);
      }
    });
    imageCache.current.clear();
  }, []);

  const forceGarbageCollection = useCallback(() => {
    // Clear caches and run cleanup
    runCleanup();
    clearImageCache();
    
    // Force garbage collection if available (development only)
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
  }, [runCleanup, clearImageCache]);

  // Auto cleanup on memory pressure
  useEffect(() => {
    const checkMemoryPressure = () => {
      const stats = getMemoryStats();
      if (stats) {
        const usagePercentage = (stats.usedJSHeapSize / stats.jsHeapSizeLimit) * 100;
        
        if (usagePercentage > 80) {
          console.warn('High memory usage detected, running cleanup...');
          forceGarbageCollection();
        }
      }
    };

    const interval = setInterval(checkMemoryPressure, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [forceGarbageCollection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      runCleanup();
      clearImageCache();
    };
  }, [runCleanup, clearImageCache]);

  return {
    getMemoryStats,
    addCleanupTask,
    runCleanup,
    optimizeImageCache,
    getCachedImage,
    clearImageCache,
    forceGarbageCollection
  };
};
