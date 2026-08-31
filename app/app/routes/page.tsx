"use client";

import { EscrowPanel } from "@/components/EscrowPanel";
import { SendForm } from "@/components/SendForm";
import { useState } from "react";
import { useWallet } from "@/app/context/WalletContext";
import { useToast } from "@/app/context/ToastContext";
import { trackProductEvent } from "@/lib/analytics";

const ROUTES = [
    { id: 1, title: "StarPort Embassy", cost: "50", emoji: "🍜", desc: "High priority delivery to the ambassador.", stamp: "1x Common", color: "cyan" },
    { id: 2, title: "Neon Market", cost: "120", emoji: "🛸", desc: "Supply run for the underground market.", stamp: "2x Common", color: "pink" },
    { id: 3, title: "Orbital Station 9", cost: "300", emoji: "🛰️", desc: "Deep space delivery. High risk.", stamp: "1x Rare", color: "gold" },
    { id: 4, title: "Sector 7 Slums", cost: "25", emoji: "🏙️", desc: "Charity run for the lower levels.", stamp: "1x Common", color: "purple" },
];

type TransactionStatus = {
    routeId: number;
    state: "pending" | "success" | "error";
    message: string;
    hash?: string;
};

export default function RoutesPage() {
    const [selectedRouteId, setSelectedRouteId] = useState<number | null>(1);
    const [isSponsoring, setIsSponsoring] = useState<number | null>(null);
    const [transactionStatus, setTransactionStatus] = useState<TransactionStatus | null>(null);
    const { address } = useWallet();
    const { showSuccess, showError } = useToast();

    const selectedRoute = ROUTES.find((route) => route.id === selectedRouteId) ?? null;

    const handleQuickSponsor = async (routeId: number) => {
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
        <div className="mx-auto max-w-6xl p-6 md:p-10">
            {/* Header */}
            <header className="mb-8">
                <p className="mb-1 font-mono text-xs uppercase tracking-[0.2em] text-cyan">Marketplace</p>
                <h1 className="mb-2 text-4xl font-bold text-paper drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] md:text-5xl">
                    Sponsor Routes
                </h1>
                <p className="text-sm text-muted">Fund delivery missions with XLM on Stellar Testnet and lock or release payments via Soroban smart contracts.</p>
            </header>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {ROUTES.map((route) => {
                            const isSelected = selectedRouteId === route.id;
                            const borderColor = route.color === "cyan" ? "border-cyan/40" : route.color === "pink" ? "border-pink/40" : route.color === "gold" ? "border-gold/40" : "border-purple/40";
                            const shadowColor = route.color === "cyan" ? "shadow-neon-cyan" : route.color === "pink" ? "shadow-neon-pink" : route.color === "gold" ? "shadow-neon-gold" : "shadow-neon-purple";
                            const textColor = route.color === "cyan" ? "text-cyan" : route.color === "pink" ? "text-pink" : route.color === "gold" ? "text-gold" : "text-purple";

                            return (
                                <div
                                    key={route.id}
                                    onClick={() => setSelectedRouteId(route.id)}
                                    className={`relative rounded-2xl border-2 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/20 cursor-pointer ${isSelected ? `${borderColor} ${shadowColor}` : "border-white/10"} bg-ink-2/60 backdrop-blur-md`}
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
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleQuickSponsor(route.id);
                                                }}
                                                disabled={isSponsoring === route.id}
                                                className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${isSponsoring === route.id ? "bg-white/10 text-muted" : "bg-cyan/20 text-cyan hover:bg-cyan/30 border border-cyan/30"}`}
                                            >
                                                {isSponsoring === route.id ? "Funding..." : "Quick Sponsor"}
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
                            className={`rounded-xl border p-4 ${transactionStatus.state === "success"
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
                                            onClick={() => handleQuickSponsor(transactionStatus.routeId)}
                                        >
                                            Retry transaction
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-5">
                    <EscrowPanel route={selectedRoute} />
                    <SendForm />
                </div>
            </div>
        </div>
    );
}
