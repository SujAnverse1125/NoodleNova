"use client";

import Link from "next/link";
import { useWallet } from "@/app/context/WalletContext";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const { isConnected, connect, isLoading, error } = useWallet();
    const router = useRouter();

    const handleEnter = () => {
        localStorage.removeItem("noodle-nova-prologue-complete");
        router.push("/app/dashboard");
    };

    return (
        <div className="relative min-h-screen">
            {/* Background Image */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    zIndex: 0,
                    opacity: 0.15,
                    backgroundImage: "url('/bg_city.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    maskImage: "linear-gradient(to bottom, black 20%, transparent 80%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent 80%)"
                }}
            />

            <div className="relative z-10">

                {/* ═══════ Nav ═══════ */}
                <header className="landing-nav">
                    <Link href="/" className="brand">
                        <span className="brand-mark w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-pink">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/icon_logo.png" alt="Logo" className="w-full h-full object-cover" />
                        </span>
                        <span>
                            <b>Noodle Nova</b>
                            <small>STELLAR TESTNET</small>
                        </span>
                    </Link>
                    <nav>
                        <a href="#features">Features</a>
                        <a href="#how-it-works">How it works</a>
                        {isConnected ? (
                            <button onClick={handleEnter} className="wallet-button">
                                Enter App →
                            </button>
                        ) : (
                            <button className="wallet-button" onClick={connect} disabled={isLoading}>
                                {isLoading ? "Connecting..." : "Connect Wallet"}
                            </button>
                        )}
                    </nav>
                    <button className="landing-mobile-menu">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 12h18M3 6h18M3 18h18" />
                        </svg>
                    </button>
                </header>

                {/* ═══════ Hero ═══════ */}
                <section className="hero">
                    <div className="hero-copy">
                        <div className="eyebrow">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            STELLAR TESTNET · HACKATHON
                        </div>
                        <h1>
                            Fund noodles.{" "}
                            <em>Collect stardust.</em>
                        </h1>
                        <p>
                            An anime-styled courier world on the Stellar blockchain. Deliver cosmic ramen across the neon city,
                            sponsor routes with XLM, and earn interstellar stamps as on-chain proof of participation.
                        </p>
                        <div className="hero-buttons">
                            {isConnected ? (
                                <button onClick={handleEnter} className="button primary flex items-center gap-2">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="/icon_routes.png" alt="Enter" className="w-5 h-5 rounded" /> Enter Nova City
                                </button>
                            ) : (
                                <button className="button primary flex items-center gap-2" onClick={connect} disabled={isLoading}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="/icon_routes.png" alt="Start" className="w-5 h-5 rounded" /> {isLoading ? "Connecting..." : "Start Delivering"}
                                </button>
                            )}
                            <Link href="/app/comic" className="button ghost flex items-center gap-2">
                                <span className="text-xl">📖</span> Read the Comic
                            </Link>
                        </div>
                        {error && <p className="mt-3 text-sm text-pink">{error}</p>}
                        <div className="hero-trust">
                            <span className="status-badge cyan"><i />Testnet Only</span>
                            <span>Non-custodial</span>
                            <span>No real XLM</span>
                            <span>Freighter wallet</span>
                        </div>
                    </div>

                    {/* Hero art */}
                    <div className="hero-art">
                        <div className="comic-sticker">
                            NEW<br />MOON
                        </div>
                        <div
                            className="w-full h-full rounded-[32px_13px_35px_15px] overflow-hidden relative"
                            style={{
                                boxShadow: "20px 20px #9a76ff24",
                            }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/hero-art.png"
                                alt="Noodle Nova Courier"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="hero-stat">
                            <span>TONIGHT&apos;S ROUTES</span>
                            <b>12,480 XLM</b>
                            <small>in motion</small>
                        </div>
                    </div>
                </section>

                {/* ═══════ Ticker ═══════ */}
                <div className="ticker">
                    <span>ROUTES</span> 24 active deliveries <i />{" "}
                    <span>STAMPS</span> 156 minted <i />{" "}
                    <span>COURIERS</span> 42 on-chain <i />{" "}
                    <span>XLM</span> 12,480 in motion <i />{" "}
                    <span>NETWORK</span> Stellar Testnet
                </div>

                {/* ═══════ Features ═══════ */}
                <section id="features" className="landing-section">
                    <div className="section-heading">
                        <div className="eyebrow mb-3">WHAT YOU CAN DO</div>
                        <h2>Deliver ramen across the cosmos</h2>
                    </div>
                    <div className="feature-grid">
                        <div className="feature-card">
                            <span className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center bg-pink/20 p-1">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/icon_routes.png" alt="Routes" className="w-full h-full object-cover rounded" />
                            </span>
                            <h3>Sponsor Routes</h3>
                            <p>Fund delivery missions with XLM on Stellar Testnet. Each route has a cost, delivery window, and stamp reward.</p>
                        </div>
                        <div className="feature-card">
                            <span className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center bg-gold/20 text-3xl">
                                🏅
                            </span>
                            <h3>Earn Stamps</h3>
                            <p>Collect Stellar Stamps — on-chain NFT-like tokens that prove your cosmic courier participation.</p>
                        </div>
                        <div className="feature-card">
                            <span className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center bg-cyan/20 text-3xl">
                                📡
                            </span>
                            <h3>Live Dispatch</h3>
                            <p>Watch real-time on-chain events. See who sponsored what, which routes completed, and XLM flows.</p>
                        </div>
                    </div>
                </section>

                {/* ═══════ CTA Band ═══════ */}
                <div className="cta-band">
                    <div>
                        <p>READY TO DELIVER?</p>
                        <h2>Enter Nova City and start your route</h2>
                    </div>
                    {isConnected ? (
                        <button onClick={handleEnter} className="button inverted">
                            Enter App →
                        </button>
                    ) : (
                        <button className="button inverted" onClick={connect} disabled={isLoading}>
                            Connect Wallet →
                        </button>
                    )}
                </div>

                {/* ═══════ Demo Note ═══════ */}
                <div className="demo-note">
                    ⚠️ This is a <strong>Testnet-only</strong> demo for the &quot;New Moon to Full: Midnight&quot; hackathon.
                    No real XLM is used. Connect a Freighter wallet on Stellar Testnet to explore.
                </div>
            </div>
        </div>
    );
}
