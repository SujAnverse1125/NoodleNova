"use client";

import Link from "next/link";
import { useWallet } from "@/app/context/WalletContext";

interface OnboardingGuideProps {
    hasCompletedAction: boolean;
}

const steps = [
    {
        number: "01",
        title: "Use Stellar Testnet",
        description: "This demo uses test XLM only. Never enter a Mainnet account here.",
    },
    {
        number: "02",
        title: "Connect Freighter",
        description: "Approve the public-address request in the Freighter extension.",
    },
    {
        number: "03",
        title: "Create your courier profile",
        description: "Choose a display name so your activity can be shown in the dispatch log.",
    },
    {
        number: "04",
        title: "Sponsor your first route",
        description: "Use a Testnet route to see the transaction status and explorer receipt.",
    },
];

export function OnboardingGuide({ hasCompletedAction }: OnboardingGuideProps) {
    const { isConnected } = useWallet();
    const completed = [true, isConnected, isConnected, hasCompletedAction];
    const completedCount = completed.filter(Boolean).length;

    return (
        <section
            aria-labelledby="onboarding-heading"
            className="mb-8 overflow-hidden rounded-2xl border border-cyan/20 bg-gradient-to-br from-cyan/10 via-ink-2/80 to-pink/10 p-5 shadow-[0_0_30px_rgba(90,229,225,0.08)] md:p-6"
        >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-xl">
                    <p className="mb-2 font-mono text-[10px] tracking-[0.22em] text-cyan uppercase">FIRST FLIGHT CHECKLIST</p>
                    <h2 id="onboarding-heading" className="text-2xl font-bold text-paper">Get from wallet to route in four steps.</h2>
                    <p className="mt-2 text-sm leading-6 text-muted">
                        New to Stellar? Follow the checklist below. Noodle Nova is non-custodial and all activity in this experience stays on Testnet.
                    </p>
                </div>
                <div className="shrink-0 rounded-xl border border-white/10 bg-ink-3/70 px-4 py-3 text-right">
                    <p className="font-mono text-[10px] tracking-wider text-muted uppercase">Progress</p>
                    <p className="mt-1 text-xl font-bold text-cyan">{completedCount}/4</p>
                    <p className="text-xs text-muted">steps complete</p>
                </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {steps.map((step, index) => (
                    <div
                        key={step.number}
                        className={`rounded-xl border p-4 transition-colors ${completed[index]
                            ? "border-neon-green/30 bg-neon-green/5"
                            : "border-white/10 bg-ink-3/50"
                            }`}
                    >
                        <div className="flex items-center justify-between gap-3">
                            <span className="font-mono text-xs text-cyan">{step.number}</span>
                            <span aria-label={completed[index] ? "Complete" : "Not complete"} className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${completed[index] ? "bg-neon-green/20 text-neon-green" : "bg-white/10 text-muted"}`}>
                                {completed[index] ? "✓" : "·"}
                            </span>
                        </div>
                        <h3 className="mt-4 text-sm font-bold text-paper">{step.title}</h3>
                        <p className="mt-2 text-xs leading-5 text-muted">{step.description}</p>
                    </div>
                ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                <p className="text-muted">Need help? Start with the <span className="text-cyan">Testnet wallet</span> before funding anything.</p>
                <Link href="/app/routes" className="button primary inline-flex items-center justify-center">View Routes →</Link>
            </div>
        </section>
    );
}
