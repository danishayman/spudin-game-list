import { cn } from "@/lib/utils"
import * as React from "react"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-800", className)}
      {...props}
    />
  )
} 