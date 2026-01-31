import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Blocks, Clock, ArrowUpRight, Copy, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, ZoneBadge, LiveBadge } from "@/components/ui/badge";
import { truncateHash, getRecentBlocksFromQuaiScan, getNetworkStats } from "@/lib/quai-api";
import { cn } from "@/lib/utils";
import { generateMockBlocks } from "@/lib/mock-data";

const timeAgo = (timestamp) => {
    if (!timestamp) return "just now";
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (isNaN(seconds) || seconds < 0) return "just now";
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
};

// Zone rotation for display
const zones = ["Cyprus-1", "Paxos-1", "Hydra-1", "Cyprus-2", "Paxos-2", "Hydra-2", "Cyprus-3", "Paxos-3"];

export function RecentBlocks() {
    const [blocks, setBlocks] = useState([]);
    const [copiedHash, setCopiedHash] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        // Initial fast data to avoid empty state
        setBlocks(generateMockBlocks(8));
        setLoading(false);

        // Fetch real data from QuaiScan REST API
        const fetchBlocks = async () => {
            try {
                // Use QuaiScan REST API for accurate data
                const [quaiscanBlocks, networkStats] = await Promise.all([
                    getRecentBlocksFromQuaiScan(8),
                    getNetworkStats()
                ]);

                if (networkStats) {
                    setStats(networkStats);
                }

                if (quaiscanBlocks && quaiscanBlocks.length > 0) {
                    const formattedBlocks = quaiscanBlocks.map((block, idx) => ({
                        number: block.number || 0,
                        zone: zones[idx % zones.length],
                        hash: block.hash || `0x${idx}`,
                        txCount: block.txCount || 0,
                        timestamp: block.timestamp,
                        gasUsed: block.gasUsed,
                        isNew: idx === 0,
                    }));
                    setBlocks(formattedBlocks);
                }
            } catch (error) {
                console.error("Error fetching blocks:", error);
            }
        };

        // Fetch immediately and then interval
        fetchBlocks();
        const interval = setInterval(fetchBlocks, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleCopy = async (hash) => {
        await navigator.clipboard.writeText(hash);
        setCopiedHash(hash);
        setTimeout(() => setCopiedHash(null), 2000);
    };

    return (
        <section className="relative py-20">
            {/* Glow Effect Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Badge variant="outline">Real-Time</Badge>
                        <LiveBadge />
                    </div>
                    <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                        Live Block Feed
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        Watch new blocks being added to the Quai Network in real-time.
                        {stats && (
                            <span className="block mt-2 text-secondary">
                                Total Blocks: {stats.totalBlocks?.toLocaleString()} |
                                Transactions Today: {stats.transactionsToday?.toLocaleString()}
                            </span>
                        )}
                    </p>
                </motion.div>

                {/* Blocks Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <Card className="overflow-hidden neon-glow">
                        <CardHeader className="border-b border-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-primary">
                                        <img src="/quai-logo.png" alt="Quai" className="h-full w-full object-cover" />
                                    </div>
                                    <CardTitle>Recent Blocks</CardTitle>
                                </div>
                                <span className="text-xs text-white/40">Auto-refreshes</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-[10px] font-black font-heading text-white/40 uppercase tracking-[0.2em]">
                                <div className="col-span-2">Height</div>
                                <div className="col-span-2">Zone</div>
                                <div className="col-span-4">Hash</div>
                                <div className="col-span-2">Txs</div>
                                <div className="col-span-2 text-right">Time</div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-white/5">
                                <AnimatePresence mode="popLayout">
                                    {blocks.map((block, idx) => (
                                        <motion.div
                                            key={`${block.hash}-${idx}`}
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className={cn(
                                                "grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors group",
                                                block.isNew && "bg-primary/5"
                                            )}
                                        >
                                            {/* Height */}
                                            <div className="col-span-2">
                                                <span className="font-mono text-secondary font-medium">
                                                    #{(block.number || 0).toLocaleString()}
                                                </span>
                                            </div>

                                            {/* Zone */}
                                            <div className="col-span-2">
                                                <ZoneBadge zone={block.zone} />
                                            </div>

                                            {/* Hash */}
                                            <div className="col-span-4 flex items-center gap-2">
                                                <span className="font-mono text-sm text-white/70">
                                                    {truncateHash(block.hash, 8)}
                                                </span>
                                                <button
                                                    onClick={() => handleCopy(block.hash)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                                                >
                                                    {copiedHash === block.hash ? (
                                                        <Check className="h-3 w-3 text-green-400" />
                                                    ) : (
                                                        <Copy className="h-3 w-3 text-white/40" />
                                                    )}
                                                </button>
                                                <a
                                                    href={`https://quaiscan.io/block/${block.number}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                                                >
                                                    <ArrowUpRight className="h-3 w-3 text-white/40" />
                                                </a>
                                            </div>

                                            {/* Tx Count */}
                                            <div className="col-span-2">
                                                <span className="text-white/70">{block.txCount}</span>
                                            </div>

                                            {/* Time */}
                                            <div className="col-span-2 text-right flex items-center justify-end gap-2">
                                                <Clock className="h-3 w-3 text-white/30" />
                                                <span className="text-sm text-white/50">
                                                    {timeAgo(block.timestamp)}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
