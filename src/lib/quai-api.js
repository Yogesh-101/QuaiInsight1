/**
 * Quai Network API Service
 * Optimized for performance and scalability.
 */

import { supabase, getRecentBlocks as getBlocksFromSupabase } from './supabase';

const ZONE_RPC_URLS = {
    "cyprus-1": "https://rpc.quai.network/cyprus1",
    "cyprus-2": "https://rpc.quai.network/cyprus2",
    "cyprus-3": "https://rpc.quai.network/cyprus3",
    "paxos-1": "https://rpc.quai.network/paxos1",
    "paxos-2": "https://rpc.quai.network/paxos2",
    "paxos-3": "https://rpc.quai.network/paxos3",
    "hydra-1": "https://rpc.quai.network/hydra1",
    "hydra-2": "https://rpc.quai.network/hydra2",
    "hydra-3": "https://rpc.quai.network/hydra3",
};

const QUAISCAN_API_BASE = "https://quaiscan.io/api/v2";

/**
 * Simple in-memory cache to prevent redundant requests
 */
const cache = {
    data: new Map(),
    get(key) {
        const item = this.data.get(key);
        if (!item) return null;
        if (Date.now() > item.expiry) {
            this.data.delete(key);
            return null;
        }
        return item.value;
    },
    set(key, value, ttl = 5000) {
        this.data.set(key, {
            value,
            expiry: Date.now() + ttl
        });
    }
};

/**
 * Generic Fetch Wrapper with Timeout and Cache
 */
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

/**
 * JSON-RPC request helper
 */
async function rpcRequest(method, params = [], zone = "cyprus-1") {
    const rpcUrl = ZONE_RPC_URLS[zone] || ZONE_RPC_URLS["cyprus-1"];
    const cacheKey = `${zone}-${method}-${JSON.stringify(params)}`;

    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const data = await fetchWithTimeout(rpcUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
        });

        if (data.error) throw new Error(data.error.message || "RPC Error");

        cache.set(cacheKey, data.result);
        return data.result;
    } catch (error) {
        console.warn(`RPC Error (${method}):`, error.message);
        return null;
    }
}

// --- RPC Exports ---

export async function getLatestBlockNumber(zone = "cyprus-1") {
    const result = await rpcRequest("quai_blockNumber", [], zone);
    return result ? parseInt(result, 16) : null;
}

export async function getBlockByNumber(blockNumber, includeTransactions = true, zone = "cyprus-1") {
    const hexBlock = typeof blockNumber === 'number' ? "0x" + blockNumber.toString(16) : blockNumber;
    return await rpcRequest("quai_getBlockByNumber", [hexBlock, includeTransactions], zone);
}

export async function getGasPrice(zone = "cyprus-1") {
    const result = await rpcRequest("quai_gasPrice", [], zone);
    return result ? parseInt(result, 16) : null;
}

export async function getBalance(address, zone = "cyprus-1") {
    const result = await rpcRequest("quai_getBalance", [address, "latest"], zone);
    return result || "0x0";
}

export async function getTransactionByHash(txHash, zone = "cyprus-1") {
    return await rpcRequest("quai_getTransactionByHash", [txHash], zone);
}

// --- REST API Exports ---

export async function getNetworkStats() {
    const cacheKey = 'network-stats';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const data = await fetchWithTimeout(`${QUAISCAN_API_BASE}/stats`);
        const stats = {
            totalBlocks: parseInt(data.total_blocks) || 0,
            totalTransactions: parseInt(data.total_transactions) || 0,
            totalAddresses: parseInt(data.total_addresses) || 0,
            transactionsToday: parseInt(data.transactions_today) || 0,
            averageBlockTime: data.average_block_time || 5000,
            networkUtilization: data.network_utilization_percentage || 0,
            coinPrice: data.coin_price,
            marketCap: data.market_cap,
        };
        cache.set(cacheKey, stats, 10000); // Cache stats for 10s
        return stats;
    } catch (error) {
        console.warn("QuaiScan Stats Error:", error.message);
        return null;
    }
}

