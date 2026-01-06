import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  gradient?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hover = false,
  gradient = 'none',
  padding = 'md',
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const gradientClasses = {
    none: '',
    primary: 'bg-gradient-to-br from-primary/10 to-primary/5',
    secondary: 'bg-gradient-to-br from-secondary/10 to-secondary/5',
    accent: 'bg-gradient-to-br from-accent/10 to-accent/5',
    success: 'bg-gradient-to-br from-success/10 to-success/5',
    warning: 'bg-gradient-to-br from-warning/10 to-warning/5',
  };

  return (
    <div
      className={cn(
        'bg-card/60 backdrop-blur-xl border border-border/20 rounded-2xl shadow-lg',
        hover && 'transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer',
        paddingClasses[padding],
        gradientClasses[gradient],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
