import { Github, Twitter, MessageCircle, ExternalLink } from "lucide-react";

const links = {
    quai: [
        { label: "Documentation", href: "https://qu.ai/docs/" },
        { label: "Quai SDK", href: "https://github.com/dominant-strategies/quais.js" },
        { label: "QuaiScan", href: "https://quaiscan.io" },
        { label: "Discord", href: "https://discord.gg/quai" },
    ],
    resources: [
        { label: "GitHub", href: "https://github.com/dominant-strategies" },
        { label: "Developer Portal", href: "https://qu.ai/developers/" },
        { label: "Testnet Faucet", href: "https://faucet.quai.network" },
        { label: "Block Explorer", href: "https://quaiscan.io" },
    ],
};

export function Footer() {
    return (
        <footer className="relative border-t border-white/5 bg-background">
            {/* Top Border Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg overflow-hidden">
                                <img src="/quai-logo.png" alt="Quai" className="h-full w-full object-cover" />
                            </div>
                            <span className="font-heading text-xl font-bold text-white">QuaiInsight</span>
                        </div>
                        <p className="text-white/50 text-sm max-w-md mb-6">
                            Real-time blockchain analytics dashboard for the Quai Network.
                            Monitor blocks, transactions, and network health across all zones.
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://github.com/dominant-strategies"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <Github className="h-5 w-5 text-white/60" />
                            </a>
                            <a
                                href="https://twitter.com/QuaiNetwork"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <Twitter className="h-5 w-5 text-white/60" />
                            </a>
                            <a
                                href="https://discord.gg/quai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <MessageCircle className="h-5 w-5 text-white/60" />
                            </a>
                        </div>
                    </div>

                    {/* Quai Links */}
                    <div>
                        <h4 className="font-heading font-semibold text-white mb-4">Quai Network</h4>
                        <ul className="space-y-2">
                            {links.quai.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-white/50 hover:text-white transition-colors inline-flex items-center gap-1"
                                    >
                                        {link.label}
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-heading font-semibold text-white mb-4">Resources</h4>
                        <ul className="space-y-2">
                            {links.resources.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-white/50 hover:text-white transition-colors inline-flex items-center gap-1"
                                    >
                                        {link.label}
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-white/40">
                        Powered by <span className="text-primary">Quai Network</span>
                    </p>
                    <p className="text-xs text-white/30">
                        © 2026 QuaiInsight. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
