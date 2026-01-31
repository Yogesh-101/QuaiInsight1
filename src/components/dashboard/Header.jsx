import { useState, useEffect } from "react";
import { Search, Bell, Menu, User, X, Check, Settings, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ZoneSelector } from "./ZoneSelector";
import { SearchBar } from "./SearchBar";
import { motion, AnimatePresence } from "framer-motion";
import { getLatestBlockNumber } from "@/lib/quai-api";

export function Header({ selectedZone, onZoneChange, onSearch, onToggleSidebar, onTabChange, onSignOut }) {
    const [notifications, setNotifications] = useState([
        { id: 1, title: "System Online", message: "Dashboard connected to Quai Network", time: "Just now", read: false },
        { id: 2, title: "Zone Update", message: "Cyprus-1 sync status: Optimal", time: "2m ago", read: false }
    ]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [lastBlock, setLastBlock] = useState(0);

    // Dynamic notifications based on blocks
    useEffect(() => {
        const checkNewBlocks = async () => {
            try {
                const blockNum = await getLatestBlockNumber(selectedZone);
                if (blockNum && blockNum > lastBlock && lastBlock !== 0) {
                    const newNotification = {
                        id: Date.now(),
                        title: "New Block Mined",
                        message: `Block #${blockNum.toLocaleString()} detected in ${selectedZone}`,
                        time: "Just now",
                        read: false,
                        type: "success"
                    };
                    setNotifications(prev => [newNotification, ...prev].slice(0, 10));
                }
                if (blockNum) setLastBlock(blockNum);
            } catch (err) {
                console.error("Error checking for notifications:", err);
            }
        };

        const interval = setInterval(checkNewBlocks, 15000);
        return () => clearInterval(interval);
    }, [selectedZone, lastBlock]);

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-white/5 bg-background/80 backdrop-blur-xl px-6">
            <div className="flex items-center gap-4 flex-1">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={onToggleSidebar}>
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Search Bar */}
                <div className="max-w-md w-full hidden md:block">
                    <SearchBar onSearch={onSearch} />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Zone Selector */}
                <div className="hidden md:block">
                    <ZoneSelector selectedZone={selectedZone} onZoneChange={onZoneChange} />
                </div>

                {/* Notifications */}
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell className="h-5 w-5 text-white/70" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
                        )}
                    </Button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-white/10 bg-[#0A0A0A] shadow-2xl overflow-hidden backdrop-blur-3xl ring-1 ring-white/5"
                            >
                                <div className="flex items-center justify-between p-4 border-b border-white/5">
                                    <h3 className="font-semibold text-white">Notifications</h3>
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-primary hover:text-primary/80 transition-colors"
                                    >
                                        Mark all read
                                    </button>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center text-white/40 text-sm">
                                            No notifications
                                        </div>
                                    ) : (
                                        notifications.map(notification => (
                                            <div
                                                key={notification.id}
                                                className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors relative group ${notification.read ? 'opacity-60' : ''}`}
                                            >
                                                {!notification.read && (
                                                    <span className="absolute left-2 top-4 h-1.5 w-1.5 rounded-full bg-primary" />
                                                )}
                                                <div className="pl-2">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="font-medium text-sm text-white">{notification.title}</span>
                                                        <span className="text-[10px] text-white/40">{notification.time}</span>
                                                    </div>
                                                    <p className="text-xs text-white/60 mb-2">{notification.message}</p>
                                                    {!notification.read && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                                                            className="text-[10px] text-white/40 hover:text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Check className="h-3 w-3" /> Mark as read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile */}
                <div className="relative">
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center hover:ring-2 hover:ring-primary/20 transition-all overflow-hidden"
                    >
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Quai"
                            alt="User"
                            className="h-full w-full object-cover"
                        />
                    </button>

                    <AnimatePresence>
                        {showProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-white/10 bg-[#0A0A0A] shadow-2xl overflow-hidden backdrop-blur-3xl ring-1 ring-white/5"
                            >
                                <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                                    <p className="text-sm font-semibold text-white">Quai Developer</p>
                                    <p className="text-xs text-white/40 font-mono truncate">0x71C765...d897</p>
                                </div>
                                <div className="p-2">
                                    <button
                                        onClick={() => { onTabChange("profile"); setShowProfile(false); }}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-all"
                                    >
                                        <User className="h-4 w-4" />
                                        My Profile
                                    </button>
                                    <button
                                        onClick={() => { onTabChange("settings"); setShowProfile(false); }}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-all"
                                    >
                                        <Settings className="h-4 w-4" />
                                        Account Settings
                                    </button>
                                    <div className="my-2 border-t border-white/5" />
                                    <button
                                        onClick={() => onSignOut ? onSignOut() : (window.location.href = '/')}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-100/60 hover:bg-red-500/10 hover:text-red-400 transition-all font-medium"
                                    >
                                        <X className="h-4 w-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
