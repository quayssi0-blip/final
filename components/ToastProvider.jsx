"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle, AlertCircle, XCircle, Info, X } from "lucide-react";
import { registerToastListener, dismissToast } from "../lib/toastUtils";

// Style classes for different toast types
const toastStyles = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
  default: "bg-gray-50 border-gray-200 text-gray-800",
};

const iconComponents = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
  default: Info,
};

// Toast item component
function ToastItem({ toast, onDismiss }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 300); // Match exit animation duration
  }, [toast.id, onDismiss]);

  // Auto dismiss for non-persistent toasts
  useEffect(() => {
    if (!toast.persistent) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, toast.duration || 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.persistent, toast.duration, handleDismiss]);

  const Icon = iconComponents[toast.type] || iconComponents.default;
  const styleClass = toastStyles[toast.type] || toastStyles.default;

  return (
    <div
      className={`
        pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg
        transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
        ${styleClass}
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon
              className={`h-5 w-5 ${
                toast.type === 'success' ? 'text-green-400' :
                toast.type === 'error' ? 'text-red-400' :
                toast.type === 'warning' ? 'text-yellow-400' :
                toast.type === 'info' ? 'text-blue-400' :
                'text-gray-400'
              }`}
            />
          </div>
          <div className="ml-3 w-0 flex-1">
            {toast.title && (
              <p className="text-sm font-medium">{toast.title}</p>
            )}
            {toast.description && (
              <p className={`text-sm ${toast.title ? 'mt-1' : ''}`}>
                {toast.description}
              </p>
            )}
            {toast.action && (
              <div className="mt-3">
                <button
                  onClick={toast.action.onClick}
                  className="text-sm font-medium underline hover:no-underline"
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              onClick={handleDismiss}
              className="inline-flex rounded-md hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Fermer</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress bar for auto-dismiss */}
      {!toast.persistent && (
        <div className="h-1 bg-black bg-opacity-10">
          <div
            className={`h-full transition-all duration-${toast.duration || 5000} ease-linear ${
              toast.type === 'success' ? 'bg-green-400' :
              toast.type === 'error' ? 'bg-red-400' :
              toast.type === 'warning' ? 'bg-yellow-400' :
              toast.type === 'info' ? 'bg-blue-400' :
              'bg-gray-400'
            }`}
            style={{
              animation: `shrink ${toast.duration || 5000}ms linear forwards`
            }}
          />
        </div>
      )}
    </div>
  );
}

// Toast container component
function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Register as a listener for toast events
    const unregister = registerToastListener((action) => {
      switch (action.type) {
        case 'ADD_TOAST':
          setToasts(prev => [...prev, action.toast]);
          break;
        case 'DISMISS_TOAST':
          setToasts(prev => prev.filter(t => t.id !== action.toastId));
          break;
        case 'CLEAR_ALL_TOASTS':
          setToasts([]);
          break;
        default:
          break;
      }
    });

    return unregister;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6">
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={dismissToast}
          />
        ))}
      </div>
    </div>
  );
}

// Main ToastProvider component - provides global toast system
export default function ToastProvider({ children }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}

// CSS for progress bar animation
const globalStyles = `
  @keyframes shrink {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined' && !document.getElementById('toast-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'toast-styles';
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}