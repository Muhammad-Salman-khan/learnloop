"use client";

// Small client-only island for the schedule page. The timetable itself
// stays a Server Component; only the Print button needs the browser
// `window.print()` handle.
import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

type StaffPrintButtonProps = {
  readonly label?: string;
};

export function StaffPrintButton({ label = "Print" }: StaffPrintButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        if (typeof window !== "undefined") window.print();
      }}
    >
      <Printer className="mr-1.5 size-3.5" />
      {label}
    </Button>
  );
}

export default StaffPrintButton;
