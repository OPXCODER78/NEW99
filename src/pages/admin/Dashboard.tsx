import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, MessageSquare, Eye, TrendingUp, BarChart2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface DashboardStat {
  id: string;
  label: string;
  value: number;
  change: number;
  icon: typeof FileText;
  link: string;
  color: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [recentComments, setRecentComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      
      try {
        // In a real application, these would be actual queries
        // Simulating stats data for demo purposes
        setStats([
          {
            id: 'posts',
            label: 'Total Posts',
            value: 24,
            change: 12,
            icon: FileText,
            link: '/admin/posts',
            color: 'bg-primary-100 text-primary-600',
          },
          {
            id: 'users',
            label: 'Registered Users',
            value: 156,
            change: 8,
            icon: Users,
            link: '/admin/users',
            color: 'bg-accent-100 text-accent-600',
          },
          {
            id: 'comments',
            label: 'Comments',
            value: 87,
            change: 23,
            icon: MessageSquare,
            link: '/admin/comments',
            color: 'bg-warning-100 text-warning-600',
          },
          {
            id: 'views',
            label: 'Page Views',
            value: 3405,
            change: 5,
            icon: Eye,
            link: '/admin/analytics',
            color: 'bg-success-100 text-success-600',
          },
        ]);
        
        // Fetch recent posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('id, title, slug, status, published_at')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (postsError) throw postsError;
        
        // Fetch recent comments
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('id, content, created_at, posts(title, slug), profiles(full_name)')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (commentsError) throw commentsError;
        
        setRecentPosts(postsData);
        setRecentComments(commentsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/admin/posts/new">
          <Button>New Post</Button>
        </Link>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`rounded-full p-3 mr-4 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp size={16} className="text-success-500 mr-1" />
                <span className="text-sm text-success-500">{stat.change}% increase</span>
              </div>
              <Link to={stat.link} className="text-sm font-medium text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Posts</h2>
            <Link to="/admin/posts" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                  <div>
                    <Link 
                      to={`/admin/posts/edit/${post.id}`}
                      className="font-medium text-gray-900 hover:text-primary-600"
                    >
                      {post.title}
                    </Link>
                    <div className="text-sm text-gray-500 flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        post.status === 'published' ? 'bg-success-500' : 'bg-warning-500'
                      }`}></span>
                      {post.status === 'published' ? 'Published' : 'Draft'}
                      {post.published_at && ` on ${new Date(post.published_at).toLocaleDateString()}`}
                    </div>
                  </div>
                  <Link to={`/admin/posts/edit/${post.id}`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No posts yet</p>
            )}
          </div>
        </div>
        
        {/* Recent Comments */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Comments</h2>
            <Link to="/admin/comments" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentComments.length > 0 ? (
              recentComments.map((comment) => (
                <div key={comment.id} className="px-4 py-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{comment.profiles?.full_name || 'Anonymous'}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <Link to={`/admin/comments`}>
                      <Button variant="outline" size="sm">Review</Button>
                    </Link>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    On post: <Link to={`/posts/${comment.posts?.slug}`} className="hover:text-primary-600">{comment.posts?.title}</Link>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No comments yet</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Traffic Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Traffic Overview</h2>
          <div className="flex items-center space-x-2">
            <select className="text-sm border border-gray-300 rounded-md py-1 px-3">
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </select>
          </div>
        </div>
        
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <BarChart2 size={48} className="mx-auto text-gray-300" />
            <p className="mt-2 text-gray-600">Analytics visualization would appear here</p>
            <p className="text-sm text-gray-500">Connect your analytics service in settings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;