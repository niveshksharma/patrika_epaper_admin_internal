'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Select } from '@/components/ui/Select/Select';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Calendar } from '@/components/ui/Calendar/Calendar';
import { Popover } from '@/components/ui/Popover/Popover';
import { X, CalendarIcon, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { State, City } from '@/types';
import styles from './FilterBar.module.css';

interface FilterBarProps {
    states: State[];
    cities: City[];
    selectedState: string | null;
    selectedCity: string | null;
    selectedDate: Date | null;
    searchQuery: string;
    onStateChange: (stateId: string | null) => void;
    onCityChange: (cityId: string | null) => void;
    onDateChange: (date: Date | null) => void;
    onSearchChange: (query: string) => void;
}

export function FilterBar({
    states,
    cities,
    selectedState,
    selectedCity,
    selectedDate,
    searchQuery,
    onStateChange,
    onCityChange,
    onDateChange,
    onSearchChange,
}: FilterBarProps) {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const filteredCities = cities
    //     ? cities.filter((city) => city.stateId === selectedState)
    //     : cities;


    const handleClearFilters = () => {
        onStateChange(null);
        onCityChange(null);
        onDateChange(null);
        onSearchChange('');
    };

    const hasFilters = selectedState || selectedCity || selectedDate || searchQuery;

    const stateOptions = [
        { value: 'all', label: 'All States' },
        ...states.map(state => ({ value: state.id, label: state.name?.en })),
    ];

    const cityOptions = [
        { value: 'all', label: selectedState ? 'All Cities' : 'Select a state first' },
        ...filteredCities.map(city => ({ value: city.id, label: city.name.en })),
    ];

    console.log('slected state-----', selectedCity, selectedState)

    return (
        <div className={styles.filterBar}>
            <div className={styles.searchWrapper}>
                <span className={styles.searchIcon}><Search /></span>
                <Input
                    placeholder="Search editions by title..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.filters}>
                <div className={styles.filterItem}>
                    <Select
                        value={selectedState || 'all'}
                        onValueChange={(value) => {
                            onStateChange(value === 'all' ? null : value);
                            onCityChange(null);
                        }}
                        options={stateOptions}
                        placeholder="Select State"
                    />
                </div>

                <div className={styles.filterItem}>
                    <Select
                        value={selectedCity || 'all'}
                        onValueChange={(value) => onCityChange(value === 'all' ? null : value)}
                        options={cityOptions}
                        placeholder="Select City"
                        disabled={!selectedState}
                    />
                </div>

                <div className={styles.filterItem}>
                    <Popover
                        open={isCalendarOpen}
                        onOpenChange={setIsCalendarOpen}
                        content={
                            <Calendar
                                selected={selectedDate}
                                onSelect={(date) => {
                                    onDateChange(date);
                                    setIsCalendarOpen(false);
                                }}
                            />
                        }
                    >
                        <Button variant="outline" fullWidth>
                            <CalendarIcon />
                            {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                        </Button>
                    </Popover>
                </div>

                {hasFilters && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClearFilters}
                        className={styles.clearButton}
                    >
                        <X />
                    </Button>
                )}
            </div>
        </div>
    );
}
