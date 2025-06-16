
import { supabase } from "@/integrations/supabase/client";
import type { BlogPost, BlogPostSummary } from "@/types/blog";
import { compressHtmlContent, extractAndOptimizeImagesFromContent } from "@/utils/imageOptimization";
import { uploadImageToStorage } from "@/utils/supabaseImageStorage";

/**
 * Optimized post storage with content compression and image extraction
 */

export const saveOptimizedPost = async (post: BlogPost): Promise<void> => {
  try {
    console.log('Starting optimized post save process...');
    
    // Extract and optimize any base64 images from content
    const { optimizedContent, extractedImages } = await extractAndOptimizeImagesFromContent(post.content);
    
    // Upload extracted images to storage and replace placeholders
    let finalContent = optimizedContent;
    for (const extracted of extractedImages) {
      try {
        const uploadedUrl = await uploadImageToStorage(extracted.optimized, false); // Already optimized
        finalContent = finalContent.replace(extracted.placeholder, uploadedUrl);
        console.log('Replaced embedded image with storage URL');
      } catch (error) {
        console.warn('Failed to upload extracted image, keeping original:', error);
        finalContent = finalContent.replace(extracted.placeholder, extracted.original);
      }
    }
    
    // Compress HTML content
    const compressedContent = compressHtmlContent(finalContent);
    
    const originalSize = new Blob([post.content]).size;
    const optimizedSize = new Blob([compressedContent]).size;
    const savings = Math.round((1 - optimizedSize / originalSize) * 100);
    
    console.log(`Content optimized: ${Math.round(originalSize/1024)}KB → ${Math.round(optimizedSize/1024)}KB (${savings}% reduction)`);
    
    // Save optimized post
    const result = await supabase
      .from('blog_posts')
      .upsert({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: compressedContent, // Use optimized content
        published_at: post.publishedAt,
        read_time: post.readTime,
        category: post.category,
        tags: post.tags,
        featured: post.featured,
        image: post.image,
        seo_keywords: post.seoKeywords || '',
        meta_description: post.metaDescription || post.excerpt,
        author: post.author || 'InsureMyHealth Team',
        author_role: post.authorRole || 'Healthcare Policy Analyst',
        author_linkedin: post.authorLinkedin || '',
        author_bio: post.authorBio || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    const { error } = result;

    if (error) {
      console.error('❌ Error saving optimized post to Supabase:', error);
      throw error;
    }
    
    console.log('✅ Optimized post saved successfully');
  } catch (error) {
    console.error('❌ Error in saveOptimizedPost:', error);
    throw error;
  }
};

/**
 * Load post summaries with minimal data for list views
 */
export const loadOptimizedPostSummaries = async (): Promise<BlogPostSummary[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, excerpt, published_at, read_time, category, tags, featured, image, author, author_role')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error reading optimized post summaries from Supabase:', error);
    throw error;
  }

  console.log('📖 Retrieved optimized post summaries from Supabase:', data?.length || 0, 'posts');
  
  return (data || []).map(post => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.published_at,
    readTime: post.read_time,
    category: post.category,
    tags: post.tags,
    featured: post.featured,
    image: post.image,
    seoKeywords: '',
    metaDescription: post.excerpt,
    author: post.author,
    authorRole: post.author_role,
    authorLinkedin: '',
    authorBio: ''
  }));
};
