'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './Select.module.css';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = 'Select...',
  disabled = false,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={cn(styles.selectWrapper, className)} ref={wrapperRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={!selectedOption ? styles.placeholder : ''}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown />
      </button>

      <div 
        className={cn(styles.content, !isOpen && styles.hidden)}
        role="listbox"
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={cn(
              styles.item,
              option.value === value && styles.itemSelected,
              option.disabled && styles.itemDisabled
            )}
            onClick={() => !option.disabled && handleSelect(option.value)}
            role="option"
            aria-selected={option.value === value}
            disabled={option.disabled}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

