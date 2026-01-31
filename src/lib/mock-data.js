/**
 * Mock Data Generators for Quai Insight
 * Used for demo purposes and fallback states.
 */

export const generateTxVolumeData = () => {
    const data = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
        const time = new Date(now - i * 3600000);
        data.push({
            hour: time.getHours().toString().padStart(2, "0") + ":00",
            volume: Math.floor(Math.random() * 5000) + 2000,
            average: 3500,
        });
    }
    return data;
};

export const generateGasPriceData = () => {
    const zones = ["Cyprus-1", "Cyprus-2", "Paxos-1", "Paxos-2", "Hydra-1"];
    return zones.map(zone => ({
        zone,
        gasPrice: Math.floor(Math.random() * 50) + 10,
        color: zone.includes("Cyprus") ? "#D93025" : zone.includes("Paxos") ? "#06b6d4" : "#f59e0b",
    }));
};

export const generateMockBlocks = (count = 8, zone = "cyprus-1") => {
    const now = new Date();
    return Array.from({ length: count }, (_, i) => ({
        number: 6210000 - i,
        zone: zone,
        hash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        txCount: Math.floor(Math.random() * 100) + 10,
        timestamp: new Date(now.getTime() - i * 13000).toISOString(),
        isNew: i === 0,
    }));
};
