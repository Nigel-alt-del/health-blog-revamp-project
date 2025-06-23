
/**
 * Advanced content caching and service worker management
 */

export interface CacheConfig {
  maxAge: number;
  maxSize: number;
  compressionEnabled: boolean;
}

const DEFAULT_CACHE_CONFIG: CacheConfig = {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  maxSize: 50 * 1024 * 1024, // 50MB
  compressionEnabled: true
};

class ContentCache {
  private cache: Map<string, { data: any; timestamp: number; size: number }> = new Map();
  private totalSize = 0;
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CACHE_CONFIG, ...config };
  }

  set(key: string, data: any): void {
    const serialized = JSON.stringify(data);
    const size = new Blob([serialized]).size;
    
    // Remove expired items
    this.cleanup();
    
    // Check if we need to make space
    if (this.totalSize + size > this.config.maxSize) {
      this.evictLRU(size);
    }

    this.cache.set(key, {
      data: this.config.compressionEnabled ? this.compress(serialized) : data,
      timestamp: Date.now(),
      size
    });
    
    this.totalSize += size;
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Check expiration
    if (Date.now() - item.timestamp > this.config.maxAge) {
      this.delete(key);
      return null;
    }

    return this.config.compressionEnabled ? 
      this.decompress(item.data) : 
      item.data;
  }

  delete(key: string): boolean {
    const item = this.cache.get(key);
    if (item) {
      this.totalSize -= item.size;
      return this.cache.delete(key);
    }
    return false;
  }

  clear(): void {
    this.cache.clear();
    this.totalSize = 0;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.config.maxAge) {
        this.delete(key);
      }
    }
  }

  private evictLRU(requiredSpace: number): void {
    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp);
    
    let freedSpace = 0;
    for (const [key] of entries) {
      const item = this.cache.get(key);
      if (item) {
        freedSpace += item.size;
        this.delete(key);
        
        if (freedSpace >= requiredSpace) break;
      }
    }
  }

  private compress(data: string): string {
    // Simple compression using LZ-like algorithm
    // In production, consider using a proper compression library
    return data.replace(/(.{1,}?)\1+/g, (match, p1) => {
      const count = Math.floor(match.length / p1.length);
      return count > 1 ? `${p1}|${count}` : match;
    });
  }

  private decompress(data: string): any {
    const decompressed = data.replace(/(.+?)\|(\d+)/g, (match, p1, p2) => {
      return p1.repeat(parseInt(p2));
    });
    
    try {
      return JSON.parse(decompressed);
    } catch {
      return data;
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      totalSize: this.totalSize,
      maxSize: this.config.maxSize,
      usage: (this.totalSize / this.config.maxSize) * 100
    };
  }
}

// Global cache instances
export const postCache = new ContentCache({
  maxAge: 30 * 60 * 1000, // 30 minutes for posts
  maxSize: 20 * 1024 * 1024 // 20MB
});

export const imageCache = new ContentCache({
  maxAge: 60 * 60 * 1000, // 1 hour for images
  maxSize: 30 * 1024 * 1024 // 30MB
});

// Preload critical content
export const preloadCriticalContent = async (postIds: string[]) => {
  const { getPostById } = await import('@/utils/postManager');
  
  const preloadPromises = postIds.map(async (id) => {
    try {
      const post = await getPostById(id);
      if (post) {
        postCache.set(`post-${id}`, post);
      }
    } catch (error) {
      console.warn(`Failed to preload post ${id}:`, error);
    }
  });

  await Promise.all(preloadPromises);
};
