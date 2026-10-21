import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Button({
  icon,
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg
        px-3 py-2 text-sm font-medium transition
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}