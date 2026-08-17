"use client";

import { useState } from "react";
import { useWallet } from "@/app/context/WalletContext";
import { useToast } from "@/app/context/ToastContext";
import Link from "next/link";
import { FeedbackModal } from "./FeedbackModal";

interface TopbarProps {
    onMenuOpen: () => void;
}

export function Topbar({ onMenuOpen }: TopbarProps) {
    const { address, isConnected, connect, disconnect, isLoading } = useWallet();
    const { showSuccess } = useToast();
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    const truncated = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "";

    return (
        <>
            <div className="topbar glass-panel border-t-0 border-x-0 !bg-ink-2/40">
                {/* Mobile hamburger */}
                <button className="menu-button" onClick={onMenuOpen}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12h18M3 6h18M3 18h18" />
                    </svg>
                </button>

                {/* Mobile brand */}
                <div className="mobile-brand hidden max-[780px]:block">
                    <Link href="/" className="brand" style={{ transform: "scale(0.88)", transformOrigin: "left" }}>
                        <span className="brand-mark w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-pink">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/icon_logo.png" alt="Logo" className="w-full h-full object-cover" />
                        </span>
                        <span>
                            <b>Noodle Nova</b>
                        </span>
                    </Link>
                </div>

                {/* Right actions */}
                <div className="topbar-actions">
                    {/* Feedback button */}
                    <button
                        onClick={() => setIsFeedbackOpen(true)}
                        className="text-xs font-bold text-gold hover:text-gold/80 transition-colors hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/30 bg-gold/10"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Feedback
                    </button>

                    {/* Notification bell */}
                    <button
                        className="icon-button notification relative"
                        onClick={() => showSuccess("You have no new notifications.")}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                        </svg>
                        <i className="absolute top-[7px] right-[7px] w-[5px] h-[5px] border border-ink rounded-full bg-pink" />
                    </button>

                    {/* Wallet button */}
                    {isConnected ? (
                        <div className="flex items-center gap-2">
                            <span className="text-[0.72rem] text-muted font-mono">{truncated}</span>
                            <button className="wallet-button" onClick={disconnect}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                                </svg>
                                Disconnect
                            </button>
                        </div>
                    ) : (
                        <button className="wallet-button" onClick={() => connect()} disabled={isLoading}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                <path d="M1 10h22" />
                            </svg>
                            {isLoading ? "Connecting..." : "Connect Wallet"}
                        </button>
                    )}
                </div>
            </div>

            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
            />
        </>
    );
}
