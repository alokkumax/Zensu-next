import { cn } from '@/lib/utils';
import React from 'react';

const Title = ({children, className}:{
    children: React.ReactNode;
    className?: string;
}) => {
  return (
    <div className={cn("text-2xl font-semibold", className)}>
      {children}
    </div>
  );
}

export default Title;
