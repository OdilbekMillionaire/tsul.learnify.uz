import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
}

interface SelectTriggerProps extends React.HTMLAttributes<HTMLDivElement> {}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

interface SelectItemProps extends React.OptionHTMLAttributes<HTMLOptionElement> {}

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', onValueChange, value, onChange, ...props }, ref) => (
    <select
      ref={ref}
      value={value}
      onChange={(e) => {
        onChange?.(e);
        onValueChange?.(e.target.value);
      }}
      className={`px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    />
  )
);

Select.displayName = 'Select';

export const SelectTrigger = React.forwardRef<HTMLDivElement, SelectTriggerProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  )
);

SelectTrigger.displayName = 'SelectTrigger';

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-white rounded-md border border-gray-300 shadow-lg ${className}`}
      {...props}
    />
  )
);

SelectContent.displayName = 'SelectContent';

export const SelectItem = React.forwardRef<HTMLOptionElement, SelectItemProps>(
  ({ className = '', ...props }, ref) => (
    <option
      ref={ref}
      className={`text-gray-900 ${className}`}
      {...props}
    />
  )
);

SelectItem.displayName = 'SelectItem';

export const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className = '', placeholder, ...props }, ref) => (
    <span ref={ref} className={`text-gray-700 ${className}`} {...props}>
      {placeholder || 'Select...'}
    </span>
  )
);

SelectValue.displayName = 'SelectValue';
