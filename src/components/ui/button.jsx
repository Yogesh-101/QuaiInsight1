import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg shadow-secondary/20",
                outline: "border border-white/10 bg-transparent hover:bg-white/5 hover:border-white/20",
                ghost: "hover:bg-white/5",
                neon: "bg-primary/10 border border-primary/50 text-primary hover:bg-primary/20 hover:border-primary neon-glow",
                "neon-secondary": "bg-secondary/10 border border-secondary/50 text-secondary hover:bg-secondary/20 hover:border-secondary neon-glow-secondary",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-8 px-3 text-xs",
                lg: "h-12 px-6 text-base",
                xl: "h-14 px-8 text-lg",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export function Button({ className, variant, size, ...props }) {
    return (
        <button
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { buttonVariants };
