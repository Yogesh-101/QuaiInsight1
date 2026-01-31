import { useState } from "react";
import { Navbar, Hero, ChartsSection, RecentBlocks, Footer } from "@/components/landing";

export default function LandingPage({ onNavigate, onSearch }) {
    const [selectedZone, setSelectedZone] = useState("cyprus-1");

    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary/20 selection:text-primary">
            <Navbar
                selectedZone={selectedZone}
                onZoneChange={setSelectedZone}
                onNavigate={onNavigate}
            />

            <main>
                <Hero onSearch={onSearch} onNavigate={onNavigate} />
                <ChartsSection selectedZone={selectedZone} />
                <RecentBlocks />
            </main>

            <Footer />
        </div>
    );
}
