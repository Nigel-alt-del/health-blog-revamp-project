
/**
 * Image optimization utilities for reducing file sizes and improving performance
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

export const DEFAULT_OPTIMIZATION_OPTIONS: ImageOptimizationOptions = {
  maxWidth: 1200,
  maxHeight: 800,
  quality: 0.8,
  format: 'webp'
};

/**
 * Compress and optimize an image file before upload
 */
export const optimizeImage = async (
  file: File, 
  options: ImageOptimizationOptions = DEFAULT_OPTIMIZATION_OPTIONS
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate new dimensions while maintaining aspect ratio
        const { width: newWidth, height: newHeight } = calculateOptimalDimensions(
          img.width, 
          img.height, 
          options.maxWidth || DEFAULT_OPTIMIZATION_OPTIONS.maxWidth!,
          options.maxHeight || DEFAULT_OPTIMIZATION_OPTIONS.maxHeight!
        );

        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw and compress image
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name, {
                type: `image/${options.format || 'webp'}`,
                lastModified: Date.now()
              });
              console.log(`Image optimized: ${file.size} bytes → ${blob.size} bytes (${Math.round((1 - blob.size/file.size) * 100)}% reduction)`);
              resolve(optimizedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          `image/${options.format || 'webp'}`,
          options.quality || DEFAULT_OPTIMIZATION_OPTIONS.quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Calculate optimal dimensions while maintaining aspect ratio
 */
const calculateOptimalDimensions = (
  originalWidth: number, 
  originalHeight: number, 
  maxWidth: number, 
  maxHeight: number
) => {
  let { width, height } = { width: originalWidth, height: originalHeight };

  if (width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }

  if (height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }

  return { width: Math.round(width), height: Math.round(height) };
};

/**
 * Extract and optimize base64 images from HTML content
 */
export const extractAndOptimizeImagesFromContent = async (content: string): Promise<{
  optimizedContent: string;
  extractedImages: Array<{ original: string; optimized: File; placeholder: string }>;
}> => {
  const base64ImageRegex = /<img[^>]+src="data:image\/[^;]+;base64,[^"]+"[^>]*>/gi;
  const matches = content.match(base64ImageRegex) || [];
  
  const extractedImages: Array<{ original: string; optimized: File; placeholder: string }> = [];
  let optimizedContent = content;

  for (const match of matches) {
    try {
      const srcMatch = match.match(/src="(data:image\/[^;]+;base64,[^"]+)"/);
      if (srcMatch) {
        const base64Src = srcMatch[1];
        const blob = await fetch(base64Src).then(r => r.blob());
        const file = new File([blob], `extracted-image-${Date.now()}.png`, { type: blob.type });
        
        const optimizedFile = await optimizeImage(file, { maxWidth: 800, quality: 0.7 });
        const placeholder = `__OPTIMIZED_IMAGE_${extractedImages.length}__`;
        
        extractedImages.push({
          original: base64Src,
          optimized: optimizedFile,
          placeholder
        });

        optimizedContent = optimizedContent.replace(base64Src, placeholder);
      }
    } catch (error) {
      console.warn('Failed to optimize embedded image:', error);
    }
  }

  return { optimizedContent, extractedImages };
};

/**
 * Compress HTML content by removing unnecessary whitespace and comments
 */
export const compressHtmlContent = (content: string): string => {
  return content
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove extra whitespace between tags
    .replace(/>\s+</g, '><')
    // Remove leading/trailing whitespace from lines
    .replace(/^\s+|\s+$/gm, '')
    // Collapse multiple spaces into single space
    .replace(/\s{2,}/g, ' ')
    .trim();
};
