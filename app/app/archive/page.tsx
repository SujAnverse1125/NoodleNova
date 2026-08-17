"use client";

import { useState } from "react";
import { useWallet } from "@/app/context/WalletContext";

export default function ArchivePage() {
    const { unlockedChapters, rareStamps, unlockChapter, addRareStamp } = useWallet();
    const [activeChapter, setActiveChapter] = useState(1);
    const [page, setPage] = useState(1);
    const [claimedRewards, setClaimedRewards] = useState<number[]>([]);

    const handleClaimReward = (chapterId: number) => {
        if (!claimedRewards.includes(chapterId)) {
            addRareStamp();
            setClaimedRewards(prev => [...prev, chapterId]);
        }
    };

    const chapters = [
        { id: 1, title: "The Miso Meteor", pages: 5, unlocked: unlockedChapters.includes(1), cost: 0 },
        { id: 2, title: "Neon Alley Drift", pages: 4, unlocked: unlockedChapters.includes(2), cost: 1 },
        { id: 3, title: "Starlight Express", pages: 5, unlocked: unlockedChapters.includes(3), cost: 2 },
    ];

    return (
        <div className="story-library-page">
            {/* Header */}
            <div className="story-library-head">
                <div>
                    <p>MANGA ARCHIVE</p>
                    <h1>Star Records</h1>
                    <span>Read the collected chapters of the Noodle Nova saga.</span>
                </div>
                <button className="on">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                    </svg>
                    Sound On
                </button>
            </div>

            {/* Layout */}
            <div className="story-library-layout">
                {/* Sidebar Rail */}
                <div className="chapter-rail">
                    <p>CHAPTERS</p>
                    {chapters.map((ch) => (
                        <div key={ch.id} className={`flex flex-col gap-2 ${activeChapter === ch.id ? "active" : ""}`}>
                            <button
                                className={`w-full text-left ${activeChapter === ch.id ? "active" : ""}`}
                                onClick={() => ch.unlocked && setActiveChapter(ch.id)}
                                disabled={!ch.unlocked}
                            >
                                <b>{ch.id.toString().padStart(2, "0")}</b>
                                <span>{ch.unlocked ? ch.title : "Locked"}</span>
                                <small>{ch.unlocked ? `${ch.pages} pages` : `Requires ${ch.cost} Rare Stamp${ch.cost > 1 ? 's' : ''}`}</small>
                            </button>
                            {!ch.unlocked && (
                                <button
                                    className="w-full py-1.5 bg-gold/20 text-gold border border-gold/30 rounded text-xs font-bold hover:bg-gold/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    onClick={() => unlockChapter(ch.id, ch.cost)}
                                    disabled={rareStamps < ch.cost}
                                >
                                    {rareStamps >= ch.cost ? `Unlock (${ch.cost} Stamp)` : `Need ${ch.cost} Stamp`}
                                </button>
                            )}
                        </div>
                    ))}
                    <div className="sound-note">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        Unlock new chapters by completing routes and earning stamps.
                    </div>
                </div>

                {/* Reader */}
                <div className="story-reader">
                    <div className="story-page-meta">
                        <span>CHAPTER {activeChapter.toString().padStart(2, "0")}</span>
                        <span>PAGE <b>{page}</b> / {chapters[activeChapter - 1].pages}</span>
                    </div>

                    {/* Canvas */}
                    <div className="story-manga-canvas" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", background: "transparent", border: "none", padding: 0, boxShadow: "none" }}>

                        {/* CHAPTER 1 */}
                        {activeChapter === 1 && (
                            <>
                                {page === 1 && (
                                    <>
                                        {/* Panel 1 */}
                                        <div className="relative rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--pink)] min-h-[500px]">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="/comic_bg_1.png" alt="City" className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute top-4 left-4 bg-paper text-ink px-3 py-1 font-bold text-xs border-2 border-ink shadow-[4px_4px_0_var(--gold)]">
                                                At 2:17 AM, one last ramen route leaves the kitchen.
                                            </div>
                                            <div className="absolute bottom-4 right-4 bg-paper text-ink px-3 py-2 font-bold text-sm border-2 border-ink rounded-xl shadow-[4px_4px_0_var(--cyan)] max-w-[60%]">
                                                Quiet night. Suspiciously quiet.
                                            </div>
                                            <div className="absolute bottom-0 left-8 w-32 h-32 rounded-full border-4 border-ink bg-pink shadow-[4px_4px_0_var(--ink)] overflow-hidden">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src="/pixel_hana.png" alt="Hana" className="w-full h-full object-cover" />
                                            </div>
                                        </div>

                                        {/* Panel 2 (Split) */}
                                        <div className="flex flex-col gap-4 min-h-[500px]">
                                            <div className="relative flex-1 rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--cyan)]">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src="/comic_bg_1.png" alt="City" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "hue-rotate(90deg)" }} />
                                                <div className="absolute bottom-4 right-4 bg-paper text-ink px-3 py-2 font-bold text-sm border-2 border-ink rounded-xl shadow-[4px_4px_0_var(--gold)] max-w-[60%]">
                                                    Hana! The miso meteor is rolling away!
                                                </div>
                                                <div className="absolute bottom-0 left-4 w-24 h-24 rounded-full border-4 border-ink bg-gold shadow-[4px_4px_0_var(--ink)] overflow-hidden flex items-center justify-center p-2">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src="/pixel_chef.png" alt="Chef Nova" className="w-full h-full object-cover rounded-full" />
                                                </div>
                                            </div>
                                            <div className="relative flex-1 rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--purple)]">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src="/comic_bg_1.png" alt="City" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "hue-rotate(180deg)" }} />
                                                <div className="absolute top-4 left-4 bg-paper text-ink px-3 py-1 font-bold text-xs border-2 border-ink shadow-[4px_4px_0_var(--pink)]">
                                                    Then the sky burps a meteor...
                                                </div>
                                                <div className="absolute bottom-4 right-4 bg-paper text-ink px-3 py-2 font-bold text-sm border-2 border-ink rounded-xl shadow-[4px_4px_0_var(--cyan)] max-w-[60%]">
                                                    That is not covered by the warranty!
                                                </div>
                                                <div className="absolute bottom-0 left-4 w-24 h-24 rounded-full border-4 border-ink bg-cyan shadow-[4px_4px_0_var(--ink)] overflow-hidden flex items-center justify-center p-2">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src="/icon_logo.png" alt="Robot" className="w-full h-full object-cover rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {page === 2 && (
                                    <>
                                        <div className="relative rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--gold)] min-h-[500px]">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="/bg_city.png" alt="City" className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute top-8 left-8 bg-paper text-ink px-4 py-2 font-bold text-lg border-2 border-ink shadow-[4px_4px_0_var(--pink)]">
                                                "I'm on it, Chef! Engaging hyper-drive!"
                                            </div>
                                            <div className="absolute bottom-8 right-8 w-40 h-40 rounded-full border-4 border-ink bg-pink shadow-[4px_4px_0_var(--ink)] overflow-hidden">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src="/pixel_hana.png" alt="Hana" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <div className="relative rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--cyan)] min-h-[500px]">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="/comic_bg_1.png" alt="City" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "hue-rotate(270deg)" }} />
                                            <div className="absolute top-4 right-4 bg-paper text-ink px-3 py-2 font-bold text-sm border-2 border-ink rounded-xl shadow-[4px_4px_0_var(--gold)] max-w-[60%]">
                                                WARNING: Asteroid field detected on Route 9.
                                            </div>
                                            <div className="absolute bottom-8 left-8 w-32 h-32 rounded-full border-4 border-ink bg-cyan shadow-[4px_4px_0_var(--ink)] overflow-hidden flex items-center justify-center p-2">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src="/icon_logo.png" alt="Robot" className="w-full h-full object-cover rounded-full" />
                                            </div>
                                        </div>
                                    </>
                                )}
                                {page === 3 && (
                                    <>
                                        <div className="relative rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--pink)] min-h-[240px] col-span-2">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="/bg_city.png" alt="City" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "hue-rotate(45deg)" }} />
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-paper text-ink px-6 py-3 font-bold text-xl border-4 border-ink shadow-[8px_8px_0_var(--gold)] text-center">
                                                "Asteroids? Just another Tuesday."
                                            </div>
                                            <div className="absolute top-4 left-8 w-20 h-20 rounded-full border-4 border-ink bg-gold shadow-[4px_4px_0_var(--ink)] overflow-hidden flex items-center justify-center p-2">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src="/pixel_ramen.png" alt="Ramen" className="w-full h-full object-cover rounded-full" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 min-h-[240px] col-span-2">
                                            <div className="relative flex-1 rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--cyan)]">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src="/comic_bg_1.png" alt="City" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "hue-rotate(120deg)" }} />
                                                <div className="absolute bottom-4 right-4 bg-paper text-ink px-3 py-2 font-bold text-sm border-2 border-ink rounded-xl shadow-[4px_4px_0_var(--pink)] max-w-[60%]">
                                                    The broth is still boiling. Perfect.
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {page === 4 && (
                                    <>
                                        <div className="relative rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--gold)] min-h-[500px]">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="/comic_bg_1.png" alt="City" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "hue-rotate(300deg)" }} />
                                            <div className="absolute top-8 left-8 bg-paper text-ink px-4 py-2 font-bold text-lg border-2 border-ink shadow-[4px_4px_0_var(--cyan)]">
                                                StarPort Embassy. 2:21 AM.
                                            </div>
                                            <div className="absolute bottom-8 right-8 w-32 h-32 rounded-full border-4 border-ink bg-ink-2 shadow-[4px_4px_0_var(--pink)] overflow-hidden flex items-center justify-center text-6xl">
                                                🏛️
                                            </div>
                                        </div>
                                        <div className="relative rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--pink)] min-h-[500px]">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="/bg_city.png" alt="City" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "hue-rotate(60deg)" }} />
                                            <div className="absolute bottom-4 left-4 bg-paper text-ink px-3 py-2 font-bold text-sm border-2 border-ink rounded-xl shadow-[4px_4px_0_var(--gold)] max-w-[60%]">
                                                "Right on time, courier. The ambassador is waiting."
                                            </div>
                                            <div className="absolute top-8 right-8 w-40 h-40 rounded-full border-4 border-ink bg-gold shadow-[4px_4px_0_var(--ink)] overflow-hidden flex items-center justify-center p-4">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src="/pixel_star.png" alt="Star" className="w-full h-full object-cover rounded-full" />
                                            </div>
                                        </div>
                                    </>
                                )}
                                {page === 5 && (
                                    <>
                                        <div className="relative rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--cyan)] min-h-[240px] col-span-2 flex items-center justify-center bg-ink-3">
                                            <div className="text-center">
                                                <h2 className="text-3xl font-bold text-gold tracking-widest mb-2">MISSION ACCOMPLISHED</h2>
                                                <p className="text-cyan font-mono text-sm mb-4">Reward: 1x Rare Stamp</p>
                                                {!claimedRewards.includes(1) ? (
                                                    <button
                                                        onClick={() => handleClaimReward(1)}
                                                        className="px-6 py-2 bg-gold text-ink font-bold rounded-full border-2 border-ink shadow-[4px_4px_0_var(--pink)] hover:translate-y-1 hover:shadow-[2px_2px_0_var(--pink)] transition-all"
                                                    >
                                                        Claim Reward
                                                    </button>
                                                ) : (
                                                    <span className="px-6 py-2 bg-ink-2 text-gold font-bold rounded-full border-2 border-gold/30">
                                                        Reward Claimed!
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="relative rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--pink)] min-h-[240px] col-span-2 flex items-center justify-center bg-ink-2">
                                            <h2 className="text-4xl font-bold text-white tracking-widest animate-pulse">TO BE CONTINUED...</h2>
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {/* CHAPTER 2 */}
                        {activeChapter === 2 && (
                            <>
                                {page === 1 && (
                                    <div className="relative rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--cyan)] min-h-[500px] col-span-2 flex items-center justify-center bg-ink-3">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/neon_alley_bg.png" alt="Neon Alley" className="absolute inset-0 w-full h-full object-cover opacity-50" style={{ filter: "blur(2px)" }} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                                        <div className="relative z-10 text-center bg-ink/80 p-8 rounded-2xl border-2 border-cyan shadow-[0_0_30px_rgba(90,229,225,0.4)] backdrop-blur-sm">
                                            <p className="text-cyan font-mono text-sm tracking-widest mb-2 animate-pulse">CHAPTER 02</p>
                                            <h2 className="text-6xl font-bold text-paper tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">Neon Alley Drift</h2>
                                        </div>
                                        <div className="absolute bottom-0 right-10 w-48 h-48 opacity-80">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="/pixel_hana.png" alt="Hana" className="w-full h-full object-cover drop-shadow-[0_0_15px_rgba(255,105,180,0.8)]" />
                                        </div>
                                    </div>
                                )}
                                {page === 2 && (
                                    <>
                                        <div className="relative rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--pink)] min-h-[500px]">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="/neon_alley_bg.png" alt="Neon Alley" className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute top-4 left-4 bg-paper text-ink px-3 py-1 font-bold text-xs border-2 border-ink shadow-[4px_4px_0_var(--gold)]">
                                                The Neon Market. No rules, just speed.
                                            </div>
                                        </div>
                                        <div className="relative rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--gold)] min-h-[500px]">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="/rival_courier.png" alt="Rival Courier" className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute bottom-4 right-4 bg-paper text-ink px-3 py-2 font-bold text-sm border-2 border-ink rounded-xl shadow-[4px_4px_0_var(--cyan)] max-w-[60%]">
                                                "Watch your six, Hana. Rival couriers on your tail."
                                            </div>
                                        </div>
                                    </>
                                )}
                                {page === 3 && (
                                    <div className="relative rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--purple)] min-h-[500px] col-span-2">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/comic_bg_1.png" alt="City" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "hue-rotate(250deg)" }} />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-paper text-ink px-6 py-3 font-bold text-xl border-4 border-ink shadow-[8px_8px_0_var(--pink)] text-center">
                                            "They'll have to catch me first!"
                                        </div>
                                    </div>
                                )}
                                {page === 4 && (
                                    <>
                                        <div className="relative rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--cyan)] min-h-[240px] col-span-2 flex items-center justify-center bg-ink-3">
                                            <div className="text-center">
                                                <h2 className="text-3xl font-bold text-gold tracking-widest mb-2">MISSION ACCOMPLISHED</h2>
                                                <p className="text-cyan font-mono text-sm mb-4">Reward: 1x Rare Stamp</p>
                                                {!claimedRewards.includes(2) ? (
                                                    <button
                                                        onClick={() => handleClaimReward(2)}
                                                        className="px-6 py-2 bg-gold text-ink font-bold rounded-full border-2 border-ink shadow-[4px_4px_0_var(--pink)] hover:translate-y-1 hover:shadow-[2px_2px_0_var(--pink)] transition-all"
                                                    >
                                                        Claim Reward
                                                    </button>
                                                ) : (
                                                    <span className="px-6 py-2 bg-ink-2 text-gold font-bold rounded-full border-2 border-gold/30">
                                                        Reward Claimed!
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="relative rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--pink)] min-h-[240px] col-span-2 flex items-center justify-center bg-ink-2">
                                            <h2 className="text-4xl font-bold text-white tracking-widest animate-pulse">TO BE CONTINUED...</h2>
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {/* CHAPTER 3 */}
                        {/* CHAPTER 3 */}
                        {activeChapter === 3 && (
                            <>
                                {page === 1 && (
                                    <div className="relative rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--gold)] min-h-[500px] col-span-2 flex items-center justify-center bg-ink-3">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/space_train_bg.png" alt="Space Train" className="absolute inset-0 w-full h-full object-cover opacity-50" style={{ filter: "blur(2px)" }} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                                        <div className="relative z-10 text-center bg-ink/80 p-8 rounded-2xl border-2 border-gold shadow-[0_0_30px_rgba(255,215,0,0.4)] backdrop-blur-sm">
                                            <p className="text-gold font-mono text-sm tracking-widest mb-2 animate-pulse">CHAPTER 03</p>
                                            <h2 className="text-6xl font-bold text-paper tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">Starlight Express</h2>
                                        </div>
                                        <div className="absolute bottom-0 left-10 w-48 h-48 opacity-80">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="/pixel_chef.png" alt="Chef Nova" className="w-full h-full object-cover drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]" />
                                        </div>
                                    </div>
                                )}
                                {page === 2 && (
                                    <>
                                        <div className="relative rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--cyan)] min-h-[500px]">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="/space_train_bg.png" alt="Space Train" className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute top-4 left-4 bg-paper text-ink px-3 py-1 font-bold text-xs border-2 border-ink shadow-[4px_4px_0_var(--gold)]">
                                                The legendary Starlight Express.
                                            </div>
                                        </div>
                                        <div className="relative rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--pink)] min-h-[500px]">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="/space_train_bg.png" alt="Space Train" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "hue-rotate(45deg)" }} />
                                            <div className="absolute bottom-4 right-4 bg-paper text-ink px-3 py-2 font-bold text-sm border-2 border-ink rounded-xl shadow-[4px_4px_0_var(--cyan)] max-w-[60%]">
                                                "It never stops. You have to jump."
                                            </div>
                                        </div>
                                    </>
                                )}
                                {page === 3 && (
                                    <div className="relative rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--gold)] min-h-[500px] col-span-2">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/comic_bg_1.png" alt="City" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "hue-rotate(180deg)" }} />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-paper text-ink px-6 py-3 font-bold text-xl border-4 border-ink shadow-[8px_8px_0_var(--pink)] text-center">
                                            "Hold my broth."
                                        </div>
                                        <div className="absolute bottom-8 right-8 w-40 h-40 rounded-full border-4 border-ink bg-pink shadow-[4px_4px_0_var(--ink)] overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="/pixel_hana.png" alt="Hana" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                )}
                                {page === 4 && (
                                    <>
                                        <div className="relative rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--cyan)] min-h-[500px]">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="/vip_suite_bg.png" alt="VIP Suite" className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute top-8 left-8 bg-paper text-ink px-4 py-2 font-bold text-lg border-2 border-ink shadow-[4px_4px_0_var(--gold)]">
                                                First Class Car. 2:45 AM.
                                            </div>
                                        </div>
                                        <div className="relative rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--pink)] min-h-[500px]">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="/vip_suite_bg.png" alt="VIP Suite" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "hue-rotate(10deg)" }} />
                                            <div className="absolute bottom-4 left-4 bg-paper text-ink px-3 py-2 font-bold text-sm border-2 border-ink rounded-xl shadow-[4px_4px_0_var(--gold)] max-w-[60%]">
                                                "Delivery for VIP Suite 7. Extra spicy."
                                            </div>
                                            <div className="absolute top-8 right-8 w-40 h-40 rounded-full border-4 border-ink bg-gold shadow-[4px_4px_0_var(--ink)] overflow-hidden flex items-center justify-center p-4">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src="/pixel_star.png" alt="Star" className="w-full h-full object-cover rounded-full" />
                                            </div>
                                        </div>
                                    </>
                                )}
                                {page === 5 && (
                                    <>
                                        <div className="relative rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--cyan)] min-h-[240px] col-span-2 flex items-center justify-center bg-ink-3">
                                            <div className="text-center">
                                                <h2 className="text-3xl font-bold text-gold tracking-widest mb-2">MISSION ACCOMPLISHED</h2>
                                                <p className="text-cyan font-mono text-sm mb-4">Reward: 1x Rare Stamp</p>
                                                {!claimedRewards.includes(3) ? (
                                                    <button
                                                        onClick={() => handleClaimReward(3)}
                                                        className="px-6 py-2 bg-gold text-ink font-bold rounded-full border-2 border-ink shadow-[4px_4px_0_var(--pink)] hover:translate-y-1 hover:shadow-[2px_2px_0_var(--pink)] transition-all"
                                                    >
                                                        Claim Reward
                                                    </button>
                                                ) : (
                                                    <span className="px-6 py-2 bg-ink-2 text-gold font-bold rounded-full border-2 border-gold/30">
                                                        Reward Claimed!
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="relative rounded-xl overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--pink)] min-h-[240px] col-span-2 flex items-center justify-center bg-ink-2">
                                            <h2 className="text-4xl font-bold text-white tracking-widest animate-pulse">THE END</h2>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="story-reader-controls">
                        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
                            ← Prev Page
                        </button>
                        <div>
                            {[...Array(chapters[activeChapter - 1].pages)].map((_, i) => (
                                <button key={i} className={page === i + 1 ? "active" : ""} onClick={() => setPage(i + 1)} />
                            ))}
                        </div>
                        <button onClick={() => setPage(Math.min(chapters[activeChapter - 1].pages, page + 1))} disabled={page === chapters[activeChapter - 1].pages}>
                            Next Page →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
