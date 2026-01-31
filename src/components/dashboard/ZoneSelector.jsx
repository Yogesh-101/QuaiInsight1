import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QUAI_ZONES } from "@/lib/quai-api";
import { cn } from "@/lib/utils";

export function ZoneSelector({ selectedZone, onZoneChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const currentZone = QUAI_ZONES.find(z => z.id === selectedZone) || QUAI_ZONES[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                    isOpen
                        ? "border-primary/50 bg-primary/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                )}
            >
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium text-white">{currentZone.name}</span>
                <ChevronDown className={cn(
                    "h-4 w-4 text-white/60 transition-transform",
                    isOpen && "rotate-180"
                )} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-white/10 bg-[#0a0a0a] shadow-xl overflow-hidden"
                        >
                            <div className="p-2">
                                <p className="px-2 py-1 text-xs font-medium text-white/40 uppercase tracking-wider">
                                    Select Zone
                                </p>
                            </div>

                            <div className="max-h-64 overflow-y-auto">
                                {["Cyprus", "Paxos", "Hydra"].map((region) => (
                                    <div key={region}>
                                        <div className="px-4 py-2 text-xs font-semibold text-primary/80 bg-primary/5">
                                            {region} Region
                                        </div>
                                        {QUAI_ZONES.filter(z => z.region === region).map((zone) => (
                                            <button
                                                key={zone.id}
                                                onClick={() => {
                                                    onZoneChange(zone.id);
                                                    setIsOpen(false);
                                                }}
                                                className={cn(
                                                    "flex items-center justify-between w-full px-4 py-2 text-sm transition-colors",
                                                    selectedZone === zone.id
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-white/70 hover:bg-white/5 hover:text-white"
                                                )}
                                            >
                                                <span>{zone.name}</span>
                                                {selectedZone === zone.id && (
                                                    <Check className="h-4 w-4" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
