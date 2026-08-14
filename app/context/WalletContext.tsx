"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

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
        setIsLoading(true);
        setError(null);

        try {
            const freighterApi = await import("@stellar/freighter-api");
            const connected = await freighterApi.isConnected();

            if (!connected) {
                setError("Please install the Freighter wallet extension to continue.");
                setIsLoading(false);
                return;
            }

            await freighterApi.requestAccess();
            const pubKey = await freighterApi.getPublicKey();

            if (pubKey) {
                setAddress(pubKey);
                setIsConnected(true);
                setError(null);

                // Prompt for name if not provided (fallback for buttons that don't pass it)
                let finalName = name;
                if (!finalName) {
                    finalName = window.prompt("Enter your Courier Name to register:") || "Anonymous Courier";
                }

                // Register user
                try {
                    const res = await fetch("/api/users", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ walletAddress: pubKey, name: finalName }),
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUserName(data.user.name);
                    }
                } catch (e) {
                    console.error("Failed to register user:", e);
                }
            } else {
                setError("Could not retrieve wallet address. Please try again.");
            }
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Failed to connect wallet.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

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
