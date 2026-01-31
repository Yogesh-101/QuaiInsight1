# QuaiInsight: The Vibe Analytics Engine 💎

**QuaiInsight** is a professional-grade, high-fidelity real-time analytics dashboard for the **Quai Network**. Built during the 12-hour Vibe Coding Hackathon, it combines extreme UI aesthetics with robust blockchain data architecture.

## 🚀 Key Features

-   **Multi-Zone Analytics**: Real-time monitoring across the entire Quai hierarchy (Prime, Region, Zone). Toggle between shards like **Cyprus-1**, **Paxos-2**, or **Hydra-3** to see localized chain heartbeats.
-   **Supabase Caching Layer**: Implements a high-performance caching strategy using Supabase to store block headers (`Block Height`, `Gas Used`, `Txs`). This reduces RPC overhead and enables lightning-fast historical charting.
-   **Developer Insights**: Adaptive AI-driven summaries (simulated) that analyze zone throughput and finality (e.g., sub-second finality detection for Hydra shards).
-   **Full-Stack Search**: Instantly lookup Addresses, Transaction Hashes, or Block Heights across any zone.
-   **Chain Portfolio**: A production-ready wallet view to check balances and authenticated zones for any Quai address.
-   **Visual Excellence**: Built with a sleek, dark-mode glassmorphism aesthetic using React, Tailwind CSS, and Framer Motion.

## 🛠 Tech Stack

-   **Frontend**: React + Vite, Tailwind CSS, Lucide Icons
-   **Animations**: Framer Motion
-   **Charts**: Recharts (High-fidelity historical data visualization)
-   **Data layer**: Quai Scan REST API + Quai RPC
-   **Cache/Database**: Supabase (Postgres + Realtime)
-   **Deployment**: Vercel ready

## 📦 Setup & Installation

1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/your-username/quai-insight.git
    cd quai-insight
    ```

2.  **Environment Variables**:
    Create a `.env` file with your credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

3.  **Install Dependencies**:
    ```bash
    npm install
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

5.  **Start Data Ingestion (Optional)**:
    To populate the Supabase cache loop:
    ```bash
    npm run ingest:continuous
    ```

## 📊 Database Schema (Supabase)

The project recommends a `blocks` table with the following structure:
-   `block_number` (BigInt, Primary Key)
-   `hash` (Text)
-   `parent_hash` (Text)
-   `timestamp` (Timestamp)
-   `tx_count` (Int)
-   `gas_used` (BigInt)
-   `zone` (Text, Indexed)

## 🏆 Hackathon Strategic Implementation

-   **Problem Solved**: Raw blockchain data is fragmented and slow. QuaiInsight aggregates hierarchical data into a single, high-performance interface.
-   **Differentiator**: Unlike basic explorers, this dashboard automatically detects "Node Lag" and switches to a failover mock data stream to ensure the UI never feels broken or empty.
-   **Production Ready**: Includes user profile management, session control (Sign Out), and detailed system metrics (RPC Latency, IOPS).

Developed for the **Vibe Coding 12-Hour Hackathon**. 
*Time Spent: ~11 Hours*
*Status: MVP Complete & Production Ready*
