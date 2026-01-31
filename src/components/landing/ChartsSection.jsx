import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Activity, Fuel, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { generateTxVolumeData, generateGasPriceData } from "@/lib/mock-data";

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-panel-strong p-3 text-sm border border-white/10 rounded-xl bg-black/80 backdrop-blur-md">
                <p className="text-white/60 mb-1 font-bold uppercase tracking-widest text-[10px]">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="font-black text-xs" style={{ color: entry.color }}>
                        {entry.name}: {entry.value.toLocaleString()}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export function ChartsSection() {
    const [txVolumeData, setTxVolumeData] = useState([]);
    const [gasPriceData, setGasPriceData] = useState([]);

    useEffect(() => {
        setTxVolumeData(generateTxVolumeData());
        setGasPriceData(generateGasPriceData());

        // Refresh data periodically
        const interval = setInterval(() => {
            setTxVolumeData(generateTxVolumeData());
            setGasPriceData(generateGasPriceData());
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    // Calculate trends
    const txTrend = useMemo(() => {
        if (txVolumeData.length < 2) return { direction: "neutral", value: "0%" };
        const current = txVolumeData[txVolumeData.length - 1]?.volume || 0;
        const previous = txVolumeData[txVolumeData.length - 2]?.volume || 0;
        const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;
        return {
            direction: change >= 0 ? "up" : "down",
            value: `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`,
        };
    }, [txVolumeData]);

    return (
        <section className="relative py-20">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <Badge variant="outline" className="mb-4">Analytics</Badge>
                    <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                        Network Performance
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        Real-time transaction volume and gas price tracking across all Quai zones.
                    </p>
                </motion.div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Transaction Volume Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="h-full">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                                        <Activity className="h-5 w-5 text-secondary" />
                                    </div>
                                    <div>
                                        <CardTitle>Transaction Volume</CardTitle>
                                        <p className="text-xs text-white/40">Last 24 hours</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                    {txTrend.direction === "up" ? (
                                        <TrendingUp className="h-4 w-4 text-green-400" />
                                    ) : (
                                        <TrendingDown className="h-4 w-4 text-red-400" />
                                    )}
                                    <span className={txTrend.direction === "up" ? "text-green-400" : "text-red-400"}>
                                        {txTrend.value}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={txVolumeData}>
                                            <defs>
                                                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                                                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                            <XAxis
                                                dataKey="hour"
                                                stroke="rgba(255,255,255,0.3)"
                                                fontSize={11}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                stroke="rgba(255,255,255,0.3)"
                                                fontSize={11}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area
                                                type="monotone"
                                                dataKey="volume"
                                                stroke="#06b6d4"
                                                strokeWidth={2}
                                                fill="url(#volumeGradient)"
                                                name="Transactions"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Gas Price Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="h-full">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                                        <Fuel className="h-5 w-5 text-accent" />
                                    </div>
                                    <div>
                                        <CardTitle>Gas Price by Zone</CardTitle>
                                        <p className="text-xs text-white/40">Current prices (Gwei)</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={gasPriceData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                            <XAxis
                                                type="number"
                                                stroke="rgba(255,255,255,0.3)"
                                                fontSize={11}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                type="category"
                                                dataKey="zone"
                                                stroke="rgba(255,255,255,0.3)"
                                                fontSize={11}
                                                tickLine={false}
                                                axisLine={false}
                                                width={80}
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar
                                                dataKey="gasPrice"
                                                name="Gas Price"
                                                radius={[0, 4, 4, 0]}
                                                fill="#f59e0b"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
