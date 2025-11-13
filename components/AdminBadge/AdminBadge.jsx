import React from 'react';
import './AdminBadge.css';

const AdminBadge = ({
  children,
  variant = 'info',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'admin-badge inline-flex items-center font-medium rounded-full transition-colors duration-200';

  const variantClasses = {
    success: 'admin-badge-success bg-green-100 text-green-800',
    warning: 'admin-badge-warning bg-yellow-100 text-yellow-800',
    error: 'admin-badge-error bg-red-100 text-red-800',
    info: 'admin-badge-info bg-blue-100 text-blue-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default AdminBadge;