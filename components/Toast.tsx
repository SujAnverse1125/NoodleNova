"use client";

import { useToast } from "@/app/context/ToastContext";

export function Toast() {
    const { toasts, dismissToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`animate-slide-in-right rounded-xl p-4 border backdrop-blur-md shadow-2xl ${toast.type === "success"
                            ? "bg-toast-green-bg/95 border-neon-green/50"
                            : "bg-toast-red-bg/95 border-toast-red-border/50"
                        }`}
                >
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                            {toast.type === "success" ? (
                                <span className="text-neon-green text-lg">✓</span>
                            ) : (
                                <span className="text-red-400 text-lg">✗</span>
                            )}
                            <span
                                className={`font-semibold text-sm ${toast.type === "success" ? "text-neon-green" : "text-red-400"
                                    }`}
                            >
                                {toast.type === "success"
                                    ? "Transaction sent!"
                                    : "Transaction failed"}
                            </span>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={() => dismissToast(toast.id)}
                            className="text-lavender/60 hover:text-white transition-colors text-lg leading-none"
                            aria-label="Dismiss"
                        >
                            ×
                        </button>
                    </div>

                    {/* Hash or error details */}
                    {toast.type === "success" && toast.txHash && (
                        <div className="mt-2 space-y-1">
                            <p className="text-xs text-lavender/80 font-mono">
                                Hash: {toast.txHash.slice(0, 8)}...{toast.txHash.slice(-8)}
                            </p>
                            <a
                                href={`https://stellar.expert/explorer/testnet/tx/${toast.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-gold hover:text-gold/80 underline underline-offset-2 transition-colors"
                            >
                                View on Stellar Expert ↗
                            </a>
                        </div>
                    )}

                    {toast.type === "error" && (
                        <p className="mt-2 text-xs text-red-300/80">{toast.message}</p>
                    )}
                </div>
            ))}
        </div>
    );
}
