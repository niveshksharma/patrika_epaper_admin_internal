'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import styles from './Popover.module.css';

interface PopoverProps {
  children: ReactNode;
  content: ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Popover({ 
  children, 
  content, 
  align = 'start', 
  side = 'bottom',
  open: controlledOpen,
  onOpenChange,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setIsOpen = (value: boolean) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setInternalOpen(value);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isControlled, onOpenChange]);

  const alignClass = {
    start: styles.alignStart,
    center: styles.alignCenter,
    end: styles.alignEnd,
  }[align];

  const sideClass = side === 'top' ? styles.sideTop : styles.sideBottom;

  return (
    <div className={styles.popoverWrapper} ref={wrapperRef}>
      <div 
        className={styles.trigger} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {children}
      </div>
      <div 
        className={cn(
          styles.content, 
          alignClass, 
          sideClass,
          !isOpen && styles.hidden
        )}
      >
        {content}
      </div>
    </div>
  );
}
