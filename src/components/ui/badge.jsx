import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                default: "bg-white/10 text-white",
                primary: "bg-primary/10 text-primary border border-primary/20",
                secondary: "bg-secondary/10 text-secondary border border-secondary/20",
                warning: "bg-accent/10 text-accent border border-accent/20",
                success: "bg-green-500/10 text-green-400 border border-green-500/20",
                destructive: "bg-red-500/10 text-red-400 border border-red-500/20",
                outline: "border border-white/20 text-white/70",
                live: "bg-green-500/20 text-green-400 border border-green-500/30",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export function Badge({ className, variant, children, ...props }) {
    return (
        <span className={cn(badgeVariants({ variant }), className)} {...props}>
            {children}
        </span>
    );
}

export function LiveBadge({ className, ...props }) {
    return (
        <Badge variant="live" className={cn("", className)} {...props}>
            <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            Live
        </Badge>
    );
}

export function ZoneBadge({ zone, className, ...props }) {
    const zoneColors = {
        "cyprus": "primary",
        "paxos": "secondary",
        "hydra": "warning",
        "prime": "success",
    };

    const region = zone?.split("-")[0]?.toLowerCase() || "cyprus";
    const variant = zoneColors[region] || "default";

    return (
        <Badge variant={variant} className={className} {...props}>
            {zone}
        </Badge>
    );
}

export { badgeVariants };
