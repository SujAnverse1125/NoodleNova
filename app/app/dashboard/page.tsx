"use client";

import { useWallet } from "@/app/context/WalletContext";
import { BalanceCard } from "@/components/BalanceCard";
import { TxFeed } from "@/components/TxFeed";
import Link from "next/link";

export default function DashboardPage() {
    const { isConnected, rareStamps } = useWallet();

    return (
        <div className="dashboard-page">
            <header className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
                <div>
                    <p className="text-cyan font-mono text-xs tracking-widest mb-2 uppercase">COMMAND CENTER • 指揮所</p>
                    <h1 className="text-4xl font-bold tracking-tight text-paper drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Dashboard</h1>
                    <small className="text-muted mt-2 block">Manage your courier profile, view your balance, and track your recent deliveries.</small>
                </div>
                <div className="px-4 py-2 rounded-full border-2 border-cyan bg-cyan/10 text-cyan font-bold text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(90,229,225,0.2)]">
                    <i className="w-2 h-2 rounded-full bg-cyan animate-pulse" /> Courier Active
                </div>
            </header>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#121126] border border-white/10 rounded-xl p-5 flex items-center gap-4 hover:border-pink/50 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                    <span className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-pink/20 p-1.5 border border-pink/30">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/icon_routes.png" alt="Routes" className="w-full h-full object-cover rounded-lg" />
                    </span>
                    <div>
                        <p className="text-muted font-mono text-[10px] tracking-wider mb-1">ROUTES FUNDED</p>
                        <h2 className="text-2xl font-bold text-paper leading-none">12</h2>
                        <small className="text-pink text-xs font-bold mt-1 block">+3 this week</small>
                    </div>
                </div>
                <div className="bg-[#121126] border border-white/10 rounded-xl p-5 flex items-center gap-4 hover:border-cyan/50 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                    <span className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-cyan/20 p-1.5 border border-cyan/30">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/icon_dashboard.png" alt="XLM" className="w-full h-full object-cover rounded-lg" />
                    </span>
                    <div>
                        <p className="text-muted font-mono text-[10px] tracking-wider mb-1">XLM SENT</p>
                        <h2 className="text-2xl font-bold text-paper leading-none">450</h2>
                        <small className="text-cyan text-xs font-bold mt-1 block">Testnet XLM</small>
                    </div>
                </div>
                <div className="bg-[#121126] border border-white/10 rounded-xl p-5 flex items-center gap-4 hover:border-gold/50 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                    <span className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-gold/20 p-1.5 border border-gold/30">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/pixel_star.png" alt="Stamps" className="w-full h-full object-cover rounded-lg" />
                    </span>
                    <div>
                        <p className="text-muted font-mono text-[10px] tracking-wider mb-1">STAMPS EARNED</p>
                        <h2 className="text-2xl font-bold text-paper leading-none">{rareStamps * 4}</h2>
                        <small className="text-gold text-xs font-bold mt-1 block">{rareStamps} Rare</small>
                    </div>
                </div>
                <div className="bg-[#121126] border border-white/10 rounded-xl p-5 flex items-center gap-4 hover:border-purple/50 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                    <span className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-purple/20 p-1.5 border border-purple/30">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/icon_quests.png" alt="Rank" className="w-full h-full object-cover rounded-lg" />
                    </span>
                    <div>
                        <p className="text-muted font-mono text-[10px] tracking-wider mb-1">COURIER RANK</p>
                        <h2 className="text-2xl font-bold text-paper leading-none">Silver</h2>
                        <small className="text-purple text-xs font-bold mt-1 block">Top 20%</small>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="dashboard-grid">
                {/* Left Column */}
                <div className="flex flex-col gap-4">
                    {/* Balance Card (reused from original build) */}
                    <BalanceCard />

                    {/* Route Progress */}
                    <div className="panel route-progress">
                        <div className="panel-title">
                            <div>
                                <p><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg> CURRENT ROUTE</p>
                                <h2>Starlight Express</h2>
                            </div>
                            <Link href="/app/map" className="text-button">View Map →</Link>
                        </div>
                        <div className="route-line">
                            <i className="active" />
                            <i className="active" />
                            <i />
                            <i />
                        </div>
                        <div className="route-stops">
                            <span>Start</span>
                            <span>Checkpoint</span>
                            <span>Sector 9</span>
                            <span>Destination</span>
                        </div>
                        <div className="route-countdown">
                            <b>14:22</b>
                            <span>remaining</span>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-4">
                    {/* Rank Panel */}
                    <div className="panel rank-panel">
                        <div className="panel-title">
                            <div>
                                <p>PROGRESS</p>
                                <h2>Courier Rank</h2>
                            </div>
                            <div className="rank-icon">⭐</div>
                        </div>
                        <div className="rank-meter">
                            <span style={{ width: "65%" }} />
                        </div>
                        <p><b>650 / 1000</b> XP to Gold Rank</p>
                        <Link href="/app/quests" className="button w-full">View Quests</Link>
                    </div>

                    {/* TxFeed (reused from original build) */}
                    <TxFeed />
                </div>
            </div>
        </div>
    );
}
