"use client";

import { useMemo, useState } from "react";
import { useToast } from "@/app/context/ToastContext";
import { useWallet } from "@/app/context/WalletContext";
import {
    completeDelivery,
    createDelivery,
    escrowConfig,
    getDelivery,
    type DeliveryRecord,
} from "@/lib/stellar/escrow";

interface EscrowPanelProps {
    route: {
        id: number;
        title: string;
        cost: string;
    } | null;
}

const validAddress = (address: string) => /^G[A-Z2-7]{55}$/.test(address);

export function EscrowPanel({ route }: EscrowPanelProps) {
    const { address, isConnected } = useWallet();
    const { showError, showSuccess } = useToast();
    const [courier, setCourier] = useState("");
    const [deliveryId, setDeliveryId] = useState("");
    const [delivery, setDelivery] = useState<DeliveryRecord | null>(null);
    const [pendingAction, setPendingAction] = useState<"create" | "complete" | "read" | null>(null);

    const configured = /^C[A-Z2-7]{55}$/.test(escrowConfig.contractId);
    const escrowAddress = useMemo(
        () =>
            configured
                ? `${escrowConfig.contractId.slice(0, 8)}...${escrowConfig.contractId.slice(-8)}`
                : "Not configured",
        [configured]
    );

    const requireWallet = () => {
        if (!isConnected || !address) {
            showError("Connect the sponsor wallet first.");
            return false;
        }
        if (!configured) {
            showError("Escrow is not configured for this deployment.");
            return false;
        }
        return true;
    };

    const handleCreate = async () => {
        if (!route || !requireWallet() || !address) return;
        if (!validAddress(courier)) {
            showError("Enter the courier's valid Stellar public address.");
            return;
        }

        const nextDeliveryId = Date.now();
        setPendingAction("create");
        try {
            const hash = await createDelivery({
                sponsor: address,
                courier,
                deliveryId: nextDeliveryId,
                amount: route.cost,
            });
            setDeliveryId(String(nextDeliveryId));
            setDelivery({
                amount: String(Number(route.cost) * 10_000_000),
                courier,
                is_completed: false,
                sponsor: address,
                token: "native XLM",
            });
            showSuccess(`${route.title} is now funded in escrow.`, hash);
        } catch (error) {
            showError(error instanceof Error ? error.message : "Could not create delivery escrow.");
        } finally {
            setPendingAction(null);
        }
    };

    const parsedDeliveryId = Number(deliveryId);
    const hasValidDeliveryId = Number.isSafeInteger(parsedDeliveryId) && parsedDeliveryId > 0;

    const handleRead = async () => {
        if (!requireWallet() || !address || !hasValidDeliveryId) {
            if (deliveryId && !hasValidDeliveryId) showError("Enter a valid delivery ID.");
            return;
        }

        setPendingAction("read");
        try {
            const result = await getDelivery({ accountAddress: address, deliveryId: parsedDeliveryId });
            setDelivery(result);
            showSuccess("Delivery state loaded from Soroban.");
        } catch (error) {
            showError(error instanceof Error ? error.message : "Could not load delivery state.");
        } finally {
            setPendingAction(null);
        }
    };

    const handleComplete = async () => {
        if (!requireWallet() || !address || !hasValidDeliveryId) {
            if (deliveryId && !hasValidDeliveryId) showError("Enter a valid delivery ID.");
            return;
        }

        setPendingAction("complete");
        try {
            const hash = await completeDelivery({ sponsor: address, deliveryId: parsedDeliveryId });
            setDelivery((current) => (current ? { ...current, is_completed: true } : current));
            showSuccess("Delivery completed and escrow released.", hash);
        } catch (error) {
            showError(error instanceof Error ? error.message : "Could not complete delivery.");
        } finally {
            setPendingAction(null);
        }
    };

    return (
        <section className="rounded-2xl border border-cyan/30 bg-ink-2/70 p-5 shadow-neon-cyan">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-mono uppercase tracking-[0.18em] text-cyan">Soroban escrow</p>
                    <h2 className="mt-1 text-xl font-bold text-paper">Fund a delivery on-chain</h2>
                    <p className="mt-1 text-sm text-muted">
                        Funds are locked by <code>create_delivery</code> and released only by <code>complete_delivery</code>.
                    </p>
                </div>
                <span className="rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-xs font-mono text-cyan">
                    Testnet
                </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <label className="text-xs text-muted">
                    Selected route
                    <div className="mt-1 rounded-lg border border-white/10 bg-ink-3 px-3 py-2 text-sm text-paper">
                        {route ? `${route.title} · ${route.cost} XLM` : "Select a route above"}
                    </div>
                </label>
                <label className="text-xs text-muted">
                    Courier public address
                    <input
                        value={courier}
                        onChange={(event) => setCourier(event.target.value.trim())}
                        placeholder="G..."
                        disabled={pendingAction !== null}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-ink-3 px-3 py-2 font-mono text-sm text-paper outline-none focus:border-cyan/60"
                    />
                </label>
            </div>

            <button
                type="button"
                onClick={handleCreate}
                disabled={!route || pendingAction !== null}
                className="mt-4 w-full rounded-lg border border-cyan/40 bg-cyan/20 px-4 py-3 text-sm font-bold text-cyan transition-colors hover:bg-cyan/30 disabled:cursor-not-allowed disabled:opacity-40"
            >
                {pendingAction === "create" ? "Awaiting wallet signature..." : "Fund route with Soroban escrow"}
            </button>

            <div className="mt-5 border-t border-white/10 pt-4">
                <label className="text-xs text-muted">
                    Existing delivery ID
                    <input
                        value={deliveryId}
                        inputMode="numeric"
                        onChange={(event) => setDeliveryId(event.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="Created delivery ID"
                        disabled={pendingAction !== null}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-ink-3 px-3 py-2 font-mono text-sm text-paper outline-none focus:border-cyan/60"
                    />
                </label>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={handleRead}
                        disabled={pendingAction !== null}
                        className="rounded-lg border border-white/15 px-4 py-2.5 text-sm font-bold text-paper transition-colors hover:border-cyan/50 disabled:opacity-40"
                    >
                        {pendingAction === "read" ? "Loading..." : "Load delivery"}
                    </button>
                    <button
                        type="button"
                        onClick={handleComplete}
                        disabled={pendingAction !== null || delivery?.is_completed}
                        className="rounded-lg border border-pink/40 bg-pink/20 px-4 py-2.5 text-sm font-bold text-pink transition-colors hover:bg-pink/30 disabled:opacity-40"
                    >
                        {pendingAction === "complete" ? "Awaiting wallet signature..." : "Complete and release escrow"}
                    </button>
                </div>
            </div>

            {delivery && (
                <div className="mt-4 rounded-lg border border-white/10 bg-ink-3 p-3 text-xs text-muted">
                    <p className="font-mono text-cyan">On-chain delivery {deliveryId}</p>
                    <p className="mt-1 break-all">Courier: {delivery.courier}</p>
                    <p>Status: {delivery.is_completed ? "Completed — escrow released" : "Open — funds remain in escrow"}</p>
                </div>
            )}

            <p className="mt-4 break-all text-[11px] font-mono text-muted">
                Contract: {escrowAddress}
            </p>
        </section>
    );
}
