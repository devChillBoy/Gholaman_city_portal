"use client";

import { CopyButton } from "@/components/CopyButton";

interface TrackingCodeDisplayProps {
  code: string;
}

/**
 * Client component for displaying tracking code with copy functionality
 * Used in server components where we need copy-to-clipboard behavior
 */
export function TrackingCodeDisplay({ code }: TrackingCodeDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono font-semibold">{code}</span>
      <CopyButton text={code} showLabel={false} size="icon" variant="ghost" />
    </div>
  );
}

