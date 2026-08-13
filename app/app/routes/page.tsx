"use client";

import { SendForm } from "@/components/SendForm";
import { useState } from "react";

export default function RoutesPage() {
    const [selectedRoute, setSelectedRoute] = useState<number | null>(null);

    const routes = [
        { id: 1, title: "StarPort Embassy", cost: "50", emoji: "🍜", desc: "High priority delivery to the ambassador.", stamp: "1x Common", color: "cyan" },
        { id: 2, title: "Neon Market", cost: "120", emoji: "🛸", desc: "Supply run for the underground market.", stamp: "2x Common", color: "pink" },
        { id: 3, title: "Orbital Station 9", cost: "300", emoji: "🛰️", desc: "Deep space delivery. High risk.", stamp: "1x Rare", color: "gold" },
        { id: 4, title: "Sector 7 Slums", cost: "25", emoji: "🏙️", desc: "Charity run for the lower levels.", stamp: "1x Common", color: "purple" },
    ];

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
            {/* Header */}
            <header className="mb-8">
                <p className="text-cyan font-mono text-xs tracking-[0.2em] uppercase mb-1">Marketplace</p>
                <h1 className="text-4xl md:text-5xl font-bold text-paper mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    Sponsor Routes
                </h1>
                <p className="text-muted text-sm">Fund delivery missions with XLM on Stellar Testnet to earn stamps.</p>
            </header>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Left: Routes Grid */}
                <div className="md:col-span-2">
                    <div className="grid sm:grid-cols-2 gap-4">
                        {routes.map((route) => {
                            const isSelected = selectedRoute === route.id;
                            const borderColor = route.color === "cyan" ? "border-cyan/40" : route.color === "pink" ? "border-pink/40" : route.color === "gold" ? "border-gold/40" : "border-purple/40";
                            const shadowColor = route.color === "cyan" ? "shadow-neon-cyan" : route.color === "pink" ? "shadow-neon-pink" : route.color === "gold" ? "shadow-neon-gold" : "shadow-neon-purple";
                            const textColor = route.color === "cyan" ? "text-cyan" : route.color === "pink" ? "text-pink" : route.color === "gold" ? "text-gold" : "text-purple";

                            return (
                                <div
                                    key={route.id}
                                    className={`relative rounded-2xl border-2 ${isSelected ? `${borderColor} ${shadowColor}` : "border-white/10"} bg-ink-2/60 backdrop-blur-md p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-white/20`}
                                    onClick={() => setSelectedRoute(route.id)}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-ink-3 border border-white/10 flex items-center justify-center text-2xl">
                                            {route.emoji}
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${textColor} bg-ink-3 border border-white/10`}>
                                            {route.cost} XLM
                                        </div>
                                    </div>
                                    <h2 className="text-lg font-bold text-paper mb-1">{route.title}</h2>
                                    <p className="text-muted text-xs mb-4">{route.desc}</p>
                                    <div className="flex justify-between items-center pt-3 border-t border-white/10">
                                        <div>
                                            <span className="text-xs font-mono text-muted uppercase tracking-wider">Reward</span>
                                            <p className={`font-bold text-sm ${textColor}`}>{route.stamp}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-mono text-muted uppercase tracking-wider">Status</span>
                                            <p className="font-bold text-sm text-cyan">Open</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Escrow strip */}
                    <div className="mt-6 rounded-xl border border-white/10 bg-ink-2/60 backdrop-blur-md p-4 flex justify-between items-center">
                        <div>
                            <p className="text-xs font-mono text-muted tracking-wider uppercase">Escrow Contract</p>
                            <b className="text-paper text-sm">Noodle Nova Treasury</b>
                            <span className="text-xs text-muted ml-2">Testnet Only</span>
                        </div>
                        <code className="font-mono text-cyan text-xs bg-ink-3 px-3 py-1.5 rounded-lg border border-cyan/20">GCNOVA...XLM9</code>
                    </div>
                </div>

                {/* Right: Send Form */}
                <div>
                    <div className="sticky top-6">
                        <div className="mb-4 p-5 border-2 border-white/10 rounded-2xl bg-ink-2/60 backdrop-blur-md shadow-glass">
                            <h3 className="text-sm font-bold text-cyan mb-1">
                                {selectedRoute ? `Funding: ${routes.find(r => r.id === selectedRoute)?.title}` : "Select a route to fund"}
                            </h3>
                            <p className="text-xs text-muted">
                                {selectedRoute
                                    ? `Cost: ${routes.find(r => r.id === selectedRoute)?.cost} XLM`
                                    : "Click a route card to view details."}
                            </p>
                        </div>

                        {/* Reused SendForm component */}
                        <SendForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
