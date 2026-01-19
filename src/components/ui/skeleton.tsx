import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-muted via-muted/70 to-muted bg-[length:200%_100%] animate-shimmer",
        className
      )}
      {...props}
    />
  );
}

// Text skeleton with multiple lines
function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === lines - 1 ? "w-3/4" : "w-full")}
        />
      ))}
    </div>
  );
}

// Card skeleton
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border/50 p-6 space-y-4", className)}>
      <Skeleton className="h-40 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>
    </div>
  );
}

// Avatar with text skeleton
function SkeletonAvatar({ withText = true, className }: { withText?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      {withText && (
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      )}
    </div>
  );
}

// Hero section skeleton
function SkeletonHero({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center text-center space-y-6 py-12", className)}>
      <Skeleton className="h-12 w-48 rounded-full" />
      <div className="space-y-4 w-full max-w-2xl">
        <Skeleton className="h-10 w-3/4 mx-auto" />
        <Skeleton className="h-10 w-1/2 mx-auto" />
      </div>
      <div className="space-y-2 w-full max-w-lg">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5 mx-auto" />
      </div>
      <div className="flex gap-4 pt-4">
        <Skeleton className="h-12 w-36 rounded-full" />
        <Skeleton className="h-12 w-32 rounded-full" />
      </div>
    </div>
  );
}

// Grid of cards skeleton
function SkeletonGrid({ 
  count = 6, 
  columns = 3,
  className 
}: { 
  count?: number; 
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-6", gridCols[columns], className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// Table skeleton
function SkeletonTable({ rows = 5, columns = 4, className }: { rows?: number; columns?: number; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border/50 overflow-hidden", className)}>
      {/* Header */}
      <div className="flex gap-4 p-4 bg-muted/30 border-b border-border/50">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4 border-b border-border/30 last:border-b-0">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Dashboard stats skeleton
function SkeletonStats({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border/50 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

// Form skeleton
function SkeletonForm({ fields = 4, className }: { fields?: number; className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
      <Skeleton className="h-11 w-full rounded-full mt-4" />
    </div>
  );
}

// Page skeleton wrapper with fade animation
function SkeletonPage({ 
  children, 
  isLoading,
  className 
}: { 
  children: React.ReactNode;
  isLoading: boolean;
  className?: string;
}) {
  if (!isLoading) return <>{children}</>;
  
  return (
    <div className={cn("animate-fade-in", className)}>
      {children}
    </div>
  );
}

export { 
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonHero,
  SkeletonGrid,
  SkeletonTable,
  SkeletonStats,
  SkeletonForm,
  SkeletonPage,
};
