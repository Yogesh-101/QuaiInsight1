import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function MetricCard({ title, value, change, icon: Icon, trend, loading }) {
    const isPositive = trend === "up";
    const isNegative = trend === "down";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl",
                "hover:border-primary/30 transition-all duration-300"
            )}
        >
            {/* Glow effect */}
            <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-primary/20 blur-3xl" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black font-heading text-white/40 uppercase tracking-widest">{title}</span>
                    {Icon && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-transform hover:rotate-12">
                            <Icon className="h-5 w-5 text-primary" />
                        </div>
                    )}
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        {loading ? (
                            <div className="h-8 w-32 animate-pulse rounded bg-white/10" />
                        ) : (
                            <p className="text-3xl font-black text-white font-mono tracking-tighter">{value}</p>
                        )}
                    </div>

                    {change && (
                        <div className={cn(
                            "flex items-center gap-1 text-sm font-medium",
                            isPositive && "text-green-400",
                            isNegative && "text-red-400",
                            !isPositive && !isNegative && "text-white/60"
                        )}>
                            {isPositive && "↑"}
                            {isNegative && "↓"}
                            {change}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
