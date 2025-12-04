'use client';

import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import styles from './Card.module.css';

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div className={cn(styles.card, className)} ref={ref} {...props} />
    )
);
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div className={cn(styles.header, className)} ref={ref} {...props} />
    )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3 className={cn(styles.title, className)} ref={ref} {...props} />
    )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p className={cn(styles.description, className)} ref={ref} {...props} />
    )
);
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { noPadding?: boolean }>(
    ({ className, noPadding, ...props }, ref) => (
        <div
            className={cn(styles.content, noPadding && styles.contentNoPadding, className)}
            ref={ref}
            {...props}
        />
    )
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div className={cn(styles.footer, className)} ref={ref} {...props} />
    )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
