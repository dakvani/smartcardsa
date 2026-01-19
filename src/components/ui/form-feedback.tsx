import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, AlertCircle } from "lucide-react";

type FormStatus = "idle" | "loading" | "success" | "error";

interface FormStatusIndicatorProps {
  status: FormStatus;
  successMessage?: string;
  errorMessage?: string;
}

export function FormStatusIndicator({ 
  status, 
  successMessage = "Success!", 
  errorMessage = "Something went wrong" 
}: FormStatusIndicatorProps) {
  return (
    <AnimatePresence mode="wait">
      {status === "loading" && (
        <motion.div
          key="loading"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex items-center gap-2 text-muted-foreground"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Processing...</span>
        </motion.div>
      )}
      
      {status === "success" && (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex items-center gap-2 text-green-500"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Check className="w-4 h-4" />
          </motion.div>
          <span className="text-sm">{successMessage}</span>
        </motion.div>
      )}
      
      {status === "error" && (
        <motion.div
          key="error"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex items-center gap-2 text-destructive"
        >
          <motion.div
            animate={{ x: [0, -3, 3, -3, 3, 0] }}
            transition={{ duration: 0.4 }}
          >
            <AlertCircle className="w-4 h-4" />
          </motion.div>
          <span className="text-sm">{errorMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface SubmitButtonProps {
  status: FormStatus;
  idleText: string;
  loadingText?: string;
  successText?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}

export function SubmitButton({
  status,
  idleText,
  loadingText = "Processing...",
  successText = "Done!",
  className = "",
  disabled = false,
  onClick,
  type = "submit",
}: SubmitButtonProps) {
  const isDisabled = disabled || status === "loading" || status === "success";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
      className={`relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
        status === "success"
          ? "bg-green-500 text-white"
          : status === "error"
          ? "bg-destructive text-destructive-foreground"
          : "gradient-primary text-primary-foreground shadow-glow hover:shadow-elevated hover:-translate-y-0.5"
      } disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${className}`}
    >
      <AnimatePresence mode="wait">
        {status === "loading" && (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            {loadingText}
          </motion.span>
        )}
        
        {status === "success" && (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Check className="w-4 h-4" />
            </motion.div>
            {successText}
          </motion.span>
        )}
        
        {(status === "idle" || status === "error") && (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {idleText}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Success checkmark animation component
export function SuccessCheckmark({ size = 48 }: { size?: number }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative"
      style={{ width: size, height: size }}
    >
      {/* Circle */}
      <motion.svg
        viewBox="0 0 50 50"
        className="absolute inset-0"
        style={{ width: size, height: size }}
      >
        <motion.circle
          cx="25"
          cy="25"
          r="23"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-green-500"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </motion.svg>
      
      {/* Checkmark */}
      <motion.svg
        viewBox="0 0 50 50"
        className="absolute inset-0 text-green-500"
        style={{ width: size, height: size }}
      >
        <motion.path
          d="M14 27 L 22 35 L 36 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
        />
      </motion.svg>
    </motion.div>
  );
}
