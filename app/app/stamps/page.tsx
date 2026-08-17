"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/app/context/WalletContext";

const STAMPS = [
    {
        emoji: "🍜",
        rarity: "COMMON",
        rarityColor: "text-muted",
        borderColor: "border-white/20",
        name: "First Bowl",
        description: "Funded 1 route",
        bgGlow: "",
        requiredStamps: 1,
    },
    {
        emoji: "🛸",
        rarity: "UNCOMMON",
        rarityColor: "text-cyan",
        borderColor: "border-cyan/40",
        name: "Neon Runner",
        description: "Funded 5 routes",
        bgGlow: "shadow-neon-cyan",
        requiredStamps: 5,
    },
    {
        emoji: "🛰️",
        rarity: "RARE",
        rarityColor: "text-pink",
        borderColor: "border-pink/40",
        name: "Deep Space",
        description: "Orbital Station 9",
        bgGlow: "shadow-neon-pink",
        requiredStamps: 10,
    },
    {
        emoji: "?",
        rarity: "LOCKED",
        rarityColor: "text-muted",
        borderColor: "border-white/10 border-dashed",
        name: "Unknown",
        description: "Keep delivering",
        bgGlow: "",
        requiredStamps: 15,
    },
];

export default function StampsPage() {
    const { address } = useWallet();
    const [stampsEarned, setStampsEarned] = useState(0);

    useEffect(() => {
        if (address) {
            fetch(`/api/user/stats?walletAddress=${address}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        setStampsEarned(data.stats.stampsEarned);
                    }
                })
                .catch(console.error);
        }
    }, [address]);

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
            {/* Header */}
            <header className="mb-8">
                <p className="text-cyan font-mono text-xs tracking-[0.2em] uppercase mb-1">Collection</p>
                <h1 className="text-4xl md:text-5xl font-bold text-paper mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    Stamp Vault
                </h1>
                <p className="text-muted text-sm">Your on-chain proof of cosmic deliveries.</p>
            </header>

            {/* Hero */}
            <div className="relative rounded-2xl border-2 border-gold/30 bg-ink-2/60 backdrop-blur-md p-8 mb-8 shadow-neon-gold overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="text-center md:text-left flex-1">
                        <div className="text-6xl mb-3">🏅</div>
                        <h2 className="text-5xl font-bold text-paper mb-2">
                            {stampsEarned} <span className="text-gold text-2xl font-mono">Stamps</span>
                        </h2>
                        <div className="w-full max-w-xs h-3 rounded-full bg-ink-3 border border-white/10 overflow-hidden mb-2">
                            <div className="h-full bg-gradient-to-r from-pink to-gold rounded-full transition-all" style={{ width: `${Math.min(100, (stampsEarned / 15) * 100)}%` }} />
                        </div>
                        <small className="text-muted text-xs">Top 15% of all couriers</small>
                    </div>
                    <div className="flex items-center gap-3 bg-ink-3/80 rounded-xl px-5 py-4 border border-white/10">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        <div>
                            <p className="text-paper text-sm font-bold">On-Chain Verification</p>
                            <span className="text-muted text-xs">All stamps are recorded on the Stellar Testnet ledger.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stamp Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {STAMPS.map((stamp, idx) => {
                    const isUnlocked = stampsEarned >= stamp.requiredStamps;
                    return (
                        <div
                            key={idx}
                            className={`rounded-2xl border-2 ${stamp.borderColor} bg-ink-2/60 backdrop-blur-md p-5 text-center transition-all duration-300 hover:-translate-y-1 ${stamp.bgGlow} ${!isUnlocked ? "opacity-50" : ""}`}
                        >
                            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 ${isUnlocked ? "bg-ink-3 border-2 border-white/10" : "border-2 border-dashed border-white/10"}`}>
                                {stamp.emoji}
                            </div>
                            <p className={`font-mono text-xs tracking-widest mb-1 ${stamp.rarityColor}`}>{stamp.rarity}</p>
                            <h2 className="text-lg font-bold text-paper mb-1">{stamp.name}</h2>
                            <small className="text-muted text-xs">{stamp.description}</small>
                        </div>
                    );
                })}
            </div>

            {/* Security Card */}
            <div className="relative rounded-2xl border border-white/10 bg-ink-2/60 backdrop-blur-md p-6 flex items-center gap-4 shadow-glass">
                <div className="w-10 h-10 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                </div>
                <div>
                    <b className="text-paper text-sm">Cryptographically Secured</b>
                    <p className="text-muted text-xs mt-1">Your stamps are tied to your Stellar public key. No one can take them from you.</p>
                </div>
            </div>
        </div>
    );
}
