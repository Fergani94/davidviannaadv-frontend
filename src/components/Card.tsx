'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  className = '',
  shadow = 'md',
  padding = 'md',
}: CardProps) {
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`${shadowClasses[shadow]} ${paddingClasses[padding]} rounded-lg bg-white border border-gray-200 ${className}`}
    >
      {children}
    </div>
  );
}
