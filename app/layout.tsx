import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/app/context/WalletContext";
import { ToastProvider } from "@/app/context/ToastContext";
import { Toast } from "@/components/Toast";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
    title: "Noodle Nova — Stellar Testnet Ramen Courier",
    description:
        "Fund noodles. Collect stardust. An anime-styled Stellar Testnet dApp — deliver cosmic ramen, earn Stellar Stamps, and explore the neon city.",
    keywords: ["Stellar", "Testnet", "dApp", "anime", "ramen", "blockchain", "XLM", "Freighter"],
    authors: [{ name: "Noodle Nova Team" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <WalletProvider>
                    <ToastProvider>
                        {children}
                        <Toast />
                    </ToastProvider>
                </WalletProvider>
                <Analytics />
            </body>
        </html>
    );
}
