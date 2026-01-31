/**
 * Quai Block Ingestion Script
 * 
 * This script fetches the latest blocks from Quai Network RPC
 * and stores them in Supabase for caching and historical queries.
 * 
 * Run with: node scripts/ingest-blocks.mjs
 * 
 * For continuous ingestion, use:
 * node scripts/ingest-blocks.mjs --continuous
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Configuration
const ZONE = process.env.QUAI_ZONE || 'cyprus-1';
const POLL_INTERVAL = 15000; // 15 seconds

// Zone-specific RPC endpoints
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

// Supabase config - uses VITE_ vars for frontend compatibility
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'your-service-key';

// Initialize Supabase client (only if configured)
let supabase = null;
if (!SUPABASE_URL.includes('your-project')) {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Get RPC URL for zone
function getRpcUrl(zone = "cyprus-1") {
    return ZONE_RPC_URLS[zone] || ZONE_RPC_URLS["cyprus-1"];
}

// JSON-RPC request helper
async function rpcRequest(method, params = []) {
    const rpcUrl = getRpcUrl(ZONE);

    try {
        const response = await fetch(rpcUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: method,
                params: params,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || "RPC Error");
        }

        return data.result;
    } catch (error) {
        console.error(`  RPC Error (${method}):`, error.message);
        return null;
    }
}

// Parse hex to number safely
function hexToNumber(hex) {
    if (!hex) return 0;
    if (typeof hex === 'number') return hex;
    return parseInt(hex, 16) || 0;
}

// Fetch latest block number
async function getLatestBlockNumber() {
    const result = await rpcRequest("quai_blockNumber");
    return result ? hexToNumber(result) : null;
}

// Fetch block by number
async function getBlockByNumber(blockNumber) {
    const hexBlock = "0x" + blockNumber.toString(16);
    return await rpcRequest("quai_getBlockByNumber", [hexBlock, true]);
}

// Upsert block to Supabase
async function upsertBlock(blockNumber, block) {
    // Handle different block response formats
    const txCount = Array.isArray(block.transactions)
        ? block.transactions.length
        : (typeof block.transactions === 'number' ? block.transactions : 0);

    const gasUsed = hexToNumber(block.gasUsed) || hexToNumber(block.gas) || 0;
    const timestamp = hexToNumber(block.timestamp) || Math.floor(Date.now() / 1000);

    const blockData = {
        block_number: blockNumber,
        hash: block.hash || 'unknown',
        parent_hash: block.parentHash || block.parentHash || 'unknown',
        timestamp: new Date(timestamp * 1000).toISOString(),
        tx_count: txCount,
        gas_used: gasUsed,
        zone: ZONE,
    };

    // Check if Supabase is configured
    if (!supabase) {
        console.log(`  ✓ Block #${blockData.block_number.toLocaleString()}`);
        console.log(`    Transactions: ${blockData.tx_count} | Gas: ${(blockData.gas_used / 1e6).toFixed(2)}M`);
        console.log(`    Hash: ${blockData.hash.slice(0, 18)}...`);
        console.log(`    (Supabase not configured - data not saved to DB)`);
        return true;
    }

    const { data, error } = await supabase
        .from('blocks')
        .upsert(blockData, { onConflict: 'block_number' });

    if (error) {
        console.error('  ❌ Error saving to Supabase:', error.message);
        return false;
    }

    console.log(`  ✓ Block #${blockData.block_number.toLocaleString()} saved`);
    console.log(`    Transactions: ${blockData.tx_count} | Gas: ${(blockData.gas_used / 1e6).toFixed(2)}M`);
    return true;
}

// Main ingestion function
async function ingestBlocks() {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`\n[${timestamp}] Fetching latest block for zone: ${ZONE}...`);

    const latestBlock = await getLatestBlockNumber();
    if (!latestBlock) {
        console.error('  ❌ Failed to connect to Quai Network RPC');
        console.log(`     Endpoint: ${getRpcUrl(ZONE)}`);
        return;
    }

    console.log(`  📦 Latest block number: #${latestBlock.toLocaleString()}`);

    // Fetch the latest block details
    const block = await getBlockByNumber(latestBlock);
    if (block) {
        await upsertBlock(latestBlock, block);
    } else {
        console.error('  ❌ Failed to fetch block details (may be temporary)');
    }
}

// Continuous mode
async function runContinuous() {
    console.log('\n🚀 Starting continuous ingestion...');
    console.log(`   Zone: ${ZONE}`);
    console.log(`   RPC: ${getRpcUrl(ZONE)}`);
    console.log(`   Poll Interval: ${POLL_INTERVAL / 1000}s`);
    console.log(`   Supabase: ${supabase ? 'Connected' : 'Not configured (demo mode)'}`);
    console.log('   Press Ctrl+C to stop');

    // Initial ingestion
    await ingestBlocks();

    // Set up polling
    setInterval(async () => {
        await ingestBlocks();
    }, POLL_INTERVAL);
}

// Parse command line arguments
const args = process.argv.slice(2);
const isContinuous = args.includes('--continuous') || args.includes('-c');

// Run
console.log('╔══════════════════════════════════════════╗');
console.log('║     QuaiInsight Block Ingestion          ║');
console.log('║     Quai Network RPC (quai_ namespace)   ║');
console.log('╚══════════════════════════════════════════╝');

if (isContinuous) {
    runContinuous();
} else {
    ingestBlocks().then(() => {
        console.log('\n✅ Ingestion complete');
        process.exit(0);
    });
}
