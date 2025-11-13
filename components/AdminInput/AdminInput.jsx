import React from 'react';
import './AdminInput.css';

const AdminInput = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  error = false,
  success = false,
  required = false,
  className = '',
  label,
  helperText,
  ...props
}) => {
  const baseClasses = 'admin-input w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200';

  let inputClasses = baseClasses;

  if (error) {
    inputClasses += ' border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500';
  } else if (success) {
    inputClasses += ' border-green-300 text-green-900 placeholder-green-300 focus:ring-green-500 focus:border-green-500';
  } else {
    inputClasses += ' border-gray-300 text-gray-900';
  }

  if (disabled) {
    inputClasses += ' bg-gray-50 cursor-not-allowed';
  }

  inputClasses += ` ${className}`;

  return (
    <div className="admin-input-wrapper">
      {label && (
        <label className="admin-input-label block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        required={required}
        className={inputClasses}
        {...props}
      />
      {helperText && (
        <p className={`admin-input-helper mt-1 text-sm ${error ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default AdminInput;