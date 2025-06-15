import { supabase } from "@/integrations/supabase/client";

// Export the BlogPost type
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
  image: string;
  seoKeywords?: string;
  metaDescription?: string;
  author?: string;
  authorRole?: string;
  authorLinkedin?: string;
  authorBio?: string;
}

export const savePosts = async (posts: BlogPost[]): Promise<void> => {
  try {
    // We'll store each post individually in Supabase
    console.log('💾 Saving posts to Supabase:', posts.length);
    
    for (const post of posts) {
      await savePostToSupabase(post);
    }
  } catch (error) {
    console.error('❌ Error saving posts to Supabase:', error);
    throw error;
  }
};

export const loadPosts = async (): Promise<BlogPost[]> => {
  try {
    const result = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('📖 Retrieved posts from Supabase:', result.data);
    
    // Map database format to BlogPost interface format
    const mappedPosts = (result.data || []).map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      publishedAt: post.published_at,
      readTime: post.read_time,
      category: post.category,
      tags: post.tags,
      featured: post.featured,
      image: post.image,
      seoKeywords: post.seo_keywords,
      metaDescription: post.meta_description,
      author: post.author,
      authorRole: post.author_role,
      authorLinkedin: post.author_linkedin,
      authorBio: post.author_bio
    }));
    
    return mappedPosts;
  } catch (error) {
    console.error('❌ Error reading from Supabase:', error);
    return [];
  }
};

export const getPostFromStorage = async (postId: string): Promise<BlogPost | undefined> => {
  try {
    console.log(`🔎 Fetching single post from Supabase by ID: ${postId}`);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', postId)
      .maybeSingle();

    if (error) {
      console.error('❌ Error fetching single post from Supabase:', error);
      throw error;
    }

    if (!data) {
      return undefined;
    }

    // Map database format to BlogPost interface format
    return {
      id: data.id,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      publishedAt: data.published_at,
      readTime: data.read_time,
      category: data.category,
      tags: data.tags,
      featured: data.featured,
      image: data.image,
      seoKeywords: data.seo_keywords,
      metaDescription: data.meta_description,
      author: data.author,
      authorRole: data.author_role,
      authorLinkedin: data.author_linkedin,
      authorBio: data.author_bio
    };
  } catch (error) {
    console.error('❌ Error in getPostFromStorage:', error);
    throw error;
  }
};

export const addPostToStorage = async (post: BlogPost): Promise<void> => {
  try {
    console.log('➕ Adding post to Supabase:', post);
    await savePostToSupabase(post);
  } catch (error) {
    console.error('❌ Error adding post to Supabase:', error);
    throw error;
  }
};

export const updatePostInStorage = async (updatedPost: BlogPost): Promise<void> => {
  try {
    console.log('✏️ Updating post in Supabase:', updatedPost);
    
    const result = await supabase
      .from('blog_posts')
      .update({
        title: updatedPost.title,
        excerpt: updatedPost.excerpt,
        content: updatedPost.content,
        category: updatedPost.category,
        tags: updatedPost.tags,
        featured: updatedPost.featured,
        image: updatedPost.image,
        seo_keywords: updatedPost.seoKeywords,
        meta_description: updatedPost.metaDescription,
        author: updatedPost.author,
        author_role: updatedPost.authorRole,
        author_linkedin: updatedPost.authorLinkedin,
        author_bio: updatedPost.authorBio,
        updated_at: new Date().toISOString()
      })
      .eq('id', updatedPost.id);

    const { error } = result;

    if (error) {
      console.error('❌ Error updating post in Supabase:', error);
      throw error;
    }
  } catch (error) {
    console.error('❌ Error updating post in Supabase:', error);
    throw error;
  }
};

export const deletePostFromStorage = async (postId: string): Promise<void> => {
  try {
    console.log('🗑️ Deleting post from Supabase:', postId);
    
    const result = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', postId);

    const { error } = result;

    if (error) {
      console.error('❌ Error deleting post from Supabase:', error);
      throw error;
    }
  } catch (error) {
    console.error('❌ Error deleting post from Supabase:', error);
    throw error;
  }
};

export const getDeletedPostIds = async (): Promise<string[]> => {
  try {
    const result = await supabase
      .from('deleted_posts')
      .select('post_id');

    console.log('📋 Retrieved deleted post IDs from Supabase:', result.data);
    return result.data?.map(item => item.post_id) || [];
  } catch (error) {
    console.error('❌ Error reading deleted post IDs from Supabase:', error);
    return [];
  }
};

export const addDeletedPostId = async (postId: string): Promise<void> => {
  try {
    console.log('🚫 Adding post ID to deleted list in Supabase:', postId);
    
    const result = await supabase
      .from('deleted_posts')
      .upsert({ post_id: postId }, { onConflict: 'post_id' });

    const { error } = result;

    if (error) {
      console.error('❌ Error adding deleted post ID to Supabase:', error);
      throw error;
    }
  } catch (error) {
    console.error('❌ Error adding deleted post ID to Supabase:', error);
    throw error;
  }
};

const savePostToSupabase = async (post: BlogPost): Promise<void> => {
  const result = await supabase
    .from('blog_posts')
    .upsert({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
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
    console.error('❌ Error saving post to Supabase:', error);
    throw error;
  }
};

export const getStoredPosts = loadPosts;
export const savePostsToStorage = savePosts;
export const isPostDeleted = async (postId: string): Promise<boolean> => {
  const deletedIds = await getDeletedPostIds();
  return deletedIds.includes(postId);
};
