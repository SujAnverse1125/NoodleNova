"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { trackProductEvent } from "@/lib/analytics";

interface WalletState {
    address: string | null;
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;
    userName: string | null;
    connect: (name?: string) => Promise<void>;
    disconnect: () => void;
    rareStamps: number;
    unlockedChapters: number[];
    unlockedRoutes: number;
    addRareStamp: () => void;
    unlockChapter: (chapterId: number, cost: number) => boolean;
    unlockRoute: (routeId: number) => void;
}

const WalletContext = createContext<WalletState>({
    address: null,
    isConnected: false,
    isLoading: false,
    error: null,
    userName: null,
    connect: async () => { },
    disconnect: () => { },
    rareStamps: 0,
    unlockedChapters: [1],
    unlockedRoutes: 1,
    addRareStamp: () => { },
    unlockChapter: () => false,
    unlockRoute: () => { },
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [address, setAddress] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

    // Game State
    const [rareStamps, setRareStamps] = useState(2); // Start with 2 for testing
    const [unlockedChapters, setUnlockedChapters] = useState<number[]>([1]); // Chapter 1 unlocked by default
    const [unlockedRoutes, setUnlockedRoutes] = useState(1); // Route 1 unlocked by default

    const [showNameModal, setShowNameModal] = useState(false);
    const [tempPubKey, setTempPubKey] = useState<string | null>(null);
    const [nameInput, setNameInput] = useState("");

    // Check if already connected on mount
    useEffect(() => {
        const checkConnection = async () => {
            try {
                const freighterApi = await import("@stellar/freighter-api");
                const connected = await freighterApi.isConnected();
                if (connected) {
                    const allowed = await freighterApi.isAllowed();
                    if (allowed) {
                        const pubKey = await freighterApi.getPublicKey();
                        if (pubKey) {
                            setAddress(pubKey);
                            setIsConnected(true);
                        }
                    }
                }
            } catch {
                // Freighter not installed — silent on mount
            }
        };
        checkConnection();
    }, []);

    const connect = useCallback(async (name?: string) => {
        trackProductEvent("wallet_connect_started");
        setIsLoading(true);
        setError(null);

        try {
            const freighterApi = await import("@stellar/freighter-api");
            const connected = await freighterApi.isConnected();

            if (!connected) {
                const message = "Please install the Freighter wallet extension to continue.";
                trackProductEvent("wallet_connect_failed", { reason: "missing_extension" });
                setError(message);
                setIsLoading(false);
                return;
            }

            await freighterApi.requestAccess();
            const pubKey = await freighterApi.getPublicKey();

            if (pubKey) {
                if (name) {
                    // Name provided directly (e.g. from a specific button)
                    await registerUser(pubKey, name);
                } else {
                    // Show custom modal
                    trackProductEvent("wallet_connected");
                    setTempPubKey(pubKey);
                    setNameInput("");
                    setShowNameModal(true);
                }
            } else {
                const message = "Could not retrieve wallet address. Please try again.";
                trackProductEvent("wallet_connect_failed", { reason: "address_unavailable" });
                setError(message);
            }
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Failed to connect wallet.";
            trackProductEvent("wallet_connect_failed", { reason: "wallet_error" });
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const registerUser = async (pubKey: string, name: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ walletAddress: pubKey, name }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok || !data?.user) {
                throw new Error(data?.error || "Could not save your courier profile. Please retry.");
            }

            setUserName(data.user.name);
            setAddress(pubKey);
            setIsConnected(true);
            setShowNameModal(false);
            trackProductEvent("onboarding_completed");
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Could not save your courier profile. Please retry.";
            trackProductEvent("wallet_connect_failed", { reason: "registration_error" });
            setError(message);
            console.error("Failed to register user:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (tempPubKey) {
            registerUser(tempPubKey, nameInput || "Anonymous Courier");
        }
    };

    const disconnect = useCallback(() => {
        setAddress(null);
        setIsConnected(false);
        setError(null);
    }, []);

    const addRareStamp = useCallback(() => {
        setRareStamps(prev => prev + 1);
    }, []);

    const unlockChapter = useCallback((chapterId: number, cost: number) => {
        if (rareStamps >= cost && !unlockedChapters.includes(chapterId)) {
            setRareStamps(prev => prev - cost);
            setUnlockedChapters(prev => [...prev, chapterId]);
            return true;
        }
        return false;
    }, [rareStamps, unlockedChapters]);

    const unlockRoute = useCallback((routeId: number) => {
        setUnlockedRoutes((prev) => Math.max(prev, routeId));
    }, []);

    return (
        <WalletContext.Provider
            value={{
                address, isConnected, isLoading, error, userName, connect, disconnect,
                rareStamps, unlockedChapters, unlockedRoutes, addRareStamp, unlockChapter, unlockRoute
            }}
        >
            {children}

            {/* Custom Name Modal */}
            {showNameModal && (
                <div className="fixed inset-0 z-[100] bg-space-dark/90 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-ink-2/90 border border-cyan/30 rounded-2xl p-8 max-w-md w-full shadow-[0_0_40px_rgba(90,229,225,0.15)] relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink/20 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10">
                            {/* Close Button */}
                            <button
                                onClick={() => {
                                    setShowNameModal(false);
                                    disconnect();
                                }}
                                className="absolute top-0 right-0 text-muted hover:text-pink transition-colors"
                                aria-label="Close"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="w-16 h-16 bg-cyan/20 rounded-full flex items-center justify-center border border-cyan/50 mb-6 shadow-[0_0_15px_rgba(90,229,225,0.3)]">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>

                            <h2 className="text-2xl font-bold text-paper tracking-tight mb-2">Welcome to Noodle Nova</h2>
                            <p className="text-muted text-sm mb-6">
                                Your wallet is connected! Please enter a Courier Name to register your profile on the network.
                            </p>

                            <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label htmlFor="courierName" className="block text-xs font-mono text-cyan mb-2 tracking-widest uppercase">
                                        Courier Name
                                    </label>
                                    <input
                                        id="courierName"
                                        type="text"
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                        placeholder="e.g. StarRider99"
                                        className="w-full bg-ink-3 border border-white/10 rounded-lg px-4 py-3 text-paper focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/50 transition-all"
                                        autoFocus
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-cyan text-ink font-bold py-3 rounded-lg mt-2 hover:bg-cyan/90 transition-colors shadow-[0_0_15px_rgba(90,229,225,0.4)]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Registering..." : "Complete Registration"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
}
