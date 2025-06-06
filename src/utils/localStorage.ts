
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

export const getStoredPosts = (): BlogPost[] => {
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

export type { BlogPost };
