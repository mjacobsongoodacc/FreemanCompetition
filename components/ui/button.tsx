import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex min-h-touch min-w-touch items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[transform,filter,background-color,color] duration-150",
    "focus-visible:shepherd-focus active:shepherd-active disabled:shepherd-disabled",
    "md:min-h-0 md:min-w-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-amber text-white md:shepherd-filled-hover [@media(hover:hover)]:hover:bg-amber-deep",
        outline:
          "border border-amber bg-transparent text-amber md:shepherd-ghost-hover [@media(hover:hover)]:hover:bg-[color-mix(in_oklab,var(--amber)_8%,transparent)]",
        ghost:
          "bg-transparent md:shepherd-ghost-hover [@media(hover:hover)]:hover:bg-[color-mix(in_oklab,var(--amber)_8%,transparent)]",
      },
      size: {
        default: "h-11 px-4 py-2 md:h-9",
        sm: "h-11 rounded-md px-3 text-xs md:h-8",
        lg: "h-12 rounded-md px-8 md:h-10",
        icon: "h-11 w-11 md:h-9 md:w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
