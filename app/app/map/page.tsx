"use client";

import { useWallet } from "@/app/context/WalletContext";
import Link from "next/link";

export default function MapPage() {
    const { address, unlockedRoutes } = useWallet();
    const truncated = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "Not connected";

    return (
        <div className="map-page">
            <header className="flex justify-between items-end mb-6">
                <div>
                    <p className="text-cyan font-mono text-xs tracking-widest mb-2 uppercase">ASTRAL DELIVERY ATLAS • 地図 / CHIZU</p>
                    <h1 className="text-4xl font-bold tracking-tight">Pick a route, courier.</h1>
                </div>
                <div className="flex gap-3">
                    <div className="px-3 py-1.5 rounded-full border border-white/10 bg-ink-3 text-gold font-mono text-sm flex items-center gap-2">
                        <span>🪙</span> 220
                    </div>
                    <div className="px-3 py-1.5 rounded-full border border-white/10 bg-ink-3 text-gold font-mono text-sm flex items-center gap-2">
                        <span>✨</span> 0/4 routes
                    </div>
                </div>
            </header>

            <div className="star-map-container relative w-full h-[600px] border border-white/10 rounded-2xl overflow-hidden bg-[#0a091a]">
                {/* Dotted Grid Background */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

                {/* Orbital Lines */}
                <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] border border-pink/20 rounded-full -translate-x-1/2 -translate-y-1/2 border-dashed" />
                <div className="absolute top-1/2 left-1/2 w-[1200px] h-[1200px] border border-cyan/10 rounded-full -translate-x-1/2 -translate-y-1/2 border-dashed" />

                {/* Route 1: Active */}
                <div className={`route-card ${unlockedRoutes >= 1 ? "active border-white shadow-[0_0_30px_rgba(90,229,225,0.15)]" : "locked border-white/10 opacity-80"} absolute top-[45%] left-[10%] w-[280px] bg-[#121126] border-2 rounded-xl p-5`}>
                    <div className={`absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-[#0a091a] flex items-center justify-center text-xl ${unlockedRoutes >= 1 ? "bg-gold shadow-[0_0_15px_rgba(255,201,91,0.3)]" : "bg-ink-3 text-muted"}`}>
                        {unlockedRoutes >= 1 ? "🍜" : "🔒"}
                    </div>
                    <span className={`${unlockedRoutes >= 1 ? "text-cyan" : "text-muted"} font-mono text-xs font-bold block mb-4`}>01</span>
                    <p className="text-muted text-xs mb-1">Nebula Noodlebar</p>
                    <h2 className={`text-xl font-bold mb-1 ${unlockedRoutes >= 1 ? "text-paper" : "text-paper/50"}`}>Meteor Miso</h2>
                    <p className="text-muted text-xs mb-6">Learn the lanes</p>
                    {unlockedRoutes >= 1 ? (
                        <Link href="/app/game" className="w-full py-2.5 bg-cyan text-ink font-bold rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-cyan/90 transition-colors">
                            ▶ Play route
                        </Link>
                    ) : (
                        <button disabled className="w-full py-2.5 bg-white/5 text-muted font-bold rounded-lg text-sm cursor-not-allowed">
                            Route locked
                        </button>
                    )}
                </div>

                {/* Route 2 */}
                <div className={`route-card ${unlockedRoutes >= 2 ? "active border-pink shadow-[0_0_30px_rgba(255,94,158,0.15)]" : "locked border-white/10 opacity-80"} absolute top-[15%] left-[35%] w-[280px] bg-[#121126] border-2 rounded-xl p-5`}>
                    <div className={`absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-[#0a091a] flex items-center justify-center text-xl ${unlockedRoutes >= 2 ? "bg-pink shadow-[0_0_15px_rgba(255,94,158,0.3)]" : "bg-ink-3 text-muted"}`}>
                        {unlockedRoutes >= 2 ? "🍶" : "🔒"}
                    </div>
                    <span className={`${unlockedRoutes >= 2 ? "text-pink" : "text-muted"} font-mono text-xs font-bold block mb-4`}>02</span>
                    <p className="text-muted text-xs mb-1">Lightwave Arcade</p>
                    <h2 className={`text-xl font-bold mb-1 ${unlockedRoutes >= 2 ? "text-paper" : "text-paper/50"}`}>Aurora Shoyu</h2>
                    <p className="text-muted text-xs mb-6">Unlock after mission 1</p>
                    {unlockedRoutes >= 2 ? (
                        <Link href="/app/game2" className="w-full py-2.5 bg-pink text-ink font-bold rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-pink/90 transition-colors">
                            ▶ Play route
                        </Link>
                    ) : (
                        <button disabled className="w-full py-2.5 bg-white/5 text-muted font-bold rounded-lg text-sm cursor-not-allowed">
                            Route locked
                        </button>
                    )}
                </div>

                {/* Route 3 */}
                <div className={`route-card ${unlockedRoutes >= 3 ? "active border-gold shadow-[0_0_30px_rgba(255,201,91,0.15)]" : "locked border-white/10 opacity-80"} absolute top-[55%] left-[55%] w-[280px] bg-[#121126] border-2 rounded-xl p-5`}>
                    <div className={`absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-[#0a091a] flex items-center justify-center text-xl ${unlockedRoutes >= 3 ? "bg-gold shadow-[0_0_15px_rgba(255,201,91,0.3)]" : "bg-ink-3 text-muted"}`}>
                        {unlockedRoutes >= 3 ? "🌌" : "🔒"}
                    </div>
                    <span className={`${unlockedRoutes >= 3 ? "text-gold" : "text-muted"} font-mono text-xs font-bold block mb-4`}>03</span>
                    <p className="text-muted text-xs mb-1">Singularity Station</p>
                    <h2 className={`text-xl font-bold mb-1 ${unlockedRoutes >= 3 ? "text-paper" : "text-paper/50"}`}>Black Hole Broth</h2>
                    <p className="text-muted text-xs mb-6">Unlock after mission 2</p>
                    {unlockedRoutes >= 3 ? (
                        <Link href="/app/game3" className="w-full py-2.5 bg-gold text-ink font-bold rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-gold/90 transition-colors">
                            ▶ Play route
                        </Link>
                    ) : (
                        <button disabled className="w-full py-2.5 bg-white/5 text-muted font-bold rounded-lg text-sm cursor-not-allowed">
                            Route locked
                        </button>
                    )}
                </div>

                {/* Route 4 */}
                <div className={`route-card ${unlockedRoutes >= 4 ? "active border-purple shadow-[0_0_30px_rgba(147,51,234,0.15)]" : "locked border-white/10 opacity-80"} absolute top-[20%] left-[80%] w-[280px] bg-[#121126] border-2 rounded-xl p-5`}>
                    <div className={`absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-[#0a091a] flex items-center justify-center text-xl ${unlockedRoutes >= 4 ? "bg-purple shadow-[0_0_15px_rgba(147,51,234,0.3)]" : "bg-ink-3 text-muted"}`}>
                        {unlockedRoutes >= 4 ? "🏪" : "🔒"}
                    </div>
                    <span className={`${unlockedRoutes >= 4 ? "text-purple" : "text-muted"} font-mono text-xs font-bold block mb-4`}>04</span>
                    <p className="text-muted text-xs mb-1">Moonbean Market</p>
                    <h2 className={`text-xl font-bold mb-1 ${unlockedRoutes >= 4 ? "text-paper" : "text-paper/50"}`}>Comet Creamy</h2>
                    <p className="text-muted text-xs mb-6">Unlock after mission 3</p>
                    {unlockedRoutes >= 4 ? (
                        <Link href="/app/game4" className="w-full py-2.5 bg-purple text-ink font-bold rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-purple/90 transition-colors">
                            ▶ Play route
                        </Link>
                    ) : (
                        <button disabled className="w-full py-2.5 bg-white/5 text-muted font-bold rounded-lg text-sm cursor-not-allowed">
                            Route locked
                        </button>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center mt-4 text-sm">
                <div className="flex items-center gap-2 text-cyan font-bold">
                    <span>✨</span> Meet characters and accept side quests • 行こう!
                </div>
                <Link href="/app/game" className="text-pink font-bold hover:underline">
                    Visit scooter garage →
                </Link>
            </div>
        </div>
    );
}
