import React from 'react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
}

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: 'bg-blue-50 border border-blue-200 text-blue-900',
      destructive: 'bg-red-50 border border-red-200 text-red-900',
    };

    return (
      <div
        ref={ref}
        className={`px-4 py-3 rounded-md ${variantClasses[variant]} ${className}`}
        role="alert"
        {...props}
      />
    );
  }
);

Alert.displayName = 'Alert';

export const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className = '', ...props }, ref) => (
    <p ref={ref} className={`text-sm ${className}`} {...props} />
  )
);

AlertDescription.displayName = 'AlertDescription';
