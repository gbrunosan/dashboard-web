import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormSelectProps {
  name: string;
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export function FormSelect({
  name,
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
  disabled,
}: FormSelectProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Select value={String(value || "")} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id={name}>
          <SelectValue placeholder={placeholder || `Selecione ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
