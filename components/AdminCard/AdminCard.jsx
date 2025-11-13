import React from 'react';
import './AdminCard.css';

const AdminCard = ({
  children,
  className = '',
  padding = 'medium',
  shadow = 'medium',
  rounded = 'medium',
  hover = false,
  ...props
}) => {
  const baseClasses = 'admin-card bg-white border border-gray-200 transition-all duration-200';

  const paddingClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  };

  const shadowClasses = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg',
  };

  const roundedClasses = {
    none: '',
    small: 'rounded-sm',
    medium: 'rounded-md',
    large: 'rounded-lg',
    full: 'rounded-full',
  };

  const classes = [
    baseClasses,
    paddingClasses[padding],
    shadowClasses[shadow],
    roundedClasses[rounded],
    hover ? 'hover:shadow-lg hover:-translate-y-1' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default AdminCard;