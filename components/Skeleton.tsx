'use client';

import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white/5 shadow-inner", className)}
      {...props}
    />
  );
}

export function DoctorSkeleton() {
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-md h-full space-y-6">
      <div className="flex items-center gap-4 mb-5">
        <Skeleton className="w-14 h-14 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      <div className="flex items-center justify-between pb-6 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>

      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}

export { Skeleton };
