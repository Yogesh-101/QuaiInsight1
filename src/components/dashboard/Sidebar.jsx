import {
    LayoutDashboard,
    Blocks,
    ArrowLeftRight,
    Wallet,
    BarChart3,
    Settings,
    HelpCircle,
    Home,
    ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
    { icon: Blocks, label: "Blocks", id: "blocks" },
    { icon: ArrowLeftRight, label: "Transactions", id: "transactions" },
    { icon: Wallet, label: "Wallet", id: "wallet" },
    { icon: BarChart3, label: "Analytics", id: "analytics" },
];

const bottomItems = [
    { icon: Settings, label: "Settings", id: "settings" },
    { icon: HelpCircle, label: "Help", id: "help" },
];

export function SimpleSidebar({ activeTab, onTabChange, onNavigate, isOnline }) {
    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-background">
            <div className="flex h-full flex-col">
                {/* Logo */}
                <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
                    <div className="h-10 w-10 rounded-xl overflow-hidden">
                        <img src="/quai-logo.png" alt="Quai" className="h-full w-full object-cover" />
                    </div>
                    <div>
                        <h1 className="font-heading text-lg font-bold text-white">QuaiInsight</h1>
                        <p className="text-xs text-white/40">Network Analytics</p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="px-3 pt-4">
                    <button
                        onClick={() => onNavigate?.("landing")}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-all"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Back to Home
                    </button>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 space-y-1 px-3 py-4">
                    <p className="mb-2 px-3 text-xs font-semibold text-white/40 uppercase tracking-wider">
                        Main Menu
                    </p>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                                activeTab === item.id
                                    ? "bg-primary/10 text-primary"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Bottom Navigation */}
                <div className="border-t border-white/10 px-3 py-4">
                    {bottomItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                                activeTab === item.id
                                    ? "bg-primary/10 text-primary"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Network Status */}
                <div className="border-t border-white/10 p-4">
                    <div className={cn("rounded-lg p-3 transition-colors", isOnline ? "bg-green-500/10" : "bg-orange-500/10")}>
                        <div className="flex items-center gap-2">
                            <div className={cn("h-2 w-2 rounded-full animate-pulse", isOnline ? "bg-green-400" : "bg-orange-400")} />
                            <span className={cn("text-xs font-medium uppercase tracking-tighter", isOnline ? "text-green-400" : "text-orange-400")}>
                                {isOnline ? "Network Online" : "Node Lagging"}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-white/40 font-medium">
                            {isOnline ? "All systems operational" : "Switching to failover nodes"}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default SimpleSidebar;
