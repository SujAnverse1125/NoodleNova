"use client";

import { useState } from "react";
import { useWallet } from "@/app/context/WalletContext";

export function WalletButton() {
    const { address, isConnected, isLoading, error, connect, disconnect } =
        useWallet();
    const [isPromptingName, setIsPromptingName] = useState(false);
    const [nameInput, setNameInput] = useState("");

    const truncatedAddress = address
        ? `${address.slice(0, 4)}...${address.slice(-4)}`
        : "";

    const handleConnectClick = () => {
        if (!isPromptingName) {
            setIsPromptingName(true);
        } else {
            if (nameInput.trim()) {
                connect(nameInput.trim());
                setIsPromptingName(false);
            }
        }
    };

    if (isConnected && address) {
        return (
            <div className="flex items-center gap-3">
                {/* Connected address pill */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-glass border border-pink-neon/20">
                    <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                    <span className="text-sm text-lavender font-medium">
                        {truncatedAddress}
                    </span>
                </div>

                {/* Disconnect button — clearly labeled, always visible */}
                <button
                    onClick={disconnect}
                    className="px-4 py-2 rounded-full text-sm font-semibold
            border border-pink-neon/40 text-pink-neon
            hover:bg-pink-neon/10 hover:border-pink-neon
            hover:text-gold transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-pink-neon/50"
                >
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-start gap-2">
            {isPromptingName ? (
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder="Enter your Courier Name"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-ink-2 border border-cyan/30 text-paper focus:outline-none focus:border-cyan"
                        autoFocus
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleConnectClick}
                            disabled={isLoading || !nameInput.trim()}
                            className="px-4 py-2 rounded-lg bg-cyan text-ink font-bold hover:bg-cyan/80 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? "Connecting..." : "Confirm"}
                        </button>
                        <button
                            onClick={() => setIsPromptingName(false)}
                            className="px-4 py-2 rounded-lg border border-white/20 text-lavender hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={handleConnectClick}
                    disabled={isLoading}
                    className="group relative px-6 py-3 rounded-full font-bold text-sm
              bg-pink-neon text-white
              hover:shadow-[0_0_25px_rgba(255,45,120,0.5)]
              hover:text-gold
              active:scale-95
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-all duration-300
              animate-glow-pulse"
                >
                    {/* Glow ring behind button */}
                    <span className="absolute inset-0 rounded-full bg-pink-neon/20 blur-lg group-hover:bg-pink-neon/30 transition-all duration-300 -z-10" />

                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <svg
                                className="animate-spin h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                            Connecting...
                        </span>
                    ) : (
                        "Connect Wallet"
                    )}
                </button>
            )}

            {/* Error message */}
            {error && (
                <p className="text-sm text-red-400 animate-fade-in max-w-xs">
                    ⚠ {error}
                </p>
            )}
        </div>
    );
}
