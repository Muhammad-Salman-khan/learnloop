"use client";

// Filter UI used in toolbar rows. Match the existing Select-on-page
// pattern but doesn't render a <table> — the parent owns the layout.

import type { ReactNode } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = { readonly value: string; readonly label: string };

type ToolbarSelectProps = {
  readonly value: string;
  readonly onValueChange: (v: string) => void;
  readonly options: ReadonlyArray<Option>;
  readonly placeholder?: string;
  readonly width?: string;
};

export function SuperadminToolbarSelect({
  value,
  onValueChange,
  options,
  placeholder,
  width = "w-40",
}: ToolbarSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={`h-9 ${width}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function SuperadminToolbarGroup({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">{children}</div>
  );
}
