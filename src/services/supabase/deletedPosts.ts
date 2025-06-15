
import { supabase } from "@/integrations/supabase/client";

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

export const isPostDeleted = async (postId: string): Promise<boolean> => {
  const deletedIds = await getDeletedPostIds();
  return deletedIds.includes(postId);
};
