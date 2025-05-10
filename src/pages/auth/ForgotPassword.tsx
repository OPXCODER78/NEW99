import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>();
  
  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setLoading(true);
    
    try {
      const { error } = await forgotPassword(data.email);
      
      if (error) {
        throw error;
      }
      
      setEmailSent(true);
      toast.success('Password reset link sent to your email');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
        Reset your password
      </h2>
      
      {emailSent ? (
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            We've sent a password reset link to your email. Please check your inbox.
          </p>
          <Link to="/auth/login">
            <Button variant="outline" className="mt-4">
              Return to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-6">
            Enter the email address associated with your account, and we'll send you a link to reset your password.
          </p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <Link to="/auth/login" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                Return to Sign In
              </Link>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              isLoading={loading}
            >
              Send Reset Link
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;