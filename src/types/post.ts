export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  status: 'draft' | 'published';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  author_id: string;
  category_id: string;
  seo_title: string | null;
  seo_description: string | null;
  view_count: number;
  categories?: {
    id: string;
    name: string;
    slug: string;
  };
  profiles?: {
    id: string;
    full_name: string;
  };
  tags?: {
    id: string;
    name: string;
    slug: string;
  }[];
  comments_count?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  post_count?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  post_count?: number;
}

export interface Comment {
  id: string;
  content: string;
  post_id: string;
  user_id: string;
  created_at: string;
  is_approved: boolean;
  parent_id: string | null;
  posts?: {
    title: string;
    slug: string;
  };
  profiles?: {
    full_name: string;
  };
  replies?: Comment[];
}