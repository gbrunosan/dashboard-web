import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

interface InputWithLabelProps extends React.ComponentProps<"input"> {
  label: string
  labelClassName?: string
}

export const InputWithLabel = React.forwardRef<HTMLInputElement, InputWithLabelProps>(
  ({ label, labelClassName, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <Label 
          htmlFor={id} 
          className={cn("text-sm font-medium text-foreground", labelClassName)}
        >
          {label}
        </Label>
        <Input
          id={id}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)

InputWithLabel.displayName = "InputWithLabel"
