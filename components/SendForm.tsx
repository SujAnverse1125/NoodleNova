"use client";

import { useWallet } from "@/app/context/WalletContext";
import { useToast } from "@/app/context/ToastContext";
import { useState } from "react";

const HORIZON_URL =
    process.env.NEXT_PUBLIC_HORIZON_URL ||
    "https://horizon-testnet.stellar.org";

export function SendForm() {
    const { address, isConnected } = useWallet();
    const { showSuccess, showError } = useToast();
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const validateAddress = (addr: string): boolean => {
        return /^G[A-Z2-7]{55}$/.test(addr);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        if (!address || !isConnected) {
            setValidationError("Please connect your wallet first.");
            return;
        }

        if (!validateAddress(recipient)) {
            setValidationError("Invalid Stellar address. Must start with G and be 56 characters.");
            return;
        }

        if (recipient === address) {
            setValidationError("Cannot send to your own address.");
            return;
        }

        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            setValidationError("Amount must be greater than 0.");
            return;
        }

        if (amountNum < 0.0000001) {
            setValidationError("Minimum amount is 0.0000001 XLM.");
            return;
        }

        setIsPending(true);

        try {
            const StellarSdk = await import("@stellar/stellar-sdk");
            const server = new StellarSdk.Horizon.Server(HORIZON_URL);
            const sourceAccount = await server.loadAccount(address);

            const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
                fee: StellarSdk.BASE_FEE,
                networkPassphrase: StellarSdk.Networks.TESTNET,
            })
                .addOperation(
                    StellarSdk.Operation.payment({
                        destination: recipient,
                        asset: StellarSdk.Asset.native(),
                        amount: amountNum.toFixed(7),
                    })
                )
                .setTimeout(30)
                .build();

            const freighterApi = await import("@stellar/freighter-api");
            const signedXdr = await freighterApi.signTransaction(
                transaction.toXDR(),
                {
                    networkPassphrase: StellarSdk.Networks.TESTNET,
                }
            );

            const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
                signedXdr,
                StellarSdk.Networks.TESTNET
            );

            const result = await server.submitTransaction(signedTransaction);
            showSuccess(result.hash);

            // Record transaction in DB
            try {
                await fetch("/api/transactions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        hash: result.hash,
                        walletAddress: address,
                        type: "send_xlm",
                    }),
                });
            } catch (e) {
                console.error("Failed to record transaction:", e);
            }

            // Reset form
            setRecipient("");
            setAmount("");
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Transaction failed. Please try again.";
            showError(message);
        } finally {
            setIsPending(false);
        }
    };

    if (!isConnected) return null;

    return (
        <div className="bg-glass-card border-glow rounded-2xl p-6 card-glow animate-fade-in-up">
            <h3 className="text-lg font-semibold text-gold mb-1">Send XLM</h3>
            <p className="text-xs text-lavender/50 mb-5">
                Transfer XLM to any Stellar Testnet address
            </p>

            <form onSubmit={handleSend} className="space-y-4">
                {/* Recipient input */}
                <div>
                    <label
                        htmlFor="recipient"
                        className="block text-xs uppercase tracking-wider text-lavender/60 mb-1.5"
                    >
                        Recipient Address
                    </label>
                    <input
                        id="recipient"
                        type="text"
                        value={recipient}
                        onChange={(e) => {
                            setRecipient(e.target.value);
                            setValidationError(null);
                        }}
                        placeholder="GABC...XYZ"
                        disabled={isPending}
                        className="w-full px-4 py-3 rounded-xl bg-navy/80 border border-lavender/10
              text-lavender placeholder:text-lavender/20 font-mono text-sm
              focus:border-pink-neon/50 focus:ring-1 focus:ring-pink-neon/30
              disabled:opacity-50 transition-all outline-none"
                    />
                </div>

                {/* Amount input */}
                <div>
                    <label
                        htmlFor="amount"
                        className="block text-xs uppercase tracking-wider text-lavender/60 mb-1.5"
                    >
                        Amount (XLM)
                    </label>
                    <input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => {
                            setAmount(e.target.value);
                            setValidationError(null);
                        }}
                        placeholder="0.00"
                        step="0.0000001"
                        min="0"
                        disabled={isPending}
                        className="w-full px-4 py-3 rounded-xl bg-navy/80 border border-lavender/10
              text-gold placeholder:text-lavender/20 font-mono text-sm
              focus:border-pink-neon/50 focus:ring-1 focus:ring-pink-neon/30
              disabled:opacity-50 transition-all outline-none
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>

                {/* Validation error */}
                {validationError && (
                    <p className="text-sm text-red-400 animate-fade-in">
                        ⚠ {validationError}
                    </p>
                )}

                {/* Send button */}
                <button
                    type="submit"
                    disabled={isPending || !recipient || !amount}
                    className="w-full py-3.5 rounded-xl font-bold text-sm
            bg-pink-neon text-white
            hover:shadow-[0_0_25px_rgba(255,45,120,0.4)]
            hover:text-gold
            active:scale-[0.98]
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none
            transition-all duration-300"
                >
                    {isPending ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg
                                className="animate-spin h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Sending...
                        </span>
                    ) : (
                        "Send XLM →"
                    )}
                </button>
            </form>
        </div>
    );
}
