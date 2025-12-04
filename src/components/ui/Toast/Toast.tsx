'use client';

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './Toast.module.css';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

export function ToastItem({ toast, onDismiss }: ToastProps) {
  return (
    <div className={cn(styles.toast, toast.variant === 'destructive' && styles.destructive)}>
      <div className={styles.toastContent}>
        <div className={styles.title}>{toast.title}</div>
        {toast.description && (
          <div className={styles.description}>{toast.description}</div>
        )}
      </div>
      <button 
        className={styles.closeButton}
        onClick={() => onDismiss(toast.id)}
        aria-label="Close"
      >
        <X />
      </button>
    </div>
  );
}

interface ToasterProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function Toaster({ toasts, onDismiss }: ToasterProps) {
  if (toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
