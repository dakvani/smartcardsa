import { useMemo } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PasswordStrengthIndicatorProps {
  password: string;
}

const requirements = [
  { label: "At least 6 characters", test: (p: string) => p.length >= 6 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Number", test: (p: string) => /[0-9]/.test(p) },
  { label: "Special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const results = useMemo(
    () => requirements.map((r) => ({ ...r, met: r.test(password) })),
    [password]
  );

  const score = results.filter((r) => r.met).length;
  const percent = (score / requirements.length) * 100;

  const strengthLabel =
    score <= 1 ? "Weak" : score <= 3 ? "Fair" : score <= 4 ? "Strong" : "Very strong";

  const strengthColor =
    score <= 1
      ? "bg-destructive"
      : score <= 3
        ? "bg-yellow-500"
        : "bg-green-500";

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Password strength</span>
        <span className="font-medium text-muted-foreground">{strengthLabel}</span>
      </div>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full transition-all duration-300 rounded-full ${strengthColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <ul className="space-y-1">
        {results.map((r) => (
          <li key={r.label} className="flex items-center gap-1.5 text-xs">
            {r.met ? (
              <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
            ) : (
              <XCircle className="w-3 h-3 text-muted-foreground shrink-0" />
            )}
            <span className={r.met ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}>
              {r.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
