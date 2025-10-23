"use client";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface Props {
  checked: boolean;
  onToggle: (next: boolean) => Promise<void>;
}

export default function StatusSwitch({ checked, onToggle }: Props) {
  const [loading, setLoading] = useState(false);

  return (
    <Switch
      checked={checked}
      onCheckedChange={async (val) => {
        setLoading(true);
        try {
          await onToggle(val);
        } finally {
          setLoading(false);
        }
      }}
      disabled={loading}
    />
  );
}
