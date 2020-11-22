import clsx from 'clsx';
import { HTMLAttributes } from 'react';

export default function Button({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        'transition-all duration-300 bg-blue-100 text-gray-900 rounded-md px-3 py-2 border-2 border-solid hover:border-blue-900',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
