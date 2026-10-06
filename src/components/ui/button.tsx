import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-[transform,box-shadow,background-color,color,border-color] duration-200 hover:-translate-y-0.5 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary-action text-primary-action-foreground shadow-[0_6px_24px_color-mix(in_srgb,var(--primary-action)_22%,transparent)] hover:brightness-105 hover:shadow-[0_10px_30px_color-mix(in_srgb,var(--primary-action)_28%,transparent)]",
        secondary: "bg-background-raised text-foreground border border-border-strong hover:border-primary",
        ghost: "text-foreground hover:text-foreground hover:bg-surface-hover",
        outline: "border border-border-strong text-foreground hover:border-primary hover:text-primary",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  }
);
Button.displayName = "Button";