export async function getRecentBlocksFromQuaiScan(limit = 10, zone = null) {
    const cacheKey = `recent-blocks-${limit}-${zone || 'all'}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        // If zone is provided, we can fetch specifically for that shard if the API supports it
        // Otherwise, we'll fetch global and filter, OR use the RPC method below
        const url = zone
            ? `${QUAISCAN_API_BASE}/blocks?type=block&shard=${zone.replace('-', '')}`
            : `${QUAISCAN_API_BASE}/blocks?type=block`;

        const data = await fetchWithTimeout(url);
        const blocks = data.items?.slice(0, limit).map(block => ({
            number: block.height,
            hash: block.hash,
            timestamp: block.timestamp,
            txCount: block.tx_count || 0,
            gasUsed: block.gas_used || "0",
            miner: block.miner?.hash,
            zone: block.shard || zone
        })) || [];
        cache.set(cacheKey, blocks, 5000);
        return blocks;
    } catch (error) {
        console.warn("QuaiScan Blocks Error:", error.message);
        return [];
    }
}

/**
 * Fetch recent blocks using RPC for a specific zone (highly accurate)
 * Now integrated with Supabase caching for lightning fast recovery
 */
export async function getRecentBlocksByZone(zone = "cyprus-1", limit = 10) {
    const cacheKey = `rpc-blocks-${zone}-${limit}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        // Try fetching from Supabase cache first (PRD requirement)
        const sbBlocks = await getBlocksFromSupabase(limit, zone);
        if (sbBlocks && sbBlocks.length >= limit) {
            const formatted = sbBlocks.map(b => ({
                number: b.block_number,
                hash: b.hash,
                timestamp: b.timestamp,
                txCount: b.tx_count,
                gasUsed: b.gas_used.toString(),
                zone: b.zone
            }));
            cache.set(cacheKey, formatted, 5000);
            return formatted;
        }

        // Fallback to RPC if Supabase is empty or behind
        const latest = await getLatestBlockNumber(zone);
        if (!latest) return [];

        const promises = [];
        for (let i = 0; i < limit; i++) {
            if (latest - i < 0) break;
            promises.push(getBlockByNumber(latest - i, false, zone));
        }

        const results = await Promise.all(promises);
        const blocks = results.filter(b => b).map(b => ({
            number: parseInt(b.number, 16),
            hash: b.hash,
            timestamp: new Date(parseInt(b.timestamp, 16) * 1000).toISOString(),
            txCount: b.transactions?.length || 0,
            gasUsed: parseInt(b.gasUsed, 16).toString(),
            miner: b.miner,
            zone: zone
        }));

        cache.set(cacheKey, blocks, 5000);
        return blocks;
    } catch (error) {
        console.warn(`RPC Blocks Error (${zone}):`, error.message);
        return [];
    }
}

/**
 * Fetch historical data for charts
 */
export async function getHistoricalBlocks(zone = "cyprus-1", hours = 24) {
    try {
        const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
        const { data, error } = await supabase
            .from('blocks')
            .select('*')
            .eq('zone', zone)
            .gte('timestamp', since)
            .order('timestamp', { ascending: true });

        if (error) throw error;
        return data.map(b => ({
            number: b.block_number,
            txCount: b.tx_count,
            timestamp: b.timestamp,
            gasUsed: b.gas_used
        }));
    } catch (e) {
        console.warn("Historical Data Error:", e.message);
        return [];
    }
}

export async function getRecentTransactions(limit = 10, zone = null) {
    const cacheKey = `recent-txs-${limit}-${zone || 'all'}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const url = zone
            ? `${QUAISCAN_API_BASE}/transactions?type=validated&shard=${zone.replace('-', '')}`
            : `${QUAISCAN_API_BASE}/transactions?type=validated`;

        const data = await fetchWithTimeout(url);
        const txs = data.items?.slice(0, limit).map(tx => ({
            hash: tx.hash,
            from: tx.from?.hash,
            to: tx.to?.hash,
            value: tx.value,
            gasUsed: tx.gas_used,
            timestamp: tx.timestamp,
            status: tx.status,
            type: tx.type,
            zone: tx.shard || zone
        })) || [];
        cache.set(cacheKey, txs, 5000);
        return txs;
    } catch (error) {
        console.warn("QuaiScan Transactions Error:", error.message);
        return [];
    }
}

export async function getAddressTransactions(address, limit = 10) {
    try {
        const url = `${QUAISCAN_API_BASE}/addresses/${address}/transactions?type=validated`;
        const data = await fetchWithTimeout(url);
        return data.items?.slice(0, limit).map(tx => ({
            hash: tx.hash,
            from: tx.from?.hash,
            to: tx.to?.hash,
            value: tx.value,
            timestamp: tx.timestamp,
            status: tx.status
        })) || [];
    } catch (error) {
        console.warn("Address Transactions Error:", error.message);
        return [];
    }
}

export const QUAI_ZONES = [
    { id: "cyprus-1", name: "Cyprus-1", region: "Cyprus" },
    { id: "cyprus-2", name: "Cyprus-2", region: "Cyprus" },
    { id: "cyprus-3", name: "Cyprus-3", region: "Cyprus" },
    { id: "paxos-1", name: "Paxos-1", region: "Paxos" },
    { id: "paxos-2", name: "Paxos-2", region: "Paxos" },
    { id: "paxos-3", name: "Paxos-3", region: "Paxos" },
    { id: "hydra-1", name: "Hydra-1", region: "Hydra" },
    { id: "hydra-2", name: "Hydra-2", region: "Hydra" },
    { id: "hydra-3", name: "Hydra-3", region: "Hydra" },
];

export const weiToGwei = (wei) => {
    if (!wei) return 0;
    const value = typeof wei === 'string' && wei.startsWith('0x') ? BigInt(wei) : BigInt(wei);
    return Number(value) / 1e9;
};

export const weiToQuai = (wei) => {
    if (!wei) return 0;
    const value = typeof wei === 'string' && wei.startsWith('0x') ? BigInt(wei) : BigInt(wei);
    return Number(value / 100000000000000n) / 10000; // Keep 4 decimal precision safely
};

export const hexToNumber = (hex) => hex ? parseInt(hex, 16) : 0;
export const truncateHash = (hash, chars = 6) => hash ? `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}` : "";

export function formatNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num?.toLocaleString() || "0";
}
