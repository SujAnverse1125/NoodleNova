"use client";

import { useWallet } from "@/app/context/WalletContext";
import { useState, useEffect, useCallback } from "react";

const HORIZON_URL =
    process.env.NEXT_PUBLIC_HORIZON_URL ||
    "https://horizon-testnet.stellar.org";

export function BalanceCard() {
    const { address, isConnected } = useWallet();
    const [balance, setBalance] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const fetchBalance = useCallback(async () => {
        if (!address) return;
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`${HORIZON_URL}/accounts/${address}`);
            if (!res.ok) {
                throw new Error("Account not found or not funded on Testnet.");
            }
            const data = await res.json();
            const xlmBalance = data.balances.find(
                (b: { asset_type: string; balance: string }) =>
                    b.asset_type === "native"
            );
            setBalance(xlmBalance ? xlmBalance.balance : "0");
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Could not load balance.";
            setError(message);
            setBalance(null);
        } finally {
            setIsLoading(false);
        }
    }, [address]);

    // Initial fetch + auto-refresh every 30s
    useEffect(() => {
        if (!isConnected || !address) return;
        fetchBalance();
        const interval = setInterval(fetchBalance, 30000);
        return () => clearInterval(interval);
    }, [isConnected, address, fetchBalance]);

    const copyAddress = () => {
        if (!address) return;
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatBalance = (bal: string) => {
        const num = parseFloat(bal);
        return num.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    if (!isConnected) return null;

    return (
        <div className="relative bg-glass-card border-glow rounded-2xl p-6 card-glow-gold animate-fade-in-up">
            {/* TESTNET badge — orange pill, top-right */}
            <div className="absolute top-4 right-4">
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    Testnet
                </span>
            </div>

            {/* Balance display — THE hero element */}
            <div className="mb-4">
                <p className="text-xs uppercase tracking-widest text-lavender/60 mb-2">
                    Your XLM Balance
                </p>

                {isLoading && !balance ? (
                    /* Skeleton loading state */
                    <div className="space-y-2">
                        <div className="h-14 w-64 bg-gradient-to-r from-lavender/5 via-lavender/10 to-lavender/5 rounded-lg animate-shimmer bg-[length:200%_100%]" />
                        <div className="h-4 w-32 bg-lavender/5 rounded animate-pulse" />
                    </div>
                ) : error ? (
                    /* Error state */
                    <div className="space-y-3">
                        <p className="text-red-400 text-sm">⚠ {error}</p>
                        <button
                            onClick={fetchBalance}
                            className="px-4 py-2 text-xs rounded-lg bg-pink-neon/10 text-pink-neon border border-pink-neon/20 hover:bg-pink-neon/20 transition-all"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    /* Balance number — giant gold, unmissable */
                    <div className="flex items-baseline gap-3">
                        <span className="text-5xl md:text-6xl font-bold text-gold text-glow-gold tabular-nums">
                            {balance ? formatBalance(balance) : "—"}
                        </span>
                        <span className="text-xl text-gold/60 font-medium">XLM</span>
                    </div>
                )}
            </div>

            {/* Wallet address + copy + refresh */}
            <div className="flex items-center justify-between pt-4 border-t border-lavender/10">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-lavender/50 font-mono">
                        {address ? `${address.slice(0, 8)}...${address.slice(-8)}` : ""}
                    </span>
                    <button
                        onClick={copyAddress}
                        className="text-lavender/40 hover:text-gold transition-colors"
                        title="Copy full address"
                    >
                        {copied ? (
                            <svg className="w-4 h-4 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Refresh button */}
                <button
                    onClick={fetchBalance}
                    disabled={isLoading}
                    className="flex items-center gap-1 text-xs text-lavender/40 hover:text-pink-neon transition-colors disabled:opacity-40"
                >
                    <svg
                        className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {isLoading ? "Refreshing..." : "Refresh"}
                </button>
            </div>
        </div>
    );
}
