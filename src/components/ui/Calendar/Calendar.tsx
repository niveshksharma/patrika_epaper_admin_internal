'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday
} from 'date-fns';
import { cn } from '@/lib/utils';
import styles from './Calendar.module.css';

interface CalendarProps {
  selected?: Date | null;
  onSelect?: (date: Date | null) => void;
  className?: string;
}

export function Calendar({ selected, onSelect, className }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDayClick = (day: Date) => {
    if (onSelect) {
      if (selected && isSameDay(selected, day)) {
        onSelect(null);
      } else {
        onSelect(day);
      }
    }
  };

  return (
    <div className={cn(styles.calendar, className)}>
      <div className={styles.header}>
        <button 
          type="button" 
          className={styles.navButton} 
          onClick={handlePrevMonth}
          aria-label="Previous month"
        >
          <ChevronLeft />
        </button>
        <span className={styles.monthYear}>
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button 
          type="button" 
          className={styles.navButton} 
          onClick={handleNextMonth}
          aria-label="Next month"
        >
          <ChevronRight />
        </button>
      </div>

      <div className={styles.weekdays}>
        {weekdays.map(day => (
          <div key={day} className={styles.weekday}>{day}</div>
        ))}
      </div>

      <div className={styles.days}>
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selected && isSameDay(day, selected);
          const isDayToday = isToday(day);

          return (
            <button
              key={index}
              type="button"
              className={cn(
                styles.day,
                !isCurrentMonth && styles.dayOutside,
                isSelected && styles.selected,
                isDayToday && !isSelected && styles.today
              )}
              onClick={() => handleDayClick(day)}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
