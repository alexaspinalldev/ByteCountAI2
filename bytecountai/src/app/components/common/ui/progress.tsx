"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

// Define the ProgressProps type
type ProgressProps = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  value?: number; // Optional value prop for progress percentage
};

function Progress({ className, value, children, ...props }: ProgressProps & { children?: React.ReactNode }) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-full min-h-5 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <div className="absolute w-full h-full top-0 left-0 z-5 flex justify-center items-center text-sm">{children}</div>
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }