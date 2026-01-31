import { useState, useEffect } from "react";
import LandingPage from "@/pages/Landing";
import DashboardPage from "@/pages/Dashboard";

function App() {
    const [currentPage, setCurrentPage] = useState("landing");
    const [searchQuery, setSearchQuery] = useState("");

    // Handle navigation
    const handleNavigate = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    // Handle search from landing page
    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage("dashboard");
    };

    return (
        <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
            {currentPage === "landing" ? (
                <LandingPage
                    onNavigate={handleNavigate}
                    onSearch={handleSearch}
                />
            ) : (
                <DashboardPage
                    onNavigate={handleNavigate}
                    initialSearchQuery={searchQuery}
                    onSignOut={() => handleNavigate("landing")}
                />
            )}
        </div>
    );
}

export default App;
