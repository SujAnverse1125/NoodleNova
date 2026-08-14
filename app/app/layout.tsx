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

    const handleReplayPrologue = useCallback(() => {
        localStorage.removeItem("noodle-nova-prologue-complete");
        setShowPrologue(true);
    }, []);

    const handlePrologueComplete = useCallback(() => {
        setShowPrologue(false);
    }, []);

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
