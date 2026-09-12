import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
}

export function LoadingSpinner({ size = 'md', className, message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-brand border-t-transparent',
          sizeClasses[size]
        )}
        role="status"
        aria-label={message || 'Loading'}
      />
      {message && (
        <p className="text-sm text-muted">{message}</p>
      )}
    </div>
  );
}

export function PageLoader({ message }: { message?: string }) {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-8">
      <LoadingSpinner size="lg" message={message} />
    </div>
  );
}

export function InlineLoader({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-4">
      <LoadingSpinner size="sm" message={message} />
    </div>
  );
}
