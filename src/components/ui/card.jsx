import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
    return (
        <div
            className={cn(
                "glass-panel p-6",
                className
            )}
            {...props}
        />
    );
}

export function CardHeader({ className, ...props }) {
    return (
        <div
            className={cn("flex flex-col space-y-1.5", className)}
            {...props}
        />
    );
}

export function CardTitle({ className, ...props }) {
    return (
        <h3
            className={cn(
                "font-heading text-lg font-semibold leading-none tracking-tight text-white",
                className
            )}
            {...props}
        />
    );
}

export function CardDescription({ className, ...props }) {
    return (
        <p
            className={cn("text-sm text-white/60", className)}
            {...props}
        />
    );
}

export function CardContent({ className, ...props }) {
    return (
        <div className={cn("pt-4", className)} {...props} />
    );
}

export function CardFooter({ className, ...props }) {
    return (
        <div
            className={cn("flex items-center pt-4", className)}
            {...props}
        />
    );
}
