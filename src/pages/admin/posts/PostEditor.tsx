import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../components/ui/Button';
import TipTapEditor from '../../../components/editor/TipTapEditor';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

interface PostFormData {
  title: string;
  excerpt: string;
  category_id: string;
  featured_image: string;
  seo_title: string;
  seo_description: string;
  is_featured: boolean;
}

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PostFormData>();
  
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
        
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      setCategories(data || []);
    }
    
    async function fetchPost() {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setValue('title', data.title);
          setValue('excerpt', data.excerpt);
          setValue('category_id', data.category_id);
          setValue('featured_image', data.featured_image || '');
          setValue('seo_title', data.seo_title || '');
          setValue('seo_description', data.seo_description || '');
          setValue('is_featured', data.is_featured);
          setContent(data.content);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Failed to load post');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCategories();
    fetchPost();
  }, [id, setValue]);
  
  const onSubmit = async (formData: PostFormData) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const postData = {
        ...formData,
        content,
        author_id: user.id,
        slug: formData.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
      };
      
      if (id) {
        // Update existing post
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', id);
          
        if (error) throw error;
        
        toast.success('Post updated successfully');
      } else {
        // Create new post
        const { error } = await supabase
          .from('posts')
          .insert([postData]);
          
        if (error) throw error;
        
        toast.success('Post created successfully');
      }
      
      navigate('/admin/posts');
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast.error(error.message || 'Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Edit Post' : 'Create New Post'}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                {...register('title', { required: 'Title is required' })}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-error-600">{errors.title.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                rows={3}
                {...register('excerpt', { required: 'Excerpt is required' })}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              />
              {errors.excerpt && (
                <p className="mt-1 text-sm text-error-600">{errors.excerpt.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                {...register('category_id', { required: 'Category is required' })}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-sm text-error-600">{errors.category_id.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <TipTapEditor
                content={content}
                onChange={setContent}
                placeholder="Write your post content here..."
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">SEO & Media</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700">
                Featured Image URL
              </label>
              <input
                type="url"
                id="featured_image"
                {...register('featured_image')}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label htmlFor="seo_title" className="block text-sm font-medium text-gray-700">
                SEO Title
              </label>
              <input
                type="text"
                id="seo_title"
                {...register('seo_title')}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label htmlFor="seo_description" className="block text-sm font-medium text-gray-700">
                SEO Description
              </label>
              <textarea
                id="seo_description"
                rows={3}
                {...register('seo_description')}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                {...register('is_featured')}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                Feature this post on the homepage
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/posts')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSaving}
          >
            {id ? 'Update Post' : 'Create Post'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostEditor;