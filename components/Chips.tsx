'use client';

import { useState, useEffect } from 'react';

interface IdlePreview {
  id: string;
  tag: string;
  afterMs: number;
  previewEvent: string;
}

interface ChipsProps {
  options: string[] | Array<{ id: string; label: string; primary?: boolean }>;
  onSelect: (value: string) => void;
  selectedValue?: string;
  className?: string;
  multiSelect?: boolean;
  idlePreview?: IdlePreview; // Preview chip selection after idle time
}

export default function Chips({ 
  options, 
  onSelect, 
  selectedValue, 
  className = '',
  multiSelect = false,
  idlePreview
}: ChipsProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleSelect = (value: string) => {
    if (multiSelect) {
      const newSelected = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];
      setSelectedValues(newSelected);
      onSelect(newSelected.join(', '));
    } else {
      onSelect(value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, value: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect(value);
    }
  };

  // Idle preview logic (visual preview only, doesn't trigger onSelect)
  // This is now handled by the demo store for better coordination
  useEffect(() => {
    // The demo store handles idle preview timing and visual feedback
    // This component just responds to the store's visual state
  }, [idlePreview]);

  const isSelected = (value: string) => {
    if (multiSelect) {
      return selectedValues.includes(value);
    }
    return selectedValue === value;
  };

  const normalizeOptions = (opts: typeof options): Array<{ label: string; primary?: boolean }> => {
    return opts.map(opt => 
      typeof opt === 'string' ? { label: opt } : opt
    );
  };

  const normalizedOptions = normalizeOptions(options);

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {normalizedOptions.map((option) => (
        <button
          key={option.label}
          onClick={() => handleSelect(option.label)}
          onKeyDown={(e) => handleKeyDown(e, option.label)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            border focus:outline-none focus:ring-2 focus:ring-teal focus:ring-opacity-50
            ${
              isSelected(option.label)
                ? 'bg-teal border-teal text-white shadow-md transform scale-105'
                : option.primary
                  ? 'bg-teal border-teal text-white shadow-md hover:bg-teal-hover'
                  : 'bg-white border-border-light text-text-secondary hover:text-text-primary hover:border-teal hover:bg-background-muted shadow-sm hover:shadow-md'
            }
          `}
          role="button"
          tabIndex={0}
          aria-pressed={isSelected(option.label)}
          aria-label={`Select ${option.label}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}