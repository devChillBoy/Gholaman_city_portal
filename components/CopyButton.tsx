"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

/**
 * A button that copies text to clipboard with visual feedback
 */
export function CopyButton({
  text,
  className,
  variant = "outline",
  size = "sm",
  showLabel = true,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        console.error("Failed to copy text");
      }

      document.body.removeChild(textarea);
    }
  }, [text]);

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn(
        "transition-all duration-200",
        copied && "bg-green-100 text-green-700 border-green-300",
        className
      )}
      aria-label={copied ? "کپی شد" : "کپی کردن"}
    >
      {copied ? (
        <>
          <Check className={cn("h-4 w-4", showLabel && "ml-2")} />
          {showLabel && "کپی شد!"}
        </>
      ) : (
        <>
          <Copy className={cn("h-4 w-4", showLabel && "ml-2")} />
          {showLabel && "کپی"}
        </>
      )}
    </Button>
  );
}

