import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold tracking-wide transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-[var(--color-ink-2)]",
        accent:
          "bg-[var(--color-accent)] text-[var(--color-paper)] hover:opacity-90",
        destructive:
          "bg-[var(--color-accent)] text-[var(--color-paper)] hover:opacity-90",
        outline:
          "border border-[var(--color-rule)] bg-transparent text-[var(--color-ink)] hover:border-[var(--color-ink)]",
        secondary:
          "bg-[var(--color-paper-2)] text-[var(--color-ink)] hover:opacity-80",
        ghost:
          "text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]",
        link:
          "text-[var(--color-ink)] underline underline-offset-4 hover:text-[var(--color-accent)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
