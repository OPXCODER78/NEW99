import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '../lib/supabase';
import type { Post } from '../types/post';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';

const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'technology', name: 'Technology' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'business', name: 'Business' },
    { id: 'health', name: 'Health & Wellness' },
  ];

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      
      try {
        // Fetch featured posts
        const { data: featuredData, error: featuredError } = await supabase
          .from('posts')
          .select('*, categories(*), profiles(full_name)')
          .eq('status', 'published')
          .eq('is_featured', true)
          .order('published_at', { ascending: false })
          .limit(3);
          
        if (featuredError) throw featuredError;
        
        // Fetch latest posts based on category filter
        let query = supabase
          .from('posts')
          .select('*, categories(*), profiles(full_name)')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(6);
          
        if (activeCategory !== 'all') {
          query = query.eq('categories.slug', activeCategory);
        }
        
        const { data: latestData, error: latestError } = await query;
        
        if (latestError) throw latestError;
        
        setFeaturedPosts(featuredData as Post[]);
        setLatestPosts(latestData as Post[]);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPosts();
  }, [activeCategory]);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-primary-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Modern Blog Platform</h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
            Discover insights, stories, and expertise from writers on any topic.
          </p>
        </div>
      </div>
      
      {/* Featured Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-8 text-gray-900">Featured Posts</h2>
        
        {isLoading ? (
          <LoadingSpinner />
        ) : featuredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
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
                    <span>{post.categories?.name || 'Uncategorized'}</span>
                  </div>
                  <Link to={`/posts/${post.slug}`}>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 hover:text-primary-600">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <User size={16} className="mr-1" />
                      <span>{post.profiles?.full_name || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      <span>{formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No featured posts available.</p>
        )}
      </section>
      
      {/* Latest Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Latest Posts</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {isLoading ? (
          <LoadingSpinner />
        ) : latestPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
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
                    <span>{post.categories?.name || 'Uncategorized'}</span>
                  </div>
                  <Link to={`/posts/${post.slug}`}>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 hover:text-primary-600">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <User size={16} className="mr-1" />
                      <span>{post.profiles?.full_name || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      <span>{formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No posts available for this category.</p>
        )}
        
        <div className="mt-12 text-center">
          <Link to="/search">
            <Button size="lg">
              View All Posts
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-primary-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Subscribe to Our Newsletter</h2>
          <p className="text-lg text-gray-600 mb-8">
            Get the latest posts and updates delivered directly to your inbox.
          </p>
          <form className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
              <Button type="submit">
                Subscribe
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;