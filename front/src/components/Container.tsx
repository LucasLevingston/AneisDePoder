import React from 'react';
import 'react-toastify/dist/ReactToastify.css';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps): JSX.Element {
  return (
    <div
      className={`flex-1 min-h-screen p-6 sm:p-[50px] ${className}
      bg-gradient-to-br from-gray-900 from-amber-50 to-mainColor`}
    >
      <div className="h-full">{children}</div>
    </div>
  );
}
