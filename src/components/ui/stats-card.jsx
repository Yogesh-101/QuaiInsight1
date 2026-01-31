import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatsCard({
    title,
    value,
    icon: Icon,
    trend = "neutral",
    trendValue,
    loading = false,
    className
}) {
    const trendConfig = {
        up: { icon: TrendingUp, color: "text-green-400", bg: "bg-green-400/10" },
        down: { icon: TrendingDown, color: "text-red-400", bg: "bg-red-400/10" },
        neutral: { icon: Minus, color: "text-white/40", bg: "bg-white/5" },
    };

    const TrendIcon = trendConfig[trend]?.icon || Minus;

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "glass-panel p-5 relative overflow-hidden group",
                "hover:border-white/10 transition-all duration-300",
                className
            )}
        >
            {/* Glow effect on hover */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
                        {title}
                    </span>
                    {Icon && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-4 w-4 text-primary" />
                        </div>
                    )}
                </div>

                {/* Value */}
                {loading ? (
                    <div className="h-9 w-32 rounded shimmer" />
                ) : (
                    <p className="font-mono text-3xl font-bold text-white tracking-tight">
                        {value}
                    </p>
                )}

                {/* Trend */}
                {trendValue && (
                    <div className={cn(
                        "mt-3 inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                        trendConfig[trend]?.bg,
                        trendConfig[trend]?.color
                    )}>
                        <TrendIcon className="h-3 w-3" />
                        {trendValue}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
