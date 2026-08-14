"use client";

import { useState, useCallback, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Prologue } from "@/components/Prologue";
import { useWallet } from "@/app/context/WalletContext";
import { useRouter } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showPrologue, setShowPrologue] = useState(true);
    const { isConnected, isLoading } = useWallet();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isConnected) {
            router.push("/");
        }
    }, [isLoading, isConnected, router]);

    const handleReplayPrologue = useCallback(() => {
        localStorage.removeItem("noodle-nova-prologue-complete");
        setShowPrologue(true);
    }, []);

    const handlePrologueComplete = useCallback(() => {
        setShowPrologue(false);
    }, []);

    if (!isConnected) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-space-dark">
                <div className="w-8 h-8 rounded-full bg-neon-green animate-pulse" />
            </div>
        );
    }

    return (
        <>
            {/* Prologue overlay */}
            {showPrologue && <Prologue onComplete={handlePrologueComplete} />}

            <div className="app-layout">
                <Sidebar
                    mobileOpen={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    onReplayPrologue={handleReplayPrologue}
                />
                <div>
                    <Topbar onMenuOpen={() => setMobileOpen(true)} />
                    <div className="page-container">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
