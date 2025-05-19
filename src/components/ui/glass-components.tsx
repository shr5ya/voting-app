import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Glassmorphism Container
const glassContainerVariants = cva(
  "relative overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white/30 dark:bg-card/20 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/5 shadow-glass dark:shadow-glass-dark",
        flat: "bg-white/20 dark:bg-card/10 backdrop-blur-md rounded-xl border border-white/10 dark:border-white/5 shadow-glass-sm dark:shadow-glass-dark-sm",
        panel: "bg-white/40 dark:bg-card/30 backdrop-blur-md rounded-xl border border-white/30 dark:border-white/10 shadow-glass dark:shadow-glass-dark",
        sidebar: "bg-white/50 dark:bg-card/40 backdrop-blur-md rounded-xl border border-white/30 dark:border-white/10 shadow-glass dark:shadow-glass-dark",
        reflection: "bg-white/30 dark:bg-card/20 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/5 shadow-glass dark:shadow-glass-dark after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/20 after:to-transparent after:backdrop-blur-sm after:rounded-xl after:opacity-50 after:-z-10 after:translate-y-[0.5rem]",
        active: "bg-gradient-to-b from-primary/10 to-blue-400/5 backdrop-blur-md rounded-xl border border-primary/20 dark:border-primary/10 shadow-glass dark:shadow-glass-dark",
      },
      intensity: {
        light: "backdrop-blur-sm",
        medium: "backdrop-blur-md",
        heavy: "backdrop-blur-lg",
        xheavy: "backdrop-blur-xl",
      },
      animation: {
        none: "",
        fadeIn: "animate-fade-in",
        slideUp: "animate-slide-in-up",
        slideDown: "animate-slide-in-down",
        slideLeft: "animate-slide-in-left",
        slideRight: "animate-slide-in-right",
        float: "animate-float",
        pulse: "animate-pulse-soft",
      },
      border: {
        none: "border-0",
        thin: "border border-white/20 dark:border-white/5",
        medium: "border-2 border-white/30 dark:border-white/10",
        accent: "border border-primary/30 dark:border-primary/20",
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-glass-sm dark:shadow-glass-dark-sm",
        md: "shadow-glass dark:shadow-glass-dark",
        lg: "shadow-glass-hover dark:shadow-glass-dark-hover",
        inner: "shadow-inner-glass dark:shadow-inner-glass-dark",
      }
    },
    defaultVariants: {
      variant: "default",
      intensity: "medium",
      animation: "none",
      border: "thin",
      shadow: "md",
    },
  }
);

export interface GlassContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassContainerVariants> {
  innerClassName?: string;
}

export const GlassContainer = React.forwardRef<
  HTMLDivElement,
  GlassContainerProps
>(({ 
  className, 
  variant, 
  intensity, 
  animation, 
  border,
  shadow,
  children, 
  innerClassName,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        glassContainerVariants({
          variant,
          intensity,
          animation,
          border,
          shadow,
          className,
        })
      )}
      {...props}
    >
      <div className={cn("relative z-10", innerClassName)}>
        {children}
      </div>
    </div>
  );
});
GlassContainer.displayName = "GlassContainer";

// Glassmorphism Badge
const glassBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white/50 dark:bg-white/10 backdrop-blur-sm text-foreground",
        primary: "bg-primary/80 backdrop-blur-sm text-white",
        secondary: "bg-secondary/80 backdrop-blur-sm text-secondary-foreground",
        outline: "border border-white/30 dark:border-white/10 text-foreground",
        success: "bg-green-500/80 backdrop-blur-sm text-white",
        warning: "bg-yellow-500/80 backdrop-blur-sm text-white",
        danger: "bg-red-500/80 backdrop-blur-sm text-white",
        info: "bg-blue-500/80 backdrop-blur-sm text-white",
      },
      animation: {
        none: "",
        pulse: "animate-pulse-soft",
        float: "animate-float",
      },
    },
    defaultVariants: {
      variant: "default",
      animation: "none",
    },
  }
);

export interface GlassBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassBadgeVariants> {}

export const GlassBadge = React.forwardRef<HTMLDivElement, GlassBadgeProps>(
  ({ className, variant, animation, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(glassBadgeVariants({ variant, animation, className }))}
      {...props}
    />
  )
);
GlassBadge.displayName = "GlassBadge";

// Glassmorphism Divider
export interface GlassDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  thickness?: "thin" | "medium" | "thick";
}

export const GlassDivider = React.forwardRef<HTMLDivElement, GlassDividerProps>(
  ({ 
    className, 
    orientation = "horizontal", 
    thickness = "thin",
    ...props 
  }, ref) => {
    const thicknessClasses = {
      thin: "border-[0.5px]",
      medium: "border-[1px]",
      thick: "border-[2px]",
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          "bg-gradient-to-r from-white/0 via-white/30 to-white/0 dark:from-white/0 dark:via-white/10 dark:to-white/0",
          orientation === "horizontal" 
            ? "w-full h-0" 
            : "h-full w-0",
          thicknessClasses[thickness],
          className
        )}
        {...props}
      />
    );
  }
);
GlassDivider.displayName = "GlassDivider";

// Animated Text component with glassmorphism effects
export interface AnimatedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  variant?: "gradient" | "glow" | "shimmer" | "normal";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold";
}

export const AnimatedText = React.forwardRef<HTMLDivElement, AnimatedTextProps>(
  ({ 
    className, 
    text,
    variant = "normal",
    size = "md",
    weight = "normal",
    ...props 
  }, ref) => {
    const sizeClasses = {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
    };
    
    const weightClasses = {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    };
    
    const variantClasses = {
      normal: "text-foreground",
      gradient: "bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent animate-pulse-soft",
      glow: "text-primary relative after:absolute after:inset-0 after:bg-primary/20 after:blur-sm after:opacity-75 after:-z-10",
      shimmer: "relative text-foreground overflow-hidden before:absolute before:inset-0 before:w-full before:bg-shimmer before:bg-[length:200%_100%] before:animate-shimmer",
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          "inline-block transition-all duration-300",
          sizeClasses[size],
          weightClasses[weight],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {text}
      </div>
    );
  }
);
AnimatedText.displayName = "AnimatedText"; 