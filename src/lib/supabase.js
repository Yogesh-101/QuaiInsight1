import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Block table operations
export async function upsertBlock(blockData) {
    const { data, error } = await supabase
        .from('blocks')
        .upsert({
            block_number: blockData.blockNumber,
            hash: blockData.hash,
            parent_hash: blockData.parentHash,
            timestamp: new Date(blockData.timestamp * 1000).toISOString(),
            tx_count: blockData.txCount,
            gas_used: blockData.gasUsed,
            zone: blockData.zone || 'cyprus-1',
        }, { onConflict: 'block_number' });

    if (error) console.error('Error upserting block:', error);
    return data;
}

// Get recent blocks from cache
export async function getRecentBlocks(limit = 10, zone = 'cyprus-1') {
    const { data, error } = await supabase
        .from('blocks')
        .select('*')
        .eq('zone', zone)
        .order('block_number', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching blocks:', error);
        return [];
    }
    return data || [];
}

// Get block stats for charts (hourly aggregation)
export async function getBlockStats(hours = 24, zone = 'cyprus-1') {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
        .from('blocks')
        .select('*')
        .eq('zone', zone)
        .gte('timestamp', since)
        .order('timestamp', { ascending: true });

    if (error) {
        console.error('Error fetching block stats:', error);
        return [];
    }
    return data || [];
}

// Subscribe to real-time block updates
export function subscribeToBlocks(callback) {
    const subscription = supabase
        .channel('blocks-channel')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'blocks' }, (payload) => {
            callback(payload.new);
        })
        .subscribe();

    return () => subscription.unsubscribe();
}

// Search for address or transaction
export async function searchBlockchain(query) {
    // Determine if it's an address (starts with 0x and 42 chars) or tx hash (66 chars)
    const isAddress = query.length === 42 && query.startsWith('0x');
    const isTxHash = query.length === 66 && query.startsWith('0x');

    return { isAddress, isTxHash, query };
}
