"use client"

import { toast as sonnerToast } from "sonner"

// Simple wrapper to maintain compatibility with existing toast API
export function toast(options: {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  action?: {
    label: string
    onClick: () => void
  }
}) {
  const { title, description, variant, action } = options

  if (variant === "destructive") {
    return sonnerToast.error(title || description || "Error", {
      description: title ? description : undefined,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    })
  }

  return sonnerToast.success(title || description || "Success", {
    description: title ? description : undefined,
    action: action
      ? {
          label: action.label,
          onClick: action.onClick,
        }
      : undefined,
  })
}

// Enhanced toast with all Sonner methods
export const enhancedToast = {
  success: (message: string, options?: any) => sonnerToast.success(message, options),
  error: (message: string, options?: any) => sonnerToast.error(message, options),
  info: (message: string, options?: any) => sonnerToast.info(message, options),
  warning: (message: string, options?: any) => sonnerToast.warning(message, options),
  loading: (message: string, options?: any) => sonnerToast.loading(message, options),
  promise: sonnerToast.promise,
  dismiss: sonnerToast.dismiss,
}

// Hook for compatibility
export function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  }
}
