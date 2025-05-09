import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> { }

const Input = ({ className, ref, ...props }: InputProps) => {
  return (
    <input
      className={
        cn(
          "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )
      }
      {...props}
      ref={ref as React.Ref<HTMLInputElement>} // My added prop
    />
  )
}

export { Input }