"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CHAPTERS = [
    {
        id: 1,
        title: "The Miso Meteor",
        scenes: [
            {
                speaker: "/pixel_hana.png",
                isImage: true,
                name: "HANA",
                color: "gold",
                dialogue: "Another quiet night shift at Nova Ramen... or so I thought.",
                narration: "Nova City, District 7. Past midnight. The stars hummed louder than usual.",
            },
            {
                speaker: "👨‍🍳",
                isImage: false,
                name: "CHEF NOVA",
                color: "pink",
                dialogue: "Hana! We've got an urgent order — the StarPort Embassy needs 200 bowls in forty minutes.",
                narration: "The kitchen erupted. Steam and shouting. The impossible order.",
            },
            {
                speaker: "/pixel_hana.png",
                isImage: true,
                name: "HANA",
                color: "cyan",
                dialogue: "Two hundred? That's insane. But I've never missed a delivery. Load 'em up.",
                narration: "She grabbed her cosmic scooter keys. The engine glowed cyan in the dark.",
            },
            {
                speaker: "🤖",
                isImage: false,
                name: "BEAM",
                color: "gold",
                dialogue: "Route calculated. The Express Lane through Sector 9 is open. I recommend deploying XLM boosters.",
                narration: "BEAM, the AI co-pilot, flickered to life on Hana's visor.",
            },
            {
                speaker: "/pixel_hana.png",
                isImage: true,
                name: "HANA",
                color: "pink",
                dialogue: "Then let's make history. Fund the route, lock in the boosters, and let's ride!",
                narration: "The cosmic scooter roared through neon alleyways. Mission: Stardust Express.",
            },
        ],
    },
];

export default function ComicPage() {
    const router = useRouter();
    const [chapterIndex] = useState(0);
    const [sceneIndex, setSceneIndex] = useState(0);

    const chapter = CHAPTERS[chapterIndex];
    const scene = chapter.scenes[sceneIndex];
    const isLast = sceneIndex === chapter.scenes.length - 1;

    const nextScene = () => {
        if (!isLast) setSceneIndex((s) => s + 1);
        else setSceneIndex(0); // Loop to start
    };

    const prevScene = () => {
        if (sceneIndex > 0) setSceneIndex((s) => s - 1);
    };

    const speakerBg =
        scene.color === "pink" ? "var(--pink)"
            : scene.color === "cyan" ? "var(--cyan)"
                : "var(--gold)";

    return (
        <div>
            <div className="page-title">
                <div>
                    <div className="eyebrow mb-2">VISUAL NOVEL · CHAPTER {chapter.id}</div>
                    <h1>{chapter.title}</h1>
                    <small>Experience the story of Noodle Nova through interactive manga scenes.</small>
                </div>
                <div className="status-badge gold"><i />Scene {sceneIndex + 1}/{chapter.scenes.length}</div>
            </div>

            {/* Story stage */}
            <div className="story-mode">
                {/* Sky / background */}
                <div className="story-sky" style={{
                    background: "radial-gradient(circle at 70% 25%, #332563 0%, transparent 45%), radial-gradient(circle at 20% 75%, #1a2a4a 0%, transparent 40%), #090819"
                }}>
                    {/* Stars */}
                    <div className="story-halftone" />
                </div>

                {/* Story head */}
                <div className="absolute z-[2] top-5 left-6 right-6 flex justify-between text-gold font-mono text-[0.63rem] tracking-widest font-bold">
                    <span>CH.{chapter.id} — {chapter.title.toUpperCase()}</span>
                    <span>SCENE {sceneIndex + 1} / {chapter.scenes.length}</span>
                </div>

                {/* Narration */}
                {scene.narration && (
                    <div className="absolute z-[6] top-[22px] left-[22px] max-w-[min(365px,50%)] p-[10px_11px] border-3 border-ink rounded-[9px_3px] text-ink bg-paper font-bold text-[0.74rem] leading-snug"
                        style={{ boxShadow: "4px 4px rgba(8,7,20,0.65)" }}>
                        {scene.narration}
                    </div>
                )}

                {/* Character at bottom */}
                <div className="absolute z-[3] bottom-[180px] left-1/2 -translate-x-1/2">
                    <div
                        className="w-[130px] h-[130px] rounded-[47%_53%_43%_57%] border-4 border-ink flex items-center justify-center text-7xl overflow-hidden"
                        style={{ background: speakerBg, boxShadow: "6px 7px rgba(8,7,23,0.75)" }}
                    >
                        {scene.isImage ? (
                            <img src={scene.speaker} alt={scene.name} className="w-full h-full object-cover" />
                        ) : (
                            scene.speaker
                        )}
                    </div>
                    <b className="block text-center mt-2 px-2 py-1 bg-paper text-ink text-xs font-bold rounded" style={{ transform: "rotate(-2deg)" }}>
                        {scene.name}
                    </b>
                </div>

                {/* Dialogue card */}
                <div className="story-dialogue-card" style={{ marginTop: "auto", marginBottom: "24px" }}>
                    <div className="speaker-face overflow-hidden" style={{ background: speakerBg }}>
                        {scene.isImage ? (
                            <img src={scene.speaker} alt={scene.name} className="w-full h-full object-cover" />
                        ) : (
                            scene.speaker
                        )}
                    </div>
                    <div>
                        <p className="m-[2px_0_7px] text-[#5b5267] font-mono text-[0.64rem] tracking-widest font-bold">
                            {scene.name}
                        </p>
                        <h2 className="m-0 text-[clamp(1.25rem,3vw,2rem)] tracking-tight leading-tight text-ink">
                            {scene.dialogue}
                        </h2>
                        <div className="choice-row">
                            <button className="text-paper bg-ink" onClick={nextScene}>
                                {isLast ? "🔄 Replay Chapter" : "→ Continue"}
                            </button>
                            {isLast && (
                                <button className="text-ink bg-cyan" onClick={() => setSceneIndex(0)}>
                                    ↩ Back to Start
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Progress dots */}
                <div className="absolute z-[2] bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                    {chapter.scenes.map((_, i) => (
                        <i
                            key={i}
                            className={`w-2 h-2 rounded-full border border-paper cursor-pointer ${i === sceneIndex ? "bg-gold border-gold" : ""
                                }`}
                            onClick={() => setSceneIndex(i)}
                        />
                    ))}
                </div>

                {/* Skip */}
                <button
                    className="absolute z-[2] right-5 bottom-5 flex items-center gap-1.5 border-0 text-[#b8b1c9] bg-transparent text-[0.67rem] cursor-pointer hover:text-cyan"
                    onClick={() => router.push("/app/archive")}
                >
                    Skip chapter
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 4l10 8-10 8V4zM19 5v14" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
