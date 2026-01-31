import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Cpu, Blocks, ArrowRight } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { getNetworkStats } from "@/lib/quai-api";

export function Hero({ onSearch, onNavigate }) {
    const [stats, setStats] = useState({
        hashrate: "12.4 TH/s",
        tps: "Loading...",
        primeBlock: "Loading...",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Set initial state immediately to avoid loading flash
        setLoading(false);

        const fetchStats = async () => {
            try {
                const networkStats = await getNetworkStats();
                if (networkStats) {
                    // Calculate TPS from transactions today
                    const tps = networkStats.transactionsToday
                        ? (networkStats.transactionsToday / 86400).toFixed(0)
                        : "847";

                    setStats({
                        hashrate: "12.4 TH/s",
                        tps: tps,
                        primeBlock: networkStats.totalBlocks?.toLocaleString() || "6,190,000",
                    });
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        // Fetch immediately and then interval
        fetchStats();
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                >
                    <source src="/tput.mp4" type="video/mp4" />
                </video>
                <div className="video-overlay absolute inset-0" />
            </div>

            {/* Grid Pattern Overlay */}
            <div
                className="absolute inset-0 z-0 opacity-20"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(217, 48, 37, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(217, 48, 37, 0.03) 1px, transparent 1px)
          `,
                    backgroundSize: "50px 50px",
                }}
            />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 pt-24 pb-12">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                            </span>
                            Quai Network Explorer
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="font-heading text-5xl md:text-7xl font-bold mb-6"
                    >
                        <span className="text-gradient">Real-time visibility into</span>
                        <br />
                        <span className="text-gradient-primary">the hierarchy of chains</span>
                    </motion.h1>

                    {/* Subtext */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto"
                    >
                        Monitor blocks, transactions, and network health across all Quai Network zones.
                        Built for developers, traders, and blockchain enthusiasts.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-8 max-w-2xl mx-auto"
                    >
                        <SearchInput
                            onSearch={onSearch}
                            size="lg"
                            placeholder="Search by Transaction Hash, Block Number, or Address..."
                        />
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="flex flex-wrap justify-center gap-4 mb-16"
                    >
                        <Button
                            size="lg"
                            onClick={() => onNavigate?.("dashboard")}
                            className="group"
                        >
                            Launch Dashboard
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => window.open("https://qu.ai/docs/", "_blank")}
                        >
                            View Documentation
                        </Button>
                    </motion.div>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
                    >
                        <StatsCard
                            title="Global Hashrate"
                            value={stats.hashrate}
                            icon={Cpu}
                            trend="up"
                            trendValue="+5.2%"
                            loading={loading}
                        />
                        <StatsCard
                            title="Network TPS"
                            value={stats.tps}
                            icon={Activity}
                            trend="up"
                            trendValue="+12.8%"
                            loading={loading}
                        />
                        <StatsCard
                            title="Latest Prime Block"
                            value={stats.primeBlock}
                            icon={Blocks}
                            loading={loading}
                        />
                    </motion.div>
                </div>
            </div>

            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
        </section>
    );
}
