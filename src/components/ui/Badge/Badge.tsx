'use client';

import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import styles from './Badge.module.css';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(styles.badge, styles[variant], className)}
      {...props}
    />
  );
}

export { Badge };
