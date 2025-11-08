// Toast utilities for use in hooks
// This provides a global toast system that can be used outside React components

let toastQueue = [];
let listeners = [];

// Register a listener (React component) to receive toast events
export function registerToastListener(listener) {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

// Show a toast notification
export function showToast(toastOptions) {
  const id = Date.now() + Math.random();
  const toast = {
    id,
    open: true,
    ...toastOptions,
  };
  
  toastQueue.push(toast);
  
  // Notify all listeners
  listeners.forEach(listener => {
    if (typeof listener === 'function') {
      listener({ type: 'ADD_TOAST', toast });
    }
  });
  
  return id;
}

// Enhanced toast functions for different types
export const toastTypes = {
  success: (title, description, options = {}) => ({
    type: 'success',
    title,
    description,
    duration: options.duration || 4000,
    persistent: options.persistent || false,
    action: options.action,
  }),
  
  error: (title, description, options = {}) => ({
    type: 'error',
    title,
    description,
    duration: options.duration || 6000, // Longer for errors
    persistent: options.persistent || false,
    action: options.action,
  }),
  
  warning: (title, description, options = {}) => ({
    type: 'warning',
    title,
    description,
    duration: options.duration || 5000,
    persistent: options.persistent || false,
    action: options.action,
  }),
  
  info: (title, description, options = {}) => ({
    type: 'info',
    title,
    description,
    duration: options.duration || 4000,
    persistent: options.persistent || false,
    action: options.action,
  }),
};

// Convenience functions
export const toast = {
  success: (title, description, options = {}) => 
    showToast(toastTypes.success(title, description, options)),
  
  error: (title, description, options = {}) => 
    showToast(toastTypes.error(title, description, options)),
  
  warning: (title, description, options = {}) => 
    showToast(toastTypes.warning(title, description, options)),
  
  info: (title, description, options = {}) => 
    showToast(toastTypes.info(title, description, options)),
  
  default: (title, description, options = {}) => 
    showToast({
      type: 'default',
      title,
      description,
      duration: options.duration || 4000,
      persistent: options.persistent || false,
      action: options.action,
    }),
};

// Dismiss a specific toast
export function dismissToast(id) {
  listeners.forEach(listener => {
    if (typeof listener === 'function') {
      listener({ type: 'DISMISS_TOAST', toastId: id });
    }
  });
}

// Clear all toasts
export function clearAllToasts() {
  listeners.forEach(listener => {
    if (typeof listener === 'function') {
      listener({ type: 'CLEAR_ALL_TOASTS' });
    }
  });
}

// Auto-dismiss utility for non-persistent toasts
export function autoDismiss(toastId, duration = 5000) {
  setTimeout(() => {
    dismissToast(toastId);
  }, duration);
}

// Hook-like function for use in components
export function useToastFromUtils() {
  return {
    toast,
    dismiss: dismissToast,
    clearAll: clearAllToasts,
  };
}