"use client";

import Image from "next/image";
import { useState } from "react";

interface NewsImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

/**
 * Optimized news image component using next/image
 * Handles external images with proper fallback
 */
export function NewsImage({ src, alt, className = "", priority = false }: NewsImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">تصویر در دسترس نیست</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={`object-cover ${className}`}
      priority={priority}
      onError={() => setHasError(true)}
    />
  );
}

