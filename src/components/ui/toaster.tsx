import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { useEffect, useRef } from "react";

// Screen reader announcement component
function ScreenReaderAnnouncement({ message, priority = "polite" }: { message: string; priority?: "polite" | "assertive" }) {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

export function Toaster() {
  const { toasts } = useToast();
  const announcementRef = useRef<string>("");

  // Update screen reader announcement when toasts change
  useEffect(() => {
    const latestToast = toasts[0];
    if (latestToast) {
      const message = [latestToast.title, latestToast.description]
        .filter(Boolean)
        .join(". ");
      announcementRef.current = message;
    }
  }, [toasts]);

  return (
    <ToastProvider>
      {/* Screen reader announcements */}
      {toasts.map(({ id, title, description, variant }) => (
        <ScreenReaderAnnouncement
          key={`sr-${id}`}
          message={`${title ? String(title) : ""}${description ? `. ${String(description)}` : ""}`}
          priority={variant === "destructive" ? "assertive" : "polite"}
        />
      ))}
      
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose aria-label="Dismiss notification" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
