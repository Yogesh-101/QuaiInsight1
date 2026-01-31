import { useMemo } from "react";
import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-white/10 bg-[#0a0a0a] px-3 py-2 shadow-xl">
                <p className="text-xs text-white/60">{label}</p>
                <p className="text-sm font-semibold text-primary">
                    {payload[0].value.toLocaleString()} {payload[0].name}
                </p>
            </div>
        );
    }
    return null;
};

export function TransactionChart({ data, loading, title = "Transaction Volume" }) {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) {
            // Generate mock data if no real data
            return Array.from({ length: 24 }, (_, i) => ({
                hour: `${i}:00`,
                transactions: Math.floor(Math.random() * 500) + 100,
            }));
        }

        // Aggregate data by hour
        const hourlyData = {};
        data.forEach(block => {
            const date = new Date(block.timestamp);
            const hour = date.getHours();
            const key = `${hour}:00`;
            if (!hourlyData[key]) {
                hourlyData[key] = { hour: key, transactions: 0, count: 0 };
            }
            hourlyData[key].transactions += (block.txCount || block.tx_count || 0);
            hourlyData[key].count++;
        });

        const result = Object.values(hourlyData).sort((a, b) => {
            const hA = parseInt(a.hour);
            const hB = parseInt(b.hour);
            return hA - hB;
        });

        // If we only have data for one hour, show raw blocks instead for better visualization
        if (result.length <= 1 && data.length > 5) {
            return data.slice().sort((a, b) => a.number - b.number).map(b => ({
                hour: `#${b.number}`,
                transactions: b.txCount || b.tx_count || 0
            }));
        }

        return result;
    }, [data]);

    if (loading) {
        return (
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <div className="h-6 w-48 animate-pulse rounded bg-white/10 mb-6" />
                <div className="h-64 animate-pulse rounded bg-white/10" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black font-heading text-white uppercase tracking-widest">{title}</h3>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-black font-heading text-white/40 uppercase tracking-widest">Transactions</span>
                </div>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="hour"
                            stroke="rgba(255,255,255,0.3)"
                            fontSize={12}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.3)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="transactions"
                            name="Txns"
                            stroke="hsl(var(--primary))"
                            strokeWidth={3}
                            fill="url(#colorTx)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}

export function BlockTimeChart({ data, loading }) {
    const chartData = useMemo(() => {
        // Ensure data is sorted by number/timestamp
        const sortedData = data.slice().sort((a, b) => a.number - b.number);

        // Calculate block times between consecutive entries
        const times = [];
        for (let i = 1; i < sortedData.length; i++) {
            const timeDiff = new Date(sortedData[i].timestamp).getTime() - new Date(sortedData[i - 1].timestamp).getTime();
            const blockNum = sortedData[i].number || sortedData[i].block_number || sortedData[i].blockNumber;

            if (blockNum) {
                times.push({
                    block: blockNum,
                    time: Math.max(0, Math.abs(timeDiff / 1000)), // Convert to seconds, ensure non-negative
                });
            }
        }
        return times;
    }, [data]);

    if (loading) {
        return (
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <div className="h-6 w-48 animate-pulse rounded bg-white/10 mb-6" />
                <div className="h-48 animate-pulse rounded bg-white/10" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black font-heading text-white uppercase tracking-widest">Block Time</h3>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-secondary" />
                    <span className="text-[10px] font-black font-heading text-white/40 uppercase tracking-widest">Seconds</span>
                </div>
            </div>

            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="block"
                            stroke="rgba(255,255,255,0.3)"
                            fontSize={10}
                            tickLine={false}
                            hide
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.3)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 'dataMax + 5']}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="time"
                            name="Seconds"
                            stroke="hsl(var(--secondary))"
                            strokeWidth={3}
                            dot={{ r: 2, fill: "hsl(var(--secondary))", strokeWidth: 0 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            animationDuration={1500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
