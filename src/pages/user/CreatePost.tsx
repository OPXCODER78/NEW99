import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import TipTapEditor from '../../components/editor/TipTapEditor';

interface PostFormData {
  title: string;
  excerpt: string;
  category_id: string;
  featured_image: string;
}

const CreatePost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<PostFormData>();

  useState(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      setCategories(data || []);
    }
    fetchCategories();
  }, []);

  const onSubmit = async (formData: PostFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const postData = {
        ...formData,
        content,
        author_id: user.id,
        status: 'published',
        slug: formData.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
      };
      
      const { error } = await supabase
        .from('posts')
        .insert([postData]);
        
      if (error) throw error;
      
      toast.success('Post created successfully!');
      navigate('/user/profile');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Create New Post</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            {...register('title', { required: 'Title is required' })}
            className="ios-input w-full"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-system-red">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium mb-1">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            {...register('excerpt', { required: 'Excerpt is required' })}
            className="ios-input w-full"
            rows={3}
          />
          {errors.excerpt && (
            <p className="mt-1 text-sm text-system-red">{errors.excerpt.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category
          </label>
          <select
            id="category"
            {...register('category_id', { required: 'Category is required' })}
            className="ios-input w-full"
          >
            <option value="">Select a category</option>
            {categories.map((category: any) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="mt-1 text-sm text-system-red">{errors.category_id.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="featured_image" className="block text-sm font-medium mb-1">
            Featured Image URL
          </label>
          <input
            type="url"
            id="featured_image"
            {...register('featured_image')}
            className="ios-input w-full"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Content
          </label>
          <TipTapEditor
            content={content}
            onChange={setContent}
            placeholder="Write your post content here..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            variant="gray"
            onClick={() => navigate(-1)}
            type="button"
          >
            Cancel
          </Button>
          <Button
            variant="filled"
            type="submit"
            isLoading={isSubmitting}
          >
            Publish Post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;