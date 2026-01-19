import { useToast as useToastBase } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import React from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface AccessibleToastOptions {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />,
  error: <AlertCircle className="h-5 w-5 text-destructive" aria-hidden="true" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-500" aria-hidden="true" />,
  info: <Info className="h-5 w-5 text-blue-500" aria-hidden="true" />,
};

const toastVariants: Record<ToastType, "default" | "destructive"> = {
  success: "default",
  error: "destructive",
  warning: "default",
  info: "default",
};

/**
 * Enhanced toast hook with accessibility features
 * Includes screen reader announcements and visual indicators
 */
export function useAccessibleToast() {
  const { toast, dismiss, toasts } = useToastBase();

  const showToast = ({ title, description, type = "info", duration }: AccessibleToastOptions) => {
    const icon = toastIcons[type];
    const variant = toastVariants[type];

    return toast({
      title: (
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
      ) as unknown as string,
      description,
      variant,
      duration,
    });
  };

  return {
    toast: showToast,
    success: (title: string, description?: string) => 
      showToast({ title, description, type: "success" }),
    error: (title: string, description?: string) => 
      showToast({ title, description, type: "error" }),
    warning: (title: string, description?: string) => 
      showToast({ title, description, type: "warning" }),
    info: (title: string, description?: string) => 
      showToast({ title, description, type: "info" }),
    dismiss,
    toasts,
  };
}

// Standalone toast functions for use outside of React components
export const accessibleToast = {
  success: (title: string, description?: string) => {
    const { toast } = useToastBase();
    return toast({
      title: (
        <div className="flex items-center gap-2">
          {toastIcons.success}
          <span>{title}</span>
        </div>
      ) as unknown as string,
      description,
    });
  },
  error: (title: string, description?: string) => {
    const { toast } = useToastBase();
    return toast({
      title: (
        <div className="flex items-center gap-2">
          {toastIcons.error}
          <span>{title}</span>
        </div>
      ) as unknown as string,
      description,
      variant: "destructive",
    });
  },
};
