"use client";

import { useEffect, useState } from "react";

export default function DispatchPage() {
    const [events, setEvents] = useState([
        { id: 1, type: "sponsor", text: "Route 02 funded by GCNOVA...XLM9", time: "Just now", color: "pink" },
        { id: 2, type: "delivery", text: "Courier HANA completed Route 01", time: "2m ago", color: "cyan" },
        { id: 3, type: "stamp", text: "Rare Stamp minted to GABC...1234", time: "5m ago", color: "gold" },
        { id: 4, type: "sponsor", text: "Route 04 funded by GDEF...5678", time: "12m ago", color: "pink" },
        { id: 5, type: "system", text: "Network fee adjustment: 100 stroops", time: "1h ago", color: "muted" },
    ]);

    // Simulate incoming events
    useEffect(() => {
        const interval = setInterval(() => {
            setEvents((prev) => {
                const newEvent = {
                    id: Date.now(),
                    type: "sponsor",
                    text: `Route 0${Math.floor(Math.random() * 4) + 1} funded by G${Math.random().toString(36).substring(2, 6).toUpperCase()}...`,
                    time: "Just now",
                    color: "pink",
                };
                return [newEvent, ...prev].slice(0, 8);
            });
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
            <header className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
                <div>
                    <p className="text-cyan font-mono text-xs tracking-[0.2em] uppercase mb-1 animate-pulse">Network Monitor</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-paper mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        Live Dispatch
                    </h1>
                    <p className="text-muted text-sm">Real-time view of all courier activity on the Stellar Testnet.</p>
                </div>
                <div className="px-4 py-2 rounded-full border-2 border-cyan bg-cyan/10 text-cyan font-bold text-sm flex items-center gap-2 shadow-neon-cyan">
                    <i className="w-2 h-2 rounded-full bg-cyan animate-pulse" /> Live
                </div>
            </header>

            <div className="dispatch-layout">
                {/* Radar Panel */}
                <div className="panel radar">
                    <div className="panel-title">
                        <div>
                            <p>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <circle cx="12" cy="12" r="2" />
                                </svg>
                                SECTOR SCAN
                            </p>
                            <h2>Active Routes</h2>
                        </div>
                    </div>

                    <div className="radar-field">
                        <div className="radar-ring" />
                        <div className="radar-ring two" />
                        <div className="radar-ring three" />
                        <div className="radar-core overflow-hidden flex items-center justify-center bg-pink">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/icon_logo.png" alt="Radar" className="w-full h-full object-cover" />
                        </div>
                        <div className="radar-sweep" />

                        {/* Pips */}
                        <div className="route-pip p1" />
                        <div className="route-pip p2" />
                        <div className="route-pip p3" />
                        <div className="route-pip p4" />
                    </div>

                    <div className="radar-legend">
                        <span><i className="pink-dot" /> High Priority</span>
                        <span><i className="cyan-dot" /> Standard</span>
                        <span><i className="gold-dot" /> VIP</span>
                    </div>
                </div>

                {/* Console Panel */}
                <div className="panel event-console">
                    <div className="panel-title">
                        <div>
                            <p>EVENT LOG</p>
                            <h2>On-Chain Activity</h2>
                        </div>
                    </div>

                    <div className="pipeline">
                        <div>
                            <span className="overflow-hidden p-1">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/icon_routes.png" alt="Sponsor" className="w-full h-full object-cover rounded" />
                            </span>
                            <b>Sponsor</b>
                            <small>Funds Route</small>
                        </div>
                        <span className="text-muted">→</span>
                        <div>
                            <span>🔒</span>
                            <b>Escrow</b>
                            <small>Holds XLM</small>
                        </div>
                        <span className="text-muted">→</span>
                        <div>
                            <span className="overflow-hidden bg-pink">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/icon_logo.png" alt="Courier" className="w-full h-full object-cover" />
                            </span>
                            <b>Courier</b>
                            <small>Delivers</small>
                        </div>
                    </div>

                    <div className="console-lines">
                        {events.map((ev) => (
                            <div key={ev.id}>
                                <span className="overflow-hidden flex items-center justify-center p-1">
                                    {ev.color === "pink" ? (
                                        <img src="/icon_routes.png" alt="Sponsor" className="w-full h-full object-cover rounded" />
                                    ) : ev.color === "cyan" ? (
                                        <img src="/icon_logo.png" alt="Courier" className="w-full h-full object-cover rounded-full bg-pink" />
                                    ) : ev.color === "gold" ? "🏅" : "⚙️"}
                                </span>
                                <p>
                                    <b style={{ color: `var(--${ev.color})` }}>[{ev.type.toUpperCase()}]</b> {ev.text}
                                    <small>{ev.time}</small>
                                </p>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                                </svg>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
