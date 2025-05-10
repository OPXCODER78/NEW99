/*
  # Blog Platform Schema

  1. New Tables
    - `profiles` - Stores user profile information
    - `categories` - Blog post categories
    - `tags` - Blog post tags
    - `posts` - Blog posts with rich content
    - `post_tags` - Junction table for posts and tags (many-to-many)
    - `comments` - User comments on posts with moderation
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated and admin users
    - Set up auth permissions based on roles
*/

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  website TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  featured_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  published_at TIMESTAMPTZ,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  seo_title TEXT,
  seo_description TEXT,
  view_count INTEGER DEFAULT 0 NOT NULL
);

-- Create post_tags junction table
CREATE TABLE IF NOT EXISTS post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create or replace function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admin users can update any profile"
  ON profiles FOR UPDATE
  USING (is_admin());

-- Set up RLS policies for categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can create/update/delete categories"
  ON categories FOR ALL
  USING (is_admin());

-- Set up RLS policies for tags
CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT
  USING (true);

CREATE POLICY "Only admins can create/update/delete tags"
  ON tags FOR ALL
  USING (is_admin());

-- Set up RLS policies for posts
CREATE POLICY "Published posts are viewable by everyone"
  ON posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can view all posts"
  ON posts FOR SELECT
  USING (is_admin());

CREATE POLICY "Authors can view their own posts"
  ON posts FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "Only admins and post authors can create/update posts"
  ON posts FOR ALL
  USING (auth.uid() = author_id OR is_admin());

-- Set up RLS policies for post_tags
CREATE POLICY "Post tags are viewable by everyone"
  ON post_tags FOR SELECT
  USING (true);

CREATE POLICY "Only admins and post authors can manage post tags"
  ON post_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_id
      AND (posts.author_id = auth.uid() OR is_admin())
    )
  );

-- Set up RLS policies for comments
CREATE POLICY "Approved comments are viewable by everyone"
  ON comments FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Admins can view all comments"
  ON comments FOR SELECT
  USING (is_admin());

CREATE POLICY "Authors can view comments on their posts"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_id
      AND posts.author_id = auth.uid()
    )
  );

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update any comment"
  ON comments FOR UPDATE
  USING (is_admin());

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any comment"
  ON comments FOR DELETE
  USING (is_admin());

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for posts table to update updated_at
CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for profiles table to update updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (only if deploying with initial data)
INSERT INTO categories (name, slug, description)
VALUES
  ('Technology', 'technology', 'Articles about software, hardware, and tech trends'),
  ('Lifestyle', 'lifestyle', 'Articles about daily life, habits, and personal growth'),
  ('Business', 'business', 'Content related to entrepreneurship and business strategies'),
  ('Health', 'health', 'Articles about wellness, fitness, and health topics');