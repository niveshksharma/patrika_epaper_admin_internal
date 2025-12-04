'use client';

import React, { forwardRef, LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import styles from './Label.module.css';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  disabled?: boolean;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, disabled, ...props }, ref) => {
    return (
      <label
        className={cn(styles.label, disabled && styles.disabled, className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Label.displayName = 'Label';

export { Label };
