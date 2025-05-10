import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { User, Tag, MessageSquare, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Post, Comment } from '../types/post';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const PostDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      setIsLoading(true);
      try {
        // Fetch post with author and category details
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select(`
            *,
            profiles (
              id,
              full_name,
              avatar_url
            ),
            categories (
              id,
              name,
              slug
            )
          `)
          .eq('slug', slug)
          .single();

        if (postError) throw postError;

        // Fetch approved comments for the post
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select(`
            *,
            profiles (
              full_name,
              avatar_url
            )
          `)
          .eq('post_id', postData.id)
          .eq('is_approved', true)
          .order('created_at', { ascending: false });

        if (commentsError) throw commentsError;

        setPost(postData);
        setComments(commentsData || []);

        // Increment view count
        await supabase
          .from('posts')
          .update({ view_count: (postData.view_count || 0) + 1 })
          .eq('id', postData.id);

      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: newComment.trim(),
          post_id: post?.id,
          user_id: user.id,
          is_approved: false // Comments require moderation
        });

      if (error) throw error;

      setNewComment('');
      // Show success message but don't add to comments list until approved
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareUrl = window.location.href;
  const shareTitle = post?.title || 'Check out this blog post';

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Post not found</h1>
        <Link to="/" className="text-primary-600 hover:text-primary-700">
          Return to homepage
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Post Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
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

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            {post.profiles?.avatar_url ? (
              <img
                src={post.profiles.avatar_url}
                alt={post.profiles?.full_name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={20} className="text-gray-500" />
              </div>
            )}
            <div className="ml-3">
              <p className="font-medium text-gray-900">{post.profiles?.full_name}</p>
              <p className="text-sm text-gray-500">Author</p>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center text-gray-500">
              <MessageSquare size={18} className="mr-1" />
              <span>{comments.length} comments</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Tag size={18} className="mr-1" />
              <span>{post.view_count} views</span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Post Content */}
      <div 
        className="prose max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Share Buttons */}
      <div className="border-t border-b border-gray-200 py-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Share2 size={20} className="mr-2" />
          Share this post
        </h3>
        <div className="flex gap-4">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-md hover:bg-[#166FE5]"
          >
            <Facebook size={18} />
            Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-md hover:bg-[#1A94DA]"
          >
            <Twitter size={18} />
            Twitter
          </a>
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-md hover:bg-[#0958A8]"
          >
            <Linkedin size={18} />
            LinkedIn
          </a>
        </div>
      </div>

      {/* Comments Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Comments ({comments.length})</h2>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={4}
            />
            <div className="mt-2 flex justify-end">
              <Button type="submit" isLoading={isSubmitting}>
                Submit Comment
              </Button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Comments are moderated and will appear once approved.
            </p>
          </form>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <p className="text-gray-600">
              Please{' '}
              <Link to="/auth/login" className="text-primary-600 hover:text-primary-700">
                sign in
              </Link>
              {' '}to leave a comment.
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                {comment.profiles?.avatar_url ? (
                  <img
                    src={comment.profiles.avatar_url}
                    alt={comment.profiles?.full_name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={16} className="text-gray-500" />
                  </div>
                )}
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{comment.profiles?.full_name}</p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}

          {comments.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </section>
    </article>
  );
};

export default PostDetail;