import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Clock, User, Tag, Search as SearchIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '../lib/supabase';
import type { Post } from '../types/post';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    async function searchPosts() {
      const query = searchParams.get('q');
      if (!query) {
        setPosts([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            profiles (
              full_name,
              avatar_url
            ),
            categories (
              name,
              slug
            )
          `)
          .eq('status', 'published')
          .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
          .order('published_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Error searching posts:', error);
      } finally {
        setIsLoading(false);
      }
    }

    searchPosts();
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Search Articles
        </h1>
        
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for articles..."
            className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <SearchIcon
            size={20}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            Search
          </Button>
        </form>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : searchParams.get('q') ? (
        <>
          <h2 className="text-xl text-gray-600 mb-8">
            {posts.length} results for "{searchParams.get('q')}"
          </h2>

          {posts.length > 0 ? (
            <div className="space-y-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Link
                      to={`/category/${post.categories?.slug}`}
                      className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full hover:bg-primary-100"
                    >
                      {post.categories?.name}
                    </Link>
                    <span>•</span>
                    <time dateTime={post.published_at || post.created_at}>
                      {formatDistanceToNow(new Date(post.published_at || post.created_at), { addSuffix: true })}
                    </time>
                  </div>

                  <Link to={`/posts/${post.slug}`}>
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 mb-2">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-gray-600 mb-4">{post.excerpt}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {post.profiles?.avatar_url ? (
                        <img
                          src={post.profiles.avatar_url}
                          alt={post.profiles?.full_name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User size={16} className="text-gray-500" />
                        </div>
                      )}
                      <span className="ml-2 text-sm text-gray-600">
                        {post.profiles?.full_name || 'Anonymous'}
                      </span>
                    </div>

                    <Link
                      to={`/posts/${post.slug}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No posts found matching your search.</p>
              <Link to="/" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
                Return to homepage
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-600">
          Enter a search term to find articles.
        </div>
      )}
    </div>
  );
};

export default Search;