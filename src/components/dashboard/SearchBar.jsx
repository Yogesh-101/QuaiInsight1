import { useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function SearchBar({ onSearch, placeholder = "Search by address or transaction hash..." }) {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    const handleClear = () => {
        setQuery("");
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
            <div className={cn(
                "relative flex items-center rounded-xl border bg-white/5 backdrop-blur-xl transition-all duration-300",
                isFocused ? "border-primary/50 shadow-lg shadow-primary/10" : "border-white/10"
            )}>
                <Search className="absolute left-4 h-5 w-5 text-white/40" />

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className={cn(
                        "w-full bg-transparent py-3 pl-12 pr-12 text-sm text-white placeholder-white/40",
                        "focus:outline-none"
                    )}
                />

                <AnimatePresence>
                    {query && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            type="button"
                            onClick={handleClear}
                            className="absolute right-4 p-1 rounded hover:bg-white/10 transition-colors"
                        >
                            <X className="h-4 w-4 text-white/40" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Search hints */}
            <AnimatePresence>
                {isFocused && !query && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 p-3 rounded-xl border border-white/10 bg-[#0a0a0a] shadow-xl"
                    >
                        <p className="text-xs text-white/40 mb-2">Try searching for:</p>
                        <div className="space-y-1">
                            <button
                                type="button"
                                onClick={() => setQuery("0x742d35Cc6634C0532925a3b844Bc9e7595f8fBE0")}
                                className="block w-full text-left text-sm text-white/60 hover:text-primary transition-colors truncate"
                            >
                                0x742d35Cc6634C0532925a3b844Bc9e7595f8fBE0
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </form>
    );
}
