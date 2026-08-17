"use client";

export function Footer() {
    return (
        <footer className="w-full py-4 px-6 border-t border-lavender/5">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                {/* Testnet Online badge */}
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                    <span className="text-xs text-neon-green font-medium">
                        Testnet Online
                    </span>
                </div>

                {/* Center — branding */}
                <p className="text-xs text-lavender/30">
                    Noodle Nova · New Moon to Full: Midnight
                </p>

                {/* Built on Stellar */}
                <a
                    href="https://stellar.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-lavender/40 hover:text-gold transition-colors flex items-center gap-1"
                >
                    Built on Stellar ↗
                </a>
            </div>
        </footer>
    );
}
