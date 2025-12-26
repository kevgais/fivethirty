import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-charcoal">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 bg-warm-white rounded-soft border border-mushroom/20
            focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta
            text-charcoal placeholder:text-mushroom
            disabled:bg-mushroom/10 disabled:cursor-not-allowed
            ${error ? 'border-terracotta ring-1 ring-terracotta' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-terracotta">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-charcoal">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-3 bg-warm-white rounded-soft border border-mushroom/20
            focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta
            text-charcoal placeholder:text-mushroom resize-y min-h-[100px]
            disabled:bg-mushroom/10 disabled:cursor-not-allowed
            ${error ? 'border-terracotta ring-1 ring-terracotta' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-terracotta">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
