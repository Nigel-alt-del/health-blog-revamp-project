
import { optimizeImage } from './imageOptimization';

/**
 * Advanced image optimization with background removal and progressive loading
 */

export interface AdvancedImageOptions {
  removeBackground?: boolean;
  progressive?: boolean;
  responsiveBreakpoints?: number[];
  quality?: number;
}

// Background removal using in-browser AI
export const removeImageBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    const { pipeline, env } = await import('@huggingface/transformers');
    
    // Configure transformers.js
    env.allowLocalModels = false;
    env.useBrowserCache = false;

    const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
      device: 'webgpu',
    });
    
    // Convert to canvas and process
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    ctx.drawImage(imageElement, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    const result = await segmenter(imageData);
    
    if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
      throw new Error('Invalid segmentation result');
    }
    
    // Apply mask
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    outputCtx.drawImage(canvas, 0, 0);
    const outputImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    const data = outputImageData.data;
    
    for (let i = 0; i < result[0].mask.data.length; i++) {
      const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
      data[i * 4 + 3] = alpha;
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    
    return new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
        'image/png',
        1.0
      );
    });
  } catch (error) {
    console.error('Background removal failed:', error);
    throw error;
  }
};

// Generate responsive image variants
export const generateResponsiveImages = async (
  file: File, 
  breakpoints: number[] = [400, 800, 1200, 1600]
): Promise<{ width: number; file: File }[]> => {
  const variants = [];
  
  for (const width of breakpoints) {
    try {
      const optimized = await optimizeImage(file, {
        maxWidth: width,
        quality: 0.8,
        format: 'webp'
      });
      variants.push({ width, file: optimized });
    } catch (error) {
      console.warn(`Failed to create ${width}px variant:`, error);
    }
  }
  
  return variants;
};

// Progressive image loader with lazy loading
export const createProgressiveImageLoader = (
  container: HTMLElement,
  imageUrl: string,
  options: { placeholder?: string; blurAmount?: number } = {}
) => {
  const img = document.createElement('img');
  const placeholder = document.createElement('div');
  
  // Setup placeholder
  placeholder.style.cssText = `
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
    filter: blur(${options.blurAmount || 2}px);
    transition: opacity 0.3s ease;
  `;
  
  container.appendChild(placeholder);
  
  // Load image progressively
  img.onload = () => {
    img.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    container.appendChild(img);
    
    // Fade in effect
    requestAnimationFrame(() => {
      img.style.opacity = '1';
      placeholder.style.opacity = '0';
      
      setTimeout(() => {
        if (placeholder.parentNode) {
          placeholder.parentNode.removeChild(placeholder);
        }
      }, 300);
    });
  };
  
  // Intersection observer for lazy loading
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        img.src = imageUrl;
        observer.unobserve(container);
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(container);
  
  return { img, cleanup: () => observer.disconnect() };
};
