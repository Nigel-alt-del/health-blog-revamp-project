import { supabase } from "@/integrations/supabase/client";
import { optimizeImage } from "@/utils/imageOptimization";

export const uploadImageToStorage = async (file: File, optimize: boolean = true): Promise<string> => {
  try {
    let fileToUpload = file;
    
    // Optimize image before upload if requested
    if (optimize && file.type.startsWith('image/')) {
      console.log('Optimizing image before upload...');
      fileToUpload = await optimizeImage(file, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.8,
        format: 'webp'
      });
    }

    // Generate a unique filename
    const fileExt = fileToUpload.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `blog-images/${fileName}`;

    console.log('Uploading optimized image to Supabase Storage:', fileName, `(${Math.round(fileToUpload.size/1024)}KB)`);

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Get the public URL for the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    console.log('Optimized image uploaded successfully:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImageToStorage:', error);
    throw error;
  }
};

export const deleteImageFromStorage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract the file path from the URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `blog-images/${fileName}`;

    console.log('Deleting image from Supabase Storage:', filePath);

    const { error } = await supabase.storage
      .from('blog-images')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      throw error;
    }

    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Error in deleteImageFromStorage:', error);
    // Don't throw here as it's not critical if image deletion fails
  }
};

export const isSupabaseStorageUrl = (url: string): boolean => {
  return url.includes('supabase.co/storage/v1/object/public/blog-images/');
};
