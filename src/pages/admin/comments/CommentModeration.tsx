import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Check, X, MessageSquare } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  is_approved: boolean;
  posts: {
    title: string;
    slug: string;
  };
  profiles: {
    full_name: string;
  };
}

const CommentModeration = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          posts (title, slug),
          profiles (full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Error fetching comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ is_approved: true })
        .eq('id', id);

      if (error) throw error;

      setComments(comments.map(comment => 
        comment.id === id ? { ...comment, is_approved: true } : comment
      ));
      toast.success('Comment approved');
    } catch (error: any) {
      toast.error(error.message || 'Error approving comment');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setComments(comments.filter(comment => comment.id !== id));
      toast.success('Comment rejected');
    } catch (error: any) {
      toast.error(error.message || 'Error rejecting comment');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Comment Moderation</h1>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {comments.map((comment) => (
            <div key={comment.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <MessageSquare className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {comment.profiles?.full_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      on post: {comment.posts?.title}
                    </div>
                    <div className="mt-1 text-sm text-gray-900">
                      {comment.content}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="ml-6 flex items-center space-x-2">
                  {!comment.is_approved && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(comment.id)}
                      >
                        <Check size={16} className="mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleReject(comment.id)}
                      >
                        <X size={16} className="mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  {comment.is_approved && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                      Approved
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No comments to moderate.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentModeration;