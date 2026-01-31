import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Copy, Check } from "lucide-react";
import { truncateHash, weiToQuai } from "@/lib/quai-api";
import { cn } from "@/lib/utils";

export function DataGrid({ data, type = "blocks", loading }) {
    const [copiedHash, setCopiedHash] = useState(null);

    const copyToClipboard = (hash) => {
        navigator.clipboard.writeText(hash);
        setCopiedHash(hash);
        setTimeout(() => setCopiedHash(null), 2000);
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    };

    if (loading) {
        return (
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
                <div className="p-4 border-b border-white/10">
                    <div className="h-6 w-48 animate-pulse rounded bg-white/10" />
                </div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 border-b border-white/5 flex gap-4">
                        <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
                        <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
                        <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
                    </div>
                ))}
            </div>
        );
    }

    const columns = type === "blocks"
        ? ["Block", "Hash", "Txns", "Gas Used", "Time"]
        : ["Hash", "From", "To", "Value", "Time"];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
        >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-heading font-semibold text-white">
                    {type === "blocks" ? "Recent Blocks" : "Recent Transactions"}
                </h3>
                <span className="text-xs text-white/40">Live</span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/5">
                            {columns.map((col) => (
                                <th key={col} className="px-4 py-3 text-left text-xs font-black font-heading text-white/40 uppercase tracking-widest">
                                    {col}
                                </th>
                            ))}
                            <th className="px-4 py-3 text-right text-xs font-medium text-white/40 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-white/40">
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            data.map((item, idx) => (
                                <motion.tr
                                    key={item.hash || idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={cn(
                                        "border-b border-white/5 hover:bg-white/5 transition-colors",
                                        idx === 0 && "bg-primary/5"
                                    )}
                                >
                                    {type === "blocks" ? (
                                        <>
                                            <td className="px-4 py-3 text-sm font-mono text-primary">
                                                #{item.number?.toLocaleString() || item.block_number?.toLocaleString() || item.blockNumber?.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-mono text-white/70">
                                                {truncateHash(item.hash, 8)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-white">
                                                {item.tx_count || item.txCount || 0}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-white/70">
                                                {(Number(item.gas_used || item.gasUsed || 0) / 1e6).toFixed(2)}M
                                            </td>
                                            <td className="px-4 py-3 text-sm text-white/50">
                                                {formatTimestamp(item.timestamp)}
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-4 py-3 text-sm font-mono text-primary">
                                                {truncateHash(item.hash, 8)}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-mono text-white/70">
                                                {truncateHash(item.from, 6)}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-mono text-white/70">
                                                {truncateHash(item.to, 6)}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-mono text-white">
                                                {weiToQuai(item.value).toFixed(4)} <span className="text-[10px] text-primary/60">QUAI</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-white/50">
                                                {formatTimestamp(item.timestamp)}
                                            </td>
                                        </>
                                    )}
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => copyToClipboard(item.hash)}
                                                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                                            >
                                                {copiedHash === item.hash ? (
                                                    <Check className="h-4 w-4 text-green-400" />
                                                ) : (
                                                    <Copy className="h-4 w-4 text-white/40" />
                                                )}
                                            </button>
                                            <a
                                                href={`https://quaiscan.io/${type === "blocks" ? "block" : "tx"}/${type === "blocks" ? (item.number || item.block_number || item.blockNumber) : item.hash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                                            >
                                                <ExternalLink className="h-4 w-4 text-white/40" />
                                            </a>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
