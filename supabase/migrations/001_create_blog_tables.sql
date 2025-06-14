
-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  published_at TEXT NOT NULL,
  read_time TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  image TEXT DEFAULT '/placeholder.svg',
  seo_keywords TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  author TEXT DEFAULT 'InsureMyHealth Team',
  author_role TEXT DEFAULT 'Healthcare Policy Analyst',
  author_linkedin TEXT DEFAULT '',
  author_bio TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create deleted_posts table to track deleted default posts
CREATE TABLE IF NOT EXISTS deleted_posts (
  post_id TEXT PRIMARY KEY,
  deleted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deleted_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view blog posts" ON blog_posts
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view deleted posts" ON deleted_posts
  FOR SELECT USING (true);

-- Create policies for admin access (you can modify these based on your auth setup)
CREATE POLICY "Authenticated users can insert blog posts" ON blog_posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts" ON blog_posts
  FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can delete blog posts" ON blog_posts
  FOR DELETE USING (true);

CREATE POLICY "Authenticated users can insert deleted posts" ON deleted_posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can delete deleted posts" ON deleted_posts
  FOR DELETE USING (true);
