"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
    { href: "/app/game", icon: "/icon_game.png", isImage: true, label: "Noodle Run" },
    { href: "/app/comic", icon: "📖", isImage: false, label: "Comic Story" },
    { href: "/app/archive", icon: "/icon_archive.png", isImage: true, label: "Manga Archive" },
    { href: "/app/map", icon: "/icon_map.png", isImage: true, label: "Stellar Map" },
    { href: "/app/quests", icon: "/icon_quests.png", isImage: true, label: "Side Quests" },
    { href: "/app/dashboard", icon: "/icon_dashboard.png", isImage: true, label: "Command Center" },
    { href: "/app/routes", icon: "/icon_routes.png", isImage: true, label: "Sponsor Routes" },
    { href: "/app/stamps", icon: "🏅", isImage: false, label: "Stamp Vault" },
    { href: "/app/dispatch", icon: "📡", isImage: false, label: "Live Dispatch" },
];

interface SidebarProps {
    mobileOpen: boolean;
    onClose: () => void;
    onReplayPrologue: () => void;
}

export function Sidebar({ mobileOpen, onClose, onReplayPrologue }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile scrim */}
            {mobileOpen && (
                <button className="scrim fixed inset-0 z-[19] bg-black/55 border-0" onClick={onClose} />
            )}

            <aside className={`sidebar glass-panel ${mobileOpen ? "mobile-open" : ""}`}>
                {/* Top — brand + close */}
                <div className="sidebar-top">
                    <Link href="/" className="brand" onClick={onClose}>
                        <span className="brand-mark w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-pink">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/icon_logo.png" alt="Logo" className="w-full h-full object-cover" />
                        </span>
                        <span>
                            <b>Noodle Nova</b>
                            <small>STELLAR TESTNET</small>
                        </span>
                    </Link>
                    <button className="mobile-close" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav>
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={pathname === item.href ? "active" : ""}
                            onClick={onClose}
                        >
                            <span className={item.isImage ? "w-5 h-5 flex items-center justify-center overflow-hidden rounded" : ""}>
                                {item.isImage ? (
                                    <img src={item.icon} alt={item.label} className="w-full h-full object-cover" />
                                ) : (
                                    item.icon
                                )}
                            </span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Replay Prologue */}
                <button className="story-replay" onClick={() => { onReplayPrologue(); onClose(); }}>
                    <span>🔄</span>
                    Replay Prologue
                </button>

                {/* Bottom — status */}
                <div className="sidebar-bottom">
                    <p>NETWORK</p>
                    <div className="status-badge cyan">
                        <i />
                        Testnet Online
                    </div>
                    <a href="https://stellar.org" target="_blank" rel="noopener noreferrer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                        </svg>
                        Built on Stellar
                    </a>
                </div>
            </aside>
        </>
    );
}
