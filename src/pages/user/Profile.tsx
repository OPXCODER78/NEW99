import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Camera, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import type { Post } from '../../types/post';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [profile, setProfile] = useState({
    full_name: '',
    avatar_url: '',
    website: '',
    bio: ''
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (user) {
      getProfile();
      getUserPosts();
    }
  }, [user]);

  async function getProfile() {
    try {
      if (!user) return;

      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        // If no profile exists, create one
        if (error.message.includes('returned 0 rows')) {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || '',
              role: 'user',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (createError) throw createError;
          data = newProfile;
        } else {
          throw error;
        }
      }

      if (data) setProfile(data);
    } catch (error: any) {
      toast.error('Error loading profile');
      console.error('Error loading profile:', error);
    } finally {
      setIsInitialLoad(false);
    }
  }

  async function getUserPosts() {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('posts')
        .select('*, categories(*)')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  }

  async function updateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    if (!user) return;
    
    setLoading(true);
    try {
      const updates = {
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Error updating profile');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setLoading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfile({ ...profile, avatar_url: publicUrl });
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error('Error uploading avatar');
      console.error('Error uploading avatar:', error);
    } finally {
      setLoading(false);
    }
  }

  if (isInitialLoad) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary-900">Profile Settings</h1>
        <Link to="/user/posts/new">
          <Button variant="filled" className="bg-accent-600 hover:bg-accent-700">
            <Plus className="w-5 h-5 mr-2" />
            Create Post
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={updateProfile} className="space-y-6">
            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name}&background=8b5cf6&color=fff`}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover ring-2 ring-primary-200"
                  />
                  <label
                    htmlFor="avatar"
                    className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50 ring-2 ring-primary-100"
                  >
                    <Camera className="w-4 h-4 text-primary-600" />
                    <input
                      type="file"
                      id="avatar"
                      accept="image/*"
                      onChange={uploadAvatar}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              {/* Website */}
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  value={profile.website || ''}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="filled"
                isLoading={loading}
                className="bg-primary-600 hover:bg-primary-700"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-primary-900">Your Posts</h2>
          <div className="space-y-4">
            {userPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md border border-primary-100 p-4 hover:border-primary-200 transition-colors">
                <h3 className="font-medium text-primary-900">{post.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {post.categories?.name} • {new Date(post.created_at).toLocaleDateString()}
                </p>
                <div className="mt-3">
                  <Link to={`/posts/${post.slug}`}>
                    <Button variant="tinted" size="sm" className="w-full bg-primary-50 text-primary-700 hover:bg-primary-100">
                      View Post
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            {userPosts.length === 0 && (
              <div className="text-center py-8 bg-primary-50 rounded-lg border border-primary-100">
                <p className="text-primary-600 mb-4">No posts yet. Start sharing your thoughts!</p>
                <Link to="/user/posts/new">
                  <Button variant="filled" size="sm" className="bg-primary-600 hover:bg-primary-700">
                    Create Your First Post
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}