import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, User, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '../lib/supabase';
import type { Post, Category as CategoryType } from '../types/post';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Category = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryAndPosts() {
      setIsLoading(true);
      try {
        // Fetch category details
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .single();

        if (categoryError) throw categoryError;

        // Fetch posts in this category
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select(`
            *,
            profiles (
              full_name,
              avatar_url
            )
          `)
          .eq('category_id', categoryData.id)
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (postsError) throw postsError;

        setCategory(categoryData);
        setPosts(postsData || []);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchCategoryAndPosts();
    }
  }, [slug]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Category not found</h1>
        <Link to="/" className="text-primary-600 hover:text-primary-700">
          Return to homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
        {category.description && (
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {category.description}
          </p>
        )}
      </header>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md transition-shadow hover:shadow-lg">
              <Link to={`/posts/${post.slug}`}>
                <img
                  src={post.featured_image || 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Tag size={16} className="mr-1" />
                  <span>{category.name}</span>
                </div>
                <Link to={`/posts/${post.slug}`}>
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 hover:text-primary-600">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <User size={16} className="mr-1" />
                    <span>{post.profiles?.full_name || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    <span>
                      {formatDistanceToNow(new Date(post.published_at || post.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No posts found in this category.</p>
          <Link to="/" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            Return to homepage
          </Link>
        </div>
      )}
    </div>
  );
};

export default Category;