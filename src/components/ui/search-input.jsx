import { useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function SearchInput({
    onSearch,
    placeholder = "Search by Tx Hash / Block / Address...",
    loading = false,
    className,
    size = "default"
}) {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim() && onSearch) {
            onSearch(query.trim());
        }
    };

    const handleClear = () => {
        setQuery("");
    };

    const sizeClasses = {
        default: "h-12 text-sm",
        lg: "h-14 text-base",
        xl: "h-16 text-lg",
    };

    return (
        <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
            <div
                className={cn(
                    "relative flex items-center rounded-xl transition-all duration-300",
                    "bg-white/[0.03] border",
                    isFocused
                        ? "border-primary/50 shadow-lg shadow-primary/10"
                        : "border-white/10 hover:border-white/20",
                    sizeClasses[size]
                )}
            >
                {/* Search Icon */}
                <div className="flex items-center justify-center w-12 h-full">
                    {loading ? (
                        <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    ) : (
                        <Search className={cn(
                            "h-5 w-5 transition-colors",
                            isFocused ? "text-primary" : "text-white/40"
                        )} />
                    )}
                </div>

                {/* Input */}
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className={cn(
                        "flex-1 bg-transparent outline-none",
                        "text-white placeholder:text-white/30",
                        "font-mono"
                    )}
                />

                {/* Clear Button */}
                <AnimatePresence>
                    {query && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            type="button"
                            onClick={handleClear}
                            className="flex items-center justify-center w-10 h-full text-white/40 hover:text-white transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Search Button */}
                <button
                    type="submit"
                    disabled={!query.trim() || loading}
                    className={cn(
                        "h-full px-5 rounded-r-xl font-medium transition-all",
                        "bg-primary/10 text-primary hover:bg-primary/20",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "border-l border-white/10"
                    )}
                >
                    Search
                </button>
            </div>

            {/* Hints */}
            <AnimatePresence>
                {isFocused && !query && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute top-full left-0 mt-2 flex gap-2 text-xs text-white/40"
                    >
                        <span className="px-2 py-1 rounded bg-white/5">0x... for address</span>
                        <span className="px-2 py-1 rounded bg-white/5">66 chars for tx hash</span>
                        <span className="px-2 py-1 rounded bg-white/5">number for block</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </form>
    );
}
