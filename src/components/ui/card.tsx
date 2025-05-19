import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-xl border shadow-sm transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        glass: "glass-card",
        "glass-flat": "glass-card-flat",
        panel: "glass-panel",
        reflection: "glass-card glass-reflection",
        active: "electra-card-active",
        bordered: "border-2 border-primary/20 bg-card text-card-foreground hover:border-primary/50",
        electra: "electra-card",
      },
      hover: {
        none: "",
        lift: "hover:-translate-y-1 hover:shadow-md",
        scale: "hover:scale-[1.02]",
        glow: "hover:shadow-[0_0_15px_rgba(var(--primary)/0.3)]",
      },
      animation: {
        none: "",
        fadeIn: "animate-fade-in",
        slideUp: "animate-slide-in-up",
        float: "animate-float",
      }
    },
    defaultVariants: {
      variant: "default",
      hover: "none",
      animation: "none",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
}

const Card = React.forwardRef<
  HTMLDivElement,
  CardProps
>(({ className, variant, hover, animation, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant, hover, animation, className }))}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Card Image component for consistent card imagery
const CardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { src?: string; alt?: string; fallback?: React.ReactNode }
>(({ className, src, alt = "Card image", fallback, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "w-full relative overflow-hidden rounded-t-xl h-48 bg-muted/50",
      className
    )}
    {...props}
  >
    {src ? (
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
      />
    ) : fallback ? (
      <div className="flex items-center justify-center w-full h-full">
        {fallback}
      </div>
    ) : (
      <div className="flex items-center justify-center w-full h-full bg-gradient-glass dark:bg-gradient-glass-dark">
        <span className="text-muted-foreground">No image</span>
      </div>
    )}
  </div>
))
CardImage.displayName = "CardImage"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardImage 
}
