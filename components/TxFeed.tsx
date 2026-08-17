"use client";

import { useWallet } from "@/app/context/WalletContext";
import { useState, useEffect, useCallback } from "react";

const HORIZON_URL =
    process.env.NEXT_PUBLIC_HORIZON_URL ||
    "https://horizon-testnet.stellar.org";

interface Transaction {
    id: string;
    hash: string;
    created_at: string;
    source_account: string;
    fee_charged: string;
    operation_count: number;
    memo?: string;
    successful: boolean;
}

export function TxFeed() {
    const { address, isConnected } = useWallet();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // The app's sponsor wallet public key
    const SPONSOR_PUBLIC_KEY = "GC4A3NM4JORA2NI5B556ME25H3U7OPDY3FDFCCCSRG5CF6WK6X6XYKFT";

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(
                `${HORIZON_URL}/accounts/${SPONSOR_PUBLIC_KEY}/transactions?order=desc&limit=5`,
                { cache: "no-store" }
            );
            if (!res.ok) {
                throw new Error("Could not fetch transactions.");
            }
            const data = await res.json();
            setTransactions(data._embedded?.records || []);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Failed to load transactions.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
        const interval = setInterval(fetchTransactions, 15000); // Refresh every 15s
        return () => clearInterval(interval);
    }, [fetchTransactions]);

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    };

    if (!isConnected) return null;

    return (
        <div className="bg-glass-card border-glow rounded-2xl p-6 card-glow animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-neon animate-pulse" />
                    <h3 className="text-lg font-semibold text-gold">Live Dispatch</h3>
                </div>
                <button
                    onClick={fetchTransactions}
                    disabled={isLoading}
                    className="text-xs text-lavender/40 hover:text-pink-neon transition-colors disabled:opacity-40"
                >
                    {isLoading ? "Loading..." : "Refresh"}
                </button>
            </div>

            <p className="text-xs text-lavender/40 mb-4">
                Recent transactions on Stellar Testnet
            </p>

            {/* Content */}
            {isLoading && transactions.length === 0 ? (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="h-16 bg-gradient-to-r from-lavender/5 via-lavender/8 to-lavender/5 rounded-lg animate-shimmer bg-[length:200%_100%]"
                        />
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-6">
                    <p className="text-red-400 text-sm mb-2">⚠ {error}</p>
                    <button
                        onClick={fetchTransactions}
                        className="text-xs text-pink-neon hover:text-pink-neon/80 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            ) : transactions.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-lavender/30 text-sm">No transactions yet</p>
                    <p className="text-lavender/20 text-xs mt-1">
                        Send some XLM to see activity here
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {transactions.map((tx) => (
                        <a
                            key={tx.id}
                            href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group"
                        >
                            <div className="flex items-center justify-between p-3 rounded-xl bg-navy/50 border border-lavender/5 hover:border-pink-neon/20 hover:bg-navy/80 transition-all duration-200">
                                <div className="flex items-center gap-3">
                                    {/* Status indicator */}
                                    <div
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${tx.successful
                                            ? "bg-neon-green/10 text-neon-green"
                                            : "bg-red-500/10 text-red-400"
                                            }`}
                                    >
                                        {tx.successful ? "✓" : "✗"}
                                    </div>

                                    <div>
                                        <p className="text-sm text-lavender font-mono group-hover:text-gold transition-colors">
                                            {tx.hash.slice(0, 8)}...{tx.hash.slice(-8)}
                                        </p>
                                        <p className="text-[10px] text-lavender/30 mt-0.5">
                                            {tx.operation_count} op{tx.operation_count > 1 ? "s" : ""} · Fee: {(parseInt(tx.fee_charged) / 10000000).toFixed(5)} XLM
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs text-lavender/40">
                                        {formatTime(tx.created_at)}
                                    </p>
                                    <p className="text-[10px] text-pink-neon/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                        View ↗
                                    </p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
