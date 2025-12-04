'use client';

import React, { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import styles from './Input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className={styles.inputWrapper}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          className={cn(
            styles.input,
            icon && styles.withIcon,
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
