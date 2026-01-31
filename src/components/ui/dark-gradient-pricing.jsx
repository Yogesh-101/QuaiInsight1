import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function PricingCard({ tier, price, features, recommended, ctaText = "Get Started" }) {
    return (
        <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn(
                "relative flex flex-col rounded-2xl border p-6 shadow-xl backdrop-blur-xl transition-all hover:scale-[1.02]",
                recommended
                    ? "border-primary/50 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent z-10"
                    : "border-white/10 bg-gradient-to-br from-white/5 to-transparent opacity-80 hover:opacity-100"
            )}
        >
            {recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-wider text-xs bg-primary text-white py-1 px-3 rounded-full shadow-lg shadow-primary/40">
                    Most Popular
                </div>
            )}

            <div className="mb-6">
                <h3 className="text-xl font-semibold text-white/90">{tier}</h3>
                <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold text-white">{price}</span>
                    {price !== "Contact us" && <span className="ml-1 text-sm text-white/50">/mo</span>}
                </div>
            </div>

            <ul className="mb-6 flex-1 space-y-4">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                        {feature.included ? (
                            <Check className="h-5 w-5 shrink-0 text-primary" />
                        ) : (
                            <X className="h-5 w-5 shrink-0 text-white/20" />
                        )}
                        <span className={feature.included ? "" : "text-white/30"}>{feature.name}</span>
                    </li>
                ))}
            </ul>

            <Button
                variant={recommended ? "default" : "outline"}
                className={cn("w-full", recommended && "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90")}
            >
                {ctaText}
            </Button>
        </motion.div>
    );
}
