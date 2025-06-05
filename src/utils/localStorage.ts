
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
}

const STORAGE_KEY = 'blog_posts';

export const getStoredPosts = (): BlogPost[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

export const savePostsToStorage = (posts: BlogPost[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    console.log('Posts saved to localStorage:', posts);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const addPostToStorage = (post: BlogPost): void => {
  const posts = getStoredPosts();
  const updatedPosts = [post, ...posts];
  savePostsToStorage(updatedPosts);
  console.log('Post added to storage:', post);
};

export const updatePostInStorage = (updatedPost: BlogPost): void => {
  const posts = getStoredPosts();
  const updatedPosts = posts.map(post => 
    post.id === updatedPost.id ? updatedPost : post
  );
  savePostsToStorage(updatedPosts);
  console.log('Post updated in storage:', updatedPost);
};

export const deletePostFromStorage = (postId: string): void => {
  const posts = getStoredPosts();
  const updatedPosts = posts.filter(post => post.id !== postId);
  savePostsToStorage(updatedPosts);
  console.log('Post deleted from storage:', postId);
};

export type { BlogPost };
