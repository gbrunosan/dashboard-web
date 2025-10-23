import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { LucideIcon } from "lucide-react";
import { Button } from "./ui/Button";

interface InputIconProps extends React.ComponentProps<"input"> {
  label: string;
  labelClassName?: string;
  icon?: LucideIcon; // Ícone decorativo (esquerda ou direita)
  iconPosition?: "left" | "right";
  actionIcon?: LucideIcon; // Ícone clicável (sempre à direita)
  onActionClick?: () => void;
}

export const InputIcon = React.forwardRef<HTMLInputElement, InputIconProps>(
  (
    {
      label,
      labelClassName,
      id,
      icon: Icon,
      iconPosition = "right",
      actionIcon: ActionIcon,
      onActionClick,
      ...props
    },
    ref
  ) => {
    // Se tem actionIcon, o icon vai pra esquerda automaticamente
    const hasActionIcon = !!ActionIcon;
    const finalIconPosition = hasActionIcon && Icon ? "left" : iconPosition;

    return (
      <div className="space-y-1">
        <Label htmlFor={id} className={cn("text-sm font-medium text-foreground", labelClassName)}>
          {label}
        </Label>
        <div className="relative">
          {/* Ícone decorativo à esquerda */}
          {Icon && finalIconPosition === "left" && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Icon className="h-4 w-4" />
            </div>
          )}

          <Input
            id={id}
            ref={ref}
            className={cn(
              "py-[18px]",
              Icon && finalIconPosition === "left" && "pl-9",
              Icon && finalIconPosition === "right" && !hasActionIcon && "pr-9",
              hasActionIcon && "pr-9"
            )}
            {...props}
          />

          {/* Ícone decorativo à direita (só se não tiver actionIcon) */}
          {Icon && finalIconPosition === "right" && !hasActionIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Icon className="h-4 w-4" />
            </div>
          )}

          {/* Ícone de ação clicável (sempre à direita) */}
          {ActionIcon && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 h-full px-3 hover:bg-transparent"
              onClick={onActionClick}
              tabIndex={-1} // Não interfere no tab do formulário
            >
              <ActionIcon className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            </Button>
          )}
        </div>
      </div>
    );
  }
);

InputIcon.displayName = "InputIcon";
