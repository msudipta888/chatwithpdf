"use client";
import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "neon";
  size?: "sm" | "default" | "lg";
  children: React.ReactNode;
}

const RetroButton = React.forwardRef<HTMLButtonElement, RetroButtonProps>(
  ({ className, variant = "primary", size = "default", children, ...props }, ref) => {
    const variantClasses = {
      primary: "from-retro-purple to-retro-darkPurple text-white",
      secondary: "from-retro-sepia to-retro-orange text-black",
      destructive: "from-red-500 to-orange-500 text-white",
      neon: "from-retro-neon to-teal-500 text-black",
    };
    
    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs",
      default: "px-6 py-3",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <Button 
        ref={ref}
        className={cn(
          "retro-button bg-popover-to-r",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

RetroButton.displayName = "RetroButton";

export default RetroButton;