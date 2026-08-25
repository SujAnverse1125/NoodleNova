"use client";

import { SendForm } from "@/components/SendForm";
import { useState } from "react";
import { useWallet } from "@/app/context/WalletContext";
import { useToast } from "@/app/context/ToastContext";
import { trackProductEvent } from "@/lib/analytics";

type TransactionStatus = {
    routeId: number;
    state: "pending" | "success" | "error";
    message: string;
    hash?: string;
};

export default function RoutesPage() {
    const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
    const [isSponsoring, setIsSponsoring] = useState<number | null>(null);
    const [transactionStatus, setTransactionStatus] = useState<TransactionStatus | null>(null);
    const { address } = useWallet();
    const { showSuccess, showError } = useToast();

    const routes = [
        { id: 1, title: "StarPort Embassy", cost: "50", emoji: "🍜", desc: "High priority delivery to the ambassador.", stamp: "1x Common", color: "cyan" },
        { id: 2, title: "Neon Market", cost: "120", emoji: "🛸", desc: "Supply run for the underground market.", stamp: "2x Common", color: "pink" },
        { id: 3, title: "Orbital Station 9", cost: "300", emoji: "🛰️", desc: "Deep space delivery. High risk.", stamp: "1x Rare", color: "gold" },
        { id: 4, title: "Sector 7 Slums", cost: "25", emoji: "🏙️", desc: "Charity run for the lower levels.", stamp: "1x Common", color: "purple" },
    ];

    const handleSponsor = async (routeId: number) => {
        if (!address) {
            showError("Please connect your wallet first");
            return;
        }

        setIsSponsoring(routeId);
        setTransactionStatus({ routeId, state: "pending", message: "Submitting your Testnet route transaction…" });
        trackProductEvent("transaction_submitted", { flow: "sponsor_route", route_id: routeId });
        try {
            const res = await fetch("/api/rewards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ walletAddress: address, type: "sponsor_route" }),
            });
            const data = await res.json().catch(() => null);

            if (res.ok && data?.success && data.hash) {
                trackProductEvent("transaction_succeeded", { flow: "sponsor_route", route_id: routeId });
                setTransactionStatus({ routeId, state: "success", message: "Route sponsored successfully. Your Testnet receipt is ready.", hash: data.hash });
                showSuccess("Route sponsored! Reward sent.", data.hash);
            } else {
                const message = data?.error || "The route could not be sponsored. Please retry.";
                trackProductEvent("transaction_failed", { flow: "sponsor_route", route_id: routeId, reason: "api_error" });
                setTransactionStatus({ routeId, state: "error", message });
                showError(message);
            }
        } catch (error) {
            trackProductEvent("transaction_failed", { flow: "sponsor_route", route_id: routeId, reason: "network_error" });
            const message = "Network error while sponsoring. Check your connection and retry.";
            setTransactionStatus({ routeId, state: "error", message });
            showError(message);
        } finally {
            setIsSponsoring(null);
        }
    };

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

            <div className="max-w-4xl mx-auto">
                {/* Routes Grid */}
                <div className="grid sm:grid-cols-2 gap-6">
                    {routes.map((route) => {
                        const isSelected = selectedRoute === route.id;
                        const borderColor = route.color === "cyan" ? "border-cyan/40" : route.color === "pink" ? "border-pink/40" : route.color === "gold" ? "border-gold/40" : "border-purple/40";
                        const shadowColor = route.color === "cyan" ? "shadow-neon-cyan" : route.color === "pink" ? "shadow-neon-pink" : route.color === "gold" ? "shadow-neon-gold" : "shadow-neon-purple";
                        const textColor = route.color === "cyan" ? "text-cyan" : route.color === "pink" ? "text-pink" : route.color === "gold" ? "text-gold" : "text-purple";

                        return (
                            <div
                                key={route.id}
                                className={`relative rounded-2xl border-2 ${isSelected ? `${borderColor} ${shadowColor}` : "border-white/10"} bg-ink-2/60 backdrop-blur-md p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-white/20`}
                                onClick={() => setSelectedRoute(route.id)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-14 h-14 rounded-xl bg-ink-3 border border-white/10 flex items-center justify-center text-3xl">
                                        {route.emoji}
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-sm font-bold font-mono ${textColor} bg-ink-3 border border-white/10`}>
                                        {route.cost} XLM
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-paper mb-2">{route.title}</h2>
                                <p className="text-muted text-sm mb-6">{route.desc}</p>
                                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                    <div>
                                        <span className="text-xs font-mono text-muted uppercase tracking-wider">Reward</span>
                                        <p className={`font-bold text-base ${textColor}`}>{route.stamp}</p>
                                    </div>
                                    <div className="text-right">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSponsor(route.id);
                                            }}
                                            disabled={isSponsoring !== null}
                                            className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors ${isSponsoring === route.id ? "bg-white/10 text-muted" : "bg-cyan/20 text-cyan hover:bg-cyan/30 border border-cyan/30"}`}
                                        >
                                            {isSponsoring === route.id ? "Funding..." : "Sponsor"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {transactionStatus && (
                    <div
                        role="status"
                        aria-live="polite"
                        className={`mt-6 rounded-xl border p-4 ${transactionStatus.state === "success"
                            ? "border-neon-green/30 bg-neon-green/5"
                            : transactionStatus.state === "error"
                                ? "border-red-400/30 bg-red-400/5"
                                : "border-cyan/30 bg-cyan/5"
                            }`}
                    >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className={`text-sm font-semibold ${transactionStatus.state === "success" ? "text-neon-green" : transactionStatus.state === "error" ? "text-red-300" : "text-cyan"}`}>
                                    {transactionStatus.state === "pending" ? "Transaction pending" : transactionStatus.state === "success" ? "Transaction confirmed" : "Transaction needs attention"}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-muted">{transactionStatus.message}</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-3">
                                {transactionStatus.state === "success" && transactionStatus.hash && (
                                    <a
                                        className="text-xs font-bold text-cyan underline-offset-4 hover:underline"
                                        href={`https://stellar.expert/explorer/testnet/tx/${transactionStatus.hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View receipt ↗
                                    </a>
                                )}
                                {transactionStatus.state === "error" && (
                                    <button
                                        type="button"
                                        className="rounded-lg border border-cyan/30 px-3 py-2 text-xs font-bold text-cyan hover:bg-cyan/10"
                                        onClick={() => handleSponsor(transactionStatus.routeId)}
                                    >
                                        Retry transaction
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Escrow strip */}
                <div className="mt-8 rounded-xl border border-white/10 bg-ink-2/60 backdrop-blur-md p-5 flex justify-between items-center">
                    <div>
                        <p className="text-xs font-mono text-muted tracking-wider uppercase">Escrow Contract</p>
                        <b className="text-paper text-base">Noodle Nova Treasury</b>
                        <span className="text-xs text-muted ml-3">Testnet Only</span>
                    </div>
                    <code className="font-mono text-cyan text-sm bg-ink-3 px-4 py-2 rounded-lg border border-cyan/20">GCNOVA...XLM9</code>
                </div>
            </div>
        </div>
    );
}
