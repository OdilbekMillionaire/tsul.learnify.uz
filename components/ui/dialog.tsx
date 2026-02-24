import React, { useState } from 'react';

interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DialogTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: string;
  maxHeight?: string;
}

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const DialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

export const Dialog = ({
  open: controlledOpen,
  onOpenChange,
  children,
  ...props
}: DialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const setOpen = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      <div {...props}>{children}</div>
    </DialogContext.Provider>
  );
};

Dialog.displayName = 'Dialog';

export const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ asChild, onClick, children, ...props }, ref) => {
    const { setOpen } = React.useContext(DialogContext);

    if (asChild && React.isValidElement(children)) {
      const childElement = children as React.ReactElement<any>;
      return React.cloneElement(childElement, {
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          childElement.props.onClick?.(e);
          setOpen(true);
        },
      });
    }

    return (
      <button
        ref={ref}
        onClick={(e) => {
          onClick?.(e);
          setOpen(true);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

DialogTrigger.displayName = 'DialogTrigger';

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className = '', maxWidth = 'max-w-lg', maxHeight = 'max-h-[80vh]', ...props }, ref) => {
    const { open, setOpen } = React.useContext(DialogContext);

    if (!open) return null;

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setOpen(false)}
        />
        {/* Dialog */}
        <div
          ref={ref}
          className={`fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 ${maxWidth} ${maxHeight} bg-white rounded-lg shadow-lg border border-gray-200 overflow-y-auto ${className}`}
          {...props}
        />
      </>
    );
  }
);

DialogContent.displayName = 'DialogContent';

export const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`px-6 py-4 border-b border-gray-200 ${className}`} {...props} />
  )
);

DialogHeader.displayName = 'DialogHeader';

export const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className = '', ...props }, ref) => (
    <h2 ref={ref} className={`text-lg font-semibold text-gray-900 ${className}`} {...props} />
  )
);

DialogTitle.displayName = 'DialogTitle';

export const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className = '', ...props }, ref) => (
    <p ref={ref} className={`text-sm text-gray-600 mt-1 ${className}`} {...props} />
  )
);

DialogDescription.displayName = 'DialogDescription';
