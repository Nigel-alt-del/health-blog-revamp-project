interface BlogPost {
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

const STORAGE_KEY = 'blog_posts';
const DELETED_POSTS_KEY = 'deleted_post_ids';

/**
 * Saves a list of posts to localStorage.
 * @param posts The array of BlogPost objects to save.
 */
export const savePosts = (posts: BlogPost[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    console.log('Posts saved to localStorage:', posts);
  } catch (error) {
    console.error('Error saving posts to localStorage:', error);
  }
};

/**
 * Loads posts from localStorage.
 * @returns An array of BlogPost objects, or an empty array if none exist or an error occurs.
 */
export const loadPosts = (): BlogPost[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const posts = stored ? JSON.parse(stored) : [];
    console.log('Retrieved posts from localStorage:', posts);
    return posts;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

// Keep getStoredPosts for backward compatibility if other components use it
export const getStoredPosts = loadPosts;

export const savePostsToStorage = savePosts;

export const addPostToStorage = (post: BlogPost): void => {
  const posts = getStoredPosts();
  const updatedPosts = [post, ...posts];
  savePostsToStorage(updatedPosts);
  console.log('Post added to storage:', post);
};

export const updatePostInStorage = (updatedPost: BlogPost): void => {
  const posts = getStoredPosts();
  const existingIndex = posts.findIndex(post => post.id === updatedPost.id);
  
  if (existingIndex !== -1) {
    // Update existing post
    posts[existingIndex] = updatedPost;
    console.log('Updating existing post in storage:', updatedPost);
  } else {
    // Add as new post if not found
    posts.unshift(updatedPost);
    console.log('Adding new post to storage (not found for update):', updatedPost);
  }
  
  savePostsToStorage(posts);
};

export const deletePostFromStorage = (postId: string): void => {
  const posts = getStoredPosts();
  const updatedPosts = posts.filter(post => post.id !== postId);
  savePostsToStorage(updatedPosts);
  console.log('Post deleted from storage:', postId);
};

/**
 * Retrieves the list of IDs of posts that have been marked as deleted.
 * @returns An array of string IDs.
 */
export const getDeletedPostIds = (): string[] => {
  try {
    const stored = localStorage.getItem(DELETED_POSTS_KEY);
    const deletedIds = stored ? JSON.parse(stored) : [];
    console.log('Retrieved deleted post IDs from localStorage:', deletedIds);
    return deletedIds;
  } catch (error) {
    console.error('Error reading deleted post IDs from localStorage:', error);
    return [];
  }
};

/**
 * Adds a post ID to the list of deleted posts.
 * @param postId The ID of the post to mark as deleted.
 */
export const addDeletedPostId = (postId: string): void => {
  try {
    const deletedIds = getDeletedPostIds();
    if (!deletedIds.includes(postId)) {
      deletedIds.push(postId);
      localStorage.setItem(DELETED_POSTS_KEY, JSON.stringify(deletedIds));
      console.log('Added post ID to deleted list:', postId);
    }
  } catch (error) {
    console.error('Error adding deleted post ID:', error);
  }
};

export const clearDeletedPosts = (): void => {
  try {
    localStorage.removeItem(DELETED_POSTS_KEY);
    console.log('Cleared deleted posts tracking');
  } catch (error) {
    console.error('Error clearing deleted posts:', error);
  }
};

export const isPostDeleted = (postId: string): boolean => {
  const deletedIds = getDeletedPostIds();
  return deletedIds.includes(postId);
};

export type { BlogPost };
