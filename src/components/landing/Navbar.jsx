import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LiveBadge, ZoneBadge } from "@/components/ui/badge";
import { QUAI_ZONES } from "@/lib/quai-api";

const zones = [
    { id: "prime", name: "Prime", color: "success" },
    ...QUAI_ZONES.slice(0, 3).map(z => ({ ...z, color: "primary" })),
    ...QUAI_ZONES.slice(3, 6).map(z => ({ ...z, color: "secondary" })),
    ...QUAI_ZONES.slice(6, 9).map(z => ({ ...z, color: "warning" })),
];

export function Navbar({ selectedZone, onZoneChange, onNavigate }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl"
        >
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Left - Logo */}
                    <div className="flex items-center gap-4">
                        <button onClick={() => onNavigate?.("landing")} className="flex items-center gap-3">
                            {/* Logo Icon */}
                            <div className="h-9 w-9 rounded-lg overflow-hidden">
                                <img src="/quai-logo.png" alt="Quai" className="h-full w-full object-cover" />
                            </div>
                            <span className="font-heading text-xl font-bold text-white">QuaiInsight</span>
                        </button>

                        <LiveBadge className="hidden sm:flex" />
                    </div>

                    {/* Center - Zone Selector */}
                    <div className="hidden md:flex items-center">
                        <div className="relative">
                            <button
                                onClick={() => setZoneDropdownOpen(!zoneDropdownOpen)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg",
                                    "border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                                )}
                            >
                                <ZoneBadge zone={selectedZone || "Cyprus-1"} />
                                <ChevronDown className={cn(
                                    "h-4 w-4 text-white/60 transition-transform",
                                    zoneDropdownOpen && "rotate-180"
                                )} />
                            </button>

                            {/* Dropdown */}
                            {zoneDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 glass-panel-strong p-2"
                                >
                                    <div className="grid grid-cols-3 gap-1">
                                        {zones.map((zone) => (
                                            <button
                                                key={zone.id}
                                                onClick={() => {
                                                    onZoneChange?.(zone.id);
                                                    setZoneDropdownOpen(false);
                                                }}
                                                className={cn(
                                                    "px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                                                    selectedZone === zone.id
                                                        ? "bg-primary/20 text-primary"
                                                        : "text-white/60 hover:bg-white/10 hover:text-white"
                                                )}
                                            >
                                                {zone.name}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Right - Actions */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open("https://github.com/dominant-strategies", "_blank")}
                            className="hidden sm:flex"
                        >
                            <Github className="h-5 w-5" />
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => onNavigate?.("dashboard")}
                            className="hidden sm:flex"
                        >
                            Open Dashboard
                        </Button>

                        {/* Mobile menu */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="md:hidden border-t border-white/5 bg-background/95"
                >
                    <div className="container mx-auto px-4 py-4 space-y-4">
                        <Button variant="outline" className="w-full" onClick={() => onNavigate?.("dashboard")}>
                            Open Dashboard
                        </Button>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}
