import React from 'react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', className, text }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-primary border-t-transparent',
          sizeClasses[size]
        )}
      />
      {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
    </div>
  );
};

export default Loader;
