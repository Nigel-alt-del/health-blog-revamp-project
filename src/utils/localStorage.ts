
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
  image: string;
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
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const addPostToStorage = (post: BlogPost): void => {
  const posts = getStoredPosts();
  const updatedPosts = [post, ...posts];
  savePostsToStorage(updatedPosts);
};

export const updatePostInStorage = (updatedPost: BlogPost): void => {
  const posts = getStoredPosts();
  const updatedPosts = posts.map(post => 
    post.id === updatedPost.id ? updatedPost : post
  );
  savePostsToStorage(updatedPosts);
};

export const deletePostFromStorage = (postId: string): void => {
  const posts = getStoredPosts();
  const updatedPosts = posts.filter(post => post.id !== postId);
  savePostsToStorage(updatedPosts);
};
