// components/ui/lottie-icon.tsx
"use client";

import Lottie, { LottieComponentProps } from "lottie-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LottieIconProps {
  src: string; // Ruta en /public
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export function LottieIcon({ 
  src, 
  className,
  loop = true,
  autoplay = true 
}: LottieIconProps) {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch(src)
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(console.error);
  }, [src]);

  if (!animationData) {
    return <div className={cn("animate-pulse bg-gray-200 rounded", className)} />;
  }

  return (
    <Lottie 
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      className={className}
    />
  );
}