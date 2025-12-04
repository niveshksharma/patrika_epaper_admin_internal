'use client';

import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'editorial' | 'coral';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', fullWidth = false, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          styles.button,
          styles[variant],
          styles[size],
          fullWidth && styles.fullWidth,
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
