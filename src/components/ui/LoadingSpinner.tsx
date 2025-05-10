import { cn } from '../../utils/cn';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = ({ fullScreen = false, size = 'md' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn(
      'flex items-center justify-center',
      fullScreen && 'fixed inset-0 bg-white/80 z-50'
    )}>
      <div className={cn(
        'animate-spin rounded-full border-t-transparent',
        sizeClasses[size],
        'border-4 border-primary-500'
      )} />
    </div>
  );
};

export default LoadingSpinner;