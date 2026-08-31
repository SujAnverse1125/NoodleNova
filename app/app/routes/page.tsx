"use client";

import { EscrowPanel } from "@/components/EscrowPanel";
import { SendForm } from "@/components/SendForm";
import { useState } from "react";

const ROUTES = [
    { id: 1, title: "StarPort Embassy", cost: "50", emoji: "🍜", desc: "High priority delivery to the ambassador.", stamp: "1x Common", color: "cyan" },
    { id: 2, title: "Neon Market", cost: "120", emoji: "🛸", desc: "Supply run for the underground market.", stamp: "2x Common", color: "pink" },
    { id: 3, title: "Orbital Station 9", cost: "300", emoji: "🛰️", desc: "Deep space delivery. High risk.", stamp: "1x Rare", color: "gold" },
    { id: 4, title: "Sector 7 Slums", cost: "25", emoji: "🏙️", desc: "Charity run for the lower levels.", stamp: "1x Common", color: "purple" },
];

export default function RoutesPage() {
    const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);
    const selectedRoute = ROUTES.find((route) => route.id === selectedRouteId) ?? null;

    return (
        <div className="mx-auto max-w-6xl p-6 md:p-10">
            <header className="mb-8">
                <p className="mb-1 font-mono text-xs uppercase tracking-[0.2em] text-cyan">Marketplace</p>
                <h1 className="mb-2 text-4xl font-bold text-paper drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] md:text-5xl">
                    Sponsor Routes
                </h1>
                <p className="text-sm text-muted">Fund delivery missions with XLM on Stellar Testnet and track the escrow on-chain.</p>
            </header>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
                    {ROUTES.map((route) => {
                        const isSelected = selectedRouteId === route.id;
                        const borderColor = route.color === "cyan" ? "border-cyan/40" : route.color === "pink" ? "border-pink/40" : route.color === "gold" ? "border-gold/40" : "border-purple/40";
                        const shadowColor = route.color === "cyan" ? "shadow-neon-cyan" : route.color === "pink" ? "shadow-neon-pink" : route.color === "gold" ? "shadow-neon-gold" : "shadow-neon-purple";
                        const textColor = route.color === "cyan" ? "text-cyan" : route.color === "pink" ? "text-pink" : route.color === "gold" ? "text-gold" : "text-purple";

                        return (
                            <button
                                key={route.id}
                                type="button"
                                onClick={() => setSelectedRouteId(route.id)}
                                className={`relative rounded-2xl border-2 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/20 ${isSelected ? `${borderColor} ${shadowColor}` : "border-white/10"} bg-ink-2/60 backdrop-blur-md`}
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-ink-3 text-2xl">{route.emoji}</div>
                                    <span className={`rounded-full border border-white/10 bg-ink-3 px-3 py-1 font-mono text-xs font-bold ${textColor}`}>{route.cost} XLM</span>
                                </div>
                                <h2 className="mb-1 text-lg font-bold text-paper">{route.title}</h2>
                                <p className="mb-4 text-xs text-muted">{route.desc}</p>
                                <div className="flex items-end justify-between border-t border-white/10 pt-3">
                                    <div>
                                        <span className="font-mono text-xs uppercase tracking-wider text-muted">Reward</span>
                                        <p className={`text-sm font-bold ${textColor}`}>{route.stamp}</p>
                                    </div>
                                    <span className={`text-xs font-bold ${isSelected ? textColor : "text-muted"}`}>{isSelected ? "Selected" : "Select route"}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="space-y-5">
                    <EscrowPanel route={selectedRoute} />
                    <SendForm />
                </div>
            </div>
        </div>
    );
}
