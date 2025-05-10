import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Calendar, Clock, Image as ImageIcon, Loader2, Send } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import TipTapEditor from '../../../components/editor/TipTapEditor';
import Button from '../../../components/ui/Button';

interface BroadcastFormData {
  title: string;
  scheduledFor: string;
  scheduledTime: string;
  image?: File;
}

export default function AdminBroadcast() {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<BroadcastFormData>();
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: BroadcastFormData) => {
    if (!content.trim()) {
      toast.error('Please enter message content');
      return;
    }

    setIsSubmitting(true);
    try {
      const scheduledDateTime = data.scheduledFor && data.scheduledTime 
        ? new Date(`${data.scheduledFor}T${data.scheduledTime}`).toISOString()
        : null;

      let imageUrl = null;
      if (data.image) {
        const fileExt = data.image.name.split('.').pop();
        const filePath = `broadcasts/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, data.image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }

      const { error } = await supabase
        .from('broadcasts')
        .insert({
          title: data.title,
          content,
          image_url: imageUrl,
          scheduled_for: scheduledDateTime,
          status: scheduledDateTime ? 'scheduled' : 'published',
        });

      if (error) throw error;

      toast.success(scheduledDateTime ? 'Broadcast scheduled' : 'Broadcast sent');
      reset();
      setContent('');
      setPreviewImage(null);
    } catch (error) {
      console.error('Error sending broadcast:', error);
      toast.error('Failed to send broadcast');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Send Broadcast Message</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            {...register('title', { required: 'Title is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-error-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Content
          </label>
          <TipTapEditor
            content={content}
            onChange={setContent}
            placeholder="Write your broadcast message..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Image
          </label>
          <div className="mt-1 flex items-center">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
              <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <ImageIcon className="h-5 w-5 mr-2" />
                Choose Image
              </span>
              <input
                type="file"
                className="sr-only"
                accept="image/*"
                {...register('image')}
                onChange={handleImageChange}
              />
            </label>
          </div>
          {previewImage && (
            <div className="mt-2">
              <img
                src={previewImage}
                alt="Preview"
                className="h-32 w-auto object-cover rounded-md"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="scheduledFor" className="block text-sm font-medium text-gray-700">
              Schedule Date (Optional)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="scheduledFor"
                {...register('scheduledFor')}
                min={new Date().toISOString().split('T')[0]}
                className="block w-full pl-10 rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700">
              Schedule Time (Optional)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="time"
                id="scheduledTime"
                {...register('scheduledTime')}
                className="block w-full pl-10 rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                {watch('scheduledFor') ? 'Schedule Broadcast' : 'Send Broadcast'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}